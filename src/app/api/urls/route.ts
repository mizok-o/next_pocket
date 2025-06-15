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

export async function GET(request: Request) {
  try {
    const userId = await authenticateUser(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', parseInt(userId))
      .is('deleted_at', null)
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

export async function POST(request: Request) {
  try {
    const userId = await authenticateUser(request)
    
    if (!userId) {
      console.error('URL creation attempt without authentication')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { url, title, description, image_url } = body
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('urls')
      .insert({
        url,
        title,
        description,
        image_url,
        user_id: parseInt(userId)
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating URL:', error)
      return NextResponse.json(
        { error: 'Failed to create URL' },
        { status: 500 }
      )
    }
    
    console.log('URL saved successfully:', { url, user_id: userId })
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Server error during URL creation:', error)
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}