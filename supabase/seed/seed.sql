-- 既存データを削除
DELETE FROM urls;
DELETE FROM users;

-- テストユーザー作成
INSERT INTO users (id, email, password) VALUES 
(1, 'test@example.com', '$2b$12$nuMe9IylSrG9J1ZdmI9r3uBNBUnicX8s/Dkj5DJc0as8W0oN9kSZm'),
(2, 'demo@example.com', '$2b$12$nuMe9IylSrG9J1ZdmI9r3uBNBUnicX8s/Dkj5DJc0as8W0oN9kSZm');

-- 大量URLデータ生成用のPL/pgSQL関数
DO $$
DECLARE
    base_urls TEXT[] := ARRAY[
        'https://github.com/project-',
        'https://stackoverflow.com/questions/',
        'https://medium.com/@user/article-',
        'https://dev.to/author/post-',
        'https://www.npmjs.com/package/',
        'https://docs.react.dev/learn/',
        'https://nextjs.org/docs/',
        'https://supabase.com/docs/',
        'https://tailwindcss.com/docs/',
        'https://www.prisma.io/docs/',
        'https://www.postgresql.org/docs/',
        'https://developer.mozilla.org/docs/',
        'https://www.typescriptlang.org/docs/',
        'https://nodejs.org/api/',
        'https://expressjs.com/en/guide/',
        'https://www.docker.com/guides/',
        'https://kubernetes.io/docs/',
        'https://aws.amazon.com/documentation/',
        'https://cloud.google.com/docs/',
        'https://azure.microsoft.com/documentation/'
    ];
    
    tech_words TEXT[] := ARRAY[
        'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Supabase', 'Prisma', 'Tailwind',
        'Vue.js', 'Angular', 'Svelte', 'Remix', 'Astro', 'Vite', 'Webpack', 'ESLint',
        'Prettier', 'Jest', 'Cypress', 'Playwright', 'Storybook', 'Figma', 'Design System',
        'API', 'REST', 'GraphQL', 'WebSocket', 'Microservices', 'Serverless', 'JAMstack',
        'CI/CD', 'DevOps', 'Monitoring', 'Testing', 'Performance', 'Security', 'Authentication',
        'Authorization', 'Database', 'Cache', 'Queue', 'Search', 'Analytics', 'SEO'
    ];
    
    descriptions TEXT[] := ARRAY[
        'Complete guide to modern web development',
        'Best practices for building scalable applications',
        'Advanced patterns and techniques',
        'Performance optimization strategies',
        'Security implementation guide',
        'Testing methodologies and tools',
        'DevOps and deployment strategies',
        'Database design and optimization',
        'API development and documentation',
        'User experience and interface design',
        'Mobile-first responsive design',
        'Progressive web app development',
        'Server-side rendering techniques',
        'Static site generation methods',
        'Microservices architecture patterns',
        'Cloud infrastructure management',
        'Containerization and orchestration',
        'Monitoring and logging solutions',
        'Authentication and authorization',
        'Data visualization and analytics'
    ];
    
    image_urls TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ];
    
    i INTEGER;
    user_id INTEGER;
    url TEXT;
    title TEXT;
    description TEXT;
    image_url TEXT;
    created_at TIMESTAMP;
    
BEGIN
    -- ユーザー1とユーザー2それぞれに50000件のURLを生成
    FOR user_id IN 1..2 LOOP
        FOR i IN 1..50000 LOOP
            -- ランダムなURLを生成
            url := base_urls[1 + (RANDOM() * array_length(base_urls, 1))::INTEGER] || 
                   (RANDOM() * 999999)::INTEGER;
            
            -- ランダムなタイトルを生成
            title := tech_words[1 + (RANDOM() * array_length(tech_words, 1))::INTEGER] || 
                     ' ' || tech_words[1 + (RANDOM() * array_length(tech_words, 1))::INTEGER] || 
                     ' #' || i;
            
            -- ランダムな説明を生成
            description := descriptions[1 + (RANDOM() * array_length(descriptions, 1))::INTEGER];
            
            -- ランダムな画像URL（30%の確率でnull）
            IF RANDOM() > 0.3 THEN
                image_url := image_urls[1 + (RANDOM() * array_length(image_urls, 1))::INTEGER];
            ELSE
                image_url := NULL;
            END IF;
            
            -- ランダムな作成日時（過去30日間）
            created_at := NOW() - (RANDOM() * INTERVAL '30 days');
            
            -- URLを挿入
            INSERT INTO urls (url, title, description, image_url, user_id, created_at, is_favorite)
            VALUES (
                url,
                title,
                description,
                image_url,
                user_id,
                created_at,
                RANDOM() > 0.9  -- 10%の確率でお気に入り
            );
            
            -- 進捗表示（10000件ごと）
            IF i % 10000 = 0 THEN
                RAISE NOTICE 'User %: % URLs inserted', user_id, i;
            END IF;
        END LOOP;
        
        RAISE NOTICE 'User %: All 50000 URLs inserted successfully', user_id;
    END LOOP;
END $$;

-- IDシーケンスをリセット
SELECT setval('users_id_seq', 2, true);
SELECT setval('urls_id_seq', (SELECT MAX(id) FROM urls), true);

-- 統計情報を更新
ANALYZE urls;
ANALYZE users;

-- 作成されたデータの確認
SELECT 
    u.email,
    COUNT(ur.id) as url_count,
    COUNT(CASE WHEN ur.is_favorite THEN 1 END) as favorite_count
FROM users u
LEFT JOIN urls ur ON u.id = ur.user_id
GROUP BY u.id, u.email
ORDER BY u.id;