"use client";

import { useEffect, useState } from "react";

import { BookmarkCard } from "@/components/BookmarkCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function BookmarkList() {
  const { urls, loading, error, refetch } = useBookmarks();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleMenuClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId !== null) {
        const target = e.target as HTMLElement;
        if (!target.closest(".menu-container")) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (urls.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {urls.map((url) => (
        <li key={url.id}>
          <BookmarkCard url={url} openMenuId={openMenuId} onMenuClick={handleMenuClick} />
        </li>
      ))}
    </ul>
  );
}
