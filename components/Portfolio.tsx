'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Tag, ArrowRight, Briefcase, User, Clock, AlertCircle } from 'lucide-react';

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
  type?: string;
  acf?: {
    project_url?: string;
    client_name?: string;
    project_type?: string;
    technologies?: string;
    completion_date?: string;
    project_description?: string;
    project_status?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          medium?: {
            source_url: string;
          };
          large?: {
            source_url: string;
          };
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      taxonomy: string;
      slug: string;
    }>>;
  };
}

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<WordPressPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'fallback'>('connecting');

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setConnectionStatus('connecting');

      try {
        // Erweiterte Liste von möglichen WordPress-Endpoints
        const endpoints = [
          // Custom Post Type Portfolio
          'https://cockpit4me.de/wp-json/wp/v2/portfolio?_embed&per_page=12&orderby=date&order=desc',
          'https://cockpit4me.de/wp-json/wp/v2/portfolio?_embed&per_page=12&orderby=menu_order&order=asc',
          
          // Posts mit Portfolio-Kategorie
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=12&categories=portfolio&orderby=date&order=desc',
          
          // Posts mit Portfolio-Tag
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=12&tags=portfolio&orderby=date&order=desc',
          
          // Suche nach Portfolio-Posts
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=12&search=portfolio&orderby=relevance&order=desc',
          
          // Alle Posts durchsuchen (als letzter Fallback)
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=12&orderby=date&order=desc'
        ];

        let portfolioData: WordPressPortfolio[] = [];
        let success = false;
        let lastError: string = '';

        for (const endpoint of endpoints) {
          try {
            console.log(`Versuche Portfolio-Daten von: ${endpoint}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 Sekunden Timeout

            const response = await fetch(endpoint, {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'cockpit4me-frontend/1.0'
              },
              mode: 'cors',
              cache: 'no-cache'
            });

            clearTimeout(timeoutId);

            console.log(`Response Status: ${response.status} für ${endpoint}`);

            if (response.ok) {
              const data = await response.json();
              console.log(`Erhaltene Daten:`, data);

              if (Array.isArray(data) && data.length > 0) {
                // Filtere Portfolio-relevante Posts
                const filteredData = data.filter((item: WordPressPortfolio) => {
                  // Prüfe verschiedene Kriterien für Portfolio-Posts
                  const isPortfolioType = item.type === 'portfolio';
                  const hasPortfolioACF = item.acf?.project_url || item.acf?.client_name || item.acf?.project_type;
                  const hasPortfolioContent = item.title.rendered.toLowerCase().includes('projekt') ||
                                            item.excerpt.rendered.toLowerCase().includes('projekt') ||
                                            item.excerpt.rendered.toLowerCase().includes('client') ||
                                            item.excerpt.rendered.toLowerCase().includes('kunde');
                  
                  return isPortfolioType || hasPortfolioACF || hasPortfolioContent;
                });

                if (filteredData.length > 0) {
                  portfolioData = filteredData;
                  success = true;
                  setConnectionStatus('connected');
                  console.log(`✅ Portfolio-Daten erfolgreich geladen: ${filteredData.length} Projekte`);
                  break;
                } else if (data.length > 0) {
                  // Verwende alle Posts als Fallback, aber markiere sie entsprechend
                  portfolioData = data.slice(0, 6).map((item: any) => ({
                    ...item,
                    acf: {
                      ...item.acf,
                      project_type: 'Projekt',
                      client_name: 'cockpit4me'
                    }
                  }));
                  success = true;
                  setConnectionStatus('connected');
                  console.log(`✅ Allgemeine Posts als Portfolio verwendet: ${portfolioData.length} Einträge`);
                  break;
                }
              }
            } else {
              lastError = `HTTP ${response.status}: ${response.statusText}`;
              console.log(`❌ Endpoint fehlgeschlagen: ${lastError}`);
            }
          } catch (endpointError) {
            lastError = endpointError instanceof Error ? endpointError.message : 'Unbekannter Fehler';
            console.log(`❌ Endpoint-Fehler für ${endpoint}:`, lastError);
            continue;
          }
        }

        if (success && portfolioData.length > 0) {
          setPortfolioItems(portfolioData);
          setError(null);
        } else {
          throw new Error(`Keine Portfolio-Daten gefunden. Letzter Fehler: ${lastError}`);
        }

      } catch (err) {
        console.error('❌ Portfolio-Laden fehlgeschlagen:', err);
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Laden der Portfolio-Daten');
        setConnectionStatus('fallback');
        
        // Zeige leere Sektion statt Fallback-Daten
        setPortfolioItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Datum unbekannt';
    }
  };

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } catch {
      return html;
    }
  };

  const getTags = (item: WordPressPortfolio) => {
    try {
      if (!item._embedded?.['wp:term']) return [];
      // Suche nach Tags (normalerweise Index 1) oder Categories (Index 0)
      const terms = item._embedded['wp:term'];
      for (const termGroup of terms) {
        if (Array.isArray(termGroup)) {
          const tags = termGroup.filter(term => term.taxonomy === 'post_tag' || term.taxonomy === 'portfolio_tag');
          if (tags.length > 0) return tags;
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const getCategories = (item: WordPressPortfolio) => {
    try {
      if (!item._embedded?.['wp:term']) return [];
      const terms = item._embedded['wp:term'];
      for (const termGroup of terms) {
        if (Array.isArray(termGroup)) {
          const categories = termGroup.filter(term => term.taxonomy === 'category' || term.taxonomy === 'portfolio_category');
          if (categories.length > 0) return categories;
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const getFeaturedImage = (item: WordPressPortfolio) => {
    try {
      const media = item._embedded?.['wp:featuredmedia']?.[0];
      if (!media) return null;
      
      // Versuche verschiedene Bildgrößen
      const sizes = media.media_details?.sizes;
      if (sizes?.large?.source_url) return sizes.large.source_url;
      if (sizes?.medium?.source_url) return sizes.medium.source_url;
      
      return media.source_url;
    } catch {
      return null;
    }
  };

  const getProjectTypeColor = (type: string) => {
    const normalizedType = type.toLowerCase();
    const colors: Record<string, string> = {
      'strategieberatung': 'bg-cockpit-violet/10 text-cockpit-violet border-cockpit-violet/20',
      'strategy': 'bg-cockpit-violet/10 text-cockpit-violet border-cockpit-violet/20',
      'leadership': 'bg-cockpit-blue-light/10 text-cockpit-blue-light border-cockpit-blue-light/20',
      'führung': 'bg-cockpit-blue-light/10 text-cockpit-blue-light border-cockpit-blue-light/20',
      'optimization': 'bg-cockpit-turquoise/10 text-cockpit-turquoise border-cockpit-turquoise/20',
      'optimierung': 'bg-cockpit-turquoise/10 text-cockpit-turquoise border-cockpit-turquoise/20',
      'transformation': 'bg-cockpit-pink/10 text-cockpit-pink border-cockpit-pink/20',
      'digital': 'bg-cockpit-pink/10 text-cockpit-pink border-cockpit-pink/20',
      'analysis': 'bg-cockpit-lime/10 text-cockpit-teal border-cockpit-lime/20',
      'analyse': 'bg-cockpit-lime/10 text-cockpit-teal border-cockpit-lime/20',
      'agile': 'bg-cockpit-orange/10 text-orange-600 border-cockpit-orange/20',
      'projekt': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    
    for (const [key, value] of Object.entries(colors)) {
      if (normalizedType.includes(key)) return value;
    }
    
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  // Loading State
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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Entdecken Sie unsere erfolgreichen Projekte und Lösungen für 
              Unternehmen verschiedener Branchen.
            </p>
            <div className="flex items-center justify-center space-x-2 text-cockpit-turquoise">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cockpit-turquoise"></div>
              <span className="text-sm">Lade Portfolio-Daten von WordPress...</span>
            </div>
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

  // Error State - zeige leere Sektion
  if (error || portfolioItems.length === 0) {
    return (
      <section className="py-20 sm:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Unser{' '}
              <span className="bg-gradient-to-r from-cockpit-turquoise to-cockpit-lime bg-clip-text text-transparent">
                Portfolio
              </span>
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-800">Portfolio wird vorbereitet</h3>
                </div>
                <p className="text-amber-700 mb-4">
                  Unsere Portfolio-Projekte werden gerade in WordPress eingerichtet. 
                  Besuchen Sie unsere Hauptwebsite für aktuelle Referenzen.
                </p>
                <Button 
                  asChild
                  className="bg-cockpit-gradient hover:opacity-90 text-white"
                >
                  <a 
                    href="https://cockpit4me.de/portfolio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2"
                  >
                    <span>Portfolio auf cockpit4me.de ansehen</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Success State - zeige echte Portfolio-Daten
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
          
          {/* Connection Status */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">
              Live-Daten von WordPress ({portfolioItems.length} Projekte)
            </span>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {portfolioItems.map((item) => {
            const tags = getTags(item);
            const categories = getCategories(item);
            const featuredImage = getFeaturedImage(item);
            const projectType = item.acf?.project_type || categories[0]?.name || 'Projekt';

            return (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50/50 overflow-hidden">
                {/* Featured Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-cockpit-turquoise/10 to-cockpit-lime/10">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt={stripHtml(item.title.rendered)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cockpit-turquoise/20 to-cockpit-lime/20">
                              <div class="text-center">
                                <div class="w-16 h-16 mx-auto mb-4 bg-cockpit-turquoise/20 rounded-2xl flex items-center justify-center">
                                  <span class="text-2xl font-bold text-cockpit-turquoise/60">${stripHtml(item.title.rendered).charAt(0)}</span>
                                </div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cockpit-turquoise/20 to-cockpit-lime/20">
                      <div className="text-center">
                        <Briefcase className="w-16 h-16 text-cockpit-turquoise/60 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-cockpit-turquoise/40">
                          {stripHtml(item.title.rendered).charAt(0)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* Project Type Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getProjectTypeColor(projectType)} border`}>
                      {projectType}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-cockpit-turquoise transition-colors">
                    {stripHtml(item.title.rendered)}
                  </CardTitle>

                  {/* Client & Date */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                    {item.acf?.client_name && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{item.acf.client_name}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {stripHtml(item.excerpt.rendered) || stripHtml(item.content.rendered).substring(0, 150) + '...'}
                  </CardDescription>

                  {/* Technologies */}
                  {item.acf?.technologies && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {item.acf.technologies.split(',').slice(0, 3).map((tech, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs border-cockpit-lime/30 text-cockpit-teal bg-cockpit-lime/5"
                          >
                            {tech.trim()}
                          </Badge>
                        ))}
                        {item.acf.technologies.split(',').length > 3 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs border-gray-300 text-gray-500 bg-gray-50"
                          >
                            +{item.acf.technologies.split(',').length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Completion Date */}
                  {item.acf?.completion_date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Abgeschlossen: {formatDate(item.acf.completion_date)}</span>
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