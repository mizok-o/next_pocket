-- Add is_favorite column to urls table
ALTER TABLE urls ADD COLUMN is_favorite BOOLEAN DEFAULT false NOT NULL;

-- Create index on is_favorite for performance (for future filtering)
CREATE INDEX idx_urls_is_favorite ON urls(is_favorite);