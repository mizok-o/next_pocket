import { supabase } from '@/app/supabaseClient';
import { authOptions } from '@/lib/auth';
import { verifyJWT } from '@/lib/jwt';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

async function authenticateUser(request: Request): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);
    return payload?.userId || null;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { data } = await supabase
      .from('urls')
      .select('id')
      .eq('url', url)
      .eq('user_id', Number.parseInt(userId))
      .is('deleted_at', null);

    return NextResponse.json({ exists: data && data.length > 0 });
  } catch {
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}
