import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPostById,
  getPostBySlugForPreview,
  getPublishedPostBySlug,
  listAdminPosts,
  listPublishedPosts,
  migrateMarkdownPosts,
  publishPost,
  saveDraftPost,
  unpublishPost,
} from '@/lib/blogApi';
import type { BlogPostInput } from '@/types/blog';

export const useBlogPosts = () =>
  useQuery({
    queryKey: ['blog-posts'],
    queryFn: listPublishedPosts,
  });

export const useBlogPostBySlug = (slug?: string) =>
  useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getPublishedPostBySlug(slug || ''),
    enabled: Boolean(slug),
  });

export const useBlogPostPreviewBySlug = (slug?: string) =>
  useQuery({
    queryKey: ['blog-post-preview', slug],
    queryFn: () => getPostBySlugForPreview(slug || ''),
    enabled: Boolean(slug),
  });

export const useAdminBlogPosts = () =>
  useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: listAdminPosts,
  });

export const useAdminPostById = (postId?: string) =>
  useQuery({
    queryKey: ['admin-blog-post', postId],
    queryFn: () => getPostById(postId || ''),
    enabled: Boolean(postId),
  });

export const useSaveDraftPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BlogPostInput & { id?: string }) => saveDraftPost(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, publishedAt }: { postId: string; publishedAt?: string | null }) => publishPost(postId, publishedAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useUnpublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => unpublishPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useMigrateMarkdownPosts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: migrateMarkdownPosts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};
