-- 既存データを削除
DELETE FROM urls;
DELETE FROM users;

-- テストユーザー作成
INSERT INTO users (id, email, password) VALUES 
(1, 'test@example.com', '$2b$12$nuMe9IylSrG9J1ZdmI9r3uBNBUnicX8s/Dkj5DJc0as8W0oN9kSZm'),
(2, 'demo@example.com', '$2b$12$nuMe9IylSrG9J1ZdmI9r3uBNBUnicX8s/Dkj5DJc0as8W0oN9kSZm');

-- 簡単なテストデータのみ追加
INSERT INTO urls (url, title, description, user_id, created_at, is_favorite) VALUES 
('https://github.com/test-repo', 'Test Repository', 'Test description', 1, NOW(), false),
('https://stackoverflow.com/questions/123', 'How to setup', 'Question about setup', 1, NOW(), true),
('https://medium.com/article', 'Tutorial Article', 'Learning resource', 2, NOW(), false);