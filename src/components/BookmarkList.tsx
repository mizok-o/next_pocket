'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Url {
  id: number
  url: string
  title: string | null
  description: string | null
  image_url: string | null
  created_at: string
}

export default function BookmarkList() {
  const [urls, setUrls] = useState<Url[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/urls')
      if (!response.ok) {
        throw new Error('Failed to fetch URLs')
      }
      const { data } = await response.json()
      setUrls(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const handleCardClick = (url: string) => {
    window.location.href = url
  }

  const handleNewTabClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, '_blank')
  }

  const handleMenuClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenMenuId(openMenuId === id ? null : id)
  }

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete URL')
      }
      
      setUrls(urls.filter(url => url.id !== id))
      setOpenMenuId(null)
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId !== null) {
        const target = e.target as HTMLElement
        if (!target.closest('.menu-container')) {
          setOpenMenuId(null)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openMenuId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">エラーが発生しました: {error}</p>
        <button
          onClick={() => {
            setError(null)
            setLoading(true)
            fetchUrls()
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          再試行
        </button>
      </div>
    )
  }

  if (urls.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">ブックマークがまだありません</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {urls.map((url) => (
        <div
          key={url.id}
          onClick={() => handleCardClick(url.url)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer relative"
        >
          <div className="aspect-w-16 aspect-h-9 relative h-36 bg-gray-100">
            {url.image_url ? (
              <Image
                src={url.image_url}
                alt={url.title || url.url}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 pb-12">
            <h3 className="font-semibold text-xl mb-1 line-clamp-1">
              {url.title || url.url}
            </h3>
            {url.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {url.description}
              </p>
            )}
          </div>
          
          <div className="absolute top-2 right-2 menu-container">
            <button
              onClick={(e) => handleMenuClick(url.id, e)}
              className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all shadow-sm"
              title="メニュー"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            
            {openMenuId === url.id && (
              <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={(e) => handleDelete(url.id, e)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                >
                  削除
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => handleNewTabClick(url.url, e)}
            className="absolute bottom-0 right-0 p-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-tl-lg"
            title="新しいタブで開く"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}