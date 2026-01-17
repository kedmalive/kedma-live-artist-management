
import React, { useEffect } from 'react';
import { X, Calendar, Share2, Instagram, Music, Globe } from 'lucide-react';
import { Artist } from '../types';

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl transition-opacity animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-[#080808] w-full max-w-7xl h-full md:h-auto md:max-h-[85vh] rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col lg:flex-row rtl-grid animate-fade-in-up border border-white/10">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 left-8 z-[80] bg-white text-black p-4 rounded-full hover:bg-[#A8D5BA] transition-all transform hover:rotate-90 shadow-2xl"
        >
          <X size={24} strokeWidth={3} />
        </button>
        
        {/* Image Area */}
        <div className="w-full lg:w-1/2 h-[350px] lg:h-auto relative overflow-hidden group">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-12 right-12 left-12 flex justify-between items-end">
             <div className="bg-[#A8D5BA] text-black px-6 py-2 rounded-full text-xs font-black tracking-[0.2em] shadow-2xl">
               {artist.credit || ''}
             </div>
            <div className="flex gap-4">
              <button className="bg-white/10 backdrop-blur-xl p-5 rounded-full text-white hover:bg-[#A8D5BA] hover:text-black transition-all border border-white/10">
                <Music size={28} />
              </button>
              <button className="bg-white/10 backdrop-blur-xl p-5 rounded-full text-white hover:bg-[#A8D5BA] hover:text-black transition-all border border-white/10">
                <Instagram size={28} />
              </button>
              {artist.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-xl p-5 rounded-full text-white hover:bg-[#A8D5BA] hover:text-black transition-all border border-white/10"
                >
                  <Globe size={28} />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="w-full lg:w-1/2 p-12 lg:p-24 text-right rtl overflow-y-auto">
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-[3px] bg-[#A8D5BA]" />
                <span className="text-[#A8D5BA] font-black tracking-[0.3em] text-sm uppercase">
                  {artist.englishName}
                </span>
              </div>
              <h2 className="text-7xl lg:text-[7rem] font-black text-white mt-2 leading-[0.8] tracking-tighter uppercase italic drop-shadow-2xl">
                {artist.name}
              </h2>
            </div>
            
            <div className="space-y-10">
              <p className="text-white text-3xl lg:text-4xl font-black leading-tight tracking-tight italic">
                {artist.description}
              </p>
              <div className="h-px w-full bg-gradient-to-l from-white/20 to-transparent" />
              <p className="text-gray-400 text-2xl leading-relaxed font-medium pr-10 border-r-4 border-[#A8D5BA]/30">
                {artist.fullDetails}
              </p>
            </div>
            
            <div className="pt-10 flex flex-col sm:flex-row gap-8">
              <button 
                onClick={() => {
                   onClose();
                   const contactEl = document.getElementById('contact');
                   if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 bg-[#A8D5BA] text-black py-8 px-12 rounded-[2rem] font-black text-2xl hover:bg-white transition-all flex items-center justify-center gap-5 shadow-[0_20px_50px_rgba(168,213,186,0.3)] transform hover:-translate-y-2 active:translate-y-0 uppercase tracking-tighter"
              >
                <Calendar size={32} strokeWidth={2.5} />
                בדוק זמינות להופעה
              </button>
              <button className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-white hover:bg-white hover:text-black transition-all flex items-center justify-center">
                <Share2 size={32} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistModal;
