import { supabase } from "@/app/supabaseClient";
import { getUserId } from "@/lib/supabaseServer";
import type { CreateUrlRequest, ErrorResponse, UrlResponse, UrlsResponse } from "@/types";
import { validateCreateUrlRequest } from "@/types";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse<UrlsResponse | ErrorResponse>> {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use supabaseAdmin with service role key - RLS will allow this through
    // Manual user_id filtering provides the actual security layer
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", Number.parseInt(userId, 10))
      .is("deleted_at", null)
      .order("is_favorite", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch URLs" }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("Unexpected error in GET /api/urls:", error);
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse<UrlResponse | ErrorResponse>> {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!validateCreateUrlRequest(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { url, title, description, image_url } = body as CreateUrlRequest;

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
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to create URL" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error in POST /api/urls:", error);
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
