-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role access only" ON users;
DROP POLICY IF EXISTS "Service role access only" ON urls;

-- Create new policies that allow read access for authentication
-- Users table: Allow read access for everyone (needed for auth check)
CREATE POLICY "Allow read for authentication" ON users
FOR SELECT USING (true);

-- Users table: Only service role can insert/update/delete
CREATE POLICY "Service role only for modifications" ON users
FOR INSERT USING (auth.role() = 'service_role');

CREATE POLICY "Service role only for updates" ON users
FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role only for deletes" ON users
FOR DELETE USING (auth.role() = 'service_role');

-- URLs table: Keep restrictive for now
CREATE POLICY "Service role access only" ON urls
FOR ALL USING (auth.role() = 'service_role');

-- Update comments
COMMENT ON TABLE users IS 'RLS enabled. Read access allowed for authentication, modifications restricted to service role.';
COMMENT ON TABLE urls IS 'RLS enabled with service-role only access. Security handled at application layer with user_id filtering.';