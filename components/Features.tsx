import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, TrendingUp, Shield, Users, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'KI-gestützte Strategieentwicklung',
    description: 'Nutzen Sie fortschrittliche KI-Algorithmen zur Analyse von Markttrends und zur Entwicklung datengestützter Strategien, die Ihr Unternehmen voranbringen.',
    color: 'text-cockpit-violet',
    bgColor: 'bg-cockpit-violet/10',
  },
  {
    icon: Target,
    title: 'Präzise Unternehmensberatung',
    description: 'Erhalten Sie maßgeschneiderte Beratung für Ihre spezifischen Herausforderungen mit unserem Team aus erfahrenen Strategen und Technologie-Experten.',
    color: 'text-cockpit-blue-light',
    bgColor: 'bg-cockpit-blue-light/10',
  },
  {
    icon: TrendingUp,
    title: 'Modernes Leadership Development',
    description: 'Entwickeln Sie Führungskompetenzen für das digitale Zeitalter mit unseren innovativen Trainingsmethoden und Leadership-Programmen.',
    color: 'text-cockpit-turquoise',
    bgColor: 'bg-cockpit-turquoise/10',
  },
  {
    icon: Shield,
    title: 'Sichere Datenverarbeitung',
    description: 'Ihre Unternehmensdaten sind bei uns sicher. Wir nutzen modernste Verschlüsselung und entsprechen allen Datenschutzbestimmungen.',
    color: 'text-cockpit-pink',
    bgColor: 'bg-cockpit-pink/10',
  },
  {
    icon: Users,
    title: 'Kollaborative Plattform',
    description: 'Arbeiten Sie nahtlos mit Ihrem Team zusammen, teilen Sie Erkenntnisse und treffen Sie fundierte Entscheidungen in Echtzeit.',
    color: 'text-cockpit-lime',
    bgColor: 'bg-cockpit-lime/10',
  },
  {
    icon: Zap,
    title: 'Schnelle Implementierung',
    description: 'Von der Strategie zur Umsetzung in Rekordzeit. Unsere agilen Methoden sorgen für schnelle und effektive Ergebnisse.',
    color: 'text-cockpit-orange',
    bgColor: 'bg-cockpit-orange/10',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Alles was Sie für Ihren{' '}
            <span className="bg-gradient-to-r from-cockpit-violet to-cockpit-blue-light bg-clip-text text-transparent">
              Erfolg
            </span>{' '}
            benötigen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie unsere umfassende Suite von Tools und Services, 
            die speziell für moderne Unternehmen entwickelt wurden.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-cockpit-violet/5 to-cockpit-blue-light/5 rounded-2xl p-8 sm:p-12 border border-cockpit-violet/10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Bereit für die nächste Stufe?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam Ihre digitale Transformation gestalten. 
              Buchen Sie noch heute Ihre kostenlose Beratung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-cockpit-gradient hover:opacity-90 text-white px-8 py-4 rounded-lg font-semibold transition-all">
                Kostenlose Beratung buchen
              </button>
              <button className="border-2 border-cockpit-violet text-cockpit-violet hover:bg-cockpit-violet hover:text-white px-8 py-4 rounded-lg font-semibold transition-all">
                Mehr erfahren
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}