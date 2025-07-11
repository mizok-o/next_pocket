import { supabase } from "@/app/supabaseClient";
import { getUserId } from "@/lib/supabaseServer";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate user ID is numeric
    const userIdInt = Number.parseInt(userId, 10);
    if (Number.isNaN(userIdInt)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("urls")
      .select("id")
      .eq("url", url)
      .eq("user_id", userIdInt)
      .is("deleted_at", null);

    if (error) {
      return NextResponse.json({ error: "Failed to check URL" }, { status: 500 });
    }

    return NextResponse.json({ exists: data && data.length > 0 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
