# Biome + Husky Setup Instructions

このプロジェクトでは、コミット時にBiomeを使用してコード品質をチェックする設定を行いました。

## セットアップ手順

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **Huskyの初期化**
   ```bash
   npm run prepare
   ```

3. **pre-commitフックを実行可能にする**
   ```bash
   chmod +x .husky/pre-commit
   ```

## 使用方法

### 自動実行（コミット時）
- `git commit` 時に自動的にステージングされたファイルに対してBiomeチェックが実行されます
- エラーがある場合、コミットは失敗し、手動修正が必要な問題が表示されます

### 手動実行
- `npm run biome:check` - 全ファイルをチェック
- `npm run biome:fix` - 自動修正可能な問題を修正
- `npm run biome:staged` - ステージングされたファイルのみチェック

## 対象ファイル

以下のファイルタイプが対象です：
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- JSON (.json)
- HTML (.html)
- CSS (.css)
- Vue (.vue)
- Svelte (.svelte)

## 設定ファイル

- `biome.json` - Biome設定（全プロジェクト共通）
- `.lintstagedrc.json` - lint-staged設定
- `.husky/pre-commit` - プリコミットフック

## Chrome拡張機能対応

現在のBiome設定は、将来のChrome拡張機能ファイルにも対応するように構成されています。