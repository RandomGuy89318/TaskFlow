'use client';

import { Header } from './header';
import { Sidebar } from './sidebar';
import { Priority, Status } from '@/types';
import { CommandPalette } from './command-palette';
import { useStore } from '@/lib/store';
import { initializeSeedData } from '@/lib/seed-data';
import { useEffect } from 'react';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useAuth } from '@/contexts/auth-context';

export function Layout({ children }: { children: React.ReactNode }) {
  const { tasks, projects, addTask, addProject, loading, hasFetched, fetchTasks, fetchProjects } = useStore();
  const { user } = useAuth();

  useKeyboardShortcuts();

  useEffect(() => {
    if (user?.id && !hasFetched) {
      fetchTasks(user.id);
      fetchProjects(user.id);
    }
  }, [user?.id, hasFetched, fetchTasks, fetchProjects]);

  useEffect(() => {
    async function seed() {
      // Only seed data when tasks and projects are verified empty after loading
      if (user?.id && !loading && hasFetched && tasks.length === 0 && projects.length === 0) {
        const seedData = initializeSeedData();
        if (seedData) {
          const projectMap = new Map<string, string>();

          // Create projects sequentially and map old seed ID to new UUID
          for (const project of seedData.projects) {
            try {
              const createdProject = await addProject({
                name: project.name,
                description: project.description,
                color: project.color,
                userId: user.id,
              });
              projectMap.set(project.id, createdProject.id);
            } catch (err) {
              console.error(`Failed to seed project ${project.name}:`, err);
            }
          }

          // Create tasks sequentially with correct user ID and project UUID mappings
          for (const task of seedData.tasks) {
            try {
              const dbProjectId = task.projectId ? projectMap.get(task.projectId) : null;
              await addTask({
                title: task.title,
                description: task.description,
                priority: task.priority as Priority,
                status: task.status as Status,
                dueDate: task.dueDate,
                projectId: dbProjectId || null,
                tags: task.tags,
                assignee: task.assignee,
                archived: task.archived,
                userId: user.id,
                estimatedTime: task.estimatedTime,
                completed: task.completed,
              });
            } catch (err) {
              console.error(`Failed to seed task ${task.title}:`, err);
            }
          }
        }
      }
    }
    seed();
  }, [user?.id, loading, hasFetched, tasks.length, projects.length, addTask, addProject]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
