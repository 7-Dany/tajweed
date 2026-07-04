ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Allow public read access for course browsing (used by the slide player)
CREATE POLICY "Allow read access for all users" ON teachers FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON chapters FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON lessons FOR SELECT USING (true);

-- Allow full access for service-role (admin operations)
-- Service role bypasses RLS by default, so these are explicit policies
-- for anon/key-based admin access if needed later.
