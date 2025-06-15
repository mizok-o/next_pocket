import { createClient } from '@supabase/supabase-js';
import { authOptions } from '@/lib/auth';
import { verifyJWT } from '@/lib/jwt';
import { getServerSession } from 'next-auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables are not set');
}

// Create a Supabase client with service role key for server operations
// This bypasses RLS and puts security responsibility on the application layer
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper function to get user ID from session or JWT
export async function getUserId(request?: Request): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  if (request) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
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