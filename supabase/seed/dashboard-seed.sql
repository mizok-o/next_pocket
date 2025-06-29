-- Dashboard用追加seedデータ
-- 既存のseed.sqlに追加で実行される

-- 新規ユーザー100名を追加 (ID: 3-102)
DO $$
BEGIN
    FOR i IN 3..102 LOOP
        INSERT INTO users (id, email, password, created_at, updated_at) VALUES
        (i, 'user' || LPAD((i-2)::TEXT, 3, '0') || '@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW());
    END LOOP;
END $$;

-- 月5万件のデータ生成 (2024年4月から現在まで)
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
    
    current_month_year INTEGER;
    current_month INTEGER;
    processing_date DATE;
    month_start_date DATE;
    month_end_date DATE;
    days_in_month INTEGER;
    target_user INTEGER;
    insert_date TIMESTAMP;
    base_url TEXT;
    keyword TEXT;
    desc_text TEXT;
    img_url TEXT;
    full_url TEXT;
    url_title TEXT;
    random_val FLOAT;
    target_hour INTEGER;
    total_records_created INTEGER := 0;
    
BEGIN
    -- 2025年4月から現在月まで各月500,000件ずつ生成
    processing_date := '2025-04-01'::DATE;
    
    WHILE processing_date <= DATE_TRUNC('month', CURRENT_DATE) LOOP
        -- 月の開始日と終了日を計算
        month_start_date := DATE_TRUNC('month', processing_date);
        month_end_date := (month_start_date + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
        days_in_month := EXTRACT(DAY FROM month_end_date);
        
        RAISE NOTICE 'Processing month: % (% days)', TO_CHAR(month_start_date, 'YYYY-MM'), days_in_month;
        
        -- 各月500,000件のデータを生成
        FOR i IN 1..500000 LOOP
            -- ユーザーID 3-102にランダム割り当て
            target_user := 3 + ((i - 1) % 100);
            
            -- 当該月内でランダム日付生成
            insert_date := month_start_date + (random() * (days_in_month - 1))::INTEGER;
            
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
            
            total_records_created := total_records_created + 1;
            
            -- 進捗表示（50,000件ごと）
            IF i % 50000 = 0 THEN
                RAISE NOTICE 'Month % progress: % / 500000', TO_CHAR(month_start_date, 'YYYY-MM'), i;
            END IF;
        END LOOP;
        
        RAISE NOTICE 'Completed month %: 500,000 URLs inserted', TO_CHAR(month_start_date, 'YYYY-MM');
        
        -- 次の月に進む
        processing_date := processing_date + INTERVAL '1 month';
    END LOOP;
    
    RAISE NOTICE 'Dashboard seed completed: % total URLs inserted for users 3-102', total_records_created;
END $$;