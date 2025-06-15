import { authOptions } from '@/lib/auth';
import { generateJWT } from '@/lib/jwt';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = await generateJWT(session.user.id);

    return NextResponse.json({
      token,
      expires_in: 604800,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}