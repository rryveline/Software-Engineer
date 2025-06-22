
-- Make created_by column nullable to allow admin users to create crawled data
-- without requiring a Supabase auth user ID
ALTER TABLE public.crawled_data 
ALTER COLUMN created_by DROP NOT NULL;

-- Update the foreign key constraint to handle null values properly
-- The existing constraint should still work, but we're ensuring it's properly defined
ALTER TABLE public.crawled_data 
DROP CONSTRAINT IF EXISTS crawled_data_created_by_fkey;

-- Re-add the foreign key constraint that allows null values
ALTER TABLE public.crawled_data 
ADD CONSTRAINT crawled_data_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
