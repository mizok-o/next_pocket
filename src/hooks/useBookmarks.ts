import { useToastContext } from "@/context/ToastContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { Url } from "@/types";
import * as Sentry from "@sentry/nextjs";
import { useCallback, useEffect, useState } from "react";

export const useBookmarks = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, handleError, clearError, retry } = useErrorHandler();
  const { showSuccess, showError } = useToastContext();

  const fetchUrls = useCallback(async () => {
    try {
      clearError();
      setLoading(true);
      const response = await fetch("/api/urls");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch URLs");
      }

      const { data }: { data: Url[] } = await response.json();
      setUrls(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      Sentry.captureException(err);
      handleError(err);
      showError("ブックマークの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [clearError, handleError, showError]);

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

        showSuccess("ブックマークを削除しました");
      } catch (error) {
        // エラー時: 元の状態に戻す
        setUrls(originalUrls);
        const errorMessage = error instanceof Error ? error.message : "Failed to delete bookmark";
        Sentry.captureException(error);
        showError("ブックマークの削除に失敗しました");
        console.error("Delete failed:", errorMessage);
      }
    },
    [urls, showSuccess, showError]
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

      await fetchUrls();
      showSuccess(
        !currentIsFavoriteStatus ? "お気に入りに追加しました" : "お気に入りから削除しました"
      );
    } catch (error) {
      Sentry.captureException(error);
      showError("お気に入りの更新に失敗しました");
      console.error("Failed to toggle favorite:", error);
    }
  };

  const refetch = () => {
    retry(fetchUrls);
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
