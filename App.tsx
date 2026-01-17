
import React, { useState, useEffect, useRef } from 'react';
import { Star, Mic2, Music, Calendar, Phone, Mail, Facebook, Instagram, ChevronDown, CheckCircle, Award, ArrowUpRight } from 'lucide-react';
import Navigation from './components/Navigation';
import ArtistCard from './components/ArtistCard';
import ArtistModal from './components/ArtistModal';
import AccessibilityMenu from './components/AccessibilityMenu';
import AccessibilityStatement from './components/AccessibilityStatement';
import WhatsAppButton from './components/WhatsAppButton';
import ArtistNamesAnimation from './components/ArtistNamesAnimation';
import { Artist, EventType } from './types';
import { ARTISTS_DATA } from './constants';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isAccessibilityStatementOpen, setIsAccessibilityStatementOpen] = useState(false);
  const [showArtistNamesAnimation, setShowArtistNamesAnimation] = useState(false);
  const kedmaLiveTextRef = useRef<HTMLHeadingElement>(null);

  // Accessibility State
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'normal' as 'normal' | 'large' | 'extra',
    highContrast: false,
    underlineLinks: false,
  });

  const updateAccessibilitySettings = (newSettings: any) => {
    setAccessibilitySettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetAccessibilitySettings = () => {
    setAccessibilitySettings({
      fontSize: 'normal',
      highContrast: false,
      underlineLinks: false,
    });
  };

  const backgroundImages = [
    '/ero-background.jpg',
    '/ero-bg-1.jpg',
    '/ero-bg-2.jpg',
    '/ero-bg-3.JPG'
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Preload all images
    backgroundImages.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Show artist names animation after page loads
    const timer = setTimeout(() => {
      setShowArtistNamesAnimation(true);
    }, 800); // Start animation 800ms after page load

    return () => clearTimeout(timer);
  }, []);

  // Add Structured Data for Artists
  useEffect(() => {
    const artistStructuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": ARTISTS_DATA.map((artist, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Person",
          "name": artist.name,
          "alternateName": artist.englishName,
          "jobTitle": "זמר ויוצר",
          "description": artist.description,
          "image": artist.image.startsWith('http') ? artist.image : `https://kedma-live.com${artist.image}`,
          "memberOf": {
            "@type": "MusicGroup",
            "name": "קדמא לייב - Kedma Live"
          }
        }
      }))
    };

    // Remove existing artist structured data if exists
    const existingScript = document.getElementById('artists-structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.id = 'artists-structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(artistStructuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('artists-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  // Apply font size scaling to root element to affect all text
  useEffect(() => {
    const fontSizeScale = accessibilitySettings.fontSize === 'large' ? 1.25 : 
                          accessibilitySettings.fontSize === 'extra' ? 1.5 : 1;
    
    // Apply zoom to the root div to scale all content including text
    // Zoom scales everything proportionally without affecting layout
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.zoom = fontSizeScale.toString();
    }
    
    return () => {
      if (rootElement) {
        rootElement.style.zoom = '';
      }
    };
  }, [accessibilitySettings.fontSize]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Construct global classes for accessibility
  const accessibilityClasses = [
    accessibilitySettings.highContrast ? 'grayscale invert brightness-125 bg-white text-black' : '',
    accessibilitySettings.underlineLinks ? '[&_a]:underline' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`min-h-screen selection:bg-[#A8D5BA] selection:text-black bg-black transition-all duration-300 ${accessibilityClasses}`}
    >
      <Navigation isScrolled={isScrolled} scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Cinematic Background with Sliding Images */}
        <div className="absolute inset-0 overflow-hidden">
          {backgroundImages.map((image, index) => (
            <div
              key={`bg-${index}`}
              className={`absolute inset-0 will-change-opacity transition-opacity duration-[2000ms] ease-in-out ${
                index === currentBgIndex 
                  ? 'opacity-100 z-[1]' 
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={image}
                className="absolute inset-0 w-full h-full object-cover grayscale"
                style={{ opacity: 0.6, willChange: 'opacity' }}
                alt={`Hero Background ${index + 1}`}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1920';
                }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-[2] pointer-events-none" />
        </div>

        {/* Floating Circle Graphic */}
        <div className="absolute top-1/4 left-10 w-48 h-48 bg-[#A8D5BA] rounded-full blur-3xl opacity-20 animate-pulse" />

        <div className="relative z-10 container mx-auto px-6 text-center space-y-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 animate-fade-in opacity-0 [animation-fill-mode:forwards]">
            <div className="w-2 h-2 bg-[#A8D5BA] rounded-full animate-ping" />
            <span className="text-white text-[10px] sm:text-xs font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase">Premium Management Agency</span>
          </div>
          
          <div className="relative inline-block">
            <ArtistNamesAnimation 
              artists={ARTISTS_DATA} 
              isVisible={showArtistNamesAnimation}
              textElementRef={kedmaLiveTextRef}
            />
            
            <h1 
              ref={kedmaLiveTextRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[11rem] font-black leading-[0.8] tracking-tighter text-white uppercase italic animate-fade-in-up relative z-20 text-center"
            >
              Kedma<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5E5CF] to-[#7FB394]">
                Live
              </span>
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-6 sm:pt-10 animate-fade-in delay-700">
            <button 
              onClick={() => scrollToSection('artists')}
              className="group relative bg-[#A8D5BA] text-black px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full font-black text-lg sm:text-xl md:text-2xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_50px_rgba(168,213,186,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                הנבחרת שלנו <ArrowUpRight size={24} className="sm:w-7 sm:h-7" />
              </span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-[#A8D5BA] cursor-pointer" onClick={() => scrollToSection('artists')}>
          <ChevronDown size={48} />
        </div>
      </section>

      {/* Artists Section */}
      <section id="artists" className="py-16 sm:py-24 md:py-32 bg-black relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-12 mb-16 sm:mb-20 md:mb-24">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 sm:w-16 md:w-20 h-2 bg-[#A8D5BA]" />
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[8rem] font-black text-white leading-none tracking-tighter uppercase italic">Lineup</h2>
              </div>
              <p className="text-gray-400 text-lg sm:text-xl md:text-2xl max-w-2xl font-bold">
                נבחרת האמנים של קדמא לייב
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {ARTISTS_DATA.map((artist) => (
              <ArtistCard 
                key={artist.id} 
                artist={artist} 
                onClick={setSelectedArtist} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 md:py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 sm:gap-24 lg:gap-32">
          <div className="w-full lg:w-1/2 relative">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#A8D5BA] rounded-full opacity-50 blur-3xl" />
             <div className="relative bg-white p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 rounded-[2rem] sm:rounded-[3rem] text-black space-y-8 sm:space-y-10 md:space-y-12">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none">לקוחות שלנו</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
                   {[
                    "ועדי עובדים", "חברות הייטק", 
                    "השלטון המקומי", "משרדי ממשלה",
                    "אוניברסיטאות", "מפיקי אירועים"
                  ].map((client, idx) => (
                    <div key={idx} className="flex items-center gap-3 sm:gap-4 md:gap-5 group">
                      <div className="h-3 w-3 sm:h-4 sm:w-4 bg-[#A8D5BA] rounded-full flex-shrink-0" />
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-tighter">{client}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 sm:pt-8 md:pt-10 border-t border-black/10">
                  <p className="text-[#7FB394] font-black text-base sm:text-lg md:text-xl uppercase italic">EST 2020</p>
                </div>
             </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 md:space-y-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[6rem] font-black text-white leading-[0.9] tracking-tighter uppercase italic text-right lg:text-left">Kedma Live.<br/><span className="text-[#A8D5BA]">About Us.</span></h2>
            <div className="space-y-5 sm:space-y-6 md:space-y-8 text-gray-400 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
              <p>
                קדמא לייב היא הבית של המוזיקה הישראלית האיכותית. אנחנו לא רק מפיקים - אנחנו יוצרים חוויות.
              </p>
              <p>
                <span className="text-white font-black border-b-2 sm:border-b-4 border-[#A8D5BA]">לילך זהר ניר וגלעד קרונמן:</span> השילוב המנצח של ניסיון שטח, חזון אמנותי ויחס אישי לכל אמן ולקוח.
              </p>
            </div>
            <div className="pt-6 sm:pt-8 md:pt-10">
               <button onClick={() => scrollToSection('contact')} className="bg-[#A8D5BA] text-black px-10 sm:px-12 md:px-14 lg:px-16 py-5 sm:py-6 md:py-7 rounded-full font-black text-lg sm:text-xl md:text-2xl hover:bg-white transition-all transform hover:scale-105 uppercase tracking-tighter w-full sm:w-auto">
                 בואו נדבר
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 md:py-32 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="glass rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-[45%] bg-[#A8D5BA] p-8 sm:p-12 md:p-16 lg:p-24 xl:p-32 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10 space-y-10 sm:space-y-12 md:space-y-16">
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-black italic uppercase leading-none text-black tracking-tighter">Book<br/>Now</h3>
                    <p className="text-black/80 text-lg sm:text-xl md:text-2xl font-bold italic tracking-tight">נבנה לכם את המופע המושלם.</p>
                  </div>
                  
                  <div className="space-y-6 sm:space-y-8 md:space-y-10">
                    <a href="tel:054-6507710" className="flex items-center gap-4 sm:gap-6 md:gap-8 group">
                      <div className="bg-black p-4 sm:p-5 md:p-6 rounded-full text-[#A8D5BA] group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
                        <Phone size={28} className="sm:w-8 sm:h-8 md:w-9 md:h-9" strokeWidth={3} />
                      </div>
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-black break-all">054-6507710</span>
                    </a>
                    <a href="mailto:info@kedma-live.com" className="flex items-center gap-4 sm:gap-6 md:gap-8 group">
                      <div className="bg-black p-4 sm:p-5 md:p-6 rounded-full text-[#A8D5BA] group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
                        <Mail size={28} className="sm:w-8 sm:h-8 md:w-9 md:h-9" strokeWidth={3} />
                      </div>
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-black break-all">info@kedma-live.com</span>
                    </a>
                    <a href="https://wa.me/972546507710" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 sm:gap-6 md:gap-8 group">
                      <div className="bg-black p-4 sm:p-5 md:p-6 rounded-full text-[#A8D5BA] group-hover:bg-white group-hover:text-black transition-all flex-shrink-0">
                        <svg
                          viewBox="0 0 24 24"
                          width="28"
                          height="28"
                          className="sm:w-8 sm:h-8 md:w-9 md:h-9"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-black">צור קשר בוואטסאפ</span>
                    </a>
                  </div>
                </div>

                <div className="flex gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20 relative z-10">
                  <a href="#" className="bg-black text-white p-4 sm:p-5 md:p-6 rounded-full hover:bg-white hover:text-black transition-all">
                    <Facebook size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </a>
                  <a href="https://www.instagram.com/kedmalive?igsh=a3UyNDFnMzNkZ2lr" target="_blank" rel="noopener noreferrer" className="bg-black text-white p-4 sm:p-5 md:p-6 rounded-full hover:bg-white hover:text-black transition-all">
                    <Instagram size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </a>
                </div>
              </div>

              <div className="w-full lg:w-[55%] p-8 sm:p-12 md:p-16 lg:p-24 xl:p-32">
                <form className="space-y-8 sm:space-y-10" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Full Name / שם מלא</label>
                      <input type="text" className="w-full bg-white/5 border-b-2 border-white/20 rounded-none px-0 py-4 sm:py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-lg sm:text-xl md:text-2xl font-bold" placeholder="ישראל ישראלי" />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Phone / טלפון</label>
                      <input type="tel" className="w-full bg-white/5 border-b-2 border-white/20 rounded-none px-0 py-4 sm:py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-lg sm:text-xl md:text-2xl font-bold" placeholder="050-0000000" />
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Email / כתובת מייל</label>
                    <input type="email" className="w-full bg-white/5 border-b-2 border-white/20 rounded-none px-0 py-4 sm:py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-lg sm:text-xl md:text-2xl font-bold" placeholder="example@email.com" />
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Event Type / סוג האירוע</label>
                    <select className="w-full bg-transparent border-b-2 border-white/20 rounded-none px-0 py-4 sm:py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-lg sm:text-xl md:text-2xl font-bold appearance-none">
                      {Object.values(EventType).map(val => (
                        <option key={val} value={val} className="bg-black">{val}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <label className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Message / הודעה</label>
                    <textarea rows={3} className="w-full bg-white/5 border-b-2 border-white/20 rounded-none px-0 py-4 sm:py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-lg sm:text-xl md:text-2xl font-bold" placeholder="ספרו לנו על האירוע..."></textarea>
                  </div>
                  <button className="w-full bg-white text-black font-black py-6 sm:py-7 md:py-8 rounded-xl sm:rounded-2xl hover:bg-[#A8D5BA] transition-all shadow-2xl text-lg sm:text-xl md:text-2xl uppercase tracking-tighter">
                    Send Request / שלח פרטים
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 sm:py-20 md:py-24 border-t border-white/5 text-center text-gray-500">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
           <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
            KEDMA<span className="text-[#A8D5BA]">LIVE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            <button 
              onClick={() => setIsAccessibilityStatementOpen(true)}
              className="hover:text-[#A8D5BA] transition-colors"
            >
              Accessibility / נגישות
            </button>
            <a href="#" className="hover:text-[#A8D5BA] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#A8D5BA] transition-colors">Terms</a>
          </div>
          <p className="text-[10px] sm:text-xs opacity-40 font-bold uppercase tracking-[0.3em] sm:tracking-[0.5em] px-4">© 2024 Kedma Live Agency. Excellence Defined.</p>
        </div>
      </footer>

      {/* Accessibility Interface */}
      <AccessibilityMenu 
        accessibilitySettings={accessibilitySettings}
        updateSettings={updateAccessibilitySettings}
        resetSettings={resetAccessibilitySettings}
      />
      
      <AccessibilityStatement 
        isOpen={isAccessibilityStatementOpen}
        onClose={() => setIsAccessibilityStatementOpen(false)}
      />

      {/* Artist Detail Modal */}
      <ArtistModal 
        artist={selectedArtist} 
        onClose={() => setSelectedArtist(null)} 
      />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
