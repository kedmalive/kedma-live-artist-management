
import React from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { Artist } from '../types';
import { splitArtistName } from '../constants';

interface ArtistCardProps {
  artist: Artist;
  onClick: (artist: Artist) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => (
  <div 
    className="group relative h-[450px] sm:h-[500px] md:h-[550px] w-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:shadow-[#A8D5BA]/40 bg-[#0a0a0a] border border-white/5"
    onClick={() => onClick(artist)}
  >
    {/* Base Image Layer - Top-aligned so faces/heads are not cut off on mobile */}
    <img 
      src={artist.image} 
      alt={`${artist.name} - ${artist.category} | ${artist.englishName} - קדמא לייב ייצוג אמנים`}
      title={`${artist.name} - ${artist.description}`}
      className="absolute inset-0 w-full h-full object-cover object-top md:object-[center_20%] transition-all duration-1000 group-hover:scale-110"
      loading="lazy"
      onError={(e) => {
        console.error(`Failed to load image: ${artist.image}`, e);
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800';
      }}
    />

    {/* Elegant Gradient Overlay - More transparent at the top to show faces */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
    
    {/* Subtle Inner Glow */}
    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl sm:rounded-2xl z-15 pointer-events-none" />

    {/* Photographer Credit */}
    {artist.credit && (
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
        <span className="bg-black/60 backdrop-blur-md text-[9px] sm:text-[10px] text-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 border border-white/10 font-bold uppercase tracking-wider">
          <Camera size={10} className="sm:w-3 sm:h-3 text-[#A8D5BA]" />
          {artist.credit}
        </span>
      </div>
    )}

    {/* Content Layer - Positioned for maximum readability. On mobile, description + CTA always visible (no hover). */}
    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 z-30 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-500">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="w-8 sm:w-10 h-[2px] bg-[#A8D5BA]" />
        <span className="text-[#A8D5BA] text-[10px] sm:text-[11px] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase block">
          {(() => {
            const { firstName, lastName } = splitArtistName(artist.englishName);
            return (
              <>
                <span className="block">{firstName}</span>
                {lastName && <span className="block">{lastName}</span>}
              </>
            );
          })()}
        </span>
      </div>
      
      <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 group-hover:text-[#A8D5BA] transition-colors tracking-tighter leading-none uppercase italic">
        {(() => {
          const { firstName, lastName } = splitArtistName(artist.name);
          return (
            <>
              <span className="block">{firstName}</span>
              {lastName && <span className="block">{lastName}</span>}
            </>
          );
        })()}
      </h3>
      
      <div className="max-h-40 opacity-100 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-40 sm:group-hover:opacity-100 overflow-hidden transition-all duration-700 ease-in-out">
        <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-2 font-medium">
          {artist.description}
        </p>
        <div className="flex items-center text-black bg-[#A8D5BA] text-xs font-black gap-2 group-hover:gap-4 transition-all uppercase tracking-tighter w-fit px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl hover:bg-white">
          לפרופיל המלא <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
        </div>
      </div>
    </div>
  </div>
);

export default ArtistCard;
