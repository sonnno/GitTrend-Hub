"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import TrendTabs from "@/components/TrendTabs";
import ProjectList from "@/components/ProjectList";
import type { TrendCategory, ProjectWithBadge } from "@/types";
import styles from "./page.module.css";

interface HomePageProps {
  initialCategory: TrendCategory;
}

export default function HomePage({ initialCategory }: HomePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<TrendCategory>(initialCategory);
  const [projects, setProjects] = useState<ProjectWithBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async (cat: TrendCategory) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/trends?category=${cat}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data: ProjectWithBadge[] = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(category);
  }, [category, fetchProjects]);

  const handleTabChange = (newCategory: TrendCategory) => {
    setCategory(newCategory);
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", newCategory);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleToggleCollection = async (githubId: number) => {
    try {
      const response = await fetch("/api/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubId }),
      });

      if (!response.ok) throw new Error("Failed to toggle collection");

      setProjects((prev: ProjectWithBadge[]) =>
        prev.map((p) =>
          p.githubId === githubId ? { ...p, isCollected: !p.isCollected } : p
        )
      );
    } catch (error) {
      console.error("Error toggling collection:", error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>
            <span className={styles.gradient}>GitTrend</span> Hub
          </h1>
          <p className={styles.subtitle}>
            Discover trending repositories with intelligent ranking
          </p>
        </motion.div>

        <div className={styles.stats}>
          <div className={styles.statPill}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.pillIcon}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Real-time Rankings</span>
          </div>
          <div className={styles.statPill}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.pillIcon}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Multi-dimensional Analysis</span>
          </div>
          <div className={styles.statPill}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.pillIcon}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            <span>Smart Collections</span>
          </div>
        </div>
      </div>

      <TrendTabs activeTab={category} onTabChange={handleTabChange} />

      {loading ? (
        <div className={styles.loading}>
          <motion.div
            className={styles.spinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className={styles.loadingText}>Loading trending repositories...</p>
        </div>
      ) : (
        <ProjectList
          projects={projects}
          category={category}
          onToggleCollection={handleToggleCollection}
        />
      )}
    </main>
  );
}
