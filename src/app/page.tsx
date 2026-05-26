'use client';

import { useEffect } from 'react';
import { Layout } from '@/components/layout';
import { KanbanView } from '@/features/tasks/kanban-view';
import { TaskFilters } from '@/features/tasks/task-filters';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const { fetchTasks, fetchProjects, loading } = useStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchTasks(user.id);
      fetchProjects(user.id);
    }
  }, [user?.id, fetchTasks, fetchProjects]);

  return (
    <Layout>
      <div className="space-y-6">
        <TaskFilters />
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading tasks...</div>
        ) : (
          <KanbanView />
        )}
      </div>
    </Layout>
  );
}
