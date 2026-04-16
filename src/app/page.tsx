import { Suspense } from "react";
import HomePage from "./HomePage";
import type { TrendCategory } from "@/types";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

const validCategories: TrendCategory[] = ["all-time", "monthly", "active", "rising"];

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const category: TrendCategory = validCategories.includes(resolvedParams.category as TrendCategory)
    ? (resolvedParams.category as TrendCategory)
    : "all-time";

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <HomePage initialCategory={category} />
    </Suspense>
  );
}
