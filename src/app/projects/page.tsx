'use client';

import { Layout } from '@/components/layout';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Trash2, FolderKanban } from 'lucide-react';
import { useState } from 'react';
import { ProjectModal } from '@/components/project-modal';

export default function ProjectsPage() {
  const { projects, deleteProject, tasks, loading } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTaskCount = (projectId: string) => {
    return tasks.filter((task) => task.projectId === projectId).length;
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your projects and their tasks</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[210px] rounded-xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 animate-pulse flex flex-col justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mt-4" />
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="will-change-transform"
              >
                <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-lg shadow-inner"
                          style={{ backgroundColor: project.color }}
                        />
                        <div>
                          <CardTitle className="text-slate-900 dark:text-slate-100 font-semibold text-lg truncate max-w-[150px]">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="text-slate-500 dark:text-slate-400">
                            {getTaskCount(project.id)} tasks
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProject(project.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 min-h-[40px]">
                      {project.description || 'No description provided.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800">
                        Active
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16 bg-white/20 dark:bg-slate-800/10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"
              >
                <FolderKanban className="h-12 w-12 mx-auto mb-4 text-slate-400 opacity-60" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">No projects yet</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-6">Create your first project to get organized.</p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outline"
                  className="border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  Create your first project
                </Button>
              </motion.div>
            )}
          </div>
        )}

        <ProjectModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </motion.div>
    </Layout>
  );
}
