'use client';

import { useEffect, useState } from 'react';

import type { Url } from '@/types';

export default function BookmarkList() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/urls');
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }
      const { data }: { data: Url[] } = await response.json();
      setUrls(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (url: string) => {
    window.location.href = url;
  };

  const handleNewTabClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const handleMenuClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      setUrls(urls.filter((url) => url.id !== id));
      setOpenMenuId(null);
    } catch {}
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId !== null) {
        const target = e.target as HTMLElement;
        if (!target.closest('.menu-container')) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600" />
          <span className="text-gray-600 font-medium">読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4 font-medium">エラーが発生しました</p>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchUrls();
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Bookmark icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h3 className="text-gray-900 font-medium mb-2">ブックマークがありません</h3>
          <p className="text-gray-600 text-sm">Chrome拡張機能を使ってページを保存してみましょう</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {urls.map((url) => (
        <button
          key={url.id}
          type="button"
          onClick={() => handleCardClick(url.url)}
          className="group bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden cursor-pointer relative text-left w-full"
        >
          <div className="aspect-w-16 aspect-h-9 relative h-32 bg-gray-50 flex items-center justify-center border-b border-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="No image"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {url.title || url.url}
            </h3>
            {url.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{url.description}</p>
            )}
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <svg
                className="h-3 w-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                role="img"
                aria-label="Globe icon"
              >
                <path
                  fillRule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clipRule="evenodd"
                />
              </svg>
              {new URL(url.url).hostname}
            </div>
          </div>

          <div className="absolute top-3 right-3 menu-container opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => handleMenuClick(url.id, e)}
              className="p-2 bg-white/90 hover:bg-white border border-gray-200 rounded-md shadow-sm transition-all"
              title="メニュー"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Menu"
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
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                <button
                  type="button"
                  onClick={(e) => handleDelete(url.id, e)}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors first:rounded-t-md last:rounded-b-md"
                >
                  削除
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => handleNewTabClick(url.url, e)}
            className="absolute bottom-3 right-3 p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors opacity-0 group-hover:opacity-100"
            title="新しいタブで開く"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Open in new tab"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </button>
      ))}
    </div>
  );
}
