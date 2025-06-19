// ハイブリッド版：実行時にAPI URLを動的判定
const detectApiUrl = () => {
  // 現在のページURLで判定
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }
  return "https://next-pocket-five.vercel.app";
};

export const API_BASE_URL = detectApiUrl();

export const SPECIAL_URL_PREFIXES = {
  CHROME: "chrome://",
  EXTENSION: "chrome-extension://",
};

export const STORAGE_KEYS = {
  JWT_TOKEN: "jwt_token",
  TOKEN_EXPIRES: "token_expires",
};

export const MESSAGE_TYPES = {
  AUTH_SUCCESS: "AUTH_SUCCESS",
  URL_SAVED: "URL_SAVED",
  URL_DELETED: "URL_DELETED",
};

export const BADGE = {
  SAVED_TEXT: "✓",
  SAVED_COLOR: "#16a34a",
};

export const MILLISECONDS_MULTIPLIER = 1000;

export const TIMEOUTS = {
  ERROR_MESSAGE: 2000,
};

export const META_SELECTORS = {
  DESCRIPTION: 'meta[name="description"]',
  OG_DESCRIPTION: 'meta[property="og:description"]',
  OG_IMAGE: 'meta[property="og:image"]',
};
