export const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-500"
          role="status"
          aria-label="読み込み中"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 animate-pulse" />
      </div>
      <div className="text-center">
        <span className="text-slate-600 font-medium text-lg">読み込み中...</span>
        <p className="text-slate-400 text-sm mt-1">ブックマークを取得しています</p>
      </div>
    </div>
  </div>
);
