
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from '../types';

interface NavigationProps {
  isScrolled: boolean;
  scrollToSection: (id: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isScrolled, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks: NavLink[] = [
    { name: 'האמנים שלנו', target: 'artists' },
    { name: 'אודות', target: 'about' },
    { name: 'צור קשר', target: 'contact' },
  ];
  
  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navigation.tsx:20',message:'Navigation state change',data:{isOpen,isScrolled,windowWidth:window.innerWidth},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
  }, [isOpen, isScrolled]);
  // #endregion

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl py-2 sm:py-3 shadow-2xl border-b border-white/5' : 'bg-transparent py-4 sm:py-6'}`}>
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <div 
          className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-white cursor-pointer group flex items-center gap-1.5 sm:gap-2" 
          onClick={() => scrollToSection('hero')}
        >
          <div className="bg-amber-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-sm rotate-1 group-hover:rotate-0 transition-transform text-black">KEDMA</div>
          <span className="text-white">LIVE</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => scrollToSection(link.target)}
              className="text-white/70 hover:text-amber-500 transition-all font-bold text-sm tracking-wide uppercase"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('contact')} 
            className="bg-white text-black px-5 lg:px-6 py-2 lg:py-2.5 rounded-full font-black hover:bg-amber-500 transition-all transform hover:scale-105 active:scale-95 text-sm uppercase"
          >
            להזמנת מופע
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} className="sm:w-7 sm:h-7" /> : <Menu size={24} className="sm:w-7 sm:h-7" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/98 backdrop-blur-3xl border-t border-white/10 p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 items-center shadow-2xl animate-fade-in">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => {
                scrollToSection(link.target);
                setIsOpen(false);
              }}
              className="text-2xl sm:text-3xl text-white/90 font-black hover:text-amber-500 transition-colors uppercase"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => {
              scrollToSection('contact');
              setIsOpen(false);
            }}
            className="w-full max-w-sm bg-amber-500 text-black py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            להזמנת מופע עכשיו
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
