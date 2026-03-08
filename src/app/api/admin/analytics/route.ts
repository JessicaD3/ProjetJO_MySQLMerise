import { NextResponse } from "next/server";
import { getAdminAnalyticsDashboard } from "@/services/adminAnalytics.service";

export async function GET() {
  try {
    const data = await getAdminAnalyticsDashboard();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      { error: "Impossible de charger les données analytics." },
      { status: 500 }
    );
  }
}