
import React from 'react';
import { X } from 'lucide-react';

interface AccessibilityStatementProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityStatement: React.FC<AccessibilityStatementProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white text-black w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 md:p-12 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="סגור הצהרת נגישות"
        >
          <X size={24} />
        </button>

        <div className="space-y-8 text-right" dir="rtl">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-8 border-b-4 border-amber-500 inline-block">
            הצהרת נגישות
          </h2>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold">מבוא</h3>
            <p className="text-lg leading-relaxed">
              אנו ב-"קדמא לייב" (Kedma Live) רואים חשיבות עליונה במתן שירות שוויוני לכלל הגולשים ובשיפור חווית הגלישה באתר. אנו משקיעים משאבים רבים כדי להפוך את האתר לידידותי ונגיש עבור אנשים עם מוגבלויות, מתוך אמונה כי לכל אדם מגיעה הזכות לחיות בשוויון, כבוד, נוחות ועצמאות.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold">התאמות הנגישות באתר</h3>
            <p className="text-lg leading-relaxed">
              האתר הונגש בהתאם להוראות הנגישות המופיעות ב-WCAG 2.1 ברמה AA. 
              התאמות הנגישות שבוצעו כוללות בין היתר:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mr-4">
              <li>ניווט מקלדת מלא.</li>
              <li>תמיכה בקוראי מסך.</li>
              <li>אפשרות להגדלת גופנים.</li>
              <li>מצב ניגודיות גבוהה.</li>
              <li>הדגשת קישורים.</li>
              <li>תגיות alt לתמונות.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold">הצהרה על עמידה חלקית בתקן (במידה וקיים)</h3>
            <p className="text-lg leading-relaxed">
              האתר נבדק בדפדפנים המובילים (Chrome, Firefox, Safari, Edge) ומותאם לצפייה במכשירים ניידים. 
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold">פרטי רכז נגישות</h3>
            <p className="text-lg leading-relaxed font-bold">
              לכל שאלה, בקשה או הצעה לשיפור הנגישות, ניתן לפנות לרכז הנגישות שלנו:
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
              <p>שם: גלעד קרונמן</p>
              <p>טלפון: 054-6507710 / 050-4844614</p>
              <p>אימייל: kedmalive1@gmail.com</p>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-100 text-sm text-gray-500">
            עדכון אחרון: ינואר 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
