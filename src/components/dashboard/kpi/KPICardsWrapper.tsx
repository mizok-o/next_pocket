import LoadingState from "@/components/common/LoadingState";
import { Suspense } from "react";
import KPICards from "./KPICards";

export default function KPICardsWrapper() {
  return (
    <Suspense fallback={<LoadingState rows={1} cols={2} />}>
      <KPICards />
    </Suspense>
  );
}
