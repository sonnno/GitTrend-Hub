"use client";

import { motion, AnimatePresence } from "framer-motion";
import RepoCard from "./RepoCard";
import type { ProjectWithBadge, TrendCategory } from "@/types";
import styles from "./ProjectList.module.css";

interface ProjectListProps {
  projects: ProjectWithBadge[];
  category: TrendCategory;
  onToggleCollection: (githubId: number) => Promise<void>;
}

export default function ProjectList({ projects, category, onToggleCollection }: ProjectListProps) {
  const isHeroLayout = category === "all-time";

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={isHeroLayout ? styles.heroGrid : styles.bentoGrid}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.githubId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <RepoCard
                project={project}
                variant={isHeroLayout ? "hero" : "bento"}
                onToggleCollection={onToggleCollection}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.empty}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon}>
            <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className={styles.emptyText}>No projects found</p>
          <p className={styles.emptySubtext}>Try a different category or check back later</p>
        </motion.div>
      )}
    </div>
  );
}
