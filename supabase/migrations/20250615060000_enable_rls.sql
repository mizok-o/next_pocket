-- Enable Row Level Security on tables  
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies that only allow access via service role
-- This provides defense-in-depth while keeping application-level security

-- Users table policies - very restrictive, only for emergencies
CREATE POLICY "Service role access only" ON users
FOR ALL USING (auth.role() = 'service_role');

-- URLs table policies - very restrictive, only for emergencies  
CREATE POLICY "Service role access only" ON urls
FOR ALL USING (auth.role() = 'service_role');

-- Add a comment explaining the security model
COMMENT ON TABLE users IS 'RLS enabled with service-role only access. Security handled at application layer.';
COMMENT ON TABLE urls IS 'RLS enabled with service-role only access. Security handled at application layer with user_id filtering.';