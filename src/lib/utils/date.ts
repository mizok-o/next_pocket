// 指定した月の開始日時と終了日時を取得
export const getMonthRange = (date: Date = new Date()) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    startOfMonth,
    endOfMonth,
    startISO: startOfMonth.toISOString(),
    endISO: endOfMonth.toISOString(),
  };
};

// 前月の開始日時と終了日時を取得
export const getPreviousMonthRange = (date: Date = new Date()) => {
  const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return getMonthRange(previousMonth);
};

// 日付をYYYY-MM形式でフォーマット
export const formatMonth = (date: Date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

// 文字列をDateオブジェクトに変換
const toDate = (date: string): Date => new Date(date);

// 日付を日本語形式でフォーマット（例: 2025/6/29）
export const formatDate = (dateString: string) => {
  return toDate(dateString).toLocaleDateString("ja-JP");
};

// 日付をYYYY-MM-DD形式でフォーマット
export const formatDateToYYYYMMDD = (dateString: string) => {
  const d = toDate(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
