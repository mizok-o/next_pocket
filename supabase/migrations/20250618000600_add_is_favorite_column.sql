-- Add is_favorite column to urls table
ALTER TABLE urls ADD COLUMN is_favorite BOOLEAN DEFAULT false NOT NULL;