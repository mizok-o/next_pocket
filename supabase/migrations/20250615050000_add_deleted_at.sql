-- urls テーブルに deleted_at カラムを追加（論理削除用）
ALTER TABLE urls ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;