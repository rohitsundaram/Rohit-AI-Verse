const getSupabaseConfig = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase server env is not configured.');
  }

  return { supabaseUrl, supabaseKey };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

export default async function handler(_request: unknown, response: ApiResponse) {
  try {
    const { supabaseUrl, supabaseKey } = getSupabaseConfig();
    const query =
      'select=id,title,slug,excerpt,content,content_blocks,cover_image,tags,status,published_at,created_at,updated_at&status=eq.published&order=published_at.desc.nullslast';
    const fetchResponse = await fetch(`${supabaseUrl}/rest/v1/posts?${query}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!fetchResponse.ok) {
      const detail = await fetchResponse.text();
      response.status(fetchResponse.status);
      response.setHeader('Content-Type', 'application/json');
      response.json({ error: 'Failed to fetch blog posts', detail });
      return;
    }

    const data = await fetchResponse.json();
    response.status(200);
    response.setHeader('Content-Type', 'application/json');
    response.json(data);
    return;
  } catch (error) {
    response.status(500);
    response.setHeader('Content-Type', 'application/json');
    response.json({
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
    return;
  }
}
