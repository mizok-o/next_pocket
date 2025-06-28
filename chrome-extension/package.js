const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const outputDir = path.join(__dirname, 'dist');
const outputFile = path.join(outputDir, 'my-pocket-extension.zip');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log(`✅ Extension packaged successfully!`);
  console.log(`📦 File: ${outputFile}`);
  console.log(`📏 Size: ${(archive.pointer() / 1024).toFixed(2)} KB`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

const filesToInclude = [
  'manifest.json',
  'background.js',
  'content-script.js',
  'popup.html',
  'popup.js',
  'constants.js',
  'app-icon.png'
];

const excludeFiles = [
  'build.js',
  'package.js',
  'constants.dev.js',
  'constants.prod.js',
  'constants.hybrid.js',
  'dist',
  '.DS_Store'
];

filesToInclude.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    archive.file(filePath, { name: file });
    console.log(`📄 Adding: ${file}`);
  } else {
    console.warn(`⚠️  File not found: ${file}`);
  }
});

archive.finalize();