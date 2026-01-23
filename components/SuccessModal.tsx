
import React, { useEffect } from 'react';
import { X, CheckCircle, Mail, MessageCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, userName }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl transition-opacity animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#080808] w-full max-w-2xl rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(168,213,186,0.3)] animate-fade-in-up border border-white/10">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 bg-white/10 backdrop-blur-xl text-white p-3 sm:p-4 rounded-full hover:bg-[#A8D5BA] hover:text-black transition-all transform hover:rotate-90 shadow-2xl"
          aria-label="סגור"
        >
          <X size={24} className="sm:w-6 sm:h-6" strokeWidth={3} />
        </button>
        
        {/* Content */}
        <div className="p-8 sm:p-12 md:p-16 text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-[#A8D5BA] rounded-full p-6 sm:p-8 shadow-[0_0_50px_rgba(168,213,186,0.5)] animate-pulse">
              <CheckCircle size={64} className="sm:w-20 sm:h-20 text-black" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase italic">
              נשלח בהצלחה!
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-[#A8D5BA] uppercase tracking-tight">
              Successfully Sent!
            </p>
          </div>
          
          {/* Message */}
          <div className="space-y-6 text-gray-300 text-lg sm:text-xl md:text-2xl leading-relaxed">
            {userName && (
              <p className="text-white font-bold">
                תודה {userName}!
              </p>
            )}
            <p>
              הפרטים נשלחו בהצלחה. נחזור אליך בהקדם האפשרי.
            </p>
            <p className="text-gray-400 text-base sm:text-lg">
              Details sent successfully. We'll get back to you as soon as possible.
            </p>
          </div>
          
          {/* Icons */}
          <div className="flex justify-center gap-6 sm:gap-8 pt-4">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 rounded-full border border-white/20">
                <Mail size={32} className="sm:w-10 sm:h-10 text-[#A8D5BA]" strokeWidth={2} />
              </div>
              <span className="text-sm sm:text-base text-gray-400 font-bold">Email Sent</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-5 rounded-full border border-white/20">
                <MessageCircle size={32} className="sm:w-10 sm:h-10 text-[#25D366]" strokeWidth={2} />
              </div>
              <span className="text-sm sm:text-base text-gray-400 font-bold">WhatsApp Opened</span>
            </div>
          </div>
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-12 sm:px-16 py-5 sm:py-6 bg-[#A8D5BA] text-black font-black text-xl sm:text-2xl rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(168,213,186,0.4)] uppercase tracking-tighter mt-6"
          >
            סגור / Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
