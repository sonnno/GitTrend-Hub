'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TrendTabs } from './TrendTabs';
import { ProjectList } from './ProjectList';
import { Project, TrendCategory } from '@/lib/fetcher';

interface HomePageClientProps {
  initialProjects: Project[];
  initialCategory: TrendCategory;
}

export function HomePageClient({ initialProjects, initialCategory }: HomePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<TrendCategory>(initialCategory);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(false);

  // 关键修复：当服务端返回新数据时，同步更新客户端状态
  // 这确保了服务端渲染的 HTML 与客户端状态一致
  useEffect(() => {
    setProjects(initialProjects);
    setCategory(initialCategory);
  }, [initialProjects, initialCategory]);

  const handleCategoryChange = useCallback(async (newCategory: TrendCategory) => {
    if (newCategory === category) return;
    
    setIsLoading(true);
    
    // 更新 URL - 这会触发服务端重新获取数据
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', newCategory);
    router.push(`/?${params.toString()}`);
    
    // 注意：不要在这里手动设置 category 或 projects
    // 让 useEffect 在 initialProjects/initialCategory 变化时自动同步
    // 这样可以确保服务端和客户端状态一致
  }, [category, router, searchParams]);

  return (
    <>
      <TrendTabs 
        activeCategory={category} 
        onCategoryChange={handleCategoryChange} 
      />
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>正在加载项目...</p>
        </div>
      ) : (
        <ProjectList projects={projects} category={category} />
      )}
    </>
  );
}
