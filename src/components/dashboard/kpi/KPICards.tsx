"use client";

import type { KPICardData } from "@/types/dashboard";
import { useEffect, useState } from "react";

export default function KPICards() {
  const [kpiData, setKpiData] = useState<KPICardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/api/dashboard/kpi`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setKpiData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!kpiData) return null;

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
