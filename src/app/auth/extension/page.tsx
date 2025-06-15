'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'

export default function ExtensionAuth() {
  const { data: session, status } = useSession()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      generateToken()
    }
  }, [session])

  const generateToken = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/extension-token', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate token')
      }
      
      const data = await response.json()
      setToken(data.token)
      
      // Chrome拡張機能にトークンを送信
      window.postMessage({
        type: 'AUTH_SUCCESS',
        token: data.token,
        expires_in: data.expires_in
      }, '*')
      
      // 3秒後にタブを閉じる
      setTimeout(() => {
        window.close()
      }, 3000)
      
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center space-x-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="text-gray-600 font-medium">認証状態を確認中...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
              拡張機能認証
            </h1>
            <p className="text-gray-600">
              Chrome拡張機能を使用するには、まずログインが必要です
            </p>
          </div>
          <button
            onClick={() => signIn('google', { callbackUrl: '/auth/extension' })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Googleでログイン
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">
            認証完了
          </h1>
          
          {loading && (
            <div className="flex items-center justify-center space-x-3 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
              <span className="text-gray-600 font-medium">トークンを生成中...</span>
            </div>
          )}
          
          {token && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-medium text-green-800 mb-1">認証成功</p>
                <p className="text-sm text-green-700">
                  Chrome拡張機能が使用可能になりました
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                このタブは自動的に閉じられます...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}