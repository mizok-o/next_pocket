"use client";

import * as Sentry from "@sentry/nextjs";
import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ja">
      <body className="antialiased">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-gradient-to-br from-red-50/80 to-rose-50/60 border border-red-200/60 rounded-2xl p-8 backdrop-blur-sm shadow-lg shadow-red-500/5">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="エラーアイコン"
              >
                <title>エラーアイコン</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-4">エラーが発生しました</h2>
            <p className="text-red-500 text-sm mb-4">予期しないエラーが発生しました。</p>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              再試行
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
