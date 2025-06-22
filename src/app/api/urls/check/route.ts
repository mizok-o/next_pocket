import { supabase } from "@/app/supabaseClient";
import { getUserId } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("POST /api/urls/check received");
  try {
    const userId = await getUserId(request);
    console.log("userId:", userId);
    if (!userId) {
      console.error("Unauthorized: No user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;
    console.log("Request body:", body);
    if (!url) {
      console.error("Bad Request: URL is required");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate user ID is numeric
    const userIdInt = Number.parseInt(userId, 10);
    console.log("Parsed userIdInt:", userIdInt);
    if (Number.isNaN(userIdInt)) {
      console.error("Bad Request: Invalid user ID format", { userId });
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    console.log(`Querying Supabase for url: ${url}, userId: ${userIdInt}`);
    const { data, error } = await supabase
      .from("urls")
      .select("id")
      .eq("url", url)
      .eq("user_id", userIdInt)
      .is("deleted_at", null);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to check URL" }, { status: 500 });
    }

    console.log("Supabase response data:", data);
    return NextResponse.json({ exists: data && data.length > 0 });
  } catch (err) {
    console.error("Server error in POST /api/urls/check:", err);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}
