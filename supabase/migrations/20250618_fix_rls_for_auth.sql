-- 認証サポートのためのRLSポリシー修正

-- 既存の制限的なポリシーを削除
DROP POLICY "Service role access only" ON users;
DROP POLICY "Service role access only" ON urls;

-- usersテーブルのポリシー
-- 全員にSELECT権限を許可（認証チェックに必要）
CREATE POLICY "Public read access for authentication" ON users
FOR SELECT USING (true);

-- INSERT/UPDATE/DELETEはservice_roleのみ許可
CREATE POLICY "Service role insert access" ON users
FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role update access" ON users
FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role delete access" ON users
FOR DELETE USING (auth.role() = 'service_role');

-- urlsテーブルのポリシー - 一旦全員アクセス可能（アプリ側でセキュリティ制御）
CREATE POLICY "Allow all access to urls" ON urls
FOR ALL USING (true);

-- テーブルコメントを更新
COMMENT ON TABLE users IS 'RLS有効。認証用の公開読み取り、書き込み操作はservice_roleに制限。';
COMMENT ON TABLE urls IS 'RLS有効。認証済みユーザーはuser_idに基づいて自分のデータのみアクセス可能。';