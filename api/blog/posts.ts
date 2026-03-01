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

export default async function handler() {
  try {
    const { supabaseUrl, supabaseKey } = getSupabaseConfig();
    const query =
      'select=id,title,slug,excerpt,content,content_blocks,cover_image,tags,status,published_at,created_at,updated_at&status=eq.published&order=published_at.desc.nullslast';
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?${query}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      return new Response(JSON.stringify({ error: 'Failed to fetch blog posts', detail }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
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
