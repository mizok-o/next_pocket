"use client";

import * as Sentry from "@sentry/nextjs";
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack: string } | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Sentryにエラーを送信
    Sentry.captureException(error, {
      tags: {
        component: "ErrorBoundary",
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });

    this.setState({
      error,
      errorInfo,
    });

    // 親コンポーネントのエラーハンドラーを呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックUIがある場合は使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="エラーアイコン"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-4">
                予期しないエラーが発生しました
              </h2>
              <p className="text-slate-600 text-sm text-center mb-6">
                しばらくしてから再度お試しください。問題が続く場合は、サポートまでお問い合わせください。
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                >
                  再試行
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="flex-1 bg-slate-100 text-slate-900 font-medium py-3 px-4 rounded-xl hover:bg-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2"
                >
                  ホームに戻る
                </button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-6 text-xs">
                  <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                    エラー詳細 (開発環境のみ)
                  </summary>
                  <pre className="mt-2 p-4 bg-slate-100 rounded-lg text-red-600 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
