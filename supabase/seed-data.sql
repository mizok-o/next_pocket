-- 既存データを削除
DELETE FROM urls;
DELETE FROM users;

-- テストユーザー作成（正しいハッシュ）
INSERT INTO users (id, email, password) VALUES 
(1, 'test@example.com', '$2b$12$nuMe9IylSrG9J1ZdmI9r3uBNBUnicX8s/Dkj5DJc0as8W0oN9kSZm');

-- プログラミング言語・ツール公式サイトのテストデータ（10件）
INSERT INTO urls (url, title, description, image_url, user_id, created_at) VALUES
('https://react.dev/', 'React', 'The library for web and native user interfaces', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, '2025-06-14 10:30:00'),
('https://nodejs.org/', 'Node.js', 'JavaScript runtime built on Chrome''s V8 JavaScript engine', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, '2025-06-13 15:45:00'),
('https://www.python.org/', 'Python', 'Python is a programming language that lets you work quickly', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, '2025-06-12 09:20:00'),
('https://golang.org/', 'Go', 'Build fast, reliable, and efficient software at scale', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, '2025-06-11 14:15:00'),
('https://www.rust-lang.org/', 'Rust', 'A language empowering everyone to build reliable and efficient software', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, '2025-06-10 16:30:00'),
('https://www.typescriptlang.org/', 'TypeScript', 'TypeScript is JavaScript with syntax for types', null, 1, '2025-06-09 20:45:00'),
('https://vuejs.org/', 'Vue.js', 'The Progressive JavaScript Framework', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, '2025-06-08 11:00:00'),
('https://angular.io/', 'Angular', 'The modern web developer''s platform', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, '2025-06-07 13:25:00'),
('https://laravel.com/', 'Laravel', 'The PHP Framework for Web Artisans', null, 1, '2025-06-06 08:45:00'),
('https://www.docker.com/', 'Docker', 'Accelerate how you build, run, and manage applications', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, '2025-06-05 17:10:00');

-- IDシーケンスをリセット
SELECT setval('users_id_seq', 1, true);
SELECT setval('urls_id_seq', 10, true);