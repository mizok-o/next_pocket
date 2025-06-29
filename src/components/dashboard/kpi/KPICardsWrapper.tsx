import { CardSkeleton } from "@/components/skeleton";
import { Suspense } from "react";
import KPICards from "./KPICards";

export default function KPICardsWrapper() {
  return (
    <Suspense fallback={<CardSkeleton rows={2} cols={2} />}>
      <KPICards />
    </Suspense>
  );
}
