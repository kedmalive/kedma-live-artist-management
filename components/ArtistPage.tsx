import React, { useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, Instagram, Music, Camera } from 'lucide-react';
import Navigation from './Navigation';
import WhatsAppButton from './WhatsAppButton';
import { getArtistBySlug, getArtistSlug } from '../constants';
import { Artist } from '../types';

const SITE_URL = 'https://kedma-live.com';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function injectJsonLd(id: string, data: object) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

function useArtistSeo(artist: Artist) {
  useEffect(() => {
    const slug = getArtistSlug(artist);
    const url = `${SITE_URL}/artists/${encodeURI(slug)}`;
    const imageUrl = artist.image.startsWith('http') ? artist.image : `${SITE_URL}${artist.image}`;
    const title = `${artist.name} | ${artist.englishName} — קדמא לייב`;
    const description = artist.description;

    const prevTitle = document.title;
    document.title = title;

    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', imageUrl, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:type', 'profile', 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', imageUrl);
    setCanonical(url);

    const sameAs = [artist.website, artist.spotifyUrl, artist.instagramUrl].filter(Boolean) as string[];

    injectJsonLd('artist-person-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: artist.name,
      alternateName: artist.englishName,
      jobTitle: 'זמר ויוצר',
      description: artist.fullDetails,
      image: imageUrl,
      url,
      sameAs,
      memberOf: {
        '@type': 'MusicGroup',
        name: 'קדמא לייב - Kedma Live',
        url: SITE_URL,
      },
    });

    injectJsonLd('artist-breadcrumb-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'קדמא לייב', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'נבחרת האמנים', item: `${SITE_URL}/#artists` },
        { '@type': 'ListItem', position: 3, name: artist.name, item: url },
      ],
    });

    return () => {
      document.title = prevTitle;
      document.getElementById('artist-person-jsonld')?.remove();
      document.getElementById('artist-breadcrumb-jsonld')?.remove();
    };
  }, [artist]);
}

const ArtistPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const artist = slug ? getArtistBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!artist) {
    return <Navigate to="/" replace />;
  }

  return <ArtistPageContent artist={artist} />;
};

const ArtistPageContent: React.FC<{ artist: Artist }> = ({ artist }) => {
  useArtistSeo(artist);
  const navigate = useNavigate();
  const goToHomeSection = (id: string) => {
    navigate(`/#${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#A8D5BA] selection:text-black">
      <Navigation isScrolled={true} scrollToSection={goToHomeSection} />

      <main className="pt-24 sm:pt-28">
        {/* Breadcrumb */}
        <nav aria-label="פירורי לחם" className="container mx-auto px-6 mb-8 sm:mb-12">
          <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            <li>
              <Link to="/" className="hover:text-[#A8D5BA] transition-colors">קדמא לייב</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/#artists" className="hover:text-[#A8D5BA] transition-colors">נבחרת האמנים</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white">{artist.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="container mx-auto px-6 pb-12 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/5]">
              <img
                src={artist.image}
                alt={`${artist.name} - ${artist.category} | ${artist.englishName}`}
                width={800}
                height={1000}
                className="absolute inset-0 w-full h-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
              {artist.credit && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/60 backdrop-blur-md text-[10px] sm:text-xs text-white/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 font-bold uppercase tracking-wider">
                    <Camera size={12} className="text-[#A8D5BA]" />
                    {artist.credit}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[2px] bg-[#A8D5BA]" />
                <span className="text-[#A8D5BA] text-xs sm:text-sm font-black tracking-[0.2em] uppercase">
                  {artist.englishName}
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter">
                {artist.name}
              </h1>
              <p className="text-[#A8D5BA] text-lg sm:text-xl font-bold uppercase tracking-[0.15em]">
                {artist.category}
              </p>
              <p className="text-gray-300 text-xl sm:text-2xl leading-relaxed font-medium">
                {artist.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                {artist.spotifyUrl && (
                  <a
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-[#A8D5BA] hover:text-black px-5 py-3 rounded-full font-bold transition-all"
                    aria-label={`${artist.name} בספוטיפיי`}
                  >
                    <Music size={18} /> Spotify
                  </a>
                )}
                {artist.instagramUrl && (
                  <a
                    href={artist.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-[#A8D5BA] hover:text-black px-5 py-3 rounded-full font-bold transition-all"
                    aria-label={`${artist.name} באינסטגרם`}
                  >
                    <Instagram size={18} /> Instagram
                  </a>
                )}
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-[#A8D5BA] hover:text-black px-5 py-3 rounded-full font-bold transition-all"
                  >
                    <ExternalLink size={18} /> אתר רשמי
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Biography */}
        <section className="bg-[#050505] border-y border-white/5 py-16 sm:py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-8 sm:mb-12">
              <div className="w-16 h-[2px] bg-[#A8D5BA]" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                על האמן
              </h2>
            </div>
            <p className="text-gray-300 text-xl sm:text-2xl leading-relaxed font-medium whitespace-pre-line">
              {artist.fullDetails}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 sm:py-24 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-6 sm:mb-8">
            רוצים את {artist.name} באירוע שלכם?
          </h2>
          <p className="text-gray-400 text-xl sm:text-2xl font-medium mb-10 max-w-2xl mx-auto">
            צרו קשר עוד היום ונבנה לכם את המופע המושלם.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/#contact"
              className="bg-[#A8D5BA] text-black px-10 py-5 rounded-full font-black text-lg sm:text-xl uppercase tracking-tighter hover:bg-white transition-all transform hover:scale-105"
            >
              בואו נדבר
            </Link>
            <Link
              to="/#artists"
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-5 rounded-full font-bold transition-all"
            >
              <ArrowRight size={20} /> חזרה לכל האמנים
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-black py-12 sm:py-16 border-t border-white/5 text-center text-gray-500">
        <div className="container mx-auto px-6">
          <div className="text-4xl font-black tracking-tighter text-white uppercase italic mb-4">
            KEDMA<span className="text-[#A8D5BA]">LIVE</span>
          </div>
          <p className="text-xs opacity-40 font-bold tracking-[0.2em]">כל הזכויות שמורות לקדמא לייב בע״מ 2026</p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default ArtistPage;
