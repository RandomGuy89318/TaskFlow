-- Quick fix for infinite recursion in task policies
-- Run this in Supabase SQL Editor

-- Drop all existing task policies
DROP POLICY IF EXISTS "Users can view own or shared tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks or shared with edit permission" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Create simple task policies (without sharing for now)
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);
