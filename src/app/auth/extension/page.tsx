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
      console.error('Token generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">拡張機能認証</h1>
          <p className="text-gray-600 text-center mb-6">
            Chrome拡張機能を使用するには、まずログインが必要です。
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl: '/auth/extension' })}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Googleでログイン
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">認証完了</h1>
        
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>トークンを生成中...</p>
          </div>
        )}
        
        {token && (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold">認証成功！</p>
              <p className="text-sm">Chrome拡張機能が使用可能になりました。</p>
            </div>
            <p className="text-gray-600 text-sm">
              このタブは自動的に閉じられます...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}