'use client';

import { useOptimistic, useTransition, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RepoCard } from './RepoCard';
import { Project, TrendCategory } from '@/lib/fetcher';
import { toggleCollection } from '@/app/actions';

interface ProjectListProps {
  projects: Project[];
  category: TrendCategory;
}

export function ProjectList({ projects, category }: ProjectListProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticProjects, addOptimisticProject] = useOptimistic(
    projects,
    (state, { githubId, isCollected }: { githubId: number; isCollected: boolean }) =>
      state.map((p) =>
        p.githubId === githubId ? { ...p, isCollected } : p
      )
  );

  const handleToggleCollect = useCallback(async (githubId: number) => {
    // 找到当前项目的状态
    const project = optimisticProjects.find(p => p.githubId === githubId);
    const newState = !project?.isCollected;
    
    startTransition(async () => {
      // 乐观更新
      addOptimisticProject({ githubId, isCollected: newState });
      
      try {
        // 调用 Server Action
        const result = await toggleCollection(githubId);
        if (!result.success) {
          // 如果失败，回滚状态
          addOptimisticProject({ githubId, isCollected: !newState });
        }
      } catch (error) {
        console.error('Error toggling collection:', error);
        // 回滚状态
        addOptimisticProject({ githubId, isCollected: !newState });
      }
    });
  }, [optimisticProjects, addOptimisticProject]);

  const isHeroLayout = category === 'all-time';

  return (
    <div className={`projects-grid ${isHeroLayout ? 'hero-layout' : 'bento-layout'}`}>
      <AnimatePresence mode="popLayout">
        {optimisticProjects.map((project, index) => (
          <motion.div
            key={project.githubId}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              layout: { duration: 0.2 },
            }}
          >
            <RepoCard
              project={project}
              variant={isHeroLayout ? 'hero' : 'bento'}
              onToggleCollect={handleToggleCollect}
              isOptimistic={isPending}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
