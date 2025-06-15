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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await authenticateUser(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const urlId = Number.parseInt(resolvedParams.id);

    if (Number.isNaN(urlId)) {
      return NextResponse.json({ error: 'Invalid URL ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('urls')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', urlId)
      .eq('user_id', Number.parseInt(userId));

    if (error) {
      return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
  }
}
