import { supabase } from "@/app/supabaseClient";
import { formatDate, formatMonth, getMonthRange } from "@/lib/utils/date";
import type { UserMonthlyBookmark } from "@/types/dashboard";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { startISO, endISO } = getMonthRange();

    const { data, error } = await supabase.rpc("get_user_monthly_bookmarks", {
      start_date: startISO,
      end_date: endISO,
      limit_count: 10,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch user monthly bookmarks" },
        { status: 500 }
      );
    }

    const userMonthlyBookmarks: UserMonthlyBookmark[] = data.map(
      (record: {
        user_id: string;
        created_at: string;
        bookmark_count: number;
      }) => ({
        userId: record.user_id,
        createdAt: formatDate(record.created_at),
        bookmarkCount: Number(record.bookmark_count),
      })
    );

    return NextResponse.json({
      month: formatMonth(),
      userMonthlyBookmarks,
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
