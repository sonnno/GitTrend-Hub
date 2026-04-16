import { NextRequest, NextResponse } from "next/server";
import { toggleCollection } from "@/lib/fetcher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubId } = body;
    
    if (typeof githubId !== "number") {
      return NextResponse.json({ error: "Invalid githubId" }, { status: 400 });
    }
    
    const result = await toggleCollection(githubId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Collection Error:", error);
    return NextResponse.json({ error: "Failed to toggle collection" }, { status: 500 });
  }
}
