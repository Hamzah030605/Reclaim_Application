-- Create storage bucket for activity images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'activity-images',
  'activity-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy for authenticated users to upload their own images
CREATE POLICY "Users can upload their own activity images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'activity-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policy for public read access to activity images
CREATE POLICY "Public read access to activity images" ON storage.objects
  FOR SELECT USING (bucket_id = 'activity-images');

-- Create storage policy for users to update their own images
CREATE POLICY "Users can update their own activity images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'activity-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policy for users to delete their own images
CREATE POLICY "Users can delete their own activity images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'activity-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
