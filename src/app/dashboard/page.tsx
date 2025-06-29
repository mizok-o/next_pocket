import Header from "@/components/Header";
import HourlyActiveTable from "@/components/dashboard/hourly/HourlyActiveTable";
import KPICardsWrapper from "@/components/dashboard/kpi/KPICardsWrapper";
import UserBookmarkTableWrapper from "@/components/dashboard/users/UserBookmarkTableWrapper";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none" />
        <div className="relative">
          <Header title="ダッシュボード" />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight mb-8">
              ダッシュボード
            </h1>

            <KPICardsWrapper />

            <div className="space-y-8">
              <UserBookmarkTableWrapper />
              <HourlyActiveTable />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
