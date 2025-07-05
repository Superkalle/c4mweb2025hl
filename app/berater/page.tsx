import Navigation from '@/components/Navigation';
import BeraterPortfolio from '@/components/BeraterPortfolio';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Berater Portfolio - cockpit4me',
  description: 'Unsere Beratungsprojekte und Erfolgsgeschichten im Bereich Strategieberatung und Leadership Development',
};

export default function BeraterPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <BeraterPortfolio />
      <Footer />
    </main>
  );
}