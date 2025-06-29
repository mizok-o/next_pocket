type TableSkeletonProps = {
  rows?: number;
  columns?: number;
  hasActions?: boolean;
  className?: string;
};

export default function TableSkeleton({
  rows = 5,
  columns = 3,
  hasActions = true,
  className = "",
}: TableSkeletonProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        {hasActions && <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }, (_, i) => (
                <th key={`header-${i}-${Math.random()}`} className="px-6 py-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={`row-${rowIndex}-${Math.random()}`}>
                {Array.from({ length: columns }, (_, colIndex) => (
                  <td key={`col-${rowIndex}-${colIndex}-${Math.random()}`} className="px-6 py-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
