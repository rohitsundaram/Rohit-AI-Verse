import { motion } from 'framer-motion';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useBlogPostBySlug, useBlogPostPreviewBySlug, useBlogPosts } from '@/hooks/useBlog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BlockContentRenderer from '@/components/BlockContentRenderer';

const BLOG_AUTHOR_NAME = 'Rohit Sundaram';

const formatDate = (value?: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogPost = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreviewMode = searchParams.get('preview') === '1';
  const publishedQuery = useBlogPostBySlug(slug);
  const previewQuery = useBlogPostPreviewBySlug(isPreviewMode ? slug : undefined);
  const activeQuery = isPreviewMode ? previewQuery : publishedQuery;
  const { data: post, isLoading, isError, error, refetch } = activeQuery;
  const { data: allPosts = [] } = useBlogPosts();
  const relatedPosts = allPosts.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-primary font-medium hover:underline mb-8">
              ← Back to blog
            </Link>

            {isPreviewMode && (
              <Card className="mb-6 border-primary/40 bg-primary/5">
                <CardContent className="p-4 text-sm">
                  Preview mode: this page shows draft content and is visible only to logged-in admin users.
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card className="p-8 animate-pulse">
                <div className="h-8 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-1/3 mb-8" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </Card>
            )}

            {isError && (
              <Card className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-3">Unable to load this post</h2>
                <p className="text-muted-foreground mb-6">
                  {error instanceof Error ? error.message : 'Please try again.'}
                </p>
                <Button onClick={() => refetch()} className="gradient-primary text-primary-foreground">
                  Retry
                </Button>
              </Card>
            )}

            {!isLoading && !isError && !post && (
              <Card className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-3">Post not found</h2>
                <p className="text-muted-foreground mb-6">
                  This blog post may have been moved or is not published.
                </p>
                <Button asChild className="gradient-primary text-primary-foreground">
                  <Link to="/blog">Browse all posts</Link>
                </Button>
              </Card>
            )}

            {!isLoading && !isError && post && (
              <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <header className="mb-8">
                  <h1 className="blog-heading-1 mb-3">{post.title}</h1>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </header>

                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-2xl mb-4" />
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-10">
                  <p>Author: {BLOG_AUTHOR_NAME}</p>
                  <p>{formatDate(post.publishedAt)}</p>
                </div>

                {post.contentBlocks?.blocks?.length > 0 ? (
                  <BlockContentRenderer content={post.contentBlocks} />
                ) : (
                  <p className="text-muted-foreground">{post.excerpt}</p>
                )}

                {relatedPosts.length > 0 && (
                  <section className="mt-14 pt-8 border-t border-border">
                    <h2 className="blog-heading-2 mb-6">Related Posts</h2>
                    <div className="grid md:grid-cols-3 gap-5">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          to={`/blog/${relatedPost.slug}`}
                          className="rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-colors"
                        >
                          {relatedPost.coverImage && (
                            <img
                              src={relatedPost.coverImage}
                              alt={relatedPost.title}
                              className="w-full aspect-[16/9] object-cover"
                            />
                          )}
                          <div className="p-5">
                            <p className="text-sm text-muted-foreground mb-2">{formatDate(relatedPost.publishedAt)}</p>
                            <h3 className="text-lg font-semibold leading-snug mb-2">{relatedPost.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{relatedPost.excerpt}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </motion.article>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
