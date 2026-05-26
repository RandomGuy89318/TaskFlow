'use client';

import { Layout } from '@/components/layout';
import { CalendarView } from '@/features/tasks/calendar-view';

export default function CalendarPage() {
  return (
    <Layout>
      <CalendarView />
    </Layout>
  );
}
