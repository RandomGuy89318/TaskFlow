-- Migration to add task_shares table and update RLS policies
-- Run this in Supabase SQL Editor

-- Create task_shares table
CREATE TABLE IF NOT EXISTS task_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  shared_with_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  permission TEXT DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(task_id, shared_with_user_id)
);

-- Create indexes for task_shares
CREATE INDEX IF NOT EXISTS task_shares_task_id_idx ON task_shares(task_id);
CREATE INDEX IF NOT EXISTS task_shares_shared_with_user_id_idx ON task_shares(shared_with_user_id);

-- Enable RLS on task_shares
ALTER TABLE task_shares ENABLE ROW LEVEL SECURITY;

-- Drop existing task policies
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Create updated task policies to include shared tasks
-- Using a simpler approach to avoid infinite recursion
CREATE POLICY "Users can view own or shared tasks" ON tasks FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM task_shares
    WHERE task_shares.task_id = tasks.id
    AND task_shares.shared_with_user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks or shared with edit permission" ON tasks FOR UPDATE USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM task_shares
    WHERE task_shares.task_id = tasks.id
    AND task_shares.shared_with_user_id = auth.uid()
    AND task_shares.permission = 'edit'
  )
);

CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Create task shares policies
-- Simplified to avoid circular dependencies
CREATE POLICY "Users can view shares for their tasks" ON task_shares FOR SELECT USING (
  shared_with_user_id = auth.uid()
);
CREATE POLICY "Users can create shares for their tasks" ON task_shares FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM tasks
    WHERE tasks.id = task_shares.task_id
    AND tasks.user_id = auth.uid()
  )
);
CREATE POLICY "Users can delete shares for their tasks" ON task_shares FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM tasks
    WHERE tasks.id = task_shares.task_id
    AND tasks.user_id = auth.uid()
  )
);
