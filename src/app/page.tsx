"use client";

import BookmarkList from "@/components/BookmarkList";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div
            className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"
            role="status"
            aria-label="読み込み中"
          />
          <span className="text-gray-600 font-medium">読み込み中...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <Image
                  src="/app-icon.png"
                  alt="Ato（あと）"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-xl shadow-lg"
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                Ato（あと）
              </h1>
            </div>
            <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
              素早く、簡単に、美しくブックマークを管理
            </p>
          </div>
          <BookmarkList />
        </div>
      </div>
    </div>
  );
}
