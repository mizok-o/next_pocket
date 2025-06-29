import LoadingState from "@/components/common/LoadingState";
import { Suspense } from "react";
import MonthlyBookmarksCard from "./MonthlyBookmarksCard";
import TotalBookmarksCard from "./TotalBookmarksCard";

export default function KPICardsWrapper() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Suspense fallback={<LoadingState rows={1} cols={1} />}>
        <TotalBookmarksCard />
      </Suspense>
      <Suspense fallback={<LoadingState rows={1} cols={1} />}>
        <MonthlyBookmarksCard />
      </Suspense>
    </div>
  );
}
