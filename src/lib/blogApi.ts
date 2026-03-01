import type { BlogPost, BlogPostInput } from '@/types/blog';
import { getSupabaseClient } from '@/lib/supabase';
import { emptyBlogContent, isValidBlogContent, markdownToBlocks } from '@/lib/blockContent';
import { toRenderableImageUrl } from '@/lib/imageUrl';

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  content_blocks: unknown;
  cover_image: string | null;
  tags: string[] | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const mapPost = (row: PostRow): BlogPost => {
  const normalizedContentBlocks = isValidBlogContent(row.content_blocks)
    ? row.content_blocks
    : row.content
      ? markdownToBlocks(row.content)
      : emptyBlogContent();

  const firstContentImage = normalizedContentBlocks.blocks.find((block) => block.type === 'image');
  const imageFile = firstContentImage?.data?.file as { url?: unknown } | undefined;
  const imageFromBlocks = typeof imageFile?.url === 'string' ? imageFile.url : null;

  return {
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  content: row.content,
  contentBlocks: normalizedContentBlocks,
  status: row.status,
  publishedAt: row.published_at,
  coverImage: toRenderableImageUrl(row.cover_image || imageFromBlocks),
  tags: row.tags ?? [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  };
};

const assertData = <T>(data: T | null, error: { message?: string } | null) => {
  if (error) {
    throw new Error(error.message || 'Unexpected Supabase error.');
  }

  if (!data) {
    throw new Error('No data returned from Supabase.');
  }

  return data;
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const resolveCategoryId = async (categoryNameFromInput?: string) => {
  const supabase = getSupabaseClient();
  const categoryName = (categoryNameFromInput || 'AI Projects').trim() || 'AI Projects';
  const categorySlug = normalizeSlug(categoryName);

  const { data: byName, error: byNameError } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('name', categoryName)
    .maybeSingle();

  if (byNameError) {
    throw new Error(byNameError.message || 'Failed to resolve category.');
  }

  if (byName?.id) {
    return byName.id as string;
  }

  const { data: bySlug, error: bySlugError } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();

  if (bySlugError) {
    throw new Error(bySlugError.message || 'Failed to resolve category.');
  }

  if (bySlug?.id) {
    return bySlug.id as string;
  }

  const { data: created, error: createError } = await supabase
    .from('blog_categories')
    .insert({
      slug: categorySlug,
      name: categoryName,
      description: '',
      sort_order: 999,
    })
    .select('id')
    .single();

  if (createError) {
    throw new Error(createError.message || 'Failed to create category.');
  }

  return created.id as string;
};

export const listPublishedPosts = async (): Promise<BlogPost[]> => {
  const tryApiResponse = await fetch('/api/blog/posts');
  const contentType = tryApiResponse.headers.get('content-type') || '';

  if (tryApiResponse.ok && contentType.includes('application/json')) {
    const rows = (await tryApiResponse.json()) as PostRow[];
    return rows.map((row) => mapPost(row));
  }

  // Local Vite dev can serve /api/* files as JS source.
  // Fall back to direct Supabase browser query in that case.
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false });

  return assertData(data, error).map((row) => mapPost(row as PostRow));
};

export const getPublishedPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const tryApiResponse = await fetch(`/api/blog/post?slug=${encodeURIComponent(slug)}`);
  const contentType = tryApiResponse.headers.get('content-type') || '';

  if (tryApiResponse.ok && contentType.includes('application/json')) {
    const row = (await tryApiResponse.json()) as PostRow | null;
    return row ? mapPost(row) : null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to fetch blog post.');
  }

  return data ? mapPost(data as PostRow) : null;
};

export const getPostBySlugForPreview = async (slug: string): Promise<BlogPost | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to fetch preview post.');
  }

  return data ? mapPost(data as PostRow) : null;
};

export const listAdminPosts = async (): Promise<BlogPost[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('posts').select('*').order('updated_at', { ascending: false });
  return assertData(data, error).map((row) => mapPost(row as PostRow));
};

export const getPostById = async (postId: string): Promise<BlogPost | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('posts').select('*').eq('id', postId).maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to fetch post.');
  }

  return data ? mapPost(data as PostRow) : null;
};

export const saveDraftPost = async (input: BlogPostInput & { id?: string }): Promise<BlogPost> => {
  const supabase = getSupabaseClient();
  const publishedAt = input.publishedAt ? new Date(input.publishedAt).toISOString() : null;
  const categoryId = await resolveCategoryId(input.tags?.[0]);
  const payload = {
    title: input.title.trim() || 'Untitled Draft',
    slug: normalizeSlug(input.slug || input.title || 'untitled-draft'),
    excerpt: input.excerpt?.trim() || '',
    content: input.content || '',
    content_blocks: input.contentBlocks,
    cover_image: input.coverImage || null,
    tags: input.tags?.length ? input.tags : [],
    category_id: categoryId,
    published_at: publishedAt,
    status: 'draft' as const,
  };

  if (input.id) {
    const { data, error } = await supabase.from('posts').update(payload).eq('id', input.id).select('*').single();
    return mapPost(assertData(data, error) as PostRow);
  }

  const { data, error } = await supabase.from('posts').insert(payload).select('*').single();
  return mapPost(assertData(data, error) as PostRow);
};

export const publishPost = async (postId: string, publishedAt?: string | null): Promise<BlogPost> => {
  const supabase = getSupabaseClient();
  const resolvedPublishedAt = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();
  const { data, error } = await supabase
    .from('posts')
    .update({
      status: 'published',
      published_at: resolvedPublishedAt,
    })
    .eq('id', postId)
    .select('*')
    .single();

  return mapPost(assertData(data, error) as PostRow);
};

export const unpublishPost = async (postId: string): Promise<BlogPost> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('posts')
    .update({
      status: 'draft',
      published_at: null,
    })
    .eq('id', postId)
    .select('*')
    .single();

  return mapPost(assertData(data, error) as PostRow);
};

export const migrateMarkdownPosts = async (): Promise<number> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('posts').select('id, content, content_blocks');

  const rows = assertData(data, error) as Array<{ id: string; content: string; content_blocks: unknown }>;
  const candidates = rows.filter((row) => !isValidBlogContent(row.content_blocks) && row.content?.trim());

  for (const row of candidates) {
    const { error: updateError } = await supabase
      .from('posts')
      .update({ content_blocks: markdownToBlocks(row.content) })
      .eq('id', row.id);

    if (updateError) {
      throw new Error(updateError.message || 'Failed to migrate markdown post.');
    }
  }

  return candidates.length;
};
