
import React, { useState } from 'react';
import { Sparkles, Loader2, Search, CheckCircle2 } from 'lucide-react';
import { getArtistRecommendation, RecommendationResponse } from '../services/geminiService';
import { Artist } from '../types';
import { ARTISTS_DATA } from '../constants';

interface AIConsultantProps {
  onSelectArtist: (artist: Artist) => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ onSelectArtist }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    const result = await getArtistRecommendation(prompt);
    setRecommendation(result);
    setLoading(false);
  };

  const recommendedArtist = recommendation 
    ? ARTISTS_DATA.find(a => a.id === recommendation.artistId) 
    : null;

  return (
    <section id="ai-consultant" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-black relative">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass p-8 md:p-16 rounded-[4rem] border border-[#A8D5BA]/10 relative overflow-hidden">
            {/* Geometric accents like the provided image */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#A8D5BA] rounded-full blur-3xl opacity-10" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white rounded-full blur-3xl opacity-5" />
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 bg-[#A8D5BA]/10 text-[#A8D5BA] px-5 py-2 rounded-full border border-[#A8D5BA]/20 text-xs font-black uppercase tracking-widest">
                  <Sparkles size={14} />
                  Booking Assistant AI
                </div>
                <h2 className="text-5xl md:text-7xl font-black leading-none text-white tracking-tighter">
                  מצאו את המופע<br/>
                  <span className="text-[#A8D5BA]">הנכון עבורכם.</span>
                </h2>
                <p className="text-gray-400 text-xl leading-relaxed max-w-lg">
                  הטכנולוגיה שלנו מנתחת את צרכי האירוע שלכם וממליצה על האמן המדויק ביותר מהנבחרת של קדמא.
                </p>
                
                <form onSubmit={handleConsult} className="relative group max-w-xl">
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="תארו את האירוע שלכם כאן..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#A8D5BA] transition-all text-xl pr-16"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search size={28} />
                  </div>
                  <button 
                    disabled={loading}
                    className="mt-6 w-full md:w-auto bg-[#A8D5BA] hover:bg-[#B5E5CF] disabled:bg-[#6BA080] text-black font-black py-5 px-12 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-[#A8D5BA]/30 text-lg uppercase"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        <Sparkles size={24} />
                        קבל המלצה חכמה
                      </>
                    )}
                  </button>
                </form>
              </div>

              {recommendation && recommendedArtist && (
                <div className="w-full lg:w-[360px] animate-fade-in-up">
                  <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 space-y-6">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6">
                      <img src={recommendedArtist.image} alt={recommendedArtist.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-6">
                        <span className="text-white font-black text-2xl uppercase tracking-tighter">{recommendedArtist.name}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#A8D5BA] text-sm font-black uppercase">
                        <CheckCircle2 size={18} />
                        AI Recommended Match
                      </div>
                      <p className="text-gray-300 text-base italic leading-relaxed">
                        "{recommendation.reason}"
                      </p>
                    </div>
                    <button 
                      onClick={() => onSelectArtist(recommendedArtist)}
                      className="w-full bg-white text-black py-4 rounded-xl font-black hover:bg-[#A8D5BA] transition-colors text-sm uppercase tracking-widest"
                    >
                      פרופיל אמן מלא
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIConsultant;
