import { getKPIData } from "@/lib/data/dashboard";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kpiData = await getKPIData();
    return NextResponse.json(kpiData);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
