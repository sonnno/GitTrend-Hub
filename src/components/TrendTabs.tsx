"use client";

import { motion } from "framer-motion";
import type { TrendCategory } from "@/types";
import styles from "./TrendTabs.module.css";

interface TrendTabsProps {
  activeTab: TrendCategory;
  onTabChange: (tab: TrendCategory) => void;
}

const tabs: { id: TrendCategory; label: string; description: string }[] = [
  { id: "all-time", label: "All-Time", description: "Top starred repositories" },
  { id: "monthly", label: "Monthly", description: "New stars this month" },
  { id: "active", label: "Active", description: "Recently updated" },
  { id: "rising", label: "Rising", description: "Fast growing" },
];

export default function TrendTabs({ activeTab, onTabChange }: TrendTabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsWrapper}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className={styles.activeIndicator}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}
            <span className={styles.tabLabel}>{tab.label}</span>
            <span className={styles.tabDescription}>{tab.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
