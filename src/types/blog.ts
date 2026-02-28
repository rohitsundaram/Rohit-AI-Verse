export interface BlogBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface BlogContent {
  time?: number;
  blocks: BlogBlock[];
  version?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentBlocks: BlogContent;
  status: 'draft' | 'published';
  publishedAt: string | null;
  coverImage: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type BlogPostInput = Pick<BlogPost, 'title' | 'slug' | 'excerpt' | 'content' | 'contentBlocks' | 'coverImage' | 'tags' | 'publishedAt'>;
