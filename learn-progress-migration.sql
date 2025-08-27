-- Create user_lessons table to track learning progress
CREATE TABLE IF NOT EXISTS user_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_lessons_user_id ON user_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_lesson_id ON user_lessons(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_completed_at ON user_lessons(completed_at);

-- Enable RLS
ALTER TABLE user_lessons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own lesson progress" ON user_lessons
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress" ON user_lessons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" ON user_lessons
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson progress" ON user_lessons
    FOR DELETE USING (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate lesson completions
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_lessons_unique 
    ON user_lessons(user_id, lesson_id);
