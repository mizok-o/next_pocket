import { supabase } from "@/app/supabaseClient";
import { getUserId } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function PUT(
  favoriteUpdateRequest: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticatedUserId = await getUserId(favoriteUpdateRequest);

    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const bookmarkId = Number.parseInt(resolvedParams.id, 10);

    if (Number.isNaN(bookmarkId)) {
      return NextResponse.json({ error: "Invalid bookmark ID" }, { status: 400 });
    }

    const requestBody = await favoriteUpdateRequest.json();
    const { is_favorite: updatedIsFavoriteStatus } = requestBody;

    if (typeof updatedIsFavoriteStatus !== "boolean") {
      return NextResponse.json({ error: "is_favorite must be a boolean" }, { status: 400 });
    }

    const authenticatedUserIdAsNumber = Number.parseInt(authenticatedUserId, 10);
    if (Number.isNaN(authenticatedUserIdAsNumber)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Update favorite status in database
    const { data: updatedBookmark, error: databaseUpdateError } = await supabase
      .from("urls")
      .update({ is_favorite: updatedIsFavoriteStatus })
      .eq("id", bookmarkId)
      .eq("user_id", authenticatedUserIdAsNumber)
      .is("deleted_at", null)
      .select()
      .single();

    if (databaseUpdateError) {
      console.error('Database error updating favorite status:', databaseUpdateError);
      return NextResponse.json({ error: "Failed to update favorite status" }, { status: 500 });
    }

    if (!updatedBookmark) {
      return NextResponse.json({ error: "Bookmark not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ data: updatedBookmark });
  } catch (unexpectedError) {
    console.error('Unexpected error in favorite update API:', unexpectedError);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}