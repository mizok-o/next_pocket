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

export async function GET(request: Request) {
  try {
    const userId = await authenticateUser(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', Number.parseInt(userId))
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch {
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await authenticateUser(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, title, description, image_url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('urls')
      .insert({
        url,
        title,
        description,
        image_url,
        user_id: Number.parseInt(userId),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create URL' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}
