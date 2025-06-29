import type { KPICardData } from "@/types/dashboard";

async function fetchKPIData(): Promise<KPICardData> {
  const response = await fetch("/api/dashboard/kpi", {
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch KPI data");
  }
  return result;
}

export default async function KPICards() {
  const kpiData = await fetchKPIData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">総ブックマーク数</p>
            <p className="text-3xl font-bold text-gray-900">{kpiData.totalBookmarks}</p>
          </div>
          <div className="text-4xl">📚</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">今月のブックマーク数</p>
            <p className="text-3xl font-bold text-gray-900">{kpiData.monthlyBookmarks}</p>
            <p
              className={`text-sm font-medium mt-1 ${
                kpiData.monthlyBookmarksChange.status === "up"
                  ? "text-green-600"
                  : kpiData.monthlyBookmarksChange.status === "down"
                    ? "text-red-600"
                    : "text-gray-500"
              }`}
            >
              {kpiData.monthlyBookmarksChange.value}
            </p>
          </div>
          <div className="text-4xl">📈</div>
        </div>
      </div>
    </div>
  );
}
