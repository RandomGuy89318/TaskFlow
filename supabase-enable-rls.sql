-- Re-enable RLS with simple user ownership policies
-- Run this in Supabase SQL Editor

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_shares ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Create simple user ownership policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Drop any existing task_shares policies
DROP POLICY IF EXISTS "Users can view shares for their tasks" ON task_shares;
DROP POLICY IF EXISTS "Users can create shares for their tasks" ON task_shares;
DROP POLICY IF EXISTS "Users can delete shares for their tasks" ON task_shares;

-- Disable task_shares RLS for now (sharing feature not implemented yet)
ALTER TABLE task_shares DISABLE ROW LEVEL SECURITY;
