export type KPICardData = {
  totalBookmarks: number;
  monthlyBookmarks: number;
  monthlyBookmarksChange: {
    status: "up" | "down" | "same";
    value: string;
  };
};

export type UserMonthlyBookmark = {
  userId: string;
  createdAt: string;
  bookmarkCount: number;
};

export type HourlyActiveUsers = {
  hour: string;
  activeUsers: number;
  percentage: number;
};
