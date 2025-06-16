"use client";

import { useEffect, useState } from "react";

import type { Url } from "@/types";

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
      const response = await fetch("/api/urls");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch URLs");
      }

      const { data }: { data: Url[] } = await response.json();
      setUrls(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (url: string) => {
    window.location.href = url;
  };

  const handleNewTabClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  const handleMenuClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }

      setUrls(urls.filter((url) => url.id !== id));
      setOpenMenuId(null);
    } catch {}
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId !== null) {
        const target = e.target as HTMLElement;
        if (!target.closest(".menu-container")) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-500" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 animate-pulse" />
          </div>
          <span className="text-slate-600 font-medium text-lg">読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <div className="bg-gradient-to-br from-red-50/80 to-rose-50/60 border border-red-200/60 rounded-2xl p-8 backdrop-blur-sm shadow-lg shadow-red-500/5">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="エラー"
            >
              <title>エラー</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-800 mb-3 font-semibold text-lg">エラーが発生しました</p>
          <p className="text-red-600/80 text-sm mb-8 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchUrls();
            }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
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
        <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/40 border border-slate-200/60 rounded-2xl p-12 backdrop-blur-sm shadow-lg shadow-slate-500/5">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-500/10">
            <svg
              className="h-10 w-10 text-slate-400"
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
          </div>
          <h3 className="text-slate-900 font-semibold mb-3 text-xl">ブックマークがありません</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {urls.map((url) => (
        <button
          key={url.id}
          type="button"
          onClick={() => handleCardClick(url.url)}
          className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl hover:border-blue-300/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden cursor-pointer relative text-left w-full hover:-translate-y-1"
        >
          <div className="aspect-w-16 aspect-h-9 relative h-36 bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center border-b border-slate-100/80">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 rounded-lg" />
              <svg
                className="relative h-10 w-10 text-slate-400"
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
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors text-lg leading-tight mb-2">
              {url.title || url.url}
            </h3>
            {url.description && (
              <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                {url.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-100/80 to-blue-100/50 rounded-lg text-xs text-slate-600 font-medium">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                {new URL(url.url).hostname}
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 menu-container opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              type="button"
              onClick={(e) => handleMenuClick(url.id, e)}
              className="p-2.5 bg-white/90 hover:bg-white border border-slate-200/60 rounded-xl shadow-lg shadow-slate-500/10 hover:shadow-slate-500/20 transition-all duration-200 backdrop-blur-sm cursor-pointer"
              title="メニュー"
            >
              <svg
                className="w-4 h-4 text-slate-600"
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
              <div className="absolute right-0 mt-2 bg-white/95 border border-slate-200/60 rounded-xl shadow-lg backdrop-blur-sm z-10 min-w-[120px] overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => handleDelete(url.id, e)}
                  className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors font-medium"
                >
                  削除
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => handleNewTabClick(url.url, e)}
            className="absolute bottom-0 right-0 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-t border-l border-blue-200/50 rounded-tl-xl transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm cursor-pointer"
            title="新しいタブで開く"
          >
            <svg
              className="w-3.5 h-3.5 text-blue-600"
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
