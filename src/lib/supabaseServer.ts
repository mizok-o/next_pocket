import { authOptions } from "@/lib/auth";
import { verifyJWT } from "@/lib/jwt";
import { getServerSession } from "next-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error("Supabase environment variables are not set");
}

// Helper function to get user ID from session or JWT
export async function getUserId(request?: Request): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    return session.user.id;
  }

  if (request) {
    const authHeader = request.headers.get("Authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = await verifyJWT(token);
      return payload?.userId || null;
    }
  }

  return null;
}

// Helper function to verify user authorization
export async function verifyUserAccess(userId: string, request?: Request): Promise<boolean> {
  const authenticatedUserId = await getUserId(request);
  return authenticatedUserId === userId;
}
