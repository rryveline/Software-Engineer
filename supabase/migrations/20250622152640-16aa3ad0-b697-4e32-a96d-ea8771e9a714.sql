
-- Create table to store crawled data
CREATE TABLE public.crawled_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('auto_crawl', 'manual_input', 'file_upload')),
  word_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'pending')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crawled_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can view all crawled data" 
  ON public.crawled_data 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin can insert crawled data" 
  ON public.crawled_data 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin can update crawled data" 
  ON public.crawled_data 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admin can delete crawled data" 
  ON public.crawled_data 
  FOR DELETE 
  USING (true);

-- Create function to update word count
CREATE OR REPLACE FUNCTION public.update_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = array_length(string_to_array(trim(NEW.content), ' '), 1);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update word count
CREATE TRIGGER update_crawled_data_word_count
  BEFORE INSERT OR UPDATE ON public.crawled_data
  FOR EACH ROW EXECUTE FUNCTION public.update_word_count();
