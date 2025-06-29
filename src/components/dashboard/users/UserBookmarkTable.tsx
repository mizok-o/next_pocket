import CsvDownloadButton from "@/components/common/CsvDownloadButton";
import type { UserMonthlyBookmark } from "@/types/dashboard";

async function fetchUsersAction(): Promise<UserMonthlyBookmark[]> {
  const response = await fetch("/api/dashboard/users/monthly");
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Failed to fetch users data");
  }
  return result.userMonthlyBookmarks || [];
}

export default async function UserBookmarkTable() {
  const users = await fetchUsersAction();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">今月のユーザー別ブックマーク数</h2>
        <CsvDownloadButton
          data={users}
          filename="user_monthly_bookmarks"
          headers={{
            userId: "ユーザー名",
            bookmarkCount: "ブックマーク数",
            createdAt: "最終アクティブ",
          }}
          buttonText="CSVダウンロード"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ユーザー名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ブックマーク数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終アクティブ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.userId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{user.bookmarkCount}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
