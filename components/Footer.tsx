import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/c4m Logo 2024 250weissHG.png"
                alt="cockpit4me Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">cockpit4me</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Ihr Partner für strategische Unternehmensberatung, 
              KI-Integration und moderne Führungskräfteentwicklung.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-cockpit-violet transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cockpit-blue-light transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cockpit-turquoise transition-colors">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Strategieberatung</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">KI-Integration</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Leadership Development</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Digital Transformation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Process Optimization</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Unternehmen</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Über uns</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Team</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Karriere</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Presse</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Partner</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>info@cockpit4me.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+49 (0) 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>Berlin, Deutschland</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 cockpit4me. Alle Rechte vorbehalten.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Datenschutz
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Impressum
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}