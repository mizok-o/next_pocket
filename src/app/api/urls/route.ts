import { supabase } from "@/app/supabaseClient";
import { getUserId } from "@/lib/supabaseServer";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "50", 10);

    if (page < 1) {
      return NextResponse.json({ error: "Page must be greater than 0" }, { status: 400 });
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json({ error: "Limit must be between 1 and 100" }, { status: 400 });
    }

    const offset = (page - 1) * limit;

    // Use supabaseAdmin with service role key - RLS will allow this through
    // Manual user_id filtering provides the actual security layer
    const { data, error } = await supabase
      .from("urls")
      .select("id, url, title, description, image_url, created_at, is_favorite")
      .eq("user_id", Number.parseInt(userId, 10))
      .is("deleted_at", null)
      .order("is_favorite", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch URLs" }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, title, description, image_url } = body;

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
      .insert({
        url,
        title,
        description,
        image_url,
        user_id: userIdInt,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create URL" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
