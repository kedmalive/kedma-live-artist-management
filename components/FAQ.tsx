import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'איך מזמינים אמן דרך קדמא לייב?',
    answer:
      'פשוט מאוד — ממלאים את טופס יצירת הקשר באתר או פונים אלינו בוואטסאפ. ניצור איתכם קשר תוך 24 שעות, נבין את אופי האירוע, התקציב והקהל, ונציע את האמן המתאים ביותר עם הצעת מחיר מפורטת.',
  },
  {
    question: 'אילו סוגי אירועים אתם מפיקים?',
    answer:
      'אנחנו מפיקים מגוון רחב של אירועים: חתונות, אירועי חברה ובכירים, מסיבות פרטיות, הופעות לקהילות, ערבי גאלה, אירועי השקה, פסטיבלים והופעות אקוסטיות אינטימיות. כל אירוע מקבל התאמה אישית מלאה לפי האווירה והקהל.',
  },
  {
    question: 'מה כולל המחיר של מופע?',
    answer:
      'המחיר תלוי באמן, באורך המופע, בהרכב (סולו / להקה / אקוסטי), ובמיקום האירוע. בדרך כלל אנחנו מציעים חבילות שכוללות גם הגברה ובמה אם נדרש. נשמח לבנות לכם הצעה מותאמת לאחר שיחת אפיון קצרה.',
  },
  {
    question: 'באילו אזורים בארץ אתם פעילים?',
    answer:
      'קדמא לייב פעילה בכל רחבי ישראל — מהצפון ועד אילת. האמנים שלנו מופיעים גם בחו"ל לקהילות יהודיות ולאירועים פרטיים, על פי בקשה.',
  },
  {
    question: 'כמה זמן מראש צריך להזמין אמן?',
    answer:
      'מומלץ להזמין כמה שיותר מוקדם — אמנים מובילים כמו אביתר בנאי, מארק אליהו, דודו טסה ושולי רנד נסגרים מספר חודשים מראש, במיוחד לעונות החתונות והחגים. עם זאת, אנחנו תמיד מנסים לעזור גם בהזמנות ברגע האחרון.',
  },
  {
    question: 'האם אפשר לשלב כמה אמנים באותו אירוע?',
    answer:
      'בהחלט. אחת ההתמחויות שלנו היא הפקת מופעים משולבים — דואט, ג׳אם סשן, או רצף הופעות באירוע אחד. נשמח לבנות איתכם פורמט יצירתי שיתאים בדיוק לאווירה שאתם רוצים ליצור.',
  },
];

const FAQItemRow: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-white/10">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between gap-4 py-6 sm:py-8 text-right hover:text-[#A8D5BA] transition-colors"
    >
      <span className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">{item.question}</span>
      <ChevronDown
        size={28}
        className={`flex-shrink-0 text-[#A8D5BA] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen ? 'max-h-[600px] opacity-100 pb-6 sm:pb-8' : 'max-h-0 opacity-0'
      }`}
    >
      <p className="text-gray-300 text-lg sm:text-xl leading-relaxed font-medium">{item.answer}</p>
    </div>
  </div>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
    const existing = document.getElementById('faq-jsonld');
    if (existing) existing.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById('faq-jsonld')?.remove();
    };
  }, []);

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-black border-y border-white/5">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-[#A8D5BA]" />
            <span className="text-[#A8D5BA] text-xs sm:text-sm font-black tracking-[0.2em] uppercase">FAQ</span>
            <div className="w-12 h-[2px] bg-[#A8D5BA]" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic">
            שאלות נפוצות
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl mt-6 font-medium">
            כל מה שרציתם לדעת על הזמנת אמן לאירוע שלכם
          </p>
        </div>

        <div className="space-y-0">
          {FAQ_ITEMS.map((item, idx) => (
            <FAQItemRow
              key={item.question}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
