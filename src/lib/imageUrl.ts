const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

const getSupabaseStoragePublicPrefix = () => {
  if (!supabaseUrl) {
    return '';
  }

  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/blog-images/`;
};

const toAbsoluteStorageUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const prefix = getSupabaseStoragePublicPrefix();
  if (!prefix) {
    return trimmed;
  }

  const withoutLeadingSlash = trimmed.replace(/^\/+/, '');
  const normalizedPath = withoutLeadingSlash.startsWith('blog-images/')
    ? withoutLeadingSlash.replace(/^blog-images\//, '')
    : withoutLeadingSlash;

  return `${prefix}${normalizedPath}`;
};

const isSupabaseStorageUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.hostname.endsWith('.supabase.co') && parsed.pathname.includes('/storage/v1/object/');
  } catch {
    return false;
  }
};

export const toRenderableImageUrl = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const absoluteUrl = toAbsoluteStorageUrl(value);
  if (!absoluteUrl) {
    return '';
  }

  // In local dev, keep direct URLs because Vite may serve /api/* as source files.
  if (isSupabaseStorageUrl(absoluteUrl) && !import.meta.env.DEV) {
    return `/api/blog/image?url=${encodeURIComponent(absoluteUrl)}`;
  }

  return absoluteUrl;
};
