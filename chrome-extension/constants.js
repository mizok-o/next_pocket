export const API_BASE_URL = 'http://localhost:3000';

export const SPECIAL_URL_PREFIXES = {
  CHROME: 'chrome://',
  EXTENSION: 'chrome-extension://',
};

export const STORAGE_KEYS = {
  JWT_TOKEN: 'jwt_token',
  TOKEN_EXPIRES: 'token_expires',
};

export const MESSAGE_TYPES = {
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  URL_SAVED: 'URL_SAVED',
  URL_DELETED: 'URL_DELETED',
};

export const BADGE = {
  SAVED_TEXT: '✓',
  SAVED_COLOR: '#16a34a',
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