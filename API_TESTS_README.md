# API エンドポイント テスト

このプロジェクトには、バックエンドAPIエンドポイントの包括的なJestテストスイートが含まれています。

## テスト対象エンドポイント

### 1. POST /api/auth/extension-token
Chrome拡張機能用のJWTトークンを生成

**テストケース:**
- ✅ 200: 有効なセッションでトークン生成成功
- ✅ 401: セッションなし/無効なユーザーID
- ✅ 500: JWT生成エラー

### 2. GET /api/urls
ユーザーのブックマーク一覧を取得

**テストケース:**
- ✅ 200: ブックマーク一覧の取得成功
- ✅ 200: データなしの場合（空配列）
- ✅ 401: 認証されていないユーザー
- ✅ 500: データベースエラー

### 3. POST /api/urls
新しいブックマークを作成

**テストケース:**
- ✅ 200: ブックマーク作成成功
- ✅ 400: URL未入力/無効なユーザーID
- ✅ 401: 認証されていないユーザー
- ✅ 500: データベースエラー

### 4. DELETE /api/urls/[id]
指定されたブックマークを論理削除

**テストケース:**
- ✅ 200: 削除成功
- ✅ 400: 無効なURL ID/ユーザーID
- ✅ 401: 認証されていないユーザー
- ✅ 404: ブックマークが見つからない/所有権なし
- ✅ 500: データベースエラー

### 5. POST /api/urls/check
指定されたURLの存在確認

**テストケース:**
- ✅ 200: URL存在チェック成功（exists: true/false）
- ✅ 400: URL未入力/無効なユーザーID
- ✅ 401: 認証されていないユーザー
- ✅ 500: データベースエラー

## テストの実行方法

```bash
# 依存関係のインストール
npm install

# テストの実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# カバレッジ付きでテストを実行
npm test -- --coverage
```

## テスト設定

### Jest設定ファイル
- `jest.config.js`: Jest の基本設定
- `jest.setup.js`: テスト環境のセットアップ、モック設定

### モック
以下の依存関係がモックされています：
- Supabase クライアント (`@/lib/supabaseServer`)
- NextAuth セッション管理 (`next-auth`)
- JWT操作 (`@/lib/jwt`)

## テストファイル構造

```
src/app/api/
├── auth/extension-token/
│   ├── route.ts
│   └── route.test.ts
└── urls/
    ├── route.ts
    ├── route.test.ts
    ├── [id]/
    │   ├── route.ts
    │   └── route.test.ts
    └── check/
        ├── route.ts
        └── route.test.ts
``
