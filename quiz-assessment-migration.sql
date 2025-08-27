-- Quiz Assessment Tables
-- Run this in your Supabase SQL editor

-- User assessment responses table
CREATE TABLE user_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100),
  age INTEGER,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_score INTEGER,
  severity_level VARCHAR(50), -- 'low', 'moderate', 'high', 'severe'
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual question responses
CREATE TABLE assessment_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES user_assessments(id) ON DELETE CASCADE,
  question_id VARCHAR(50),
  question_text TEXT,
  response_value INTEGER,
  response_text TEXT,
  category VARCHAR(50), -- 'frequency', 'impact', 'control', 'motivation'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment questions table
CREATE TABLE assessment_questions (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(50),
  question_text TEXT,
  options JSONB, -- Array of response options
  weight INTEGER DEFAULT 1,
  order_index INTEGER,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default assessment questions
INSERT INTO assessment_questions (id, category, question_text, options, weight, order_index) VALUES
-- Personal Information
('name', 'personal', 'What is your name?', '[]', 0, 1),
('age', 'personal', 'What is your age?', '[]', 0, 2),

-- Frequency Questions
('frequency_daily', 'frequency', 'How often do you consume pornographic content?', 
  '[{"value": 1, "text": "Never"}, {"value": 2, "text": "Rarely (less than once a month)"}, {"value": 3, "text": "Occasionally (1-3 times per month)"}, {"value": 4, "text": "Sometimes (1-2 times per week)"}, {"value": 5, "text": "Often (3-6 times per week)"}, {"value": 6, "text": "Very often (daily)"}, {"value": 7, "text": "Multiple times per day"}]', 3, 3),

('frequency_duration', 'frequency', 'How long do you typically spend on pornographic content per session?',
  '[{"value": 1, "text": "Less than 5 minutes"}, {"value": 2, "text": "5-15 minutes"}, {"value": 3, "text": "15-30 minutes"}, {"value": 4, "text": "30-60 minutes"}, {"value": 5, "text": "1-2 hours"}, {"value": 6, "text": "2-4 hours"}, {"value": 7, "text": "More than 4 hours"}]', 2, 4),

-- Impact Questions
('impact_relationships', 'impact', 'How has porn consumption affected your relationships?',
  '[{"value": 1, "text": "No negative impact"}, {"value": 2, "text": "Slight concerns"}, {"value": 3, "text": "Some difficulties"}, {"value": 4, "text": "Moderate problems"}, {"value": 5, "text": "Significant issues"}, {"value": 6, "text": "Major problems"}, {"value": 7, "text": "Severe relationship damage"}]', 4, 5),

('impact_productivity', 'impact', 'How has porn consumption affected your productivity and daily life?',
  '[{"value": 1, "text": "No impact"}, {"value": 2, "text": "Minimal impact"}, {"value": 3, "text": "Some impact"}, {"value": 4, "text": "Moderate impact"}, {"value": 5, "text": "Significant impact"}, {"value": 6, "text": "Major impact"}, {"value": 7, "text": "Severe impact on daily life"}]', 3, 6),

('impact_mental_health', 'impact', 'How has porn consumption affected your mental health and emotional well-being?',
  '[{"value": 1, "text": "No negative effects"}, {"value": 2, "text": "Occasional guilt"}, {"value": 3, "text": "Regular guilt/shame"}, {"value": 4, "text": "Anxiety or depression"}, {"value": 5, "text": "Significant emotional distress"}, {"value": 6, "text": "Major mental health issues"}, {"value": 7, "text": "Severe psychological impact"}]', 4, 7),

-- Control Questions
('control_urges', 'control', 'How difficult is it for you to resist the urge to watch porn?',
  '[{"value": 1, "text": "Very easy"}, {"value": 2, "text": "Easy"}, {"value": 3, "text": "Somewhat easy"}, {"value": 4, "text": "Moderate difficulty"}, {"value": 5, "text": "Difficult"}, {"value": 6, "text": "Very difficult"}, {"value": 7, "text": "Extremely difficult"}]', 3, 8),

('control_attempts', 'control', 'How many times have you tried to quit or reduce porn consumption?',
  '[{"value": 1, "text": "Never tried"}, {"value": 2, "text": "1-2 times"}, {"value": 3, "text": "3-5 times"}, {"value": 4, "text": "6-10 times"}, {"value": 5, "text": "11-20 times"}, {"value": 6, "text": "21-50 times"}, {"value": 7, "text": "More than 50 times"}]', 2, 9),

('control_withdrawal', 'control', 'Do you experience withdrawal symptoms when trying to stop?',
  '[{"value": 1, "text": "No symptoms"}, {"value": 2, "text": "Mild restlessness"}, {"value": 3, "text": "Some irritability"}, {"value": 4, "text": "Moderate anxiety"}, {"value": 5, "text": "Significant mood changes"}, {"value": 6, "text": "Strong cravings"}, {"value": 7, "text": "Severe withdrawal symptoms"}]', 3, 10),

-- Motivation Questions
('motivation_quit', 'motivation', 'How motivated are you to quit or reduce porn consumption?',
  '[{"value": 1, "text": "Not motivated at all"}, {"value": 2, "text": "Slightly motivated"}, {"value": 3, "text": "Somewhat motivated"}, {"value": 4, "text": "Moderately motivated"}, {"value": 5, "text": "Very motivated"}, {"value": 6, "text": "Extremely motivated"}, {"value": 7, "text": "Completely committed"}]', 2, 11),

('motivation_reasons', 'motivation', 'What are your main reasons for wanting to change?',
  '[{"value": 1, "text": "No specific reasons"}, {"value": 2, "text": "General health"}, {"value": 3, "text": "Relationship improvement"}, {"value": 4, "text": "Productivity"}, {"value": 5, "text": "Mental health"}, {"value": 6, "text": "Spiritual/religious reasons"}, {"value": 7, "text": "Multiple serious reasons"}]', 1, 12);

-- RLS Policies
ALTER TABLE user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;

-- User can only access their own assessments
CREATE POLICY "Users can view own assessments" ON user_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON user_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON user_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- User can only access their own assessment responses
CREATE POLICY "Users can view own assessment responses" ON assessment_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_assessments 
      WHERE user_assessments.id = assessment_responses.assessment_id 
      AND user_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own assessment responses" ON assessment_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_assessments 
      WHERE user_assessments.id = assessment_responses.assessment_id 
      AND user_assessments.user_id = auth.uid()
    )
  );

-- Questions are public (read-only)
CREATE POLICY "Anyone can view assessment questions" ON assessment_questions
  FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_user_assessments_user_id ON user_assessments(user_id);
CREATE INDEX idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);
CREATE INDEX idx_assessment_questions_category ON assessment_questions(category);
CREATE INDEX idx_assessment_questions_order ON assessment_questions(order_index);
