import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xcpzujhxoccopsgoqoqy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjcHp1amh4b2Njb3BzZ29xb3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTc5NjgsImV4cCI6MjA2NjE3Mzk2OH0.phzL2hPLMGPW7O2YPavO_nj6HTr6uDuhL4VDkfEKdqM');

(async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  console.log('data:', data);
  console.log('error:', error);
})();