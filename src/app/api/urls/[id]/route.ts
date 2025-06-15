import { NextResponse } from 'next/server'
import { supabase } from '@/app/supabaseClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const resolvedParams = await params
    const urlId = parseInt(resolvedParams.id)
    
    // 論理削除（deleted_atに現在時刻を設定）
    const { error } = await supabase
      .from('urls')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', urlId)
      .eq('user_id', parseInt(session.user.id))
    
    if (error) {
      console.error('Error deleting URL:', error)
      return NextResponse.json(
        { error: 'Failed to delete URL' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    )
  }
}