import { supabase } from "@/app/supabaseClient";
import { getUserId } from "@/lib/supabaseServer";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Validate user ID is numeric
    const userIdInt = Number.parseInt(userId, 10);
    if (Number.isNaN(userIdInt)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Use update with select to verify the row was actually updated
    const { data, error } = await supabase
      .from("urls")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", urlId)
      .eq("user_id", userIdInt)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to delete URL" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "URL not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
