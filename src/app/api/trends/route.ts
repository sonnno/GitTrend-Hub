import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubTrends } from "@/lib/fetcher";
import type { TrendCategory } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = (searchParams.get("category") || "all-time") as TrendCategory;
  
  const validCategories: TrendCategory[] = ["all-time", "monthly", "active", "rising"];
  const safeCategory: TrendCategory = validCategories.includes(category) ? category : "all-time";
  
  try {
    const projects = await fetchGitHubTrends(safeCategory);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}
