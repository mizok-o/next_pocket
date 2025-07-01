"use client";

import CsvDownloadButton from "@/components/common/CsvDownloadButton";
import type { HourlyActiveUsers } from "@/types/dashboard";

const mockHourlyActiveUsers: HourlyActiveUsers[] = [
  { hour: "00:00", activeUsers: 12, percentage: 3.2 },
  { hour: "01:00", activeUsers: 8, percentage: 2.1 },
  { hour: "02:00", activeUsers: 5, percentage: 1.3 },
  { hour: "03:00", activeUsers: 3, percentage: 0.8 },
  { hour: "04:00", activeUsers: 4, percentage: 1.1 },
  { hour: "05:00", activeUsers: 7, percentage: 1.9 },
  { hour: "06:00", activeUsers: 15, percentage: 4.0 },
  { hour: "07:00", activeUsers: 28, percentage: 7.5 },
  { hour: "08:00", activeUsers: 42, percentage: 11.2 },
  { hour: "09:00", activeUsers: 58, percentage: 15.5 },
  { hour: "10:00", activeUsers: 65, percentage: 17.4 },
  { hour: "11:00", activeUsers: 72, percentage: 19.3 },
  { hour: "12:00", activeUsers: 68, percentage: 18.2 },
  { hour: "13:00", activeUsers: 55, percentage: 14.7 },
  { hour: "14:00", activeUsers: 48, percentage: 12.8 },
  { hour: "15:00", activeUsers: 38, percentage: 10.2 },
  { hour: "16:00", activeUsers: 32, percentage: 8.6 },
  { hour: "17:00", activeUsers: 28, percentage: 7.5 },
  { hour: "18:00", activeUsers: 25, percentage: 6.7 },
  { hour: "19:00", activeUsers: 22, percentage: 5.9 },
  { hour: "20:00", activeUsers: 18, percentage: 4.8 },
  { hour: "21:00", activeUsers: 15, percentage: 4.0 },
  { hour: "22:00", activeUsers: 12, percentage: 3.2 },
  { hour: "23:00", activeUsers: 10, percentage: 2.7 },
];

export default function HourlyActiveTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">今月の時間帯別アクティブユーザー数</h2>
        <CsvDownloadButton />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                時間帯
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクティブユーザー数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                割合
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockHourlyActiveUsers.map((data) => (
              <tr key={data.hour} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {data.hour}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {data.activeUsers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{data.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
