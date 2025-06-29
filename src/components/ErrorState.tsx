import { ErrorIcon } from "@/components/icons";

interface ErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  error = "データの読み込みに失敗しました",
  onRetry = () => window.location.reload(),
}: ErrorStateProps) => (
  <div className="max-w-md mx-auto text-center p-8">
    <div className="bg-gradient-to-br from-red-50/80 to-rose-50/60 border border-red-200/60 rounded-2xl p-8 backdrop-blur-sm shadow-lg shadow-red-500/5">
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
        <ErrorIcon className="w-8 h-8 text-white" />
      </div>
      <p className="text-red-500 text-sm mt-2">エラーが発生しました</p>
      <p className="text-red-500 text-sm mt-2">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
      >
        再試行
      </button>
    </div>
  </div>
);
