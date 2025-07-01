import { getKPIData } from "@/lib/data/dashboard";

export default async function TotalBookmarksCard() {
  const kpiData = await getKPIData();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">総ブックマーク数</p>
          <p className="text-3xl font-bold text-gray-900">{kpiData.totalBookmarks}</p>
        </div>
        <div className="text-4xl">📚</div>
      </div>
    </div>
  );
}
