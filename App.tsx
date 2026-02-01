
import React, { useState, useEffect } from 'react';
import { Star, Mic2, Music, Calendar, Phone, Mail, Facebook, Instagram, ChevronDown, CheckCircle, Award, ArrowUpRight, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Navigation from './components/Navigation';
import ArtistCard from './components/ArtistCard';
import ArtistModal from './components/ArtistModal';
import AccessibilityMenu from './components/AccessibilityMenu';
import AccessibilityStatement from './components/AccessibilityStatement';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import WhatsAppButton from './components/WhatsAppButton';
import UpcomingShows from './components/UpcomingShows';
import SuccessModal from './components/SuccessModal';
import { Artist, EventType } from './types';
import { ARTISTS_DATA } from './constants';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isAccessibilityStatementOpen, setIsAccessibilityStatementOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOfUseOpen, setIsTermsOfUseOpen] = useState(false);
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: EventType.CORPORATE,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedUserName, setSubmittedUserName] = useState<string>('');
  
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:22',message:'App mounted',data:{windowWidth:window.innerWidth,windowHeight:window.innerHeight,userAgent:navigator.userAgent},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
  }, []);
  // #endregion

  // Initialize EmailJS once on component mount
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, []);

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

  const backgroundSlides: { src: string; credit: string }[] = [
    { src: '/ero-background.jpg', credit: '' },
    { src: '/ero-bg-1.jpg', credit: '' },
    { src: '/ero-bg-2.jpg', credit: '' },
    { src: '/ero-bg-3.JPG', credit: '' },
    { src: '/ero-bg-4.JPG', credit: 'תמר חנן' },
    { src: '/ero-bg-5.jpg', credit: 'ארתור לנדה' },
    { src: '/ero-bg-6.jpg', credit: 'ארתור לנדה' },
  ];
  const backgroundImages = backgroundSlides.map((s) => s.src);

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

  // Contact Form Handler
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear status when user starts typing
    if (submitStatus) setSubmitStatus(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'אנא מלא את כל השדות הנדרשים / Please fill all required fields'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: 'כתובת מייל לא תקינה / Invalid email address'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // 1. Send email via EmailJS
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

      if (publicKey && serviceId && templateId) {
        // Send email (EmailJS is already initialized in useEffect)
        await emailjs.send(serviceId, templateId, {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          event_type: formData.eventType,
          message: formData.message,
          to_email: 'info@kedma-live.com', // Recipient email
        });
      } else {
        console.warn('EmailJS credentials not configured. Skipping email send.');
      }

      // 2. Save user name before resetting form
      const submittedName = formData.name;
      
      // 3. Open WhatsApp with pre-filled message
      const whatsappMessage = `שלום, אני ${formData.name}%0A%0Aפרטי קשר:%0Aטלפון: ${formData.phone}%0Aמייל: ${formData.email}%0A%0Aסוג האירוע: ${formData.eventType}%0A%0A${formData.message ? `הודעה: ${formData.message}` : ''}`;
      const whatsappUrl = `https://wa.me/972546507710?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');

      // 4. Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        eventType: EventType.CORPORATE,
        message: ''
      });

      // 5. Show success modal with user name
      setSubmittedUserName(submittedName);
      setIsSuccessModalOpen(true);

    } catch (error) {
      console.error('Error sending form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'שגיאה בשליחת הטופס. אנא נסה שוב או צור קשר ישירות. / Error submitting form. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
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
          {backgroundSlides.map((slide, index) => (
            <div
              key={`bg-${index}`}
              className={`absolute inset-0 will-change-opacity transition-opacity duration-[2000ms] ease-in-out ${
                index === currentBgIndex 
                  ? 'opacity-100 z-[1]' 
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.src}
                className="absolute inset-0 w-full h-full object-cover grayscale"
                style={{ opacity: 0.8, willChange: 'opacity' }}
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

        {/* Photo credit - only when current slide has credit */}
        {backgroundSlides[currentBgIndex]?.credit && (
          <div className="absolute bottom-24 left-4 sm:left-6 z-[5] text-white/60 text-xs sm:text-sm font-medium">
            צילום: {backgroundSlides[currentBgIndex].credit}
          </div>
        )}

        {/* Floating Circle Graphic */}
        <div className="absolute top-1/4 left-10 w-48 h-48 bg-[#A8D5BA] rounded-full blur-3xl opacity-20 animate-pulse" />

        <div className="relative z-10 container mx-auto px-6 text-center space-y-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md rounded-full px-8 py-3 animate-fade-in opacity-0 [animation-fill-mode:forwards]">
            <div className="w-2 h-2 bg-[#A8D5BA] rounded-full animate-ping" />
            <span className="text-white text-xs font-black tracking-[0.2em] uppercase">Premium Management Agency</span>
          </div>
          
          <div className="relative inline-block">
            <h1 
              className="text-7xl md:text-[11rem] font-black leading-[0.8] tracking-tighter text-white uppercase italic animate-fade-in-up relative z-20 text-center"
            >
              Kedma<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5E5CF] to-[#7FB394]">
                Live
              </span>
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10 animate-fade-in delay-700">
            <button 
              onClick={() => scrollToSection('artists')}
              className="group relative bg-[#A8D5BA] text-black px-12 py-6 rounded-full font-black text-2xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_50px_rgba(168,213,186,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                הנבחרת שלנו <ArrowUpRight size={28} />
              </span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-[#A8D5BA] cursor-pointer" onClick={() => scrollToSection('artists')}>
          <ChevronDown size={48} />
        </div>
      </section>

      {/* Artists Section */}
      <section id="artists" className="py-32 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-2 bg-[#A8D5BA]" />
                <h2 className="text-7xl md:text-[8rem] font-black text-white leading-none tracking-tighter uppercase italic">Lineup</h2>
              </div>
              <p className="text-gray-400 text-2xl max-w-2xl font-bold">
                נבחרת האמנים של קדמא לייב
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
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

      {/* Upcoming Shows Section */}
      <UpcomingShows />

      {/* About Section */}
      <section id="about" className="py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-32">
          <div className="w-full lg:w-1/2 relative">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#A8D5BA] rounded-full opacity-50 blur-3xl" />
             <div className="relative bg-white p-16 md:p-24 rounded-[3rem] text-black space-y-12">
                <h3 className="text-6xl font-black italic tracking-tighter uppercase leading-none">לקוחות שלנו</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                    "ועדי עובדים", "חברות הייטק", 
                    "השלטון המקומי", "משרדי ממשלה",
                    "אוניברסיטאות", "מפיקי אירועים"
                  ].map((client, idx) => (
                    <div key={idx} className="flex items-center gap-5 group">
                      <div className="h-4 w-4 bg-[#A8D5BA] rounded-full" />
                      <span className="text-2xl font-black uppercase tracking-tighter">{client}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-10 border-t border-black/10">
                  <p className="text-[#7FB394] font-black text-xl uppercase italic">EST 2020</p>
                </div>
             </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-10">
            <h2 className="text-6xl md:text-[6rem] font-black text-white leading-[0.9] tracking-tighter uppercase italic text-left" dir="ltr">Kedma Live.<br/><span className="text-[#A8D5BA]">About Us.</span></h2>
            <div className="space-y-8 text-gray-400 text-2xl leading-relaxed font-medium">
              <p>
                <span className="text-white font-black">קדמא לייב: הבית של המוזיקה הישראלית האיכותית</span>
              </p>
              <p>
                אנחנו לא רק משווקים מופעים – אנחנו יוצרים חוויות. קדמא לייב היא חברת בוטיק לייצוג אמנים והפקת מופעים, המתמחה בחיבור בין האמנים המובילים בישראל לבין האירועים שלכם. הנבחרת שלנו כוללת את: רביד פלוטניק, בניה ברבי, אביתר בנאי, שולי רנד, מארק אליהו ושי צברי.
              </p>
              <p>
                מי אנחנו? לילך זהר ניר וגלעד קרונמן. עם שנים של ניסיון בשטח בייצוג וניהול אמנים, אנו מביאים שילוב מנצח של מקצועיות בלתי מתפשרת ויחס אישי. המטרה שלנו ברורה: להביא תרבות ומוזיקה לכל מקום – החל מוועדי עובדים וחברות הייטק, דרך משרדי ממשלה ורשויות מקומיות, ועד למוסדות אקדמיים.
              </p>
            </div>
            <div className="pt-10">
               <button onClick={() => scrollToSection('contact')} className="bg-[#A8D5BA] text-black px-16 py-7 rounded-full font-black text-2xl hover:bg-white transition-all transform hover:scale-105 uppercase tracking-tighter">
                 בואו נדבר
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <div className="glass rounded-[4rem] overflow-hidden border border-white/10">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-[45%] bg-[#A8D5BA] p-20 lg:p-32 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10 space-y-16">
                  <div className="space-y-6">
                    <h3 className="text-6xl lg:text-9xl font-black italic uppercase leading-none text-black tracking-tighter">Book<br/>Now</h3>
                    <p className="text-black/80 text-2xl font-bold italic tracking-tight">נבנה לכם את המופע המושלם.</p>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="flex items-center gap-8">
                      <a href="tel:054-6507710" className="flex items-center gap-8 group">
                        <div className="bg-black p-6 rounded-full text-[#A8D5BA] group-hover:bg-white group-hover:text-black transition-all">
                          <Phone size={36} strokeWidth={3} />
                        </div>
                        <span className="text-3xl font-black text-black">054-6507710</span>
                      </a>
                      <span className="text-3xl font-black text-black">050-4844614</span>
                    </div>
                    <a href="mailto:info@kedma-live.com" className="flex items-center gap-8 group">
                      <div className="bg-black p-6 rounded-full text-[#A8D5BA] group-hover:bg-white group-hover:text-black transition-all">
                        <Mail size={36} strokeWidth={3} />
                      </div>
                      <span className="text-3xl font-black text-black">info@kedma-live.com</span>
                    </a>
                    <a href="https://wa.me/972546507710" target="_blank" rel="noopener noreferrer" className="flex items-center gap-8 group">
                      <div className="bg-black p-6 rounded-full text-[#A8D5BA] group-hover:bg-white group-hover:text-black transition-all">
                        <svg
                          viewBox="0 0 24 24"
                          width="36"
                          height="36"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <span className="text-3xl font-black text-black">צור קשר בוואטסאפ</span>
                    </a>
                  </div>
                </div>

                <div className="flex gap-8 mt-20 relative z-10">
                  <a href="#" className="bg-black text-white p-6 rounded-full hover:bg-white hover:text-black transition-all">
                    <Facebook size={32} />
                  </a>
                  <a href="https://www.instagram.com/kedmalive?igsh=a3UyNDFnMzNkZ2lr" target="_blank" rel="noopener noreferrer" className="bg-black text-white p-6 rounded-full hover:bg-white hover:text-black transition-all">
                    <Instagram size={32} />
                  </a>
                </div>
              </div>

              <div className="w-full lg:w-[55%] p-16 lg:p-32">
                <form className="space-y-10" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label htmlFor="name" className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Full Name / שם מלא</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full bg-white/5 border-b-2 border-white/20 rounded-none px-0 py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-2xl font-bold" 
                        placeholder="ישראל ישראלי" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label htmlFor="phone" className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Phone / טלפון</label>
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        className="w-full bg-white/5 border-b-2 border-white/20 rounded-none px-0 py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-2xl font-bold" 
                        placeholder="050-0000000" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="email" className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Email / כתובת מייל</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-white/5 border-b-2 border-white/20 rounded-none px-0 py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-2xl font-bold" 
                      placeholder="example@email.com" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="eventType" className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Event Type / סוג האירוע</label>
                    <select 
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleFormChange}
                      className="w-full bg-transparent border-b-2 border-white/20 rounded-none px-0 py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-2xl font-bold appearance-none"
                    >
                      {Object.values(EventType).map(val => (
                        <option key={val} value={val} className="bg-black">{val}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label htmlFor="message" className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Message / הודעה</label>
                    <textarea 
                      rows={3} 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      className="w-full bg-white/5 border-b-2 border-white/20 rounded-none px-0 py-5 text-white focus:outline-none focus:border-[#A8D5BA] transition-colors text-2xl font-bold resize-none" 
                      placeholder="ספרו לנו על האירוע..."
                    ></textarea>
                  </div>
                  
                  {/* Status Message */}
                  {submitStatus && (
                    <div className={`p-6 rounded-2xl text-xl font-bold ${
                      submitStatus.type === 'success' 
                        ? 'bg-[#A8D5BA] text-black' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black font-black py-8 rounded-2xl hover:bg-[#A8D5BA] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-2xl text-2xl uppercase tracking-tighter flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={28} />
                        <span>שולח... / Sending...</span>
                      </>
                    ) : (
                      'Send Request / שלח פרטים'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-24 border-t border-white/5 text-center text-gray-500">
        <div className="container mx-auto px-6 flex flex-col items-center gap-12">
           <div className="text-5xl font-black tracking-tighter text-white uppercase italic">
            KEDMA<span className="text-[#A8D5BA]">LIVE</span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-sm font-black uppercase tracking-[0.2em]">
            <button 
              onClick={() => setIsAccessibilityStatementOpen(true)}
              className="hover:text-[#A8D5BA] transition-colors"
            >
              Accessibility / נגישות
            </button>
            <button 
              onClick={() => setIsPrivacyPolicyOpen(true)}
              className="hover:text-[#A8D5BA] transition-colors"
            >
              Privacy / פרטיות
            </button>
            <button 
              onClick={() => setIsTermsOfUseOpen(true)}
              className="hover:text-[#A8D5BA] transition-colors"
            >
              Terms / תקנון
            </button>
          </div>
          <p className="text-xs opacity-40 font-bold uppercase tracking-[0.5em]">© 2024 Kedma Live Agency. Excellence Defined.</p>
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

      <PrivacyPolicy 
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
      />

      <TermsOfUse 
        isOpen={isTermsOfUseOpen}
        onClose={() => setIsTermsOfUseOpen(false)}
      />

      {/* Artist Detail Modal */}
      <ArtistModal 
        artist={selectedArtist} 
        onClose={() => setSelectedArtist(null)} 
      />

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setSubmittedUserName('');
        }}
        userName={submittedUserName || undefined}
      />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
