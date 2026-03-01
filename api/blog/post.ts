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

export default async function handler(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug query parameter.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { supabaseUrl, supabaseKey } = getSupabaseConfig();
    const query =
      `select=id,title,slug,excerpt,content,content_blocks,cover_image,tags,status,published_at,created_at,updated_at` +
      `&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`;
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?${query}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      return new Response(JSON.stringify({ error: 'Failed to fetch blog post', detail }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rows = (await response.json()) as unknown[];
    return new Response(JSON.stringify(rows[0] ?? null), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unexpected server error.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
