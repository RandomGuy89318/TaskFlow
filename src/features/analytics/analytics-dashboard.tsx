'use client';

import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CheckCircle2, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { memo } from 'react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function AnalyticsDashboardComponent() {
  const { tasks } = useStore();

  const activeTasks = tasks.filter((t) => !t.archived);
  const completedTasks = activeTasks.filter((t) => t.completed);
  const overdueTasks = activeTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
  );

  const completionRate = activeTasks.length > 0
    ? Math.round((completedTasks.length / activeTasks.length) * 100)
    : 0;

  const priorityDistribution = [
    { name: 'Low', value: activeTasks.filter((t) => t.priority === 'Low').length, color: COLORS[0] },
    { name: 'Medium', value: activeTasks.filter((t) => t.priority === 'Medium').length, color: COLORS[1] },
    { name: 'High', value: activeTasks.filter((t) => t.priority === 'High').length, color: COLORS[2] },
    { name: 'Urgent', value: activeTasks.filter((t) => t.priority === 'Urgent').length, color: COLORS[3] },
  ];

  const statusDistribution = [
    { name: 'Todo', value: activeTasks.filter((t) => t.status === 'Todo').length },
    { name: 'In Progress', value: activeTasks.filter((t) => t.status === 'In Progress').length },
    { name: 'Review', value: activeTasks.filter((t) => t.status === 'Review').length },
    { name: 'Completed', value: activeTasks.filter((t) => t.status === 'Completed').length },
  ];

  const weeklyData = [
    { name: 'Mon', completed: 4, created: 6 },
    { name: 'Tue', completed: 3, created: 5 },
    { name: 'Wed', completed: 5, created: 4 },
    { name: 'Thu', completed: 2, created: 7 },
    { name: 'Fri', completed: 6, created: 3 },
    { name: 'Sat', completed: 1, created: 2 },
    { name: 'Sun', completed: 0, created: 1 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, description }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="will-change-transform"
    >
      <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your productivity and task completion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Tasks"
          value={activeTasks.length}
          icon={CheckCircle2}
          color="text-blue-500"
          description="Active tasks"
        />
        <StatCard
          title="Completed"
          value={completedTasks.length}
          icon={TrendingUp}
          color="text-green-500"
          description="Tasks completed"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks.length}
          icon={AlertCircle}
          color="text-red-500"
          description="Tasks past due date"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={Clock}
          color="text-purple-500"
          description="Task completion rate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="will-change-transform"
        >
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="will-change-transform"
        >
          <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="name" className="text-slate-500 dark:text-slate-400" />
                  <YAxis className="text-slate-500 dark:text-slate-400" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="will-change-transform"
      >
        <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" className="text-slate-500 dark:text-slate-400" />
                <YAxis className="text-slate-500 dark:text-slate-400" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Created"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export const AnalyticsDashboard = memo(AnalyticsDashboardComponent);
AnalyticsDashboard.displayName = 'AnalyticsDashboard';
