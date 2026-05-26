'use client';

import { useStore } from '@/lib/store';
import { Task, Status } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Copy, Archive, Trash2, Clock, Circle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { TaskModal } from './task-modal';
import { ProjectModal } from '@/components/project-modal';
import { useState, memo } from 'react';

const columns: { status: Status; label: string; color: string }[] = [
  { status: 'Todo', label: 'To Do', color: 'bg-slate-500' },
  { status: 'In Progress', label: 'In Progress', color: 'bg-blue-500' },
  { status: 'Review', label: 'Review', color: 'bg-yellow-500' },
  { status: 'Completed', label: 'Completed', color: 'bg-green-500' },
];

const priorityColors: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  Urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

function KanbanViewComponent() {
  const { tasks, updateTask, deleteTask, duplicateTask, archiveTask, toggleTaskComplete, filter } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

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

  const [activeColumn, setActiveColumn] = useState<Status | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', taskId);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    setActiveColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (
      x < rect.left ||
      x >= rect.right ||
      y < rect.top ||
      y >= rect.bottom
    ) {
      setActiveColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    setActiveColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { status, completed: status === 'Completed' });
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const TaskCard = memo(({ task }: { task: Task }) => (
    <motion.div
      key={task.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={(e) => handleDragStart(e as any, task.id)}
      className="will-change-transform"
    >
      <Card className="p-4 cursor-grab active:cursor-grabbing bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTaskComplete(task.id)}
            />
            <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {task.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditTask(task)}>Edit</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Circle className="h-4 w-4 mr-2" /> Change Status
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => updateTask(task.id, { status: 'Todo' })}>
                    Todo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask(task.id, { status: 'In Progress' })}>
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask(task.id, { status: 'Review' })}>
                    Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateTask(task.id, { status: 'Completed' })}>
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => duplicateTask(task.id)}>
                <Copy className="h-4 w-4 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => archiveTask(task.id)}>
                <Archive className="h-4 w-4 mr-2" /> Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge className={`text-xs ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          {task.assignee && (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {task.assignee.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </Card>
    </motion.div>
  ));

  TaskCard.displayName = 'TaskCard';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Kanban Board</h1>
          <p className="text-slate-500 dark:text-slate-400">Drag and drop tasks to update status</p>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <motion.div
            key={column.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
            className={`flex flex-col gap-4 p-3 rounded-2xl transition-all duration-200 border-2 border-transparent ${
              activeColumn === column.status
                ? 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80 shadow-sm scale-[1.01]'
                : 'bg-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${column.color}`} />
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{column.label}</h2>
              <Badge variant="secondary" className="ml-auto">
                {filteredTasks.filter((t) => t.status === column.status).length}
              </Badge>
            </div>

            <div className="flex flex-col gap-3 min-h-[200px]">
              <AnimatePresence mode="popLayout">
                {filteredTasks
                  .filter((task) => task.status === column.status)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
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

export const KanbanView = memo(KanbanViewComponent);
KanbanView.displayName = 'KanbanView';
