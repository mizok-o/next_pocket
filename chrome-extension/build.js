#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

// 環境変数から API_BASE_URL を取得（NODE_ENV で自動判定）
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // NODE_ENV で自動判定
  if (process.env.NODE_ENV === 'production') {
    return 'https://next-pocket-five.vercel.app';
  }

  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

console.log(`Building Chrome Extension with API_BASE_URL: ${API_BASE_URL}`);

// constants.js を動的生成
const constantsContent = `export const API_BASE_URL = '${API_BASE_URL}';

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
`;

// constants.js を上書き
fs.writeFileSync(path.join(__dirname, 'constants.js'), constantsContent);

// manifest.json を動的生成
const manifestTemplate = {
  manifest_version: 3,
  name: 'My Pocket',
  version: '1.0.0',
  description: 'Save bookmarks to My Pocket',
  permissions: ['activeTab', 'storage', 'notifications', 'scripting', 'tabs'],
  host_permissions: [`${API_BASE_URL}/*`, 'https://*/*'],
  background: {
    service_worker: 'background.js',
  },
  content_scripts: [
    {
      matches: [`${API_BASE_URL}/*`],
      js: ['content-script.js'],
    },
  ],
  action: {
    default_title: 'Save to My Pocket',
    default_popup: 'popup.html',
  },
  icons: {
    16: 'icon.png',
    48: 'icon.png',
    128: 'icon.png',
  },
};

// manifest.json を上書き
fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(manifestTemplate, null, 2));

console.log('Chrome Extension build completed!');
