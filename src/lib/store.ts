import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Project, FilterState, SortState, ViewMode, AppState, Priority, Status } from '@/types';
import { supabase } from '@/lib/supabase';

interface TaskStore extends AppState {
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { userId?: string }) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  duplicateTask: (id: string) => Promise<void>;
  archiveTask: (id: string) => Promise<void>;
  fetchTasks: (userId: string) => Promise<void>;
  fetchProjects: (userId: string) => Promise<void>;

  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'userId'> & { userId?: string }) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Selection actions
  toggleTaskSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Filter and sort actions
  setFilter: (filter: Partial<FilterState>) => void;
  setSort: (sort: Partial<SortState>) => void;
  setViewMode: (mode: ViewMode) => void;

  // UI actions
  toggleDarkMode: () => void;
  toggleSidebar: () => void;

  // Bulk actions
  bulkDelete: () => Promise<void>;
  bulkComplete: () => Promise<void>;
  bulkSetPriority: (priority: Priority) => Promise<void>;

  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const initialState: AppState = {
  tasks: [],
  projects: [],
  selectedTasks: [],
  filter: {
    search: '',
    priority: 'All',
    status: 'All',
    project: 'All',
    dueDate: 'All',
    archived: 'active',
  },
  sort: {
    by: 'updatedAt',
    order: 'desc',
  },
  viewMode: 'kanban',
  darkMode: false,
  sidebarOpen: true,
  hasFetched: false,
};

export const useStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      loading: false,
      setLoading: (loading) => set({ loading }),

      fetchTasks: async (userId: string) => {
        set({ loading: true });
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const tasks: Task[] = data.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status as Status,
            priority: task.priority as Priority,
            completed: task.completed,
            dueDate: task.due_date,
            projectId: task.project_id,
            tags: task.tags || [],
            assignee: task.assignee,
            archived: task.archived,
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            userId: task.user_id,
            estimatedTime: null,
          }));

          set({ tasks, hasFetched: true });
        } catch (error) {
          console.error('Error fetching tasks:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchProjects: async (userId: string) => {
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const projects: Project[] = data.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            color: project.color,
            createdAt: project.created_at,
            userId: project.user_id,
          }));

          set({ projects });
        } catch (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }
      },

      addTask: async (task) => {
        try {
          if (!supabase) throw new Error('Supabase not configured');

          let userId = task.userId;
          if (!userId) {
            const { data: { session } } = await supabase.auth.getSession();
            userId = session?.user?.id;
          }

          if (!userId) {
            throw new Error('User ID is required to create a task');
          }

          const { data, error } = await supabase
            .from('tasks')
            .insert({
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              completed: task.completed,
              due_date: task.dueDate,
              project_id: task.projectId,
              tags: task.tags,
              assignee: task.assignee,
              archived: task.archived,
              user_id: userId,
            })
            .select()
            .single();

          if (error) throw error;

          const newTask: Task = {
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status as Status,
            priority: data.priority as Priority,
            completed: data.completed,
            dueDate: data.due_date,
            projectId: data.project_id,
            tags: data.tags || [],
            assignee: data.assignee,
            archived: data.archived,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            userId: data.user_id,
            estimatedTime: null,
          };

          set((state) => ({ tasks: [newTask, ...state.tasks] }));
          return newTask;
        } catch (error) {
          console.error('Error adding task:', error);
          throw error;
        }
      },

      updateTask: async (id, updates) => {
        try {
          if (!supabase) throw new Error('Supabase not configured');

          // Use `!== undefined` for all fields so clearing a value (empty string,
          // null, empty array) is correctly persisted to Supabase.
          const updateData: Record<string, unknown> = {};
          if (updates.title !== undefined) updateData.title = updates.title;
          if (updates.description !== undefined) updateData.description = updates.description;
          if (updates.status !== undefined) updateData.status = updates.status;
          if (updates.priority !== undefined) updateData.priority = updates.priority;
          if (updates.completed !== undefined) updateData.completed = updates.completed;
          if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
          if (updates.projectId !== undefined) updateData.project_id = updates.projectId;
          if (updates.tags !== undefined) updateData.tags = updates.tags;
          if (updates.assignee !== undefined) updateData.assignee = updates.assignee;
          if (updates.archived !== undefined) updateData.archived = updates.archived;

          const { error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id
                ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                : task
            ),
          }));
        } catch (error) {
          console.error('Error updating task:', error);
          throw error;
        }
      },

      deleteTask: async (id) => {
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            selectedTasks: state.selectedTasks.filter((taskId) => taskId !== id),
          }));
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      },

      toggleTaskComplete: async (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const newCompleted = !task.completed;
        const newStatus = newCompleted ? 'Completed' : 'Todo';

        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { error } = await supabase
            .from('tasks')
            .update({ completed: newCompleted, status: newStatus })
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id
                ? {
                  ...task,
                  completed: newCompleted,
                  status: newStatus as Status,
                  updatedAt: new Date().toISOString(),
                }
                : task
            ),
          }));
        } catch (error) {
          console.error('Error toggling task complete:', error);
        }
      },

      duplicateTask: async (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { data, error } = await supabase
            .from('tasks')
            .insert({
              title: `${task.title} (Copy)`,
              description: task.description,
              status: task.status,
              priority: task.priority,
              completed: false,
              due_date: task.dueDate,
              project_id: task.projectId,
              tags: task.tags,
              assignee: task.assignee,
              archived: false,
              user_id: task.userId,
            })
            .select()
            .single();

          if (error) throw error;

          const newTask: Task = {
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status as Status,
            priority: data.priority as Priority,
            completed: data.completed,
            dueDate: data.due_date,
            projectId: data.project_id,
            tags: data.tags || [],
            assignee: data.assignee,
            archived: data.archived,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            userId: data.user_id,
            estimatedTime: null,
          };

          set((state) => ({ tasks: [...state.tasks, newTask] }));
        } catch (error) {
          console.error('Error duplicating task:', error);
        }
      },

      archiveTask: async (id) => {
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { error } = await supabase
            .from('tasks')
            .update({ archived: true })
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id
                ? { ...task, archived: true, updatedAt: new Date().toISOString() }
                : task
            ),
          }));
        } catch (error) {
          console.error('Error archiving task:', error);
        }
      },

      addProject: async (project) => {
        try {
          if (!supabase) throw new Error('Supabase not configured');

          let userId = project.userId;
          if (!userId) {
            const { data: { session } } = await supabase.auth.getSession();
            userId = session?.user?.id;
          }

          if (!userId) {
            throw new Error('User ID is required to create a project');
          }

          const { data, error } = await supabase
            .from('projects')
            .insert({
              name: project.name,
              description: project.description,
              color: project.color,
              user_id: userId,
            })
            .select()
            .single();

          if (error) throw error;

          const newProject: Project = {
            id: data.id,
            name: data.name,
            description: data.description,
            color: data.color,
            createdAt: data.created_at,
            userId: data.user_id,
          };

          set((state) => ({ projects: [...state.projects, newProject] }));
          return newProject;
        } catch (error) {
          console.error('Error adding project:', error);
          throw error;
        }
      },

      updateProject: async (id, updates) => {
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const updateData: Record<string, unknown> = {};
          if (updates.name !== undefined) updateData.name = updates.name;
          if (updates.description !== undefined) updateData.description = updates.description;
          if (updates.color !== undefined) updateData.color = updates.color;

          const { error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...updates } : project
            ),
          }));
        } catch (error) {
          console.error('Error updating project:', error);
          throw error;
        }
      },

      deleteProject: async (id) => {
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            tasks: state.tasks.map((task) =>
              task.projectId === id ? { ...task, projectId: null } : task
            ),
          }));
        } catch (error) {
          console.error('Error deleting project:', error);
        }
      },

      toggleTaskSelection: (id) => {
        set((state) => ({
          selectedTasks: state.selectedTasks.includes(id)
            ? state.selectedTasks.filter((taskId) => taskId !== id)
            : [...state.selectedTasks, id],
        }));
      },

      clearSelection: () => {
        set({ selectedTasks: [] });
      },

      selectAll: () => {
        const { tasks, filter } = get();
        const filteredTasks = tasks.filter((task) => {
          if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
            return false;
          }
          if (filter.priority !== 'All' && task.priority !== filter.priority) {
            return false;
          }
          if (filter.status !== 'All' && task.status !== filter.status) {
            return false;
          }
          if (filter.project !== 'All' && task.projectId !== filter.project) {
            return false;
          }
          if (filter.dueDate !== 'All') {
            const now = new Date();
            const taskDate = task.dueDate ? new Date(task.dueDate) : null;
            if (filter.dueDate === 'overdue' && (!taskDate || taskDate >= now)) {
              return false;
            }
            if (filter.dueDate === 'today' && (!taskDate || taskDate.toDateString() !== now.toDateString())) {
              return false;
            }
            if (filter.dueDate === 'week') {
              const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              if (!taskDate || taskDate > weekFromNow) {
                return false;
              }
            }
            if (filter.dueDate === 'month') {
              const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
              if (!taskDate || taskDate > monthFromNow) {
                return false;
              }
            }
          }
          if (filter.archived === 'active' && task.archived) {
            return false;
          }
          if (filter.archived === 'archived' && !task.archived) {
            return false;
          }
          return true;
        });
        set({ selectedTasks: filteredTasks.map((task) => task.id) });
      },

      setFilter: (filter) => {
        set((state) => ({
          filter: { ...state.filter, ...filter },
          selectedTasks: [],
        }));
      },

      setSort: (sort) => {
        set((state) => ({ sort: { ...state.sort, ...sort } }));
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      bulkDelete: async () => {
        const { selectedTasks } = get();
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { error } = await supabase
            .from('tasks')
            .delete()
            .in('id', selectedTasks);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.filter((task) => !selectedTasks.includes(task.id)),
            selectedTasks: [],
          }));
        } catch (error) {
          console.error('Error bulk deleting tasks:', error);
        }
      },

      bulkComplete: async () => {
        const { selectedTasks } = get();
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { error } = await supabase
            .from('tasks')
            .update({ completed: true, status: 'Completed' })
            .in('id', selectedTasks);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.map((task) =>
              selectedTasks.includes(task.id)
                ? {
                  ...task,
                  completed: true,
                  status: 'Completed',
                  updatedAt: new Date().toISOString(),
                }
                : task
            ),
            selectedTasks: [],
          }));
        } catch (error) {
          console.error('Error bulk completing tasks:', error);
        }
      },

      bulkSetPriority: async (priority) => {
        const { selectedTasks } = get();
        try {
          if (!supabase) throw new Error('Supabase not configured');

          const { error } = await supabase
            .from('tasks')
            .update({ priority })
            .in('id', selectedTasks);

          if (error) throw error;

          set((state) => ({
            tasks: state.tasks.map((task) =>
              selectedTasks.includes(task.id)
                ? { ...task, priority, updatedAt: new Date().toISOString() }
                : task
            ),
            selectedTasks: [],
          }));
        } catch (error) {
          console.error('Error bulk setting priority:', error);
        }
      },
    }),
    {
      name: 'task-manager-storage',
      partialize: (state) => ({
        filter: state.filter,
        sort: state.sort,
        viewMode: state.viewMode,
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
