'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Repo } from '@/lib/fetcher';
import { CollectButton } from './CollectButton';
import { motion } from 'framer-motion';

interface RepoCardProps {
  repo: Repo;
  variant: 'hero' | 'bento';
  layoutId: string;
}

export function RepoCard({ repo, variant, layoutId }: RepoCardProps) {
  const formattedStars = repo.stars >= 1000
    ? `${(repo.stars / 1000).toFixed(1)}k`
    : repo.stars.toString();

  const updatedAt = formatDistanceToNow(repo.updatedAt, {
    addSuffix: true,
    locale: zhCN,
  });

  const handleCardClick = () => {
    window.open(repo.htmlUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'hero') {
    return (
      <motion.div
        layoutId={layoutId}
        className="hero-card"
        onClick={handleCardClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <CollectButton githubId={repo.githubId} initialCollected={repo.isCollected} />
        <div className="hero-header">
          <img
            src={repo.avatarUrl}
            alt={repo.owner}
            className="hero-avatar"
          />
          <div className="hero-title">
            <h2>{repo.fullName}</h2>
            <p>{repo.description}</p>
          </div>
          <button
            className="view-btn"
            onClick={(e) => {
              e.stopPropagation();
              window.open(repo.htmlUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            View Repo
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-value">{formattedStars}</div>
            <div className="stat-label">Stars</div>
          </div>
          <div className="stat">
            <div className="stat-value">{repo.forks}</div>
            <div className="stat-label">Forks</div>
          </div>
          <div className="stat">
            <div className="stat-value">{repo.language || 'N/A'}</div>
            <div className="stat-label">Language</div>
          </div>
          <div className="stat">
            <div className="stat-value">{repo.openIssues}</div>
            <div className="stat-label">Issues</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={layoutId}
      className="bento-card"
      onClick={handleCardClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <CollectButton githubId={repo.githubId} initialCollected={repo.isCollected} />
      <div className="bento-header">
        <img
          src={repo.avatarUrl}
          alt={repo.owner}
          className="bento-avatar"
        />
        <div className="bento-title">
          <h3>{repo.name}</h3>
          <p>{repo.owner}</p>
        </div>
      </div>
      <p className="bento-description">{repo.description}</p>
      <div className="bento-footer">
        <div className="bento-meta-left">
          {repo.language && (
            <span className="language-tag">{repo.language}</span>
          )}
          <span className="growth-badge">{repo.dailyGrowth}</span>
        </div>
        <div className="bento-meta">
          <span className="meta-item">
            <span className="star-icon">★</span>
            {formattedStars}
          </span>
          <span className="date-label">{updatedAt}</span>
        </div>
      </div>
    </motion.div>
  );
}
