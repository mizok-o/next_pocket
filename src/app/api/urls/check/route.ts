import { NextResponse } from 'next/server'
import { supabase } from '@/app/supabaseClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { verifyJWT } from '@/lib/jwt'

async function authenticateUser(request: Request): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    return session.user.id
  }
  
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const payload = await verifyJWT(token)
    return payload?.userId || null
  }
  
  return null
}

export async function POST(request: Request) {
  try {
    const userId = await authenticateUser(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    
    const { data } = await supabase
      .from('urls')
      .select('id')
      .eq('url', url)
      .eq('user_id', parseInt(userId))
      .is('deleted_at', null);
    
    return NextResponse.json({ exists: data && data.length > 0 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error occurred' }, { status: 500 })
  }
}