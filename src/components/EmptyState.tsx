import { BookmarkIcon } from "@/components/icons";

export const EmptyState = () => (
  <div className="max-w-md mx-auto text-center p-8">
    <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/40 border border-slate-200/60 rounded-2xl p-12 backdrop-blur-sm shadow-lg shadow-slate-500/5">
      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-500/10">
        <BookmarkIcon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-slate-900 font-semibold mb-3 text-xl">ブックマークがありません</h3>
      <p className="text-slate-600 text-sm mb-6">
        ブックマークを追加して、お気に入りのページを整理しましょう。
      </p>
      <div className="flex items-center justify-center gap-2 text-blue-600">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          role="img"
          aria-label="追加アイコン"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="text-sm font-medium">ブラウザ拡張機能で簡単追加</span>
      </div>
    </div>
  </div>
);
