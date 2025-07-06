'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, ArrowRight, User, Mail, Phone, Linkedin, MapPin, AlertCircle, Users, Award, Briefcase, GraduationCap } from 'lucide-react';

interface WordPressBerater {
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
  categories: number[];
  type?: string;
  acf?: {
    berater_position?: string;
    berater_email?: string;
    berater_phone?: string;
    berater_linkedin?: string;
    berater_location?: string;
    berater_specialties?: string;
    berater_experience?: string;
    berater_education?: string;
    berater_certifications?: string;
    berater_languages?: string;
    berater_bio?: string;
    berater_projects?: string;
    berater_availability?: string;
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

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export default function BeraterPortfolio() {
  const [beraterTeam, setBeraterTeam] = useState<WordPressBerater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [foundCategories, setFoundCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchBeraterTeam = async () => {
      setLoading(true);
      
      try {
        console.log('🔍 Starte Berater-Suche...');
        setDebugInfo('Suche nach Berater-Kategorien...');
        
        // Schritt 1: Alle Kategorien laden
        const categoriesResponse = await fetch('https://cockpit4me.de/wp-json/wp/v2/categories?per_page=100', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          cache: 'no-cache'
        });
        
        if (!categoriesResponse.ok) {
          throw new Error(`Kategorien-Abruf fehlgeschlagen: ${categoriesResponse.status}`);
        }
        
        const allCategories: Category[] = await categoriesResponse.json();
        console.log('📋 Alle Kategorien:', allCategories.map(cat => `"${cat.name}" (${cat.slug}, ${cat.count} Posts)`));
        
        // Finde alle Berater-relevanten Kategorien
        const beraterCategories = allCategories.filter(cat => 
          cat.name.toLowerCase().includes('berater') ||
          cat.slug.includes('berater') ||
          cat.name.toLowerCase().includes('führung') ||
          cat.name.toLowerCase().includes('transformation') ||
          cat.name.toLowerCase().includes('team') ||
          cat.name.toLowerCase().includes('consultant')
        );
        
        console.log('🎯 Berater-relevante Kategorien gefunden:', beraterCategories);
        setFoundCategories(beraterCategories);
        setDebugInfo(`${beraterCategories.length} Berater-Kategorien gefunden: ${beraterCategories.map(c => c.name).join(', ')}`);
        
        if (beraterCategories.length === 0) {
          throw new Error('Keine Berater-Kategorien gefunden');
        }
        
        // Schritt 2: Posts aus allen Berater-Kategorien laden
        let allBeraterPosts: WordPressBerater[] = [];
        
        for (const category of beraterCategories) {
          try {
            console.log(`📦 Lade Posts aus Kategorie "${category.name}" (ID: ${category.id})...`);
            
            const postsResponse = await fetch(`https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&categories=${category.id}&orderby=date&order=desc`, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              mode: 'cors',
              cache: 'no-cache'
            });

            if (postsResponse.ok) {
              const posts = await postsResponse.json();
              console.log(`✅ ${posts.length} Posts aus "${category.name}" geladen`);
              
              if (Array.isArray(posts) && posts.length > 0) {
                // Füge Kategorie-Info zu jedem Post hinzu
                const postsWithCategory = posts.map((post: WordPressBerater) => ({
                  ...post,
                  sourceCategory: category.name
                }));
                allBeraterPosts = [...allBeraterPosts, ...postsWithCategory];
              }
            } else {
              console.log(`⚠️ Kategorie "${category.name}" konnte nicht geladen werden: ${postsResponse.status}`);
            }
          } catch (categoryError) {
            console.log(`❌ Fehler bei Kategorie "${category.name}":`, categoryError);
            continue;
          }
        }
        
        // Entferne Duplikate basierend auf Post-ID
        const uniquePosts = allBeraterPosts.filter((post, index, self) => 
          index === self.findIndex(p => p.id === post.id)
        );
        
        console.log(`🎉 Insgesamt ${uniquePosts.length} einzigartige Berater-Posts gefunden`);
        setDebugInfo(prev => prev + ` | ${uniquePosts.length} Posts geladen`);
        
        if (uniquePosts.length > 0) {
          setBeraterTeam(uniquePosts);
          setError(null);
        } else {
          // Fallback: Suche nach Posts mit "berater" im Titel oder Inhalt
          console.log('🔄 Fallback: Suche nach Posts mit "berater" im Inhalt...');
          
          const fallbackResponse = await fetch('https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=50&search=berater&orderby=relevance&order=desc', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            cache: 'no-cache'
          });
          
          if (fallbackResponse.ok) {
            const fallbackPosts = await fallbackResponse.json();
            console.log(`📦 ${fallbackPosts.length} Posts über Fallback-Suche gefunden`);
            
            if (fallbackPosts.length > 0) {
              setBeraterTeam(fallbackPosts);
              setDebugInfo(prev => prev + ` | Fallback: ${fallbackPosts.length} Posts`);
              setError(null);
            } else {
              throw new Error('Keine Berater-Posts gefunden (auch nicht über Fallback-Suche)');
            }
          } else {
            throw new Error('Keine Berater-Posts in den gefundenen Kategorien');
          }
        }

      } catch (err) {
        console.error('❌ Berater-Team-Laden fehlgeschlagen:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Berater-Team-Daten');
        setBeraterTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBeraterTeam();
  }, []);

  const getCategories = (item: WordPressBerater) => {
    try {
      if (!item._embedded?.['wp:term']) return [];
      const terms = item._embedded['wp:term'];
      for (const termGroup of terms) {
        if (Array.isArray(termGroup)) {
          const categories = termGroup.filter(term => 
            term.taxonomy === 'category'
          );
          if (categories.length > 0) return categories;
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const getTags = (item: WordPressBerater) => {
    try {
      if (!item._embedded?.['wp:term']) return [];
      const terms = item._embedded['wp:term'];
      for (const termGroup of terms) {
        if (Array.isArray(termGroup)) {
          const tags = termGroup.filter(term => 
            term.taxonomy === 'post_tag'
          );
          if (tags.length > 0) return tags;
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const getFeaturedImage = (item: WordPressBerater) => {
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

  const getSpecialtyColor = (specialty: string) => {
    const normalizedSpecialty = specialty.toLowerCase();
    const colors: Record<string, string> = {
      'strategieberatung': 'bg-cockpit-violet/10 text-cockpit-violet border-cockpit-violet/20',
      'strategy': 'bg-cockpit-violet/10 text-cockpit-violet border-cockpit-violet/20',
      'leadership': 'bg-cockpit-blue-light/10 text-cockpit-blue-light border-cockpit-blue-light/20',
      'führung': 'bg-cockpit-blue-light/10 text-cockpit-blue-light border-cockpit-blue-light/20',
      'transformation': 'bg-cockpit-pink/10 text-cockpit-pink border-cockpit-pink/20',
      'change': 'bg-cockpit-pink/10 text-cockpit-pink border-cockpit-pink/20',
      'prozess': 'bg-cockpit-turquoise/10 text-cockpit-turquoise border-cockpit-turquoise/20',
      'process': 'bg-cockpit-turquoise/10 text-cockpit-turquoise border-cockpit-turquoise/20',
      'digital': 'bg-cockpit-lime/10 text-cockpit-teal border-cockpit-lime/20',
      'innovation': 'bg-cockpit-orange/10 text-orange-600 border-cockpit-orange/20'
    };
    
    for (const [key, value] of Object.entries(colors)) {
      if (normalizedSpecialty.includes(key)) return value;
    }
    
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  // Loading State
  if (loading) {
    return (
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cockpit-violet/10 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-cockpit-violet" />
              <span className="text-sm font-medium text-cockpit-violet">Unser Team</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unsere{' '}
              <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
                Berater
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Lernen Sie unser erfahrenes Team von Strategieberatern und Leadership-Experten kennen. 
              Gemeinsam bringen wir Ihr Unternehmen auf die nächste Stufe.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-cockpit-violet">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cockpit-violet"></div>
              <span className="text-sm">Lade Berater-Team aus WordPress...</span>
            </div>
            
            {/* Debug Info während Loading */}
            {debugInfo && (
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 max-w-2xl mx-auto">
                <strong>Debug:</strong> {debugInfo}
              </div>
            )}
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
  if (error || beraterTeam.length === 0) {
    return (
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cockpit-violet/10 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-cockpit-violet" />
              <span className="text-sm font-medium text-cockpit-violet">Unser Team</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unsere{' '}
              <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
                Berater
              </span>
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-semibold text-amber-800">Berater-Profile werden eingerichtet</h3>
                </div>
                <p className="text-amber-700 mb-4 leading-relaxed">
                  Die Berater-Posts werden gerade in WordPress vorbereitet. 
                  Besuchen Sie unsere Hauptwebsite für aktuelle Team-Informationen.
                </p>
                
                {/* Debug Info */}
                {debugInfo && (
                  <div className="text-xs text-amber-600 bg-amber-100 rounded p-3 mb-4">
                    <strong>Debug-Info:</strong> {debugInfo}
                  </div>
                )}
                
                {/* Gefundene Kategorien anzeigen */}
                {foundCategories.length > 0 && (
                  <div className="text-xs text-amber-600 bg-amber-100 rounded p-3 mb-4">
                    <strong>Gefundene Berater-Kategorien:</strong>
                    <ul className="mt-1">
                      {foundCategories.map(cat => (
                        <li key={cat.id}>• "{cat.name}" ({cat.count} Posts)</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    className="bg-cockpit-gradient hover:opacity-90 text-white"
                  >
                    <a 
                      href="https://cockpit4me.de/team" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2"
                    >
                      <span>Team kennenlernen</span>
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
                      <span>Kontakt aufnehmen</span>
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

  // Success State - Zeige alle gefundenen Berater
  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-cockpit-violet/10 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-cockpit-violet" />
            <span className="text-sm font-medium text-cockpit-violet">Unser Team</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Unsere{' '}
            <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
              Berater
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Lernen Sie unser erfahrenes Team von Strategieberatern und Leadership-Experten kennen. 
            Gemeinsam bringen wir Ihr Unternehmen auf die nächste Stufe.
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">
              Live-Daten von WordPress ({beraterTeam.length} Berater-Posts)
            </span>
          </div>
          
          {/* Debug Info */}
          {debugInfo && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 max-w-2xl mx-auto mb-8">
              <strong>Debug:</strong> {debugInfo}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-violet mb-2">{beraterTeam.length}+</div>
              <div className="text-gray-600">Experten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-blue-light mb-2">{foundCategories.length}+</div>
              <div className="text-gray-600">Kategorien</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-turquoise mb-2">15+</div>
              <div className="text-gray-600">Jahre Erfahrung</div>
            </div>
          </div>
        </div>

        {/* Berater Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {beraterTeam.map((berater) => {
            const tags = getTags(berater);
            const categories = getCategories(berater);
            const featuredImage = getFeaturedImage(berater);
            const position = berater.acf?.berater_position || 'Senior Berater';
            const specialties = berater.acf?.berater_specialties?.split(',').map(s => s.trim()) || [];

            return (
              <Card key={berater.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50/50 overflow-hidden">
                {/* Profile Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-cockpit-violet/10 to-cockpit-blue-light/10">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt={stripHtml(berater.title.rendered)}
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
                                <div class="w-20 h-20 mx-auto mb-4 bg-cockpit-violet/20 rounded-full flex items-center justify-center">
                                  <span class="text-3xl font-bold text-cockpit-violet/60">${stripHtml(berater.title.rendered).charAt(0)}</span>
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
                        <User className="w-20 h-20 text-cockpit-violet/60 mx-auto mb-4" />
                        <div className="text-3xl font-bold text-cockpit-violet/40">
                          {stripHtml(berater.title.rendered).charAt(0)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* Position Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-800 border-0">
                      {position}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-cockpit-violet transition-colors">
                    {stripHtml(berater.title.rendered)}
                  </CardTitle>

                  {/* Contact Info */}
                  <div className="space-y-1 text-sm text-gray-500">
                    {berater.acf?.berater_email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{berater.acf.berater_email}</span>
                      </div>
                    )}
                    {berater.acf?.berater_location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{berater.acf.berater_location}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {berater.acf?.berater_bio || stripHtml(berater.excerpt.rendered) || stripHtml(berater.content.rendered).substring(0, 150) + '...'}
                  </CardDescription>

                  {/* Experience & Education */}
                  <div className="space-y-2 mb-4 text-sm">
                    {berater.acf?.berater_experience && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{berater.acf.berater_experience}</span>
                      </div>
                    )}
                    {berater.acf?.berater_education && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{berater.acf.berater_education}</span>
                      </div>
                    )}
                    {berater.acf?.berater_certifications && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>{berater.acf.berater_certifications}</span>
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {specialties.slice(0, 3).map((specialty, index) => (
                        <Badge 
                          key={index} 
                          className={`text-xs border ${getSpecialtyColor(specialty)}`}
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {specialties.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs border-gray-300 text-gray-500 bg-gray-50"
                        >
                          +{specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Categories Debug */}
                  {categories.length > 0 && (
                    <div className="text-xs text-gray-400 mb-2">
                      Kategorien: {categories.map(cat => cat.name).join(', ')}
                    </div>
                  )}

                  {/* Languages */}
                  {berater.acf?.berater_languages && (
                    <div className="text-xs text-gray-500 mb-4">
                      <strong>Sprachen:</strong> {berater.acf.berater_languages}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Button 
                      asChild
                      variant="ghost" 
                      className="p-0 h-auto text-cockpit-violet hover:text-cockpit-blue-light font-semibold group/btn"
                    >
                      <a 
                        href={berater.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <span>Profil ansehen</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>

                    {/* LinkedIn */}
                    {berater.acf?.berater_linkedin && (
                      <Button 
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-cockpit-violet text-cockpit-violet hover:bg-cockpit-violet hover:text-white"
                      >
                        <a 
                          href={berater.acf.berater_linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1"
                        >
                          <Linkedin className="w-3 h-3" />
                          <span>LinkedIn</span>
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
              Bereit für Ihr nächstes Projekt?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Unser erfahrenes Berater-Team steht bereit, um Ihre strategischen 
              Herausforderungen zu lösen. Kontaktieren Sie uns für eine 
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