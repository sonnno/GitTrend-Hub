'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Project } from '@/lib/fetcher';

interface RepoCardProps {
  project: Project;
  variant: 'hero' | 'bento';
  onToggleCollect: (githubId: number) => void;
  isOptimistic?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    'C++': '#f34b7d',
    C: '#555555',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Ruby: '#701516',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Elixir: '#6e4a7e',
  };
  return colors[language || ''] || '#8b949e';
}

// 增长勋章组件
function GrowthBadge({ badge, growth }: { badge: Project['growthBadge']; growth: number }) {
  if (!badge) return null;
  
  return (
    <motion.div 
      className="growth-badge"
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      style={{ 
        backgroundColor: `${badge.color}20`,
        borderColor: badge.color,
        color: badge.color 
      }}
    >
      <span className="badge-icon">{badge.icon}</span>
      <span className="badge-label">{badge.label}</span>
      {growth > 0 && (
        <span className="badge-growth">+{growth.toFixed(0)}%</span>
      )}
    </motion.div>
  );
}

export function RepoCard({ project, variant, onToggleCollect, isOptimistic }: RepoCardProps) {
  const handleCollect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleCollect(project.githubId);
  };

  const handleCardClick = () => {
    window.open(project.htmlUrl, '_blank', 'noopener,noreferrer');
  };

  // 使用 date-fns 格式化日期，避免 hydration mismatch
  const formattedDate = format(new Date(project.pushedAt), 'yyyy-MM-dd', { locale: zhCN });

  if (variant === 'hero') {
    return (
      <motion.div
        className="hero-card"
        onClick={handleCardClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <div className="hero-card-content">
          <div className="hero-card-header">
            <div className="owner-info">
              <img
                src={project.ownerAvatar}
                alt={project.owner}
                className="owner-avatar"
                loading="lazy"
              />
              <div className="owner-meta">
                <span className="owner-name">{project.owner}</span>
                <span className="repo-name">{project.name}</span>
              </div>
            </div>
            <button
              onClick={handleCollect}
              className={`collect-button ${project.isCollected ? 'collected' : ''} ${isOptimistic ? 'optimistic' : ''}`}
              aria-label={project.isCollected ? '取消收藏' : '收藏'}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={project.isCollected ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          </div>

          {/* 增长勋章 */}
          {project.growthBadge && (
            <div className="badge-container">
              <GrowthBadge badge={project.growthBadge} growth={project.starsGrowth} />
            </div>
          )}

          <p className="hero-description">{project.description || 'No description available'}</p>

          <div className="hero-stats">
            <div className="stat-item primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{formatNumber(project.stars)}</span>
            </div>
            {project.language && (
              <div className="stat-item">
                <span
                  className="language-dot"
                  style={{ backgroundColor: getLanguageColor(project.language) }}
                />
                <span>{project.language}</span>
              </div>
            )}
            <div className="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 6.34L2.1 2.1m17.8 17.8l-4.24-4.24M6.34 17.66l-4.24 4.24M23 12h-6m-6 0H1m20.24-4.24l-4.24 4.24M6.34 6.34l-4.24-4.24" />
              </svg>
              <span>{formatNumber(project.forks)}</span>
            </div>
          </div>

          <div className="hero-footer">
            <span className="updated-at">更新于 {formattedDate}</span>
            <span className="view-repo">View Repo →</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Bento variant
  return (
    <motion.div
      className="bento-card"
      onClick={handleCardClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="bento-card-content">
        <div className="bento-header">
          <img
            src={project.ownerAvatar}
            alt={project.owner}
            className="bento-avatar"
            loading="lazy"
          />
          <div className="bento-title">
            <span className="bento-repo-name">{project.name}</span>
            <span className="bento-owner">{project.owner}</span>
          </div>
          <button
            onClick={handleCollect}
            className={`collect-button small ${project.isCollected ? 'collected' : ''} ${isOptimistic ? 'optimistic' : ''}`}
            aria-label={project.isCollected ? '取消收藏' : '收藏'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={project.isCollected ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>

        {/* 增长勋章 - Bento 模式 */}
        {project.growthBadge && (
          <div className="badge-container bento-badge">
            <GrowthBadge badge={project.growthBadge} growth={project.starsGrowth} />
          </div>
        )}

        <p className="bento-description">{project.description || 'No description'}</p>

        <div className="bento-meta">
          {project.language && (
            <span className="bento-language">
              <span
                className="language-dot"
                style={{ backgroundColor: getLanguageColor(project.language) }}
              />
              {project.language}
            </span>
          )}
          <span className="bento-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {formatNumber(project.stars)}
          </span>
        </div>

        <div className="bento-footer">
          <span className="bento-date">{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
}
