'use client';

import { motion } from 'framer-motion';
import { TrendCategory } from '@/lib/fetcher';

interface Tab {
  id: TrendCategory;
  label: string;
  description: string;
}

const tabs: Tab[] = [
  { id: 'all-time', label: '全站总榜', description: '历史最高星标项目' },
  { id: 'monthly', label: '本月新秀', description: '近30天创建的热门项目' },
  { id: 'recently-active', label: '最近活跃', description: '近7天有更新的项目' },
  { id: 'trending', label: '攀升榜', description: '近期快速增长的项目' },
];

interface TrendTabsProps {
  activeCategory: TrendCategory;
  onCategoryChange: (category: TrendCategory) => void;
}

export function TrendTabs({ activeCategory, onCategoryChange }: TrendTabsProps) {
  return (
    <div className="tabs-container">
      <div className="tabs-wrapper">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onCategoryChange(tab.id)}
            className={`tab-button ${activeCategory === tab.id ? 'active' : ''}`}
          >
            {activeCategory === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="tab-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="tab-label">{tab.label}</span>
            <span className="tab-description">{tab.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
