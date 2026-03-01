const getSupabaseHost = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  if (!supabaseUrl) {
    return '';
  }

  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return '';
  }
};

type ApiRequest = {
  query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: Buffer) => void;
  json: (body: unknown) => void;
};

const getTargetUrl = (request: ApiRequest) => {
  const fromQuery = request.query?.url;
  const raw = Array.isArray(fromQuery) ? fromQuery[0] : fromQuery;
  if (!raw) {
    return null;
  }

  try {
    return new URL(raw);
  } catch {
    return null;
  }
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  try {
    const targetUrl = getTargetUrl(request);
    if (!targetUrl) {
      response.status(400);
      response.setHeader('Content-Type', 'application/json');
      response.json({ error: 'Missing or invalid image url query parameter.' });
      return;
    }

    const supabaseHost = getSupabaseHost();
    const isSupabaseStorage =
      targetUrl.hostname.endsWith('.supabase.co') && targetUrl.pathname.includes('/storage/v1/object/');
    const sameProject = !supabaseHost || targetUrl.hostname === supabaseHost;

    if (!isSupabaseStorage || !sameProject) {
      response.status(403);
      response.setHeader('Content-Type', 'application/json');
      response.json({ error: 'Image proxy only allows this project Supabase storage URLs.' });
      return;
    }

    const upstream = await fetch(targetUrl.toString());
    if (!upstream.ok) {
      response.status(upstream.status);
      response.setHeader('Content-Type', 'application/json');
      response.json({ error: 'Failed to fetch image from storage.' });
      return;
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const bytes = await upstream.arrayBuffer();
    response.status(200);
    response.setHeader('Content-Type', contentType);
    response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    response.send(Buffer.from(bytes));
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
