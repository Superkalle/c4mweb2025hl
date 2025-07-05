'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Tag, ArrowRight, Briefcase, User, Clock, AlertCircle, Users, Target, TrendingUp } from 'lucide-react';

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
    project_duration?: string;
    team_size?: string;
    industry?: string;
    challenge?: string;
    solution?: string;
    results?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          medium?: { source_url: string; };
          large?: { source_url: string; };
          full?: { source_url: string; };
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

export default function BeraterPortfolio() {
  const [portfolioItems, setPortfolioItems] = useState<WordPressPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchBeraterPortfolio = async () => {
      setLoading(true);
      
      try {
        // Verschiedene Endpoints für Berater-Portfolio versuchen
        const endpoints = [
          // Portfolio mit Berater-Kategorie
          'https://cockpit4me.de/wp-json/wp/v2/portfolio?_embed&per_page=50&portfolio_category=berater',
          'https://cockpit4me.de/wp-json/wp/v2/portfolio?_embed&per_page=50&portfolio_category=beratung',
          'https://cockpit4me.de/wp-json/wp/v2/portfolio?_embed&per_page=50&portfolio_category=consulting',
          
          // Posts mit Berater-Kategorie
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&categories=berater',
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&categories=beratung',
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&categories=consulting',
          
          // Suche nach Berater-relevanten Inhalten
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&search=berater',
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&search=beratung',
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&search=consulting',
          
          // Alle Portfolio-Items als Fallback
          'https://cockpit4me.de/wp-json/wp/v2/portfolio?_embed&per_page=50',
          'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&post_type=portfolio'
        ];

        let beraterData: WordPressPortfolio[] = [];
        let success = false;

        for (const endpoint of endpoints) {
          try {
            console.log(`Versuche Berater-Portfolio von: ${endpoint}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(endpoint, {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              mode: 'cors',
              cache: 'no-cache'
            });

            clearTimeout(timeoutId);

            if (response.ok) {
              const data = await response.json();
              
              if (Array.isArray(data) && data.length > 0) {
                // Filtere Berater-relevante Projekte
                const filteredData = data.filter((item: WordPressPortfolio) => {
                  const title = item.title.rendered.toLowerCase();
                  const excerpt = item.excerpt.rendered.toLowerCase();
                  const content = item.content.rendered.toLowerCase();
                  
                  // Prüfe auf Berater-relevante Keywords
                  const beraterKeywords = [
                    'berater', 'beratung', 'consulting', 'consultant',
                    'strategie', 'strategy', 'leadership', 'führung',
                    'transformation', 'change', 'management',
                    'prozess', 'process', 'optimierung', 'optimization'
                  ];
                  
                  const hasKeyword = beraterKeywords.some(keyword => 
                    title.includes(keyword) || 
                    excerpt.includes(keyword) || 
                    content.includes(keyword)
                  );
                  
                  // Prüfe Portfolio-Kategorien
                  const categories = getCategories(item);
                  const hasBeraterCategory = categories.some(cat => 
                    ['berater', 'beratung', 'consulting', 'strategy', 'leadership'].includes(cat.slug)
                  );
                  
                  // Prüfe ACF-Felder
                  const hasRelevantACF = item.acf?.project_type && 
                    ['beratung', 'consulting', 'strategy', 'leadership', 'transformation'].some(type =>
                      item.acf!.project_type!.toLowerCase().includes(type)
                    );
                  
                  return hasKeyword || hasBeraterCategory || hasRelevantACF;
                });

                if (filteredData.length > 0) {
                  beraterData = filteredData;
                  success = true;
                  console.log(`✅ Berater-Portfolio geladen: ${filteredData.length} Projekte`);
                  break;
                }
              }
            }
          } catch (endpointError) {
            console.log(`❌ Endpoint fehlgeschlagen:`, endpointError);
            continue;
          }
        }

        if (success && beraterData.length > 0) {
          setPortfolioItems(beraterData);
          
          // Extrahiere verfügbare Skills
          const skills = new Set<string>();
          beraterData.forEach(item => {
            const portfolioSkills = getSkills(item);
            portfolioSkills.forEach(skill => skills.add(skill));
          });
          setAvailableSkills(['all', ...Array.from(skills)]);
          
          setError(null);
        } else {
          throw new Error('Keine Berater-Portfolio-Daten gefunden');
        }

      } catch (err) {
        console.error('❌ Berater-Portfolio-Laden fehlgeschlagen:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Berater-Portfolio-Daten');
        setPortfolioItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBeraterPortfolio();
  }, []);

  const getCategories = (item: WordPressPortfolio) => {
    try {
      if (!item._embedded?.['wp:term']) return [];
      const terms = item._embedded['wp:term'];
      for (const termGroup of terms) {
        if (Array.isArray(termGroup)) {
          const categories = termGroup.filter(term => 
            term.taxonomy === 'category' || 
            term.taxonomy === 'portfolio_category'
          );
          if (categories.length > 0) return categories;
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const getSkills = (item: WordPressPortfolio) => {
    try {
      if (!item._embedded?.['wp:term']) return [];
      const terms = item._embedded['wp:term'];
      for (const termGroup of terms) {
        if (Array.isArray(termGroup)) {
          const skills = termGroup.filter(term => 
            term.taxonomy === 'portfolio_skill' || 
            term.taxonomy === 'skill'
          );
          if (skills.length > 0) return skills.map(skill => skill.name);
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const getTags = (item: WordPressPortfolio) => {
    try {
      if (!item._embedded?.['wp:term']) return [];
      const terms = item._embedded['wp:term'];
      for (const termGroup of terms) {
        if (Array.isArray(termGroup)) {
          const tags = termGroup.filter(term => 
            term.taxonomy === 'post_tag' || 
            term.taxonomy === 'portfolio_tag'
          );
          if (tags.length > 0) return tags;
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
      
      const sizes = media.media_details?.sizes;
      if (sizes?.large?.source_url) return sizes.large.source_url;
      if (sizes?.medium?.source_url) return sizes.medium.source_url;
      if (sizes?.full?.source_url) return sizes.full.source_url;
      
      return media.source_url;
    } catch {
      return null;
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

  const getProjectTypeColor = (type: string) => {
    const normalizedType = type.toLowerCase();
    const colors: Record<string, string> = {
      'strategieberatung': 'bg-cockpit-violet/10 text-cockpit-violet border-cockpit-violet/20',
      'strategy': 'bg-cockpit-violet/10 text-cockpit-violet border-cockpit-violet/20',
      'leadership': 'bg-cockpit-blue-light/10 text-cockpit-blue-light border-cockpit-blue-light/20',
      'führung': 'bg-cockpit-blue-light/10 text-cockpit-blue-light border-cockpit-blue-light/20',
      'transformation': 'bg-cockpit-pink/10 text-cockpit-pink border-cockpit-pink/20',
      'change': 'bg-cockpit-pink/10 text-cockpit-pink border-cockpit-pink/20',
      'prozessoptimierung': 'bg-cockpit-turquoise/10 text-cockpit-turquoise border-cockpit-turquoise/20',
      'process': 'bg-cockpit-turquoise/10 text-cockpit-turquoise border-cockpit-turquoise/20',
      'beratung': 'bg-cockpit-lime/10 text-cockpit-teal border-cockpit-lime/20',
      'consulting': 'bg-cockpit-lime/10 text-cockpit-teal border-cockpit-lime/20'
    };
    
    for (const [key, value] of Object.entries(colors)) {
      if (normalizedType.includes(key)) return value;
    }
    
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  // Filter Portfolio-Items basierend auf ausgewähltem Skill
  const filteredItems = selectedSkill === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => getSkills(item).includes(selectedSkill));

  // Loading State
  if (loading) {
    return (
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cockpit-violet/10 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-cockpit-violet" />
              <span className="text-sm font-medium text-cockpit-violet">Berater Portfolio</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unsere{' '}
              <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
                Beratungsprojekte
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Entdecken Sie unsere erfolgreichen Strategieberatungs- und Leadership-Projekte. 
              Von der Analyse bis zur Umsetzung - hier sehen Sie, wie wir Unternehmen transformieren.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-cockpit-violet">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cockpit-violet"></div>
              <span className="text-sm">Lade Berater-Portfolio von WordPress...</span>
            </div>
          </div>

          {/* Loading Skeleton */}
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

  // Error State
  if (error || portfolioItems.length === 0) {
    return (
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cockpit-violet/10 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-cockpit-violet" />
              <span className="text-sm font-medium text-cockpit-violet">Berater Portfolio</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unsere{' '}
              <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
                Beratungsprojekte
              </span>
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-semibold text-amber-800">Portfolio wird aufgebaut</h3>
                </div>
                <p className="text-amber-700 mb-6 leading-relaxed">
                  Unser Berater-Portfolio wird gerade in WordPress eingerichtet. 
                  Besuchen Sie unsere Hauptwebsite für aktuelle Referenzen und Fallstudien.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                      <span>Portfolio ansehen</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-cockpit-violet text-cockpit-violet hover:bg-cockpit-violet hover:text-white"
                  >
                    <a 
                      href="https://cockpit4me.de/kontakt" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2"
                    >
                      <span>Beratung anfragen</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Success State
  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-cockpit-violet/10 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-cockpit-violet" />
            <span className="text-sm font-medium text-cockpit-violet">Berater Portfolio</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Unsere{' '}
            <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
              Beratungsprojekte
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Entdecken Sie unsere erfolgreichen Strategieberatungs- und Leadership-Projekte. 
            Von der Analyse bis zur Umsetzung - hier sehen Sie, wie wir Unternehmen transformieren.
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">
              Live-Daten von WordPress ({portfolioItems.length} Beratungsprojekte)
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-violet mb-2">{portfolioItems.length}+</div>
              <div className="text-gray-600">Beratungsprojekte</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-blue-light mb-2">{availableSkills.length - 1}+</div>
              <div className="text-gray-600">Beratungsfelder</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-turquoise mb-2">100%</div>
              <div className="text-gray-600">Erfolgsquote</div>
            </div>
          </div>
        </div>

        {/* Skill Filter */}
        {availableSkills.length > 1 && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nach Beratungsfeld filtern:</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {availableSkills.map((skill) => (
                  <Button
                    key={skill}
                    variant={selectedSkill === skill ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSkill(skill)}
                    className={selectedSkill === skill 
                      ? "bg-cockpit-violet text-white" 
                      : "border-cockpit-violet text-cockpit-violet hover:bg-cockpit-violet hover:text-white"
                    }
                  >
                    {skill === 'all' ? 'Alle Projekte' : skill}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredItems.map((item) => {
            const tags = getTags(item);
            const skills = getSkills(item);
            const categories = getCategories(item);
            const featuredImage = getFeaturedImage(item);
            const projectType = item.acf?.project_type || categories[0]?.name || 'Beratungsprojekt';

            return (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50/50 overflow-hidden">
                {/* Featured Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-cockpit-violet/10 to-cockpit-blue-light/10">
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
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cockpit-violet/20 to-cockpit-blue-light/20">
                              <div class="text-center">
                                <div class="w-16 h-16 mx-auto mb-4 bg-cockpit-violet/20 rounded-2xl flex items-center justify-center">
                                  <span class="text-2xl font-bold text-cockpit-violet/60">${stripHtml(item.title.rendered).charAt(0)}</span>
                                </div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cockpit-violet/20 to-cockpit-blue-light/20">
                      <div className="text-center">
                        <Target className="w-16 h-16 text-cockpit-violet/60 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-cockpit-violet/40">
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
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-cockpit-violet transition-colors">
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

                  {/* Project Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    {item.acf?.industry && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Branche: {item.acf.industry}</span>
                      </div>
                    )}
                    {item.acf?.project_duration && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Dauer: {item.acf.project_duration}</span>
                      </div>
                    )}
                    {item.acf?.team_size && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Team: {item.acf.team_size}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {skills.slice(0, 3).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs border-cockpit-violet/30 text-cockpit-violet bg-cockpit-violet/5"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {skills.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs border-gray-300 text-gray-500 bg-gray-50"
                        >
                          +{skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tags.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant="secondary" 
                          className="bg-cockpit-blue-light/10 text-cockpit-blue-light text-xs"
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
                      className="p-0 h-auto text-cockpit-violet hover:text-cockpit-blue-light font-semibold group/btn"
                    >
                      <a 
                        href={item.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <span>Fallstudie lesen</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>

                    {/* Project URL */}
                    {item.acf?.project_url && (
                      <Button 
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-cockpit-violet text-cockpit-violet hover:bg-cockpit-violet hover:text-white"
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
          <div className="bg-gradient-to-r from-cockpit-violet/5 to-cockpit-blue-light/5 rounded-2xl p-8 sm:p-12 border border-cockpit-violet/10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ihr Beratungsprojekt mit uns starten?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam Ihre strategischen Herausforderungen analysieren 
              und maßgeschneiderte Lösungen entwickeln. Kontaktieren Sie uns für eine 
              unverbindliche Erstberatung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-cockpit-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold">
                Beratung anfragen
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-2 border-cockpit-violet text-cockpit-violet hover:bg-cockpit-violet hover:text-white px-8 py-4 text-lg font-semibold"
              >
                <a 
                  href="https://cockpit4me.de/kontakt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2"
                >
                  <span>Kontakt aufnehmen</span>
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