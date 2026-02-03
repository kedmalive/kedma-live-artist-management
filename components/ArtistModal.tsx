
import React, { useEffect } from 'react';
import { X, Calendar, Instagram, Music, Globe } from 'lucide-react';
import { Artist } from '../types';
import { splitArtistName } from '../constants';

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({ artist, onClose }) => {
  useEffect(() => {
    if (artist) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [artist]);

  if (!artist) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4 md:p-8">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl transition-opacity animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-[#080808] w-full max-w-7xl h-full md:h-auto md:max-h-[90vh] rounded-none sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col lg:flex-row rtl-grid animate-fade-in-up border-0 sm:border border-white/10">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 z-[80] bg-white text-black p-3 sm:p-4 rounded-full hover:bg-[#A8D5BA] transition-all transform hover:rotate-90 shadow-2xl"
        >
          <X size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
        </button>
        
        {/* Image Area */}
        <div className="w-full lg:w-1/2 h-[250px] sm:h-[300px] md:h-[350px] lg:h-auto relative overflow-hidden group">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 right-4 sm:right-8 md:right-12 left-4 sm:left-8 md:left-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
             <div className="bg-[#A8D5BA] text-black px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.15em] sm:tracking-[0.2em] shadow-2xl">
               {artist.credit || ''}
             </div>
            <div className="flex gap-2 sm:gap-3 md:gap-4">
              {artist.spotifyUrl ? (
                <a
                  href={artist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 md:p-5 rounded-full text-white hover:bg-[#A8D5BA] hover:text-black transition-all border border-white/10"
                  title="האזן ב-Spotify"
                >
                  <Music size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </a>
              ) : (
                <button className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 md:p-5 rounded-full text-white hover:bg-[#A8D5BA] hover:text-black transition-all border border-white/10" disabled>
                  <Music size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
              )}
              {artist.instagramUrl ? (
                <a
                  href={artist.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 md:p-5 rounded-full text-white hover:bg-[#A8D5BA] hover:text-black transition-all border border-white/10"
                  title="עמוד Instagram"
                >
                  <Instagram size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </a>
              ) : (
                <button className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 md:p-5 rounded-full text-white hover:bg-[#A8D5BA] hover:text-black transition-all border border-white/10" disabled title="אין קישור ל-Instagram">
                  <Instagram size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
              )}
              {artist.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 md:p-5 rounded-full text-white hover:bg-[#A8D5BA] hover:text-black transition-all border border-white/10"
                >
                  <Globe size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 lg:p-20 xl:p-24 text-right rtl overflow-y-auto">
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            <div>
              {(() => {
                const eng = splitArtistName(artist.englishName);
                const heb = splitArtistName(artist.name);
                return (
                  <>
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 sm:w-12 md:w-16 h-[2px] sm:h-[3px] bg-[#A8D5BA]" />
                      <span className="text-[#A8D5BA] font-black tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase block">
                        <span className="block">{eng.firstName}</span>
                        {eng.lastName && <span className="block">{eng.lastName}</span>}
                      </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem] font-black text-white mt-2 leading-[0.8] tracking-tighter uppercase italic drop-shadow-2xl">
                      <span className="block">{heb.firstName}</span>
                      {heb.lastName && <span className="block">{heb.lastName}</span>}
                    </h2>
                  </>
                );
              })()}
            </div>
            
            <div className="space-y-6 sm:space-y-8 md:space-y-10">
              <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight tracking-tight italic">
                {artist.description}
              </p>
              <div className="h-px w-full bg-gradient-to-l from-white/20 to-transparent" />
              <p className="text-gray-400 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium pr-4 sm:pr-6 md:pr-10 border-r-2 sm:border-r-4 border-[#A8D5BA]/30">
                {artist.fullDetails}
              </p>
            </div>
            
            <div className="pt-6 sm:pt-8 md:pt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
              <button 
                onClick={() => {
                   onClose();
                   const contactEl = document.getElementById('contact');
                   if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 bg-[#A8D5BA] text-black py-5 sm:py-6 md:py-7 lg:py-8 px-6 sm:px-8 md:px-10 lg:px-12 rounded-xl sm:rounded-[1.5rem] md:rounded-[2rem] font-black text-base sm:text-lg md:text-xl lg:text-2xl hover:bg-white transition-all flex items-center justify-center gap-3 sm:gap-4 md:gap-5 shadow-[0_20px_50px_rgba(168,213,186,0.3)] transform hover:-translate-y-2 active:translate-y-0 uppercase tracking-tighter"
              >
                <Calendar size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" strokeWidth={2.5} />
                בדוק זמינות להופעה
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistModal;
