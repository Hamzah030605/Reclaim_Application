-- Create urge_journals table
CREATE TABLE IF NOT EXISTS urge_journals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    urge_intensity INTEGER CHECK (urge_intensity >= 1 AND urge_intensity <= 10),
    trigger_description TEXT,
    coping_strategies TEXT,
    mood_before TEXT,
    mood_after TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_urge_journals_user_id ON urge_journals(user_id);
CREATE INDEX IF NOT EXISTS idx_urge_journals_created_at ON urge_journals(created_at);

-- Enable RLS
ALTER TABLE urge_journals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own urge journals" ON urge_journals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own urge journals" ON urge_journals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own urge journals" ON urge_journals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own urge journals" ON urge_journals
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_urge_journals_updated_at 
    BEFORE UPDATE ON urge_journals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
