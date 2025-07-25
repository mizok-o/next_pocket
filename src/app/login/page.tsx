"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginForm() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "AccessDenied") {
      setAuthError("このメールアドレスは許可されていません。管理者にお問い合わせください。");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-3">
        <div
          className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"
          role="status"
          aria-label="読み込み中"
        />
        <span className="text-gray-600 font-medium">読み込み中...</span>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">Ato（あと）</h1>
        <p className="text-gray-600">アカウントにログイン</p>
      </div>

      {authError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-500 text-sm mt-2 text-center">{authError}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          signIn("google", { callbackUrl: "/" });
        }}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" role="img" aria-label="Google logo">
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
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center space-x-3">
            <div
              className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"
              role="status"
              aria-label="読み込み中"
            />
            <span className="text-gray-600 font-medium">読み込み中...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
