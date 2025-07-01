import { supabase } from "@/app/supabaseClient";
import { CACHE_TTL } from "@/lib/constants";
import { getCache, setCache } from "@/lib/redis";
import { formatDate, formatMonth, getMonthRange, getPreviousMonthRange } from "@/lib/utils/date";
import type { KPICardData, UserMonthlyBookmark } from "@/types/dashboard";

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

export async function getKPIData(): Promise<KPICardData> {
  const { count: totalCount, error: totalError } = await supabase
    .from("urls")
    .select("id", { count: "exact" })
    .is("deleted_at", null);

  if (totalError) {
    throw new Error("Failed to fetch total bookmarks");
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
    throw new Error("Failed to fetch monthly bookmarks");
  }

  const { count: lastMonthCount, error: lastMonthError } = await supabase
    .from("urls")
    .select("id", { count: "exact" })
    .is("deleted_at", null)
    .gte("created_at", lastMonthStart)
    .lt("created_at", lastMonthEnd);

  if (lastMonthError) {
    throw new Error("Failed to fetch last month bookmarks");
  }

  const monthlyBookmarks = monthlyCount || 0;
  const lastMonthBookmarks = lastMonthCount || 0;

  const monthlyBookmarksChange = calculatePercentageChange(monthlyBookmarks, lastMonthBookmarks);

  return {
    totalBookmarks: totalCount || 0,
    monthlyBookmarks,
    monthlyBookmarksChange,
  };
}

export async function getUserMonthlyData(): Promise<UserMonthlyBookmark[]> {
  const { startISO, endISO } = getMonthRange();
  const cacheKey = `dashboard:users:monthly:${startISO}:${endISO}`;

  const cached = await getCache<{
    month: string;
    userMonthlyBookmarks: UserMonthlyBookmark[];
  }>(cacheKey);

  if (cached) {
    return cached.userMonthlyBookmarks;
  }

  const { data, error } = await supabase.rpc("get_user_monthly_bookmarks", {
    start_date: startISO,
    end_date: endISO,
    limit_count: 10,
  });

  if (error) {
    throw new Error("Failed to fetch user monthly bookmarks");
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

  const responseData = {
    month: formatMonth(),
    userMonthlyBookmarks,
  };

  await setCache(cacheKey, responseData, CACHE_TTL.DASHBOARD_DATA);

  return userMonthlyBookmarks;
}
