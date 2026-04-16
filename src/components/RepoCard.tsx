"use client";

import { motion } from "framer-motion";
import { useOptimistic, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import type { ProjectWithBadge, GrowthBadge } from "@/types";
import styles from "./RepoCard.module.css";

interface RepoCardProps {
  project: ProjectWithBadge;
  variant: "hero" | "bento";
  onToggleCollection: (githubId: number) => Promise<void>;
}

const languageColors: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  Go: "#00add8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#fa7343",
  Kotlin: "#a97bff",
  Ruby: "#701516",
  PHP: "#4f5d95",
  Scala: "#c22d40",
  Zig: "#ec915c",
  Shell: "#89e051",
};

const badgeConfig: Record<Exclude<GrowthBadge, null>, { emoji: string; label: string; className: string }> = {
  rocket: { emoji: "🚀", label: "Fast Growing", className: styles.badgeRocket },
  trending: { emoji: "📈", label: "Trending", className: styles.badgeTrending },
  sparkle: { emoji: "✨", label: "New Star", className: styles.badgeSparkle },
  fire: { emoji: "🔥", label: "Top Project", className: styles.badgeFire },
};

function formatStars(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

function formatGrowthRate(rate: number): string {
  if (rate >= 1000) {
    return `${(rate / 1000).toFixed(1)}k`;
  }
  return Math.round(rate).toString();
}

export default function RepoCard({ project, variant, onToggleCollection }: RepoCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCollected, setOptimisticCollected] = useOptimistic(
    project.isCollected,
    (state: boolean, newValue: boolean) => newValue
  );

  const handleToggle = () => {
    startTransition(async () => {
      setOptimisticCollected(!optimisticCollected);
      await onToggleCollection(project.githubId);
    });
  };

  const languageColor = project.language ? languageColors[project.language] || "#8b5cf6" : "#8b5cf6";
  const timeAgo = project.pushedAt
    ? formatDistanceToNow(new Date(project.pushedAt), { addSuffix: true })
    : "Unknown";

  const badgeInfo = project.badge ? badgeConfig[project.badge] : null;

  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={styles.heroCard}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <img
              src={project.ownerAvatarUrl}
              alt={project.ownerLogin}
              className={styles.heroAvatar}
            />
            <div className={styles.heroTitleSection}>
              <div className={styles.heroTitleRow}>
                <h3 className={styles.heroTitle}>{project.fullName}</h3>
                {badgeInfo && (
                  <span className={`${styles.badge} ${badgeInfo.className}`}>
                    <span className={styles.badgeEmoji}>{badgeInfo.emoji}</span>
                    <span className={styles.badgeLabel}>{badgeInfo.label}</span>
                  </span>
                )}
              </div>
              <p className={styles.heroDescription}>{project.description || "No description available"}</p>
            </div>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <svg className={styles.statIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className={styles.statValue}>{formatStars(project.stargazersCount)}</span>
              <span className={styles.statLabel}>Stars</span>
            </div>
            <div className={styles.statItem}>
              <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 18V4a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                <path d="M17 21H5a2 2 0 01-2-2V7" />
              </svg>
              <span className={styles.statValue}>{formatStars(project.forksCount)}</span>
              <span className={styles.statLabel}>Forks</span>
            </div>
            {project.growthRate > 0 && (
              <div className={styles.growthStat}>
                <svg className={styles.growthIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                <span className={styles.growthValue}>{formatGrowthRate(project.growthRate)}</span>
                <span className={styles.growthLabel}>stars/day</span>
              </div>
            )}
            {project.language && (
              <div className={styles.languageBadge}>
                <span className={styles.languageDot} style={{ backgroundColor: languageColor }} />
                <span>{project.language}</span>
              </div>
            )}
          </div>

          <div className={styles.heroActions}>
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewButton}
            >
              View Repo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.externalIcon}>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <motion.button
              onClick={handleToggle}
              disabled={isPending}
              className={`${styles.collectButton} ${optimisticCollected ? styles.collected : ""}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" fill={optimisticCollected ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              {optimisticCollected ? "Saved" : "Save"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={styles.bentoCard}
    >
      <div className={styles.bentoHeader}>
        <img
          src={project.ownerAvatarUrl}
          alt={project.ownerLogin}
          className={styles.bentoAvatar}
        />
        <div className={styles.bentoTitleWrapper}>
          <div className={styles.bentoTitleRow}>
            <h4 className={styles.bentoTitle}>{project.name}</h4>
            {badgeInfo && (
              <span className={`${styles.miniBadge} ${badgeInfo.className}`}>
                {badgeInfo.emoji}
              </span>
            )}
          </div>
          <span className={styles.bentoOwner}>{project.ownerLogin}</span>
        </div>
        <motion.button
          onClick={handleToggle}
          disabled={isPending}
          className={`${styles.bentoCollect} ${optimisticCollected ? styles.collected : ""}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg viewBox="0 0 24 24" fill={optimisticCollected ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </motion.button>
      </div>

      <p className={styles.bentoDescription}>{project.description || "No description available"}</p>

      <div className={styles.bentoMeta}>
        <div className={styles.bentoStats}>
          <span className={styles.bentoStat}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.miniIcon}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {formatStars(project.stargazersCount)}
          </span>
          <span className={styles.bentoStat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.miniIcon}>
              <path d="M7 18V4a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
              <path d="M17 21H5a2 2 0 01-2-2V7" />
            </svg>
            {formatStars(project.forksCount)}
          </span>
          {project.growthRate > 10 && (
            <span className={styles.bentoGrowth}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.miniIcon}>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              </svg>
              {formatGrowthRate(project.growthRate)}/day
            </span>
          )}
        </div>
        {project.language && (
          <span className={styles.bentoLanguage}>
            <span className={styles.languageDot} style={{ backgroundColor: languageColor }} />
            {project.language}
          </span>
        )}
      </div>

      <div className={styles.bentoFooter}>
        <span className={styles.bentoTime}>{timeAgo}</span>
        <a
          href={project.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.bentoLink}
        >
          View
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.tinyIcon}>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}
