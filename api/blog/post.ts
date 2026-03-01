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

type ApiRequest = {
  query?: Record<string, string | string[] | undefined>;
  url?: string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  try {
    const fromQuery = request.query?.slug;
    const slug = Array.isArray(fromQuery) ? fromQuery[0] : fromQuery;

    if (!slug) {
      response.status(400);
      response.setHeader('Content-Type', 'application/json');
      response.json({ error: 'Missing slug query parameter.' });
      return;
    }

    const { supabaseUrl, supabaseKey } = getSupabaseConfig();
    const query =
      `select=id,title,slug,excerpt,content,content_blocks,cover_image,tags,status,published_at,created_at,updated_at` +
      `&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`;
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
      response.json({ error: 'Failed to fetch blog post', detail });
      return;
    }

    const rows = (await fetchResponse.json()) as unknown[];
    response.status(200);
    response.setHeader('Content-Type', 'application/json');
    response.json(rows[0] ?? null);
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
