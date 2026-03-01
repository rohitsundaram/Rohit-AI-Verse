import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useBlogPosts } from '@/hooks/useBlog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BLOG_AUTHOR_NAME = 'Rohit Sundaram';

const formatDate = (value?: string) => {
  if (!value) {
    return 'Recently published';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Recently published';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Blog = () => {
  const { data: posts = [], isLoading, isError, error, refetch } = useBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return ['all', ...Array.from(tagSet)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.tags.includes(selectedCategory);
      const normalized = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
      const matchesSearch = !searchTerm.trim() || normalized.includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchTerm]);

  const featuredPost = filteredPosts[0];
  const cardPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <section className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h1 className="blog-heading-1 mb-2">Our Latest Blog Posts</h1>
          </motion.div>

          {!isLoading && !isError && posts.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-11 rounded-md border border-input bg-background px-4 text-sm text-foreground max-w-[220px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Articles' : category}
                  </option>
                ))}
              </select>
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search for blogs here..."
                className="md:max-w-[340px]"
              />
            </div>
          )}

          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-6 h-64 animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Unable to load blog posts</h2>
              <p className="text-muted-foreground mb-6">
                {error instanceof Error ? error.message : 'Please check your Supabase setup and try again.'}
              </p>
              <Button onClick={() => refetch()} className="gradient-primary text-primary-foreground">
                Retry
              </Button>
            </Card>
          )}

          {!isLoading && !isError && filteredPosts.length === 0 && (
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">No matching posts</h2>
              <p className="text-muted-foreground">
                Try changing category or search term.
              </p>
            </Card>
          )}

          {!isLoading && !isError && featuredPost && (
            <div className="space-y-8">
              <Card className="overflow-hidden border">
                <div className="grid lg:grid-cols-2 gap-0">
                  <Link to={`/blog/${featuredPost.slug}`} className="block">
                    {featuredPost.coverImage ? (
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className="w-full h-full min-h-[280px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[280px] bg-muted" />
                    )}
                  </Link>
                  <div className="p-6 lg:p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      {featuredPost.tags[0] && <Badge variant="secondary">{featuredPost.tags[0]}</Badge>}
                      <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                        <Link to={`/blog/${featuredPost.slug}`} className="hover:text-primary transition-colors">
                          {featuredPost.title}
                        </Link>
                      </h2>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-8">
                      <p>{formatDate(featuredPost.publishedAt)}</p>
                      <p>{BLOG_AUTHOR_NAME}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {cardPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cardPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                    >
                      <Card className="h-full border hover:border-primary/40 transition-all duration-300 hover:shadow-md overflow-hidden">
                        {post.coverImage && (
                          <img src={post.coverImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
                        )}
                        <CardHeader>
                          {post.tags[0] && <Badge variant="secondary" className="w-fit">{post.tags[0]}</Badge>}
                          <CardTitle className="text-xl leading-tight mt-2">
                            <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                              {post.title}
                            </Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <p>{formatDate(post.publishedAt)}</p>
                            <p>{BLOG_AUTHOR_NAME}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
