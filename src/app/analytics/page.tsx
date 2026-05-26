'use client';

import { Layout } from '@/components/layout';
import { AnalyticsDashboard } from '@/features/analytics/analytics-dashboard';

export default function AnalyticsPage() {
  return (
    <Layout>
      <AnalyticsDashboard />
    </Layout>
  );
}
