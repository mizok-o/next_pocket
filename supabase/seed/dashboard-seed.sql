-- Dashboard用追加seedデータ
-- 既存のseed.sqlに追加で実行される

-- 新規ユーザー10名を追加 (ID: 3-12)
INSERT INTO users (id, email, password, created_at, updated_at) VALUES
(3, 'user01@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(4, 'user02@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(5, 'user03@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(6, 'user04@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(7, 'user05@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(8, 'user06@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(9, 'user07@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(10, 'user08@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(11, 'user09@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
(12, 'user10@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW());

-- 4-6月期間（6/28まで）のダッシュボード用データ生成
DO $$
DECLARE
    base_urls TEXT[] := ARRAY[
        'https://github.com/', 'https://stackoverflow.com/', 'https://medium.com/',
        'https://dev.to/', 'https://react.dev/', 'https://nextjs.org/',
        'https://tailwindcss.com/', 'https://typescript.org/', 'https://nodejs.org/',
        'https://prisma.io/', 'https://supabase.com/', 'https://vercel.com/',
        'https://aws.amazon.com/', 'https://docs.docker.com/', 'https://kubernetes.io/',
        'https://redis.io/', 'https://postgresql.org/', 'https://mongodb.com/',
        'https://firebase.google.com/', 'https://stripe.com/', 'https://auth0.com/',
        'https://sentry.io/', 'https://datadog.com/', 'https://grafana.com/',
        'https://figma.com/', 'https://notion.so/', 'https://slack.com/',
        'https://discord.com/', 'https://zoom.us/', 'https://linear.app/'
    ];
    
    tech_keywords TEXT[] := ARRAY[
        'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Go', 'Rust',
        'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API',
        'Microservices', 'Serverless', 'CI/CD', 'DevOps', 'Monitoring', 'Testing',
        'Security', 'Performance', 'Scalability', 'Architecture', 'Database', 'Frontend',
        'Backend', 'Full Stack', 'Machine Learning', 'Data Science', 'Analytics',
        'Automation', 'Cloud', 'Infrastructure', 'Authentication', 'Authorization',
        'Caching', 'Load Balancing', 'API Gateway', 'Message Queue', 'Event Driven',
        'Reactive', 'Functional Programming', 'Object Oriented', 'Design Patterns',
        'Clean Code', 'Code Review', 'Agile', 'Scrum', 'Documentation'
    ];
    
    descriptions TEXT[] := ARRAY[
        'プロジェクトで使える便利なツール', '最新の技術トレンドについて',
        '開発効率を上げるためのリソース', 'バグ修正の参考になった記事',
        'パフォーマンス最適化のヒント', 'セキュリティ対策の重要なポイント',
        'チーム開発で役立つツール', 'デザインシステムの参考資料',
        'API設計のベストプラクティス', 'データベース設計の考え方',
        'テスト戦略について学んだこと', 'CI/CDパイプラインの改善案',
        'クラウドアーキテクチャの参考', 'モニタリング設定の方法',
        '新しいフレームワークの検証', 'ライブラリの比較検討資料',
        'パフォーマンス計測ツール', 'セキュリティ監査のチェックリスト',
        'コードレビューのガイドライン', 'ドキュメント管理の方法'
    ];
    
    image_urls TEXT[] := ARRAY[
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f',
        'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
        'https://images.unsplash.com/photo-1605379399642-870262d3d051',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3',
        'https://images.unsplash.com/photo-1551808525-51a94da548ce'
    ];
    
    start_date DATE := '2024-04-01';
    end_date DATE := '2024-06-28';
    total_days INTEGER;
    target_user INTEGER;
    insert_date TIMESTAMP;
    base_url TEXT;
    keyword TEXT;
    desc_text TEXT;
    img_url TEXT;
    full_url TEXT;
    url_title TEXT;
    hour_weight FLOAT;
    random_val FLOAT;
    target_hour INTEGER;
    
BEGIN
    total_days := end_date - start_date + 1;
    
    -- 50,000件のデータを生成
    FOR i IN 1..50000 LOOP
        -- ユーザーID 3-12にランダム割り当て
        target_user := 3 + ((i - 1) % 10);
        
        -- 4月1日から6月28日までの期間でランダム日付生成
        insert_date := start_date + (random() * total_days)::INTEGER;
        
        -- 時間帯別分散パターンを適用
        random_val := random();
        IF random_val <= 0.35 THEN
            -- 09:00-12:00 (35%)
            target_hour := 9 + floor(random() * 4)::INTEGER;
        ELSIF random_val <= 0.50 THEN
            -- 13:00-14:00 (15%)
            target_hour := 13 + floor(random() * 2)::INTEGER;
        ELSIF random_val <= 0.80 THEN
            -- 15:00-18:00 (30%)
            target_hour := 15 + floor(random() * 4)::INTEGER;
        ELSIF random_val <= 0.95 THEN
            -- 19:00-23:00 (15%)
            target_hour := 19 + floor(random() * 5)::INTEGER;
        ELSE
            -- 00:00-08:00 (5%)
            target_hour := floor(random() * 9)::INTEGER;
        END IF;
        
        -- 最終的な日時を設定
        insert_date := insert_date + INTERVAL '1 hour' * target_hour + 
                       INTERVAL '1 minute' * floor(random() * 60) + 
                       INTERVAL '1 second' * floor(random() * 60);
        
        -- ランダムなデータを選択
        base_url := base_urls[1 + floor(random() * array_length(base_urls, 1))];
        keyword := tech_keywords[1 + floor(random() * array_length(tech_keywords, 1))];
        desc_text := descriptions[1 + floor(random() * array_length(descriptions, 1))];
        
        -- 70%の確率で画像URLを設定
        IF random() <= 0.7 THEN
            img_url := image_urls[1 + floor(random() * array_length(image_urls, 1))];
        ELSE
            img_url := NULL;
        END IF;
        
        -- URLとタイトルを生成
        full_url := base_url || lower(replace(keyword, ' ', '-')) || '/' || floor(random() * 10000);
        url_title := keyword || ' - ' || 
                CASE floor(random() * 5)
                    WHEN 0 THEN 'チュートリアル'
                    WHEN 1 THEN 'ドキュメント'
                    WHEN 2 THEN 'ガイド'
                    WHEN 3 THEN 'リファレンス'
                    ELSE 'ベストプラクティス'
                END;
        
        -- データを挿入
        INSERT INTO urls (
            url, 
            title, 
            description, 
            image_url, 
            user_id, 
            created_at, 
            updated_at, 
            is_favorite
        ) VALUES (
            full_url,
            url_title,
            desc_text || ' - ' || keyword,
            img_url,
            target_user,
            insert_date,
            insert_date,
            random() <= 0.1  -- 10%の確率でお気に入り
        );
        
        -- 進捗表示（10,000件ごと）
        IF i % 10000 = 0 THEN
            RAISE NOTICE 'Dashboard seed progress: % / 50000', i;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Dashboard seed completed: 50,000 URLs inserted for users 3-12';
END $$;