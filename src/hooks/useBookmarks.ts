import type { Url } from "@/types";
import * as Sentry from "@sentry/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";

interface PaginationResponse {
  data: Url[];
  pagination: {
    page: number;
    limit: number;
  };
}

export const useBookmarks = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchUrls = useCallback(async (page: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(`/api/urls?page=${page}&limit=50`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch URLs");
      }

      const result: PaginationResponse = await response.json();
      const newUrls = result.data || [];

      if (isInitial) {
        setUrls(newUrls);
      } else {
        setUrls((prev) => [...prev, ...newUrls]);
      }

      setHasMore(newUrls.length === 50);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      Sentry.captureException(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchUrls(currentPage + 1);
    }
  }, [fetchUrls, currentPage, loadingMore, hasMore]);

  const deleteBookmark = useCallback(
    async (id: number) => {
      // 楽観的更新: 即座にUIから削除
      const originalUrls = urls;
      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));

      try {
        const response = await fetch(`/api/urls/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete URL");
        }
      } catch (error) {
        // エラー時: 元の状態に戻す
        setUrls(originalUrls);
        const errorMessage = error instanceof Error ? error.message : "Failed to delete bookmark";
        Sentry.captureException(error);
        console.error("Delete failed:", errorMessage);
      }
    },
    [urls]
  );

  const toggleFavorite = async (bookmarkId: number, currentIsFavoriteStatus: boolean) => {
    try {
      const response = await fetch(`/api/urls/${bookmarkId}/favorite`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_favorite: !currentIsFavoriteStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }

      fetchUrls(1, true);
    } catch (error) {
      Sentry.captureException(error);
      console.error("Failed to toggle favorite:", error);
    }
  };

  const refetch = () => {
    setError(null);
    setUrls([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchUrls(1, true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadMore();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "20px",
        }
      );

      const currentTarget = observerTarget.current;

      if (currentTarget) {
        observer.observe(currentTarget);
      }

      return () => {
        if (currentTarget) {
          observer.unobserve(currentTarget);
        }
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [loadMore]);

  return {
    urls,
    loading,
    loadingMore,
    error,
    hasMore,
    deleteBookmark,
    toggleFavorite,
    refetch,
    observerTarget,
  };
};
