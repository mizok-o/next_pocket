const fs = require("node:fs");
const path = require("node:path");
const archiver = require("archiver");

const outputDir = path.join(__dirname, "dist");
const outputFile = path.join(outputDir, "ato-extension.zip");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const output = fs.createWriteStream(outputFile);
const archive = archiver("zip", {
  zlib: { level: 9 },
});

output.on("close", () => {
  // Extension packaged successfully
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);

const filesToInclude = [
  "manifest.json",
  "background.js",
  "content-script.js",
  "popup.html",
  "popup.js",
  "constants.js",
  "app-icon.png",
];

const excludeFiles = [
  "build.js",
  "package.js",
  "constants.dev.js",
  "constants.prod.js",
  "constants.hybrid.js",
  "dist",
  ".DS_Store",
];

for (const file of filesToInclude) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    archive.file(filePath, { name: file });
  }
}

archive.finalize();
