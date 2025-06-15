import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateJWT } from '@/lib/jwt'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.error('Extension token request without valid session')
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }
    
    const token = await generateJWT(session.user.id)
    
    console.log('Extension JWT token generated for user:', session.user.email)
    
    return NextResponse.json({
      token,
      expires_in: 604800
    })
  } catch (error) {
    console.error('Extension token generation failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}