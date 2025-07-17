import { supabase } from "@/app/supabaseClient";
import { getUserId } from "@/lib/supabaseServer";
import type { ErrorResponse, UrlResponse } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UrlResponse | ErrorResponse>> {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "認証されていません" }, { status: 401 });
    }

    const { id } = await params;
    const urlId = Number.parseInt(id, 10);

    if (Number.isNaN(urlId)) {
      return NextResponse.json({ error: "無効なURLのIDです" }, { status: 400 });
    }

    const body = await request.json();
    const { is_favorite } = body;

    if (typeof is_favorite !== "boolean") {
      return NextResponse.json(
        { error: "is_favoriteはtrue/falseで指定してください" },
        { status: 400 }
      );
    }

    const { data: updatedUrl, error } = await supabase
      .from("urls")
      .update({ is_favorite })
      .eq("id", urlId)
      .eq("user_id", Number.parseInt(userId, 10))
      .is("deleted_at", null)
      .select()
      .single();

    if (error) {
      console.error("Database error updating favorite status:", error);
      return NextResponse.json({ error: "お気に入りの更新に失敗しました" }, { status: 500 });
    }

    if (!updatedUrl) {
      return NextResponse.json(
        { error: "URLが見つからないか、アクセス権限がありません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedUrl });
  } catch (error) {
    console.error("Unexpected error in favorite update API:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
