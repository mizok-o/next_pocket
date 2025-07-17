import type { Url, UrlsResponse } from "@/types";
import * as Sentry from "@sentry/nextjs";
import { useCallback, useEffect, useState } from "react";

export const useBookmarks = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    try {
      const response = await fetch("/api/urls");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch URLs");
      }

      const result: UrlsResponse = await response.json();
      setUrls(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      Sentry.captureException(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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

      fetchUrls();
    } catch (error) {
      Sentry.captureException(error);
      console.error("Failed to toggle favorite:", error);
    }
  };

  const refetch = () => {
    setError(null);
    setLoading(true);
    fetchUrls();
  };

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  return {
    urls,
    loading,
    error,
    deleteBookmark,
    toggleFavorite,
    refetch,
  };
};
