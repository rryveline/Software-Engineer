
export interface CrawledData {
  id: string;
  title: string;
  content: string;
  category: string;
  url: string | null;
  source_type: string;
  word_count: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null; // Now properly nullable for admin users
}
