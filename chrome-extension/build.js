#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

// 引数から環境と監視モードを取得
const environment = process.argv[2] || "dev";
const watchMode = process.argv.includes("--watch");

if (!["dev", "prod"].includes(environment)) {
  process.stderr.write("Usage: node build.js [dev|prod] [--watch]\n");
  process.exit(1);
}

// パスをrootから実行されることを前提に修正
const extensionDir = path.join(__dirname);
const sourceConstantsPath = path.join(extensionDir, `constants.${environment}.js`);
const targetConstantsPath = path.join(extensionDir, "constants.js");

// ビルド関数
function buildExtension() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Building Chrome extension (${environment} mode)...`);

  if (!fs.existsSync(sourceConstantsPath)) {
    process.stderr.write(`Constants file not found: ${sourceConstantsPath}\n`);
    return false;
  }

  try {
    // constants.js をコピー
    fs.copyFileSync(sourceConstantsPath, targetConstantsPath);

    // manifest.json を動的生成
    const getManifestConfig = () => {
      if (environment === "dev") {
        return {
          host_permissions: ["http://localhost:3000/*", "https://*/*"],
          content_scripts_matches: ["http://localhost:3000/*"],
        };
      }
      return {
        host_permissions: ["https://next-pocket-five.vercel.app/*", "https://*/*"],
        content_scripts_matches: ["https://next-pocket-five.vercel.app/*"],
      };
    };

    const config = getManifestConfig();

    const manifestContent = {
      manifest_version: 3,
      name: "Ato（あと）",
      version: "1.0.0",
      description: "あとで読みたい、すべてを記録する",
      permissions: ["activeTab", "storage", "notifications", "scripting", "tabs"],
      host_permissions: config.host_permissions,
      background: {
        service_worker: "background.js",
        type: "module",
      },
      content_scripts: [
        {
          matches: config.content_scripts_matches,
          js: ["content-script.js"],
        },
      ],
      action: {
        default_title: "Atoに保存",
        default_popup: "popup.html",
      },
      icons: {
        16: "app-icon.png",
        48: "app-icon.png",
        128: "app-icon.png",
      },
    };

    // manifest.json を生成
    fs.writeFileSync(
      path.join(extensionDir, "manifest.json"),
      JSON.stringify(manifestContent, null, 2)
    );

    console.log(`[${timestamp}] ✅ Chrome extension built successfully`);
    return true;
  } catch (error) {
    console.error(`[${timestamp}] ❌ Build failed:`, error.message);
    return false;
  }
}

// 初回ビルド実行
buildExtension();

// 監視モード
if (watchMode) {
  console.log("👀 Watching for changes...");

  // 監視対象ファイル
  const watchTargets = [
    path.join(extensionDir, "background.js"),
    path.join(extensionDir, "content-script.js"),
    path.join(extensionDir, "popup.js"),
    path.join(extensionDir, "popup.html"),
    sourceConstantsPath,
  ];

  for (const filePath of watchTargets) {
    if (fs.existsSync(filePath)) {
      fs.watchFile(filePath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          const fileName = path.basename(filePath);
          console.log(`📝 ${fileName} changed, rebuilding...`);
          buildExtension();
        }
      });
    }
  }

  // プロセス終了時のクリーンアップ
  process.on("SIGINT", () => {
    console.log("\n👋 Stopping file watcher...");
    process.exit(0);
  });
}
