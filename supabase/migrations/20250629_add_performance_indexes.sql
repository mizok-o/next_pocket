-- パフォーマンス最適化用インデックス追加

-- urls テーブルの created_at, deleted_at 複合インデックス
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_urls_created_deleted 
ON urls (created_at, deleted_at);