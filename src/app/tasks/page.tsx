'use client';

import { Layout } from '@/components/layout';
import { ListView } from '@/features/tasks/list-view';
import { TaskFilters } from '@/features/tasks/task-filters';

export default function TasksPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <TaskFilters />
        <ListView />
      </div>
    </Layout>
  );
}
