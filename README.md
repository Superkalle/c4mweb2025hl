# cockpit4me - Headless WordPress Business Platform

Eine moderne, Next.js-basierte Website für cockpit4me mit vollständiger headless WordPress-Integration für Content-Management.

## 🚀 Features

- **Headless WordPress CMS**: Vollständige Integration mit WordPress REST API
- **Portfolio Management**: Automatische Synchronisation von Portfolio-Projekten
- **Blog Integration**: Live-Anbindung an WordPress-Blog
- **Services Management**: Dynamische Service-Darstellung aus WordPress
- **Moderne UI/UX**: Stripe-inspiriertes Design mit cockpit4me Branding
- **Responsive Design**: Optimiert für alle Bildschirmgrößen
- **Custom Color System**: Integrierte cockpit4me Farbpalette in Tailwind CSS
- **Original Logo**: Integriertes cockpit4me Logo in Navigation und Footer
- **TypeScript**: Vollständige Typsicherheit
- **Performance**: Optimiert für schnelle Ladezeiten
- **SEO-freundlich**: Optimierte Metadaten und Struktur

## 🎯 WordPress Integration

### Content-Typen
Die Website integriert folgende WordPress-Inhalte:

#### Blog Posts
- **Endpoint**: `https://cockpit4me.de/wp-json/wp/v2/posts`
- **Features**: Kategorien, Tags, Featured Images, Autoren
- **Darstellung**: 6 neueste Beiträge in Card-Layout

#### Portfolio
- **Primary**: `https://cockpit4me.de/wp-json/wp/v2/portfolio` (Custom Post Type)
- **Fallback**: Posts mit Portfolio-Kategorie
- **Features**: Project URLs, Client Names, Technologies, Completion Dates
- **ACF Support**: Advanced Custom Fields für erweiterte Metadaten

#### Services
- **Primary**: `https://cockpit4me.de/wp-json/wp/v2/services` (Custom Post Type)
- **Fallback**: Posts mit Services-Kategorie
- **Features**: Preise, Dauer, Feature-Listen
- **ACF Support**: Service-spezifische Felder

### WordPress Setup Empfehlungen

#### Erforderliche Plugins
```
- Advanced Custom Fields (ACF) Pro
- Custom Post Type UI (für Portfolio/Services)
- Yoast SEO
- WP REST API Controller (optional)
```

#### Custom Post Types
```php
// Portfolio CPT
register_post_type('portfolio', [
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'portfolio',
    'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields']
]);

// Services CPT
register_post_type('services', [
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'services',
    'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields']
]);
```

#### ACF Felder für Portfolio
```
- project_url (URL)
- client_name (Text)
- project_type (Select)
- technologies (Textarea)
- completion_date (Date)
```

#### ACF Felder für Services
```
- service_price (Text)
- service_duration (Text)
- service_features (Textarea)
- service_icon (Image)
```

## 🎨 Design-System

### Logo
Das offizielle cockpit4me Logo wird verwendet:
- **Datei**: `/public/c4m Logo 2024 250weissHG.png`
- **Navigation**: 40x40px
- **Footer**: 32x32px

### Farbpalette
```css
/* Violet/Pink */
--cockpit-violet-light: #A180E6
--cockpit-violet: #8B5CF6
--cockpit-violet-alt: #B57CEE
--cockpit-pink: #FF78C4

/* Blue/Turquoise */
--cockpit-blue-light: #54BFFF
--cockpit-turquoise: #34D5DD
--cockpit-teal: #15AABD
--cockpit-blue-dark: #0046A6
--cockpit-blue-accent: #567BFF

/* Lime/Green */
--cockpit-lime-light: #CFFF66
--cockpit-lime: #B7FF6A

/* Orange */
--cockpit-orange: #FFD082

/* Gray */
--cockpit-gray-light: #BDBDBD
--cockpit-gray: #A3A3A3
--cockpit-gray-dark: #616161
```

### Typografie
- **Hauptschrift**: Inter (Google Fonts)
- **Fallback**: system-ui, sans-serif

## 🛠️ Technologie-Stack

- **Framework**: Next.js 13+ (App Router)
- **CMS**: WordPress (Headless)
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Schriftarten**: Inter via Google Fonts
- **TypeScript**: Vollständige Typsicherheit
- **API**: WordPress REST API

## 📦 Installation & Setup

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn
- WordPress-Installation mit REST API

### Installation
```bash
# Repository klonen
git clone [repository-url]
cd cockpit4me

# Abhängigkeiten installieren
npm install

# Development Server starten
npm run dev

# Projekt bauen
npm run build

# Produktionsversion starten
npm start
```

### Umgebung
Die Website läuft standardmäßig auf `http://localhost:3000`

## 📁 Projektstruktur

```
cockpit4me/
├── app/
│   ├── globals.css          # Globale Styles & Tailwind
│   ├── layout.tsx           # Root Layout
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # shadcn/ui Components
│   ├── Navigation.tsx       # Header Navigation
│   ├── Hero.tsx            # Hero Section
│   ├── Features.tsx        # Features Section
│   ├── Services.tsx        # WordPress Services
│   ├── Portfolio.tsx       # WordPress Portfolio
│   ├── Blog.tsx            # WordPress Blog
│   └── Footer.tsx          # Footer Component
├── lib/
│   ├── utils.ts            # Utility Functions
│   └── wordpress.ts        # WordPress API Utilities
├── public/
│   └── c4m Logo 2024 250weissHG.png  # cockpit4me Logo
├── tailwind.config.ts      # Tailwind Configuration
└── README.md
```

## 🎯 Komponenten-Übersicht

### Navigation
- Responsive Header mit cockpit4me Logo
- Navigation Links zu allen Sektionen
- CTA Buttons

### Hero Section
- Gradient Background
- Hauptslogan: "Strategie. KI. Leadership."
- Call-to-Action Buttons
- Statistiken

### Features Section
- 6 Feature Cards mit Icons
- Hover-Effekte
- Responsive Grid Layout

### Services Section (WordPress)
- Dynamische Service-Darstellung
- ACF-Integration für Preise und Features
- Responsive Card-Layout

### Portfolio Section (WordPress)
- Portfolio-Projekte aus WordPress
- Project URLs und Client-Informationen
- Technology Tags und Kategorien

### Blog Section (WordPress)
- 6 neueste Blog-Posts
- Featured Images und Kategorien
- Autor und Datum-Anzeige

### Footer
- cockpit4me Logo und Unternehmensinfo
- Service-Links
- Kontaktinformationen
- Social Media Links

## 🔧 Konfiguration

### WordPress API URL ändern
Bearbeiten Sie `lib/wordpress.ts`:
```typescript
const WORDPRESS_API_URL = 'https://ihre-domain.de/wp-json/wp/v2';
```

### Logo ersetzen
Das Logo befindet sich unter `/public/c4m Logo 2024 250weissHG.png` und wird automatisch in Navigation und Footer verwendet.

### Farben anpassen
Bearbeiten Sie `tailwind.config.ts` um die Farbpalette anzupassen:

```typescript
colors: {
  'cockpit': {
    'violet': '#8B5CF6',
    // ... weitere Farben
  }
}
```

### Inhalte ändern
- **Hero Text**: `components/Hero.tsx`
- **Features**: `components/Features.tsx`
- **Navigation**: `components/Navigation.tsx`
- **Footer**: `components/Footer.tsx`
- **WordPress Content**: Direkt im WordPress-Backend

## 🚀 Deployment

### Vercel (Empfohlen)
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment
vercel
```

### Netlify
```bash
# Build
npm run build

# dist/ Ordner zu Netlify hochladen
```

### Andere Hosting-Anbieter
Das Projekt ist als statische Website exportierbar (`next export`).

## 📝 Content Management

### WordPress Backend
Alle Inhalte werden über das WordPress-Backend verwaltet:

1. **Blog-Posts**: Reguläre WordPress-Posts
2. **Portfolio**: Custom Post Type "Portfolio" mit ACF-Feldern
3. **Services**: Custom Post Type "Services" mit ACF-Feldern

### Content-Updates
- Änderungen im WordPress-Backend werden automatisch auf der Website angezeigt
- Keine manuelle Synchronisation erforderlich
- Real-time Content-Updates

## 🔒 Sicherheit

### WordPress Hardening
```
- Regelmäßige Updates
- Sichere Passwörter
- SSL-Zertifikat
- Backup-Strategie
- Security Plugins (Wordfence, etc.)
```

### API-Sicherheit
- CORS-Konfiguration
- Rate Limiting
- Input Validation
- Error Handling

## 🤝 Mitwirkende

- **Design**: Basierend auf cockpit4me Branding
- **Entwicklung**: Next.js + TypeScript + Tailwind CSS
- **CMS**: WordPress Headless Integration
- **UI Components**: shadcn/ui

## 📞 Support

Bei Fragen oder Problemen wenden Sie sich an:
- Email: info@cockpit4me.com
- Website: [cockpit4me.com](https://cockpit4me.com)

---

**cockpit4me** - Strategie. KI. Leadership. - Powered by Headless WordPress