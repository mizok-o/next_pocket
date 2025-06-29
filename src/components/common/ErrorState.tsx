type ErrorStateProps = {
  error: string;
  cols?: number;
  className?: string;
};

export default function ErrorState({ error, cols = 2, className = "" }: ErrorStateProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-6 mb-8 ${className}`}>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 col-span-2">
        <p className="text-red-600">エラーが発生しました: {error}</p>
      </div>
    </div>
  );
}
