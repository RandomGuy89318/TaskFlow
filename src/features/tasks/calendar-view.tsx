'use client';

import { useState, memo } from 'react';
import { useStore } from '@/lib/store';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskModal } from './task-modal';
import { ProjectModal } from '@/components/project-modal';

const priorityColors: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  Urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

function CalendarViewComponent() {
  const { tasks, filter } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const filteredTasks = tasks.filter((task) => {
    if (filter.archived === 'active' && task.archived) return false;
    if (filter.archived === 'archived' && !task.archived) return false;
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
    return true;
  });

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const getPendingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return filteredTasks.filter((task) => {
      if (task.completed || task.archived) return false;
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      return taskDate < today;
    });
  };

  const tasksForSelectedDate = selectedDate ? getTasksForDate(selectedDate) : [];
  const pendingTasks = getPendingTasks();

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const hasTasksOnDay = (date: Date) => {
    return getTasksForDate(date).length > 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400">View tasks by due date</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsProjectModalOpen(true)}
            className="border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            New Project
          </Button>
          <Button onClick={handleCreateTask} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Calendar picker */}
              <div className="flex-shrink-0 w-full md:w-auto md:max-w-xs mx-auto">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 select-none">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border border-slate-100 dark:border-slate-800/40 p-2 shadow-sm bg-white dark:bg-slate-900/50"
                  modifiers={{
                    hasTask: (date) => hasTasksOnDay(date)
                  }}
                  modifiersClassNames={{
                    hasTask: "font-semibold underline decoration-2 decoration-blue-500/80 dark:decoration-blue-400/80 underline-offset-4"
                  }}
                />
              </div>

              {/* Day tasks details inside empty card space */}
              <div className="flex-grow w-full border-t md:border-t-0 md:border-l border-slate-200/50 dark:border-slate-700/50 pt-6 md:pt-0 md:pl-6 min-h-[300px] flex flex-col">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 select-none">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                  Tasks for {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Selected Day'}
                </h3>

                <div className="flex-1 overflow-y-auto max-h-[320px] pr-1">
                  <AnimatePresence mode="popLayout">
                    {tasksForSelectedDate.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-16 text-slate-500"
                      >
                        <Clock className="h-9 w-9 mx-auto mb-3 opacity-40 text-slate-400" />
                        <p className="text-sm font-medium">
                          {selectedDate?.toDateString() === new Date().toDateString()
                            ? 'No tasks for today'
                            : 'No tasks for this date'}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {tasksForSelectedDate.map((task) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            onClick={() => handleEditTask(task)}
                            className="cursor-pointer"
                          >
                            <Card className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/80 border-slate-200/60 dark:border-slate-800/60 hover:shadow-sm transition-all duration-200">
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h4 className={`font-semibold text-sm leading-tight ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {task.title}
                                </h4>
                                <Badge className={`text-[10px] px-1.5 py-0.5 ${priorityColors[task.priority]}`}>
                                  {task.priority}
                                </Badge>
                              </div>
                              {task.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 border-slate-200 dark:border-slate-800">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Dedicated card for Pending Tasks */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 h-full flex flex-col min-h-[400px]">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 select-none">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              Pending Tasks
              <Badge variant="secondary" className="ml-auto bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50 text-[11px] font-medium">
                {pendingTasks.length}
              </Badge>
            </h2>

            <div className="flex-1 overflow-y-auto max-h-[380px] pr-1">
              <AnimatePresence mode="popLayout">
                {pendingTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16 text-slate-500 h-full flex flex-col justify-center items-center"
                  >
                    <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center mb-3 shadow-sm">
                      <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-850 dark:text-slate-350">All caught up!</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No uncompleted past tasks.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {pendingTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => handleEditTask(task)}
                        className="cursor-pointer"
                      >
                        <Card className="p-3.5 bg-amber-50/10 dark:bg-amber-950/5 hover:bg-amber-50/25 dark:hover:bg-amber-950/15 border-amber-200/40 dark:border-amber-900/20 hover:border-amber-200/80 hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="font-semibold text-sm text-slate-850 dark:text-slate-200 leading-tight">
                              {task.title}
                            </h4>
                            <Badge className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              Overdue
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-1 mb-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 border-t border-slate-100 dark:border-slate-900 pt-2">
                            <span className="flex items-center gap-1 select-none">
                              <Clock className="h-3 w-3" />
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                            </span>
                            <span className="font-semibold text-amber-600/90 dark:text-amber-400/90 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded select-none">
                              {task.priority}
                            </span>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={selectedTask || undefined}
      />
      <ProjectModal
        open={isProjectModalOpen}
        onOpenChange={setIsProjectModalOpen}
      />
    </motion.div>
  );
}

export const CalendarView = memo(CalendarViewComponent);
CalendarView.displayName = 'CalendarView';
