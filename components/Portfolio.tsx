'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Tag, ArrowRight } from 'lucide-react';

interface WordPressPortfolio {
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
  featured_media: number;
  type: string;
  acf?: {
    project_url?: string;
    client_name?: string;
    project_type?: string;
    technologies?: string;
    completion_date?: string;
  };
  _embedded?: {
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

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<WordPressPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Verwende den korrekten Array-Parameter für Portfolio-Posts
        const response = await fetch(
          'https://cockpit4me.de/wp-json/wp/v2/posts?type[]=post&type[]=portfolio&_embed&per_page=6&orderby=date&order=desc'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio items');
        }
        
        const data = await response.json();
        // Filtere nur Portfolio-Items (falls beide Types zurückkommen)
        const portfolioData = data.filter((item: WordPressPortfolio) => 
          item.type === 'portfolio' || 
          // Fallback: wenn type nicht verfügbar ist, prüfe andere Indikatoren
          item.acf?.project_url || 
          item.acf?.client_name
        );
        
        setPortfolioItems(portfolioData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
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

  const getTags = (item: WordPressPortfolio) => {
    if (!item._embedded?.['wp:term']) return [];
    return item._embedded['wp:term'][1]?.filter(term => term.taxonomy === 'post_tag') || [];
  };

  const getFeaturedImage = (item: WordPressPortfolio) => {
    return item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  };

  if (loading) {
    return (
      <section className="py-20 sm:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Unser{' '}
              <span className="bg-gradient-to-r from-cockpit-turquoise to-cockpit-lime bg-clip-text text-transparent">
                Portfolio
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
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
      <section className="py-20 sm:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Portfolio
          </h2>
          <p className="text-red-600 mb-8">
            Fehler beim Laden des Portfolios: {error}
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

  // Verstecke Sektion wenn keine Portfolio-Items vorhanden
  if (portfolioItems.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="py-20 sm:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Unser{' '}
            <span className="bg-gradient-to-r from-cockpit-turquoise to-cockpit-lime bg-clip-text text-transparent">
              Portfolio
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie unsere erfolgreichen Projekte und Lösungen für 
            Unternehmen verschiedener Branchen.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {portfolioItems.map((item) => {
            const tags = getTags(item);
            const featuredImage = getFeaturedImage(item);

            return (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50/50 overflow-hidden">
                {/* Featured Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-cockpit-turquoise/10 to-cockpit-lime/10">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt={stripHtml(item.title.rendered)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cockpit-turquoise/20 to-cockpit-lime/20">
                      <div className="text-6xl font-bold text-cockpit-turquoise/30">
                        {stripHtml(item.title.rendered).charAt(0)}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* Project Type Badge */}
                  {item.acf?.project_type && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-cockpit-turquoise text-white">
                        {item.acf.project_type}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-cockpit-turquoise transition-colors">
                    {stripHtml(item.title.rendered)}
                  </CardTitle>

                  {/* Client & Date */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                    {item.acf?.client_name && (
                      <span className="font-medium">{item.acf.client_name}</span>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {stripHtml(item.excerpt.rendered)}
                  </CardDescription>

                  {/* Technologies */}
                  {item.acf?.technologies && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {item.acf.technologies.split(',').slice(0, 3).map((tech, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs border-cockpit-lime text-cockpit-teal"
                          >
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tags.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant="secondary" 
                          className="bg-cockpit-lime/10 text-cockpit-teal text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Button 
                      asChild
                      variant="ghost" 
                      className="p-0 h-auto text-cockpit-turquoise hover:text-cockpit-teal font-semibold group/btn"
                    >
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>

                    {/* Project URL */}
                    {item.acf?.project_url && (
                      <Button 
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-cockpit-turquoise text-cockpit-turquoise hover:bg-cockpit-turquoise hover:text-white"
                      >
                        <a 
                          href={item.acf.project_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Live</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-cockpit-turquoise/5 to-cockpit-lime/5 rounded-2xl p-8 sm:p-12 border border-cockpit-turquoise/10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ihr Projekt mit uns realisieren?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam Ihre Vision in die Realität umsetzen. 
              Kontaktieren Sie uns für eine unverbindliche Beratung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-cockpit-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold">
                Projekt besprechen
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-2 border-cockpit-turquoise text-cockpit-turquoise hover:bg-cockpit-turquoise hover:text-white px-8 py-4 text-lg font-semibold"
              >
                <a 
                  href="https://cockpit4me.de/portfolio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2"
                >
                  <span>Vollständiges Portfolio</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}