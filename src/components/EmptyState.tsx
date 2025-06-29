import { BookmarkIcon } from "@/components/icons";

export const EmptyState = () => (
  <div className="max-w-md mx-auto text-center p-8">
    <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/40 border border-slate-200/60 rounded-2xl p-12 backdrop-blur-sm shadow-lg shadow-slate-500/5">
      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-500/10">
        <BookmarkIcon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-slate-900 font-semibold mb-3 text-xl">ブックマークがありません</h3>
    </div>
  </div>
);
