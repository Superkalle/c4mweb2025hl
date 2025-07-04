'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface WordPressService {
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
  link: string;
  featured_media: number;
  acf?: {
    service_price?: string;
    service_duration?: string;
    service_features?: string;
    service_icon?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export default function Services() {
  const [services, setServices] = useState<WordPressService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Versuche Services Custom Post Type
        let response = await fetch(
          'https://cockpit4me.de/wp-json/wp/v2/services?_embed&per_page=6&orderby=menu_order&order=asc'
        );
        
        // Falls Services CPT nicht existiert, verwende Posts mit Services-Kategorie
        if (!response.ok) {
          response = await fetch(
            'https://cockpit4me.de/wp-json/wp/v2/posts?_embed&per_page=6&categories=services&orderby=date&order=desc'
          );
        }
        
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getFeaturedImage = (service: WordPressService) => {
    return service._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  };

  if (loading || services.length === 0) {
    return null; // Verstecke Sektion wenn keine Services vorhanden
  }

  if (error) {
    return null; // Verstecke Sektion bei Fehler
  }

  return (
    <section id="services" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Unsere{' '}
            <span className="bg-gradient-to-r from-cockpit-pink to-cockpit-orange bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Maßgeschneiderte Lösungen für Ihre digitale Transformation 
            und strategische Weiterentwicklung.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const featuredImage = getFeaturedImage(service);

            return (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50/50 overflow-hidden h-full">
                {/* Featured Image or Icon */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cockpit-pink/10 to-cockpit-orange/10">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt={stripHtml(service.title.rendered)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cockpit-pink to-cockpit-orange rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {stripHtml(service.title.rendered).charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-cockpit-pink transition-colors">
                    {stripHtml(service.title.rendered)}
                  </CardTitle>

                  {/* Price & Duration */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                    {service.acf?.service_price && (
                      <Badge variant="outline" className="border-cockpit-pink text-cockpit-pink">
                        {service.acf.service_price}
                      </Badge>
                    )}
                    {service.acf?.service_duration && (
                      <span>{service.acf.service_duration}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col h-full">
                  <CardDescription className="text-gray-600 leading-relaxed line-clamp-3 mb-4 flex-grow">
                    {stripHtml(service.excerpt.rendered)}
                  </CardDescription>

                  {/* Features */}
                  {service.acf?.service_features && (
                    <div className="mb-4">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.acf.service_features.split('\n').slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-cockpit-pink rounded-full"></div>
                            <span>{feature.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    asChild
                    variant="ghost" 
                    className="p-0 h-auto text-cockpit-pink hover:text-cockpit-orange font-semibold group/btn mt-auto"
                  >
                    <a 
                      href={service.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <span>Mehr erfahren</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-cockpit-pink/5 to-cockpit-orange/5 rounded-2xl p-8 sm:p-12 border border-cockpit-pink/10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Bereit für Ihre Transformation?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam den perfekten Service für Ihre 
              Anforderungen finden und Ihr Projekt zum Erfolg führen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-cockpit-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold">
                Beratung vereinbaren
              </Button>
              <Button 
                asChild
                variant="outline"
                className="border-2 border-cockpit-pink text-cockpit-pink hover:bg-cockpit-pink hover:text-white px-8 py-4 text-lg font-semibold"
              >
                <a 
                  href="https://cockpit4me.de/services" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2"
                >
                  <span>Alle Services</span>
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