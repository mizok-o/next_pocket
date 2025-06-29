import { supabase } from "@/app/supabaseClient";
import { getMonthRange, getPreviousMonthRange } from "@/lib/utils/date";
import type { KPICardData } from "@/types/dashboard";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

const getChangeStatus = (
  current: number,
  previous: number
): KPICardData["monthlyBookmarksChange"]["status"] => {
  if (previous === 0) return "same";
  return current > previous ? "up" : "down";
};

const calculatePercentageChange = (
  current: number,
  previous: number
): KPICardData["monthlyBookmarksChange"] => {
  if (previous === 0) return { status: "same", value: "-" };

  const change = ((current - previous) / previous) * 100;
  return {
    status: getChangeStatus(current, previous),
    value: `${change.toFixed(2)}%`,
  };
};

export async function GET() {
  try {
    const { count: totalCount, error: totalError } = await supabase
      .from("urls")
      .select("id", { count: "exact" })
      .is("deleted_at", null);

    if (totalError) {
      return NextResponse.json({ error: "Failed to fetch total bookmarks" }, { status: 500 });
    }

    const { startISO: currentMonthStart, endISO: currentMonthEnd } = getMonthRange();
    const { startISO: lastMonthStart, endISO: lastMonthEnd } = getPreviousMonthRange();

    const { count: monthlyCount, error: monthlyError } = await supabase
      .from("urls")
      .select("id", { count: "exact" })
      .is("deleted_at", null)
      .gte("created_at", currentMonthStart)
      .lt("created_at", currentMonthEnd);

    if (monthlyError) {
      return NextResponse.json({ error: "Failed to fetch monthly bookmarks" }, { status: 500 });
    }

    const { count: lastMonthCount, error: lastMonthError } = await supabase
      .from("urls")
      .select("id", { count: "exact" })
      .is("deleted_at", null)
      .gte("created_at", lastMonthStart)
      .lt("created_at", lastMonthEnd);

    if (lastMonthError) {
      return NextResponse.json({ error: "Failed to fetch last month bookmarks" }, { status: 500 });
    }

    const monthlyBookmarks = monthlyCount || 0;
    const lastMonthBookmarks = lastMonthCount || 0;

    const monthlyBookmarksChange = calculatePercentageChange(monthlyBookmarks, lastMonthBookmarks);

    return NextResponse.json({
      totalBookmarks: totalCount || 0,
      monthlyBookmarks,
      monthlyBookmarksChange,
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
