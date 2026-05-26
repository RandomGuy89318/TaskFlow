'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Don't protect login and signup pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (isAuthPage) {
      return;
    }
    if (!loading && !isConfigured) {
      // Allow access if Supabase is not configured
      return;
    }
    if (!loading && isConfigured && !user) {
      router.push('/login');
    }
  }, [loading, isConfigured, user, router, isAuthPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Lock className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthPage && isConfigured && !user) {
    return null;
  }

  return <>{children}</>;
}
