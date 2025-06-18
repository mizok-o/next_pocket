#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

// 引数から環境を取得（dev/prod）
const environment = process.argv[2] || 'dev';

if (!['dev', 'prod'].includes(environment)) {
  process.stderr.write('Usage: node build.js [dev|prod]\n');
  process.exit(1);
}


// パスをrootから実行されることを前提に修正
const extensionDir = path.join(__dirname);
const sourceConstantsPath = path.join(extensionDir, `constants.${environment}.js`);
const targetConstantsPath = path.join(extensionDir, 'constants.js');

if (!fs.existsSync(sourceConstantsPath)) {
  process.stderr.write(`Constants file not found: ${sourceConstantsPath}\n`);
  process.exit(1);
}

// constants.js をコピー
fs.copyFileSync(sourceConstantsPath, targetConstantsPath);

// manifest.json を動的生成
const getManifestConfig = () => {
  if (environment === 'dev') {
    return {
      host_permissions: ['http://localhost:3000/*', 'https://*/*'],
      content_scripts_matches: ['http://localhost:3000/*']
    };
  }
  return {
    host_permissions: ['https://next-pocket-five.vercel.app/*', 'https://*/*'],
    content_scripts_matches: ['https://next-pocket-five.vercel.app/*']
  };
};

const config = getManifestConfig();

const manifestContent = {
  manifest_version: 3,
  name: 'My Pocket',
  version: '1.0.0',
  description: 'Save bookmarks to My Pocket',
  permissions: ['activeTab', 'storage', 'notifications', 'scripting', 'tabs'],
  host_permissions: config.host_permissions,
  background: {
    service_worker: 'background.js',
    type: 'module',
  },
  content_scripts: [
    {
      matches: config.content_scripts_matches,
      js: ['content-script.js'],
    },
  ],
  action: {
    default_title: 'Save to My Pocket',
    default_popup: 'popup.html',
  },
  icons: {
    16: 'app-icon.png',
    48: 'app-icon.png',
    128: 'app-icon.png',
  },
};

// manifest.json を生成
fs.writeFileSync(
  path.join(extensionDir, 'manifest.json'),
  JSON.stringify(manifestContent, null, 2)
);

