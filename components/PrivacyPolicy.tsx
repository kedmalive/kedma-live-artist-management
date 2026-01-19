
import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white text-black w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 md:p-12 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="סגור מדיניות פרטיות"
        >
          <X size={24} />
        </button>

        <div className="space-y-8 text-right" dir="rtl">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-8 border-b-4 border-[#A8D5BA] inline-block">
            מדיניות פרטיות
          </h2>

          <div className="bg-[#E8F5ED] border-r-4 border-[#A8D5BA] p-4 mb-6 text-sm">
            <strong>הבהרה משפטית:</strong> מסמך זה מהווה תבנית כללית למדיניות פרטיות. מומלץ להיוועץ עם עורך דין המתמחה בתחום כדי לוודא התאמה מלאה לצרכים הספציפיים של העסק ולדרישות החוק המשתנות.
          </div>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">1. מבוא</h3>
            <p className="text-lg leading-relaxed">
              קדמא לייב (להלן: "החברה" או "אנחנו") מכבדת את פרטיות המשתמשים באתר (להלן: "המשתמש" או "אתה"). מדיניות פרטיות זו מפרטת כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שאתה מספק לנו בעת השימוש באתר.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">2. המידע שאנו אוספים</h3>
            <p className="text-lg leading-relaxed">
              אנו אוספים מידע שהמשתמש מוסר מרצונו החופשי בעת מילוי טופס יצירת קשר או שימוש בשירותים באתר:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mr-4">
              <li>פרטי קשר: שם מלא, כתובת דוא"ל, ומספר טלפון.</li>
              <li>פרטי האירוע: סוג האירוע וכל מידע נוסף שתבחר לפרט בהודעתך.</li>
              <li>שאילתות לייעוץ AI: תוכן השאלות שאתה מזין במערכת הייעוץ החכם שלנו.</li>
              <li>מידע טכני: כתובת IP, סוג דפדפן, מערכת הפעלה ונתוני שימוש באתר (באמצעות קבצי Cookies וטכנולוגיות דומות).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">3. השימוש במידע</h3>
            <p className="text-lg leading-relaxed">
              המידע הנאסף ישמש למטרות הבאות:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mr-4">
              <li>יצירת קשר עם המשתמש בעקבות פנייתו.</li>
              <li>מתן המלצות מותאמות אישית באמצעות מערכת ה-AI שלנו.</li>
              <li>שיפור ושדרוג האתר וחווית המשתמש.</li>
              <li>שליחת עדכונים או מידע שיווקי (בכפוף להסכמתך המפורשת, ככל שתידרש בחוק).</li>
              <li>מילוי דרישות משפטיות או הגנה על זכויותינו במקרה של תביעה.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">4. העברת מידע לצדדים שלישיים</h3>
            <p className="text-lg leading-relaxed">
              החברה לא תמכור או תשכיר את המידע האישי שלך לצדדים שלישיים. אנו עשויים לשתף מידע במקרים הבאים בלבד:
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg mr-4">
              <li>ספקי שירותים: כגון שירותי ה-AI של Google (Gemini API) לצורך עיבוד הבקשות לייעוץ, או ספקי אחסון אתרים.</li>
              <li>לפי דרישה משפטית: אם נחויב לעשות כן על פי צו שיפוטי או דרישת רשות מוסמכת.</li>
              <li>הגנה על החברה: במקרה של הליכים משפטיים בין המשתמש לחברה.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">5. אבטחת מידע</h3>
            <p className="text-lg leading-relaxed">
              אנו נוקטים באמצעי אבטחה מקובלים כדי להגן על המידע האישי שלך מפני גישה בלתי מורשית, אובדן או שימוש לרעה. עם זאת, יש לזכור כי אף אמצעי אבטחה באינטרנט אינו בטוח ב-100%.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">6. זכויות המשתמש</h3>
            <p className="text-lg leading-relaxed">
              בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, הינך זכאי לעיין במידע המוחזק עליך במאגר המידע שלנו, לבקש לתקנו או למחקו במידה ואינו מדויק או אינו רלוונטי עוד.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">7. עוגיות (Cookies)</h3>
            <p className="text-lg leading-relaxed">
              האתר משתמש ב-"עוגיות" לצורך תפעולו השוטף והתקין, לאיסוף נתונים סטטיסטיים ולהתאמת האתר להעדפותיך. באפשרותך לשנות את הגדרות הדפדפן שלך כדי לחסום עוגיות, אך הדבר עלול לפגוע בחלק משירותי האתר.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">8. שינויים במדיניות הפרטיות</h3>
            <p className="text-lg leading-relaxed">
              החברה רשאית לעדכן את מדיניות הפרטיות מעת לעת. שינויים מהותיים יפורסמו באתר וייכנסו לתוקף מיד עם פרסומם.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-bold text-[#7FB394]">9. יצירת קשר</h3>
            <p className="text-lg leading-relaxed">
              לכל שאלה או פנייה בנושא פרטיות, ניתן ליצור עמנו קשר בכתובת:
              <br />
              <strong>אימייל:</strong> info@kedma-live.com
              <br />
              <strong>טלפון:</strong> 054-6507710 / 050-4844614
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

export default PrivacyPolicy;
