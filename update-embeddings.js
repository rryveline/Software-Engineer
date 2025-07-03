async function searchSupabase(query: string) {
  // 1. Dapatkan embedding dari OpenAI
  const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: query,
    }),
  });

  const embeddingJson = await embeddingRes.json();
  const embeddingVector = embeddingJson.data?.[0]?.embedding;

  if (!embeddingVector) return [];

  // 2. Panggil fungsi match_crawled_data di Supabase (pastikan fungsi ini sudah ada di PostgreSQL Supabase)
  const { data, error } = await supabase.rpc('match_crawled_data', {
    query_embedding: embeddingVector,
    match_threshold: 0.75,
    match_count: 3,
  });

  if (error) {
    console.error('Supabase match error:', error);
    return [];
  }

  return data || [];
}
