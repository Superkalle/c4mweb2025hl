import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-cockpit-gradient opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cockpit-gradient-alt opacity-10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-cockpit-violet/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-cockpit-violet" />
            <span className="text-sm font-medium text-cockpit-violet">Neue KI-Features verfügbar</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
            <span className="block">Strategie.</span>
            <span className="block bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
              KI.
            </span>
            <span className="block">Leadership.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Revolutionieren Sie Ihr Unternehmen mit intelligenter Strategieberatung, 
            KI-gestützten Lösungen und modernem Leadership. cockpit4me ist Ihr Partner 
            für die digitale Transformation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-cockpit-gradient hover:opacity-90 text-white border-0 px-8 py-6 text-lg font-semibold group"
            >
              Kostenlos starten
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-cockpit-violet text-cockpit-violet hover:bg-cockpit-violet hover:text-white px-8 py-6 text-lg font-semibold"
            >
              Demo anfordern
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-violet mb-2">500+</div>
              <div className="text-gray-600">Erfolgreiche Projekte</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-blue-light mb-2">98%</div>
              <div className="text-gray-600">Kundenzufriedenheit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cockpit-turquoise mb-2">24/7</div>
              <div className="text-gray-600">KI-Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}