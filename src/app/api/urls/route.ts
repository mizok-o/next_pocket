import { NextResponse } from 'next/server'
import { supabase } from '@/app/supabaseClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', parseInt(session.user.id))
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching URLs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch URLs' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}