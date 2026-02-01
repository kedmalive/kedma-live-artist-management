
import React, { useState } from 'react';
import { Accessibility, X, Type, Contrast, MousePointer2, RefreshCw, FileText } from 'lucide-react';
import AccessibilityStatement from './AccessibilityStatement';

interface AccessibilityMenuProps {
  accessibilitySettings: {
    fontSize: 'normal' | 'large' | 'extra';
    highContrast: boolean;
    underlineLinks: boolean;
  };
  updateSettings: (settings: any) => void;
  resetSettings: () => void;
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ 
  accessibilitySettings, 
  updateSettings, 
  resetSettings 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[90] bg-[#A8D5BA] text-black p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-[#B5E5CF]"
        aria-label="תפריט נגישות"
      >
        <Accessibility size={28} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
      </button>

      {/* Accessibility Menu */}
      {isOpen && (
        <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[90] w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white text-black rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="p-4 sm:p-6 bg-[#A8D5BA] text-black flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tight">תפריט נגישות</h3>
            <button onClick={toggleMenu} className="hover:bg-black/10 rounded-full p-1 transition-colors">
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6" dir="rtl">
            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Type size={20} />
                <span className="font-bold">גודל גופן</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'extra'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`py-2 rounded-xl text-sm font-bold transition-all ${
                      accessibilitySettings.fontSize === size 
                        ? 'bg-[#A8D5BA] text-black' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {size === 'normal' ? 'רגיל' : size === 'large' ? 'גדול' : 'ענק'}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <button
              onClick={() => updateSettings({ highContrast: !accessibilitySettings.highContrast })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                accessibilitySettings.highContrast 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Contrast size={20} />
                <span className="font-bold">ניגודיות גבוהה</span>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${accessibilitySettings.highContrast ? 'bg-[#A8D5BA]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${accessibilitySettings.highContrast ? 'right-5' : 'right-1'}`} />
              </div>
            </button>

            {/* Underline Links */}
            <button
              onClick={() => updateSettings({ underlineLinks: !accessibilitySettings.underlineLinks })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                accessibilitySettings.underlineLinks 
                  ? 'bg-[#E8F5ED] text-[#2D5F42] border-2 border-[#A8D5BA]/20' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <MousePointer2 size={20} />
                <span className="font-bold">הדגשת קישורים</span>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${accessibilitySettings.underlineLinks ? 'bg-[#A8D5BA]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${accessibilitySettings.underlineLinks ? 'right-5' : 'right-1'}`} />
              </div>
            </button>

            <div className="h-px bg-gray-100" />

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsStatementOpen(true)}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <FileText size={20} className="text-[#7FB394]" />
                <span className="text-xs font-bold">הצהרת נגישות</span>
              </button>
              <button
                onClick={resetSettings}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <RefreshCw size={20} className="text-gray-400" />
                <span className="text-xs font-bold">איפוס הגדרות</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <AccessibilityStatement 
        isOpen={isStatementOpen} 
        onClose={() => setIsStatementOpen(false)} 
      />
    </>
  );
};

export default AccessibilityMenu;
