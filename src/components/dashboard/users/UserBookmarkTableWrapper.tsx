import { TableSkeleton } from "@/components/skeleton";
import { Suspense } from "react";
import UserBookmarkTable from "./UserBookmarkTable";

export default function UserBookmarkTableWrapper() {
  return (
    <Suspense fallback={<TableSkeleton rows={5} columns={3} hasActions />}>
      <UserBookmarkTable />
    </Suspense>
  );
}
