import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function TaskCardSkeleton() {
  return (
    <Card className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <Skeleton className="h-3 w-full mb-2 rounded" />
      <Skeleton className="h-3 w-3/4 mb-3 rounded" />
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </Card>
  );
}

export function KanbanColumnSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-5 w-6 rounded-full ml-auto" />
      </div>
      <div className="flex flex-col gap-3 min-h-[200px]">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-slate-200/50 dark:border-slate-700/50">
      <td className="p-4">
        <Skeleton className="h-4 w-4 rounded" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-32 mb-1 rounded" />
        <Skeleton className="h-3 w-48 rounded" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-3 w-20 rounded" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-20 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-5 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-8 w-8 rounded" />
      </td>
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <Skeleton className="h-8 w-16 mb-1 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-32 mb-1 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-3 w-full mb-4 rounded" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </Card>
  );
}

export function CalendarTaskSkeleton() {
  return (
    <Card className="p-4 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-600/50">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full mb-2 rounded" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </Card>
  );
}
