import { supabase } from "@/app/supabaseClient";
import { getUserId } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const urlId = Number.parseInt(resolvedParams.id, 10);

    if (Number.isNaN(urlId)) {
      return NextResponse.json({ error: "Invalid URL ID" }, { status: 400 });
    }

    const body = await request.json();
    const { is_favorite } = body;

    if (typeof is_favorite !== "boolean") {
      return NextResponse.json({ error: "is_favorite must be a boolean" }, { status: 400 });
    }

    const userIdInt = Number.parseInt(userId, 10);
    if (Number.isNaN(userIdInt)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("urls")
      .update({ is_favorite })
      .eq("id", urlId)
      .eq("user_id", userIdInt)
      .is("deleted_at", null)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update favorite status" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "URL not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}