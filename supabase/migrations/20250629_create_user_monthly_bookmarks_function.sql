-- ユーザー別月間ブックマーク数を取得する関数
CREATE OR REPLACE FUNCTION get_user_monthly_bookmarks(
  start_date timestamp, 
  end_date timestamp, 
  limit_count integer DEFAULT 50
)
RETURNS TABLE (
  user_id integer,
  created_at timestamp with time zone,
  bookmark_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    users.id as user_id,
    users.created_at,
    COALESCE(COUNT(urls.id), 0) as bookmark_count
  FROM users
  LEFT JOIN urls ON users.id = urls.user_id 
    AND urls.deleted_at IS NULL
    AND urls.created_at >= start_date
    AND urls.created_at <= end_date
  GROUP BY users.id
  ORDER BY bookmark_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;