-- Insert assessment questions data
-- This script adds all the questions for the onboarding quiz

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
  '[{"value": 1, "text": "No negative impact"}, {"value": 2, "text": "Slight concerns"}, {"value": 3, "text": "Some difficulties"}, {"value": 4, "text": "Moderate problems"}, {"value": 5, "text": "Significant issues"}, {"value": 6, "text": "Major problems"}, {"value": 7, "text": "Severe damage"}]', 3, 5),

('impact_mental', 'impact', 'How has porn consumption affected your mental health?',
  '[{"value": 1, "text": "No negative impact"}, {"value": 2, "text": "Slight concerns"}, {"value": 3, "text": "Some difficulties"}, {"value": 4, "text": "Moderate problems"}, {"value": 5, "text": "Significant issues"}, {"value": 6, "text": "Major problems"}, {"value": 7, "text": "Severe damage"}]', 3, 6),

('impact_productivity', 'impact', 'How has porn consumption affected your productivity and daily life?',
  '[{"value": 1, "text": "No negative impact"}, {"value": 2, "text": "Slight concerns"}, {"value": 3, "text": "Some difficulties"}, {"value": 4, "text": "Moderate problems"}, {"value": 5, "text": "Significant issues"}, {"value": 6, "text": "Major problems"}, {"value": 7, "text": "Severe damage"}]', 2, 7),

-- Control Questions
('control_urges', 'control', 'How difficult is it for you to resist the urge to watch porn?',
  '[{"value": 1, "text": "Very easy"}, {"value": 2, "text": "Easy"}, {"value": 3, "text": "Somewhat easy"}, {"value": 4, "text": "Neutral"}, {"value": 5, "text": "Somewhat difficult"}, {"value": 6, "text": "Difficult"}, {"value": 7, "text": "Very difficult"}]', 3, 8),

('control_planning', 'control', 'Do you find yourself planning your day around watching porn?',
  '[{"value": 1, "text": "Never"}, {"value": 2, "text": "Rarely"}, {"value": 3, "text": "Occasionally"}, {"value": 4, "text": "Sometimes"}, {"value": 5, "text": "Often"}, {"value": 6, "text": "Very often"}, {"value": 7, "text": "Always"}]', 2, 9),

('control_guilt', 'control', 'How often do you feel guilty or ashamed after watching porn?',
  '[{"value": 1, "text": "Never"}, {"value": 2, "text": "Rarely"}, {"value": 3, "text": "Occasionally"}, {"value": 4, "text": "Sometimes"}, {"value": 5, "text": "Often"}, {"value": 6, "text": "Very often"}, {"value": 7, "text": "Always"}]', 2, 10),

-- Motivation Questions
('motivation_quit', 'motivation', 'How motivated are you to quit or reduce porn consumption?',
  '[{"value": 1, "text": "Not motivated at all"}, {"value": 2, "text": "Slightly motivated"}, {"value": 3, "text": "Somewhat motivated"}, {"value": 4, "text": "Moderately motivated"}, {"value": 5, "text": "Very motivated"}, {"value": 6, "text": "Extremely motivated"}, {"value": 7, "text": "Completely committed"}]', 1, 11),

('motivation_reasons', 'motivation', 'What are your main reasons for wanting to quit? (Select all that apply)',
  '[{"value": 1, "text": "Improve relationships"}, {"value": 2, "text": "Better mental health"}, {"value": 3, "text": "Increase productivity"}, {"value": 4, "text": "Religious/spiritual reasons"}, {"value": 5, "text": "Self-improvement"}, {"value": 6, "text": "Break addiction"}, {"value": 7, "text": "Other"}]', 1, 12),

('motivation_attempts', 'motivation', 'How many times have you tried to quit before?',
  '[{"value": 1, "text": "Never tried"}, {"value": 2, "text": "1-2 times"}, {"value": 3, "text": "3-5 times"}, {"value": 4, "text": "6-10 times"}, {"value": 5, "text": "11-20 times"}, {"value": 6, "text": "21-50 times"}, {"value": 7, "text": "More than 50 times"}]', 1, 13)

ON CONFLICT (id) DO NOTHING;
