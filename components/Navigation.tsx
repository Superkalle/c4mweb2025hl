import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/c4m Logo 2024 250weissHG.png"
                alt="cockpit4me Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-gray-900">cockpit4me</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-cockpit-violet transition-colors font-medium">
              Features
            </Link>
            <Link href="#services" className="text-gray-600 hover:text-cockpit-pink transition-colors font-medium">
              Services
            </Link>
            <Link href="#portfolio" className="text-gray-600 hover:text-cockpit-turquoise transition-colors font-medium">
              Portfolio
            </Link>
            <Link href="#blog" className="text-gray-600 hover:text-cockpit-blue-light transition-colors font-medium">
              Blog
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-cockpit-violet transition-colors font-medium">
              Kontakt
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="hidden sm:inline-flex border-cockpit-violet text-cockpit-violet hover:bg-cockpit-violet hover:text-white transition-all"
            >
              Anmelden
            </Button>
            <Button className="bg-cockpit-gradient hover:opacity-90 text-white border-0 transition-all">
              Jetzt starten
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}