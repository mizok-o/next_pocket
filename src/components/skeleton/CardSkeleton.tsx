type CardSkeletonProps = {
  rows?: number;
  cols?: number;
  className?: string;
};

export default function CardSkeleton({ rows = 2, cols = 2, className = "" }: CardSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-6 mb-8 ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={`card-${i}-${Math.random()}`}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-16 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
