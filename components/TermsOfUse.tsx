
import React from 'react';
import { X } from 'lucide-react';

interface TermsOfUseProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfUse: React.FC<TermsOfUseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white text-black w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 md:p-12 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="סגור תקנון ותנאי שימוש"
        >
          <X size={24} />
        </button>

        <div className="space-y-8 text-right" dir="rtl">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-8 border-b-4 border-[#A8D5BA] inline-block">
            תקנון ותנאי שימוש
          </h2>

          <div className="bg-[#E8F5ED] border-r-4 border-[#A8D5BA] p-4 mb-6 text-sm">
            <strong>הבהרה משפטית:</strong> מסמך זה מהווה תבנית כללית לתנאי שימוש. מומלץ להיוועץ עם עורך דין כדי לוודא הגנה משפטית מרבית המותאמת לאופי העסק.
          </div>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">1. כללי</h3>
            <p className="text-lg leading-relaxed">
              השימוש באתר "קדמא לייב" (להלן: "האתר") כפוף לתנאי השימוש המפורטים להלן. גלישה באתר או שימוש בשירותיו מהווים הסכמה מפורשת לתנאים אלו.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">2. הקניין הרוחני</h3>
            <p className="text-lg leading-relaxed">
              כל התכנים המופיעים באתר, לרבות טקסטים, תמונות, לוגואים, סרטונים ועיצובים, הם רכושה הבלעדי של קדמא לייב או של האמנים המיוצגים על ידה. אין להעתיק, להפיץ או להשתמש בתכנים אלו ללא אישור מראש ובכתב.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">3. הגבלת אחריות</h3>
            <p className="text-lg leading-relaxed">
              המידע באתר מוצג כפי שהוא ("As Is"). קדמא לייב עושה מאמצים להבטיח את דיוק המידע, אך אינה אחראית לטעויות, השמטות או נזקים ישירים או עקיפים שייגרמו כתוצאה מהסתמכות על המידע באתר.
              <br />
              המלצות ה-AI באתר הן בגדר הצעה בלבד ואינן מהוות התחייבות להתאמה מוחלטת של האמן לאירוע.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">4. שימוש בשירותי האתר</h3>
            <p className="text-lg leading-relaxed">
              המשתמש מתחייב למסור פרטים נכונים ומדויקים בטופס יצירת הקשר. חל איסור על שימוש לרעה באתר, לרבות ניסיונות פריצה, הפצת וירוסים או שימוש בשפה בוטה בשאילתות ה-AI.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">5. קישורים לצדדים שלישיים</h3>
            <p className="text-lg leading-relaxed">
              האתר עשוי להכיל קישורים לאתרים חיצוניים (כגון רשתות חברתיות). קדמא לייב אינה אחראית לתוכן אתרים אלו או למדיניות הפרטיות שלהם.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">6. שינויים ותקלות</h3>
            <p className="text-lg leading-relaxed">
              החברה רשאית להפסיק את פעילות האתר או לשנות את תנאי השימוש בכל עת ללא הודעה מוקדמת. החברה אינה מתחייבת כי האתר יהיה חסין מתקלות טכניות או מהפרעות בשירות.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">7. סמכות שיפוט</h3>
            <p className="text-lg leading-relaxed">
              על תנאים אלו יחולו אך ורק דיני מדינת ישראל. מקום השיפוט הבלעדי לכל עניין הנוגע לתנאים אלו יהיה בבתי המשפט המוסמכים במחוז תל אביב-יפו.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-100 text-sm text-gray-500">
            עדכון אחרון: ינואר 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
