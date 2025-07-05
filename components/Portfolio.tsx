'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Tag, ArrowRight, Briefcase, User, Clock } from 'lucide-react';

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

// Fallback Portfolio Data mit echten Pexels-Bildern
const fallbackPortfolio: WordPressPortfolio[] = [
  {
    id: 1,
    title: { rendered: 'KI-gestützte Strategieberatung für Fintech-Startup' },
    excerpt: { rendered: 'Entwicklung einer umfassenden Digitalisierungsstrategie mit KI-Integration für ein aufstrebendes Fintech-Unternehmen. Implementierung von Machine Learning-Algorithmen zur Risikobewertung und Automatisierung von Geschäftsprozessen.' },
    content: { rendered: '' },
    date: '2024-01-15',
    link: '#',
    featured_media: 0,
    type: 'portfolio',
    acf: {
      client_name: 'FinanceFlow GmbH',
      project_type: 'Strategieberatung',
      technologies: 'Machine Learning, Python, React, AWS',
      completion_date: '2024-01-15'
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt_text: 'Fintech Strategy Meeting'
      }]
    }
  },
  {
    id: 2,
    title: { rendered: 'Leadership Development Programm für Tech-Konzern' },
    excerpt: { rendered: 'Maßgeschneidertes Führungskräfte-Entwicklungsprogramm mit Fokus auf digitale Transformation und agile Methoden. Training von 50+ Führungskräften in modernen Leadership-Techniken.' },
    content: { rendered: '' },
    date: '2023-12-10',
    link: '#',
    featured_media: 0,
    type: 'portfolio',
    acf: {
      client_name: 'TechGlobal AG',
      project_type: 'Leadership Development',
      technologies: 'Coaching, Workshops, Digital Tools',
      completion_date: '2023-12-10'
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt_text: 'Leadership Workshop'
      }]
    }
  },
  {
    id: 3,
    title: { rendered: 'Prozessoptimierung durch KI-Automatisierung' },
    excerpt: { rendered: 'Implementierung intelligenter Automatisierungslösungen zur Steigerung der Effizienz in der Produktion. 40% Reduktion der Bearbeitungszeit durch RPA und Machine Learning.' },
    content: { rendered: '' },
    date: '2023-11-20',
    link: '#',
    featured_media: 0,
    type: 'portfolio',
    acf: {
      client_name: 'ManufacturePro',
      project_type: 'Process Optimization',
      technologies: 'RPA, AI/ML, IoT, Dashboard',
      completion_date: '2023-11-20'
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt_text: 'Industrial Automation'
      }]
    }
  },
  {
    id: 4,
    title: { rendered: 'Digital Transformation Roadmap für Mittelstand' },
    excerpt: { rendered: 'Entwicklung einer 3-Jahres-Roadmap für die digitale Transformation eines traditionellen Mittelstandsunternehmens. Cloud-Migration und Digitalisierung aller Geschäftsprozesse.' },
    content: { rendered: '' },
    date: '2023-10-05',
    link: '#',
    featured_media: 0,
    type: 'portfolio',
    acf: {
      client_name: 'Tradition & Innovation GmbH',
      project_type: 'Digital Transformation',
      technologies: 'Cloud Migration, ERP, CRM, Analytics',
      completion_date: '2023-10-05'
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt_text: 'Digital Transformation Planning'
      }]
    }
  },
  {
    id: 5,
    title: { rendered: 'KI-basierte Marktanalyse für E-Commerce' },
    excerpt: { rendered: 'Implementierung fortschrittlicher KI-Algorithmen zur Marktanalyse und Kundenverhalten-Vorhersage. 25% Steigerung der Conversion-Rate durch personalisierte Empfehlungen.' },
    content: { rendered: '' },
    date: '2023-09-15',
    link: '#',
    featured_media: 0,
    type: 'portfolio',
    acf: {
      client_name: 'ShopSmart Online',
      project_type: 'Market Analysis',
      technologies: 'TensorFlow, BigQuery, Tableau, API',
      completion_date: '2023-09-15'
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt_text: 'E-Commerce Analytics Dashboard'
      }]
    }
  },
  {
    id: 6,
    title: { rendered: 'Agile Transformation für Softwareunternehmen' },
    excerpt: { rendered: 'Begleitung bei der Umstellung auf agile Arbeitsweisen und Implementierung von Scrum-Prozessen. Schulung von 8 Teams und Einführung moderner Development-Practices.' },
    content: { rendered: '' },
    date: '2023-08-30',
    link: '#',
    featured_media: 0,
    type: 'portfolio',
    acf: {
      client_name: 'CodeCraft Solutions',
      project_type: 'Agile Transformation',
      technologies: 'Scrum, Kanban, Jira, Confluence',
      completion_date: '2023-08-30'
    },
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt_text: 'Agile Team Meeting'
      }]
    }
  }
];

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<WordPressPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Versuche verschiedene WordPress-Endpoints
        const endpoints = [
          'https://cockpit4me.de/wp-json/wp/v2/portfolio?_embed&per_page=6&orderby=date&order=desc',
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=6&categories=portfolio&orderby=date&order=desc',
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=6&tags=portfolio&orderby=date&order=desc'
        ];

        let portfolioData: WordPressPortfolio[] = [];
        let success = false;

        for (const endpoint of endpoints) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(endpoint, {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data) && data.length > 0) {
                portfolioData = data;
                success = true;
                break;
              }
            }
          } catch (endpointError) {
            console.log(`Endpoint ${endpoint} failed:`, endpointError);
            continue;
          }
        }

        if (success && portfolioData.length > 0) {
          setPortfolioItems(portfolioData);
          setUsingFallback(false);
        } else {
          // Verwende Fallback-Daten wenn WordPress nicht erreichbar ist
          setPortfolioItems(fallbackPortfolio);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error('Portfolio fetch error:', err);
        // Verwende Fallback-Daten bei Fehlern
        setPortfolioItems(fallbackPortfolio);
        setUsingFallback(true);
        setError('WordPress nicht erreichbar - Demo-Daten werden angezeigt');
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
    if (typeof window === 'undefined') return html;
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

  const getProjectTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Strategieberatung': 'bg-cockpit-violet/10 text-cockpit-violet border-cockpit-violet/20',
      'Leadership Development': 'bg-cockpit-blue-light/10 text-cockpit-blue-light border-cockpit-blue-light/20',
      'Process Optimization': 'bg-cockpit-turquoise/10 text-cockpit-turquoise border-cockpit-turquoise/20',
      'Digital Transformation': 'bg-cockpit-pink/10 text-cockpit-pink border-cockpit-pink/20',
      'Market Analysis': 'bg-cockpit-lime/10 text-cockpit-teal border-cockpit-lime/20',
      'Agile Transformation': 'bg-cockpit-orange/10 text-orange-600 border-cockpit-orange/20'
    };
    return colors[type] || 'bg-gray-100 text-gray-600 border-gray-200';
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
          {usingFallback && (
            <div className="mt-4">
              <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">
                Demo-Modus: Beispiel-Projekte werden angezeigt
              </Badge>
            </div>
          )}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {portfolioItems.map((item) => {
            const tags = getTags(item);
            const featuredImage = getFeaturedImage(item);
            const projectType = item.acf?.project_type || 'Projekt';

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
                        // Fallback wenn Bild nicht lädt
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
                        href={usingFallback ? '#' : item.link} 
                        target={usingFallback ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                        onClick={usingFallback ? (e) => e.preventDefault() : undefined}
                      >
                        <span>Details</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>

                    {/* Project URL */}
                    {item.acf?.project_url && !usingFallback && (
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