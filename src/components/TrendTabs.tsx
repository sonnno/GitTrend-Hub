'use client';

import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Category } from '@/lib/fetcher';

const tabs: { key: Category; label: string }[] = [
  { key: 'all-time', label: '🔥 全站总榜' },
  { key: 'monthly', label: '⭐ 本月新秀' },
  { key: 'weekly', label: '📈 攀升榜' },
  { key: 'active', label: '⚡ 最近活跃' },
];

interface TrendTabsProps {
  activeCategory: Category;
}

export function TrendTabs({ activeCategory }: TrendTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (category: Category) => {
    router.push(`${pathname}?category=${category}`);
  };

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-button ${activeCategory === tab.key ? 'active' : ''}`}
          onClick={() => handleTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
      <motion.div
        className="tab-indicator"
        layoutId="tab-indicator"
        initial={false}
        animate={{
          left: `${tabs.findIndex((t) => t.key === activeCategory) * 25 + 1}%`,
          width: '24%',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  );
}
