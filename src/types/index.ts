// URL型定義
export interface Url {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  user_id: number;
  deleted_at: string | null;
  is_favorite: boolean;
}

// APIレスポンス型定義
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// URLs API レスポンス型
export interface UrlsResponse extends ApiResponse<Url[]> {
  data?: Url[];
}

export interface UrlResponse extends ApiResponse<Url> {
  data?: Url;
}

// エラーレスポンス型
export interface ErrorResponse {
  error: string;
}

// リクエストボディ型定義
export interface CreateUrlRequest {
  url: string;
  title?: string;
  description?: string;
  image_url?: string;
}

export interface UpdateUrlRequest {
  title?: string;
  description?: string;
  image_url?: string;
  is_favorite?: boolean;
}

// バリデーション関数
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCreateUrlRequest = (body: unknown): body is CreateUrlRequest => {
  if (!body || typeof body !== "object") return false;

  const request = body as CreateUrlRequest;

  if (!request.url || typeof request.url !== "string") return false;
  if (!validateUrl(request.url)) return false;

  if (request.title && typeof request.title !== "string") return false;
  if (request.description && typeof request.description !== "string") return false;
  if (request.image_url && typeof request.image_url !== "string") return false;

  return true;
};

export const validateUpdateUrlRequest = (body: unknown): body is UpdateUrlRequest => {
  if (!body || typeof body !== "object") return false;

  const request = body as UpdateUrlRequest;

  if (request.title && typeof request.title !== "string") return false;
  if (request.description && typeof request.description !== "string") return false;
  if (request.image_url && typeof request.image_url !== "string") return false;
  if (request.is_favorite !== undefined && typeof request.is_favorite !== "boolean") return false;

  return true;
};
