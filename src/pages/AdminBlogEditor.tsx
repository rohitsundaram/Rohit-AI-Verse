import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminBlogPosts, useMigrateMarkdownPosts, usePublishPost, useSaveDraftPost, useUnpublishPost } from '@/hooks/useBlog';
import { getSupabaseClient } from '@/lib/supabase';
import { blocksToMarkdown, markdownToBlocks } from '@/lib/blockContent';
import { uploadBlogImage } from '@/lib/blogImages';
import MarkdownArticle from '@/components/MarkdownArticle';
import { stripMarkdownModeMarker, withMarkdownModeMarker } from '@/lib/markdownMode';

interface EditorFormState {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  category: string;
  coverImage: string;
  tagsText: string;
  contentMarkdown: string;
}

const DEFAULT_BLOG_CATEGORIES = [
  'AI Projects',
  'Case Studies',
  'LLM & RAG',
  'MLOps & Deployment',
  'Data & Analytics',
  'Career & Interview Prep',
  'Tech Notes',
];

const emptyForm: EditorFormState = {
  title: '',
  slug: '',
  excerpt: '',
  publishDate: '',
  category: DEFAULT_BLOG_CATEGORIES[0],
  coverImage: '',
  tagsText: '',
  contentMarkdown: '',
};

const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

const AdminBlogEditor = () => {
  const navigate = useNavigate();
  const { data: posts = [], isLoading, error, refetch } = useAdminBlogPosts();
  const saveDraft = useSaveDraftPost();
  const publish = usePublishPost();
  const unpublish = useUnpublishPost();
  const migrateMarkdown = useMigrateMarkdownPosts();

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [form, setForm] = useState<EditorFormState>(emptyForm);
  const [statusMessage, setStatusMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isInlineImageUploading, setIsInlineImageUploading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<string[]>(DEFAULT_BLOG_CATEGORIES);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const markdownTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const hasAutoSelectedRef = useRef(false);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) || null,
    [posts, selectedPostId],
  );

  useEffect(() => {
    if (!hasAutoSelectedRef.current && !selectedPostId && posts.length > 0) {
      setSelectedPostId(posts[0].id);
      hasAutoSelectedRef.current = true;
    }
  }, [posts, selectedPostId]);

  useEffect(() => {
    const categoriesFromPosts = posts
      .map((post) => post.tags[0])
      .filter((tag): tag is string => Boolean(tag));

    setCategoryOptions((prev) => {
      const merged = Array.from(new Set([...DEFAULT_BLOG_CATEGORIES, ...prev, ...categoriesFromPosts]));
      return merged;
    });
  }, [posts]);

  useEffect(() => {
    if (!selectedPost) {
      return;
    }

    setForm({
      title: selectedPost.title,
      slug: selectedPost.slug,
      excerpt: selectedPost.excerpt,
      publishDate: selectedPost.publishedAt ? selectedPost.publishedAt.slice(0, 10) : '',
      category: selectedPost.tags[0] || DEFAULT_BLOG_CATEGORIES[0],
      coverImage: selectedPost.coverImage || '',
      tagsText: selectedPost.tags.filter((tag) => tag !== selectedPost.tags[0]).join(', '),
      contentMarkdown: selectedPost.content?.trim()
        ? stripMarkdownModeMarker(selectedPost.content)
        : blocksToMarkdown(selectedPost.contentBlocks),
    });
    setStatusMessage('');
    setActionError('');
  }, [selectedPost]);

  const handleNewDraft = () => {
    setSelectedPostId(null);
    setForm(emptyForm);
    setStatusMessage('New draft started.');
    setActionError('');
  };

  const handleSaveDraft = async () => {
    setActionError('');
    setStatusMessage('');

    try {
      const saved = await saveDraft.mutateAsync(buildDraftPayload());

      setSelectedPostId(saved.id);
      setStatusMessage('Draft saved.');
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to save draft.');
    }
  };

  const buildDraftPayload = () => {
    const normalizedMarkdown = form.contentMarkdown || '';
    const contentBlocks = markdownToBlocks(normalizedMarkdown);

    return {
      id: selectedPostId || undefined,
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      publishedAt: form.publishDate || null,
      coverImage: form.coverImage,
      tags: [form.category, ...parseTags(form.tagsText).filter((tag) => tag !== form.category)],
      content: withMarkdownModeMarker(normalizedMarkdown),
      contentBlocks,
    };
  };

  const handlePublish = async () => {
    if (!selectedPostId) {
      setActionError('Save the draft before publishing.');
      return;
    }

    setActionError('');
    setStatusMessage('');

    try {
      await publish.mutateAsync({ postId: selectedPostId, publishedAt: form.publishDate || null });
      setStatusMessage('Post published.');
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to publish post.');
    }
  };

  const handleUnpublish = async () => {
    if (!selectedPostId) {
      setActionError('Select a post to unpublish.');
      return;
    }

    setActionError('');
    setStatusMessage('');

    try {
      await unpublish.mutateAsync(selectedPostId);
      setStatusMessage('Post moved back to draft.');
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to unpublish post.');
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleMigrateMarkdown = async () => {
    setActionError('');
    setStatusMessage('');

    try {
      const count = await migrateMarkdown.mutateAsync();
      setStatusMessage(count > 0 ? `Migrated ${count} markdown post(s) to block format.` : 'No markdown posts needed migration.');
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to migrate markdown posts.');
    }
  };

  const handleCoverUpload = async (file?: File) => {
    if (!file) {
      return;
    }

    setActionError('');
    setStatusMessage('');
    setIsCoverUploading(true);

    try {
      const url = await uploadBlogImage(file);
      setForm((prev) => ({ ...prev, coverImage: url }));
      setStatusMessage('Cover image uploaded.');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to upload cover image.');
    } finally {
      setIsCoverUploading(false);
      if (coverInputRef.current) {
        coverInputRef.current.value = '';
      }
    }
  };

  const insertMarkdownAtCursor = (snippet: string) => {
    const textArea = markdownTextAreaRef.current;
    if (!textArea) {
      setForm((prev) => ({
        ...prev,
        contentMarkdown: prev.contentMarkdown ? `${prev.contentMarkdown}\n${snippet}` : snippet,
      }));
      return;
    }

    const start = textArea.selectionStart ?? form.contentMarkdown.length;
    const end = textArea.selectionEnd ?? form.contentMarkdown.length;
    const nextValue = `${form.contentMarkdown.slice(0, start)}${snippet}${form.contentMarkdown.slice(end)}`;
    setForm((prev) => ({ ...prev, contentMarkdown: nextValue }));

    requestAnimationFrame(() => {
      const nextCursor = start + snippet.length;
      textArea.focus();
      textArea.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleInlineImageUpload = async (file?: File) => {
    if (!file) {
      return;
    }

    setActionError('');
    setStatusMessage('');
    setIsInlineImageUploading(true);

    try {
      const url = await uploadBlogImage(file);
      const alt = file.name.replace(/\.[^/.]+$/, '');
      const needsNewline = form.contentMarkdown.trim().length > 0 && !form.contentMarkdown.endsWith('\n');
      const snippet = `${needsNewline ? '\n' : ''}![${alt}](${url})\n`;
      insertMarkdownAtCursor(snippet);
      setStatusMessage('Inline image uploaded and inserted into markdown.');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to upload inline image.');
    } finally {
      setIsInlineImageUploading(false);
      if (inlineImageInputRef.current) {
        inlineImageInputRef.current.value = '';
      }
    }
  };

  const handleCreateCategory = () => {
    const normalized = newCategory.trim();
    if (!normalized) {
      return;
    }

    setCategoryOptions((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    setForm((prev) => ({ ...prev, category: normalized }));
    setNewCategory('');
    setStatusMessage(`Category "${normalized}" added.`);
    setActionError('');
  };

  const handlePreviewExactPage = async () => {
    setActionError('');
    setStatusMessage('');

    try {
      const saved = await saveDraft.mutateAsync(buildDraftPayload());
      setSelectedPostId(saved.id);
      setStatusMessage('Draft saved. Opening exact page preview...');
      window.open(`/blog/${saved.slug}?preview=1`, '_blank');
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to open preview.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Blog Editor</h1>
            <p className="text-muted-foreground">Write in Markdown, preview live, then publish when ready.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleMigrateMarkdown} disabled={migrateMarkdown.isPending}>
              {migrateMarkdown.isPending ? 'Migrating...' : 'Migrate Markdown'}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Drafts & Posts</CardTitle>
              <CardDescription>Select an existing post or start a new draft.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleNewDraft} className="w-full gradient-primary text-primary-foreground">
                New Draft
              </Button>
              {isLoading && <p className="text-sm text-muted-foreground">Loading posts...</p>}
              {error && <p className="text-sm text-destructive">{error instanceof Error ? error.message : 'Failed to load posts.'}</p>}
              {!isLoading && posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`w-full text-left rounded-md border p-3 transition-colors ${
                    selectedPostId === post.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <p className="font-medium">{post.title || 'Untitled Draft'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.status === 'published' ? 'Published' : 'Draft'} • {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="grid xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Editor</CardTitle>
                <CardDescription>Content and metadata used for your public blog pages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Title"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                />
                <Input
                  placeholder="Slug (e.g. my-first-post)"
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                />
                <Input
                  placeholder="Excerpt"
                  value={form.excerpt}
                  onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Posting Date</p>
                  <Input
                    type="date"
                    value={form.publishDate}
                    onChange={(event) => setForm((prev) => ({ ...prev, publishDate: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Category</p>
                  <select
                    value={form.category}
                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Create new category"
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={handleCreateCategory}>
                      Add
                    </Button>
                  </div>
                </div>
                <Input
                  placeholder="Cover image URL (optional)"
                  value={form.coverImage}
                  onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleCoverUpload(event.target.files?.[0])}
                  />
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} disabled={isCoverUploading}>
                    {isCoverUploading ? 'Uploading cover...' : 'Upload Cover Image From PC'}
                  </Button>
                </div>
                <Input
                  placeholder="Tags (comma separated, e.g. FastAPI, PGVector, AWS)"
                  value={form.tagsText}
                  onChange={(event) => setForm((prev) => ({ ...prev, tagsText: event.target.value }))}
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">Markdown Content</p>
                    <div className="flex items-center gap-2">
                      <input
                        ref={inlineImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleInlineImageUpload(event.target.files?.[0])}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => inlineImageInputRef.current?.click()}
                        disabled={isInlineImageUploading}
                      >
                        {isInlineImageUploading ? 'Uploading inline image...' : 'Upload Inline Image'}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use Markdown only. Example: ![alt text](image-url)
                  </p>
                  <Textarea
                    ref={markdownTextAreaRef}
                    placeholder="Write markdown here..."
                    value={form.contentMarkdown}
                    onChange={(event) => setForm((prev) => ({ ...prev, contentMarkdown: event.target.value }))}
                    className="min-h-[620px] resize-y font-mono"
                  />
                </div>

                {actionError && <p className="text-sm text-destructive">{actionError}</p>}
                {statusMessage && <p className="text-sm text-primary">{statusMessage}</p>}

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSaveDraft} disabled={saveDraft.isPending}>
                    {saveDraft.isPending ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button onClick={handlePreviewExactPage} disabled={saveDraft.isPending} variant="outline">
                    Preview Exact Page
                  </Button>
                  <Button onClick={handlePublish} disabled={publish.isPending || !selectedPostId} className="gradient-primary text-primary-foreground">
                    {publish.isPending ? 'Publishing...' : 'Publish'}
                  </Button>
                  <Button onClick={handleUnpublish} disabled={unpublish.isPending || !selectedPostId} variant="outline">
                    {unpublish.isPending ? 'Updating...' : 'Unpublish'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>This is how the post content will render on your site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h2 className="text-2xl font-bold">{form.title || 'Untitled Draft'}</h2>
                {form.excerpt && <p className="text-muted-foreground">{form.excerpt}</p>}
                {form.coverImage && <img src={form.coverImage} alt={form.title || 'Cover'} className="w-full max-h-72 object-cover rounded-lg" />}
                <MarkdownArticle markdown={form.contentMarkdown} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
