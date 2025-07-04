'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, ExternalLink } from 'lucide-react';

interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  link: string;
  author: number;
  categories: number[];
  tags: number[];
  featured_media: number;
  _embedded?: {
    author?: Array<{
      name: string;
      avatar_urls: {
        '96': string;
      };
    }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      taxonomy: string;
    }>>;
  };
}

export default function Blog() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=6&orderby=date&order=desc'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getCategories = (post: WordPressPost) => {
    if (!post._embedded?.['wp:term']) return [];
    return post._embedded['wp:term'][0]?.filter(term => term.taxonomy === 'category') || [];
  };

  const getFeaturedImage = (post: WordPressPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  };

  const getAuthor = (post: WordPressPost) => {
    return post._embedded?.author?.[0]?.name || 'cockpit4me';
  };

  if (loading) {
    return (
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Aktuelle{' '}
              <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
                Blog-Beiträge
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Blog-Beiträge
          </h2>
          <p className="text-red-600 mb-8">
            Fehler beim Laden der Blog-Beiträge: {error}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-cockpit-gradient hover:opacity-90 text-white"
          >
            Erneut versuchen
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Aktuelle{' '}
            <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
              Blog-Beiträge
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bleiben Sie auf dem Laufenden mit unseren neuesten Erkenntnissen zu 
            Strategie, KI und Leadership.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post) => {
            const categories = getCategories(post);
            const featuredImage = getFeaturedImage(post);
            const author = getAuthor(post);

            return (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50/50 overflow-hidden">
                {/* Featured Image */}
                {featuredImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={featuredImage}
                      alt={post.title.rendered}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <CardHeader className="pb-3">
                  {/* Categories */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {categories.slice(0, 2).map((category) => (
                        <Badge 
                          key={category.id} 
                          variant="secondary" 
                          className="bg-cockpit-violet/10 text-cockpit-violet hover:bg-cockpit-violet hover:text-white text-xs"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-cockpit-violet transition-colors">
                    {stripHtml(post.title.rendered)}
                  </CardTitle>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{author}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {stripHtml(post.excerpt.rendered)}
                  </CardDescription>

                  <Button 
                    asChild
                    variant="ghost" 
                    className="p-0 h-auto text-cockpit-violet hover:text-cockpit-blue-light font-semibold group/btn"
                  >
                    <a 
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <span>Weiterlesen</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA to Blog */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-cockpit-violet/5 to-cockpit-blue-light/5 rounded-2xl p-8 sm:p-12 border border-cockpit-violet/10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Mehr Insights entdecken
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Besuchen Sie unseren Blog für weitere Artikel zu Strategie, 
              KI-Integration und modernem Leadership.
            </p>
            <Button 
              asChild
              className="bg-cockpit-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold"
            >
              <a 
                href="https://cockpit4me.de/blog" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2"
              >
                <span>Zum Blog</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}