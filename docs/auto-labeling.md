# 自動ラベリング機能

## 概要
ファイル変更とキーワードに基づいてPRとIssueに自動的にラベルを付与するGitHub Action

## 機能

### 1. ファイル変更ベースのラベリング
PRの変更ファイルに応じて自動でラベルを付与

| ラベル | 対象ファイル | 説明 |
|--------|------------|------|
| `frontend` | `app/`, `components/`, `*.tsx`, `*.jsx` | フロントエンド関連 |
| `backend` | `api/`, `lib/`, `*.ts` (tsx除く) | バックエンド関連 |
| `database` | `prisma/`, `migrations/`, `*.sql`, `*.prisma` | データベース関連 |
| `chrome-extension` | `chrome-extension/` | Chrome拡張機能関連 |
| `docs` | `*.md`, `docs/`, `README*` | ドキュメント変更 |
| `config` | `*.json`, `*.yml`, `*.yaml`, `.env*` | 設定ファイル |
| `github` | `.github/` | GitHub Actions・ワークフロー |
| `dependencies` | `package.json`, `package-lock.json` | 依存関係更新 |

### 2. キーワードベースのラベリング
Issue/PRのタイトル・本文からキーワードを検出してラベルを付与

| ラベル | キーワード |
|--------|-----------|
| `bug` | bug, fix, error, issue, 修正, エラー, バグ |
| `enhancement` | feat, feature, improve, enhance, 機能, 改善, 追加 |
| `performance` | perf, performance, speed, optimize, パフォーマンス, 最適化 |
| `security` | security, auth, login, セキュリティ, 認証 |
| `ui/ux` | ui, ux, design, style, css, デザイン, スタイル |
| `breaking-change` | breaking, major, 破壊的, BREAKING |
| `help-wanted` | help, wanted, good first issue, ヘルプ, 初心者向け |

## 使用方法

### 自動実行
- PR作成・更新時
- Issue作成・再オープン時

### 手動実行
GitHub ActionsタブからWorkflowを手動実行可能

## 設定のカスタマイズ

### ラベルルールの追加
`.github/workflows/auto-labeling.yml`の`labelRules`オブジェクトに新しいルールを追加

```yaml
'new-label': {
  patterns: ['src/new-feature/', '*.new'],
  color: 'FF0000',
  description: 'New feature related changes'
}
```

### キーワードルールの追加
`keywordRules`オブジェクトに新しいキーワードルールを追加

```yaml
'new-type': ['keyword1', 'keyword2', 'キーワード3']
```

## 注意事項
- ラベルが存在しない場合は自動で作成される
- 既存のラベルは上書きされない
- 複数のルールにマッチした場合は全てのラベルが適用される

## 例

### ファイル変更による自動ラベリング
```
変更ファイル: components/Header.tsx, app/layout.tsx
→ ラベル: frontend
```

### キーワードによる自動ラベリング
```
タイトル: "fix: ログインエラーを修正"
→ ラベル: bug
```

### 複合パターン
```
変更ファイル: prisma/schema.prisma
タイトル: "feat: ユーザーテーブルにprofileフィールドを追加"
→ ラベル: database, enhancement
```