import { Spinner } from "@/components/ui";

export const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="flex items-center space-x-4">
      <Spinner size="lg" color="primary" />
      <span className="text-slate-600 font-medium text-lg">読み込み中...</span>
    </div>
  </div>
);
