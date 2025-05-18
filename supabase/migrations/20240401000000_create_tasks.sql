-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'done')),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  due_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  pomodoro_sessions JSONB[]
);

-- Create index for user_id for faster queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Create index for status for faster filtering
CREATE INDEX idx_tasks_status ON tasks(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tasks
CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own tasks
CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own tasks
CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id); 