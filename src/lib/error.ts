import * as Sentry from "@sentry/nextjs";

export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, code: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "認証が必要です") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "アクセス権限がありません") {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "リソースが見つかりません") {
    super(message, "NOT_FOUND_ERROR", 404);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "リソースが競合しています") {
    super(message, "CONFLICT_ERROR", 409);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "リクエストが多すぎます") {
    super(message, "RATE_LIMIT_ERROR", 429);
    this.name = "RateLimitError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = "外部サービスでエラーが発生しました") {
    super(message, "EXTERNAL_SERVICE_ERROR", 502);
    this.name = "ExternalServiceError";
  }
}

export function handleError(error: unknown, context?: string): AppError {
  // ログ出力
  console.error(`Error in ${context || "unknown context"}:`, error);

  // Sentryに送信
  if (error instanceof Error) {
    Sentry.captureException(error, {
      tags: {
        context: context || "unknown",
      },
    });
  }

  // AppErrorの場合はそのまま返す
  if (error instanceof AppError) {
    return error;
  }

  // 既知のエラーパターンを変換
  if (error instanceof Error) {
    if (error.message.includes("not found")) {
      return new NotFoundError(error.message);
    }
    if (error.message.includes("unauthorized") || error.message.includes("authentication")) {
      return new AuthenticationError(error.message);
    }
    if (error.message.includes("forbidden") || error.message.includes("permission")) {
      return new AuthorizationError(error.message);
    }
    if (error.message.includes("validation") || error.message.includes("invalid")) {
      return new ValidationError(error.message);
    }
  }

  // 予期しないエラーの場合は汎用エラーを返す
  return new AppError("予期しないエラーが発生しました", "INTERNAL_SERVER_ERROR", 500, false);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "予期しないエラーが発生しました";
}

export function isOperationalError(error: unknown): boolean {
  return error instanceof AppError && error.isOperational;
}
