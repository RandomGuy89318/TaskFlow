export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'Todo' | 'In Progress' | 'Review' | 'Completed';
export type ViewMode = 'kanban' | 'list' | 'calendar';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  tags: string[];
  projectId: string | null;
  estimatedTime: number | null;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  archived: boolean;
  userId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  userId: string;
}

export interface FilterState {
  search: string;
  priority: Priority | 'All';
  status: Status | 'All';
  project: string | 'All';
  dueDate: string | 'All';
  archived: 'All' | 'archived' | 'active';
}

export interface SortState {
  by: 'dueDate' | 'priority' | 'updatedAt' | 'title';
  order: 'asc' | 'desc';
}

export interface AppState {
  tasks: Task[];
  projects: Project[];
  selectedTasks: string[];
  filter: FilterState;
  sort: SortState;
  viewMode: ViewMode;
  darkMode: boolean;
  sidebarOpen: boolean;
  hasFetched: boolean;
}
