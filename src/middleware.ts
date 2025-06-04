import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // ルートパスへのアクセス
  if (pathname === '/') {
    if (token) {
      // 認証済みなら /urls へリダイレクト
      return NextResponse.redirect(new URL('/urls', req.url))
    } else {
      // 未認証なら /login へリダイレクト (ログイン後 /urls に戻るように)
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', '/urls')
      return NextResponse.redirect(loginUrl)
    }
  }

  // /urls ページへのアクセスで、トークンがない (未認証) 場合
  if (pathname.startsWith('/urls') && !token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname) // 元の /urls パスを保持
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/', // ルートパスを追加
    '/urls/:path*'
  ],
} 