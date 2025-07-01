import { getUserMonthlyData } from "@/lib/data/dashboard";
import { formatMonth } from "@/lib/utils/date";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userMonthlyBookmarks = await getUserMonthlyData();

    const responseData = {
      month: formatMonth(),
      userMonthlyBookmarks,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
