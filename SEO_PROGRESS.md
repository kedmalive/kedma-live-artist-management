# SEO + GEO — מסמך מעקב חי

> **לקלוד:** זה מקור האמת היחיד למצב פרויקט ה-SEO. תקרא את זה בתחילת כל סשן ותעדכן אותו בסוף.
>
> **שפה:** עברית. ללא תרגום לאנגלית. כל הקוד עצמו נשאר באנגלית, אבל הטקסטים הגלויים והתיעוד — עברית.
>
> **מנהה:** לעדכן את הקובץ הזה בכל שינוי קוד או מצב.

---

## סטטוס כללי
**גל נוכחי:** גל 1 הסתיים ✅ | גל 2 — לא התחיל ⏸️
**עדכון אחרון:** 2026-05-24

---

## גל 1 — תיקוני יסוד ✅ הסתיים

- ✅ `public/sitemap.xml` — נקי, רק `https://kedma-live.com/` עם `lastmod` תקין
- ✅ `public/robots.txt` — פתוח ל-AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- ✅ `public/llms.txt` — קיים ומתאר את האתר ל-LLMs
- ✅ favicon מתוקן (`/favicon.svg`)
- ✅ Schema (EntertainmentBusiness + LocalBusiness JSON-LD) ב-`index.html`
- ✅ GA4 — Measurement ID מוטמע ומודד
- ✅ **Google Search Console — מאומת** (תג `google-site-verification` ב-`index.html`)
- ✅ sitemap הוגש ב-GSC (24/05/2026)

---

## גל 2 — בניית נכסי תוכן ⏸️ מוכן להתחיל

⚠️ **חשוב:** גל 2 דורש שינויי קוד אמיתיים (routing, קומפוננטות חדשות). לא רק תגי מטא.
לפני התחלה — להתייעץ עם המשתמש על סדר עדיפויות ולקבל אישור לכל commit.

### משימות (לפי עדיפות מומלצת)

#### 2.1 דפי אמן בודדים
- כל אמן מקבל route ייעודי: `/artists/avitar-banai`, `/artists/marc-eliyahu`, וכו'
- כל דף = ביוגרפיה מלאה + תיאור מופע + תמונות + סכמת `Person` JSON-LD
- צריך הוספת react-router (אם לא קיים) או פתרון routing אחר.
- עדכון `sitemap.xml` עם ה-URLs החדשים.

#### 2.2 Event schema + לוח הופעות חי
- בקובץ `data/upcomingShows.json` כבר יש מבנה.
- להוסיף `Event` JSON-LD לכל הופעה עתידית ב-`index.html` או דינמית.
- ודא שזה מופיע ב-rich results בחיפוש Google.

#### 2.3 סקשן FAQ
- "כמה עולה להזמין אמן?" "איך מזמינים?" "אילו אמנים זמינים?" וכו'.
- `FAQPage` JSON-LD schema.
- קומפוננטה גלויה בעמוד הבית.

#### 2.4 שדרוג Schema קיים
- להוסיף `aggregateRating` אם יש ביקורות.
- להוסיף `event` ל-`EntertainmentBusiness` המרכזי.

---

## גל 3 — אופטימיזציה ומדידה (עתיד)

- ניתוח ביצועים ב-GSC אחרי 30 יום (impressions, CTR, queries).
- Core Web Vitals — לבדוק עם PageSpeed.
- backlinks ו-outreach.

---

## הנחיות לקלוד עתידי

1. **קרא קודם** — כל סשן חדש בריפו הזה מתחיל בקריאת הקובץ הזה.
2. **שלוש שלושות מקבילי-Google** — אופטימיזציה לחיפוש Google הקלאסי, ChatGPT/AI, וקולי (Siri/Alexa). שווה ראשונה.
3. **ללא גרסת אנגלית** — הלקוח קורא עברית בלבד. כל טקסט חייב להיות בעברית פשוטה.
4. **commits בעברית** — כמו ההיסטוריה הקיימת.
5. **בכל שינוי** — לעדכן את הקובץ הזה (גם תוך כדי, גם בסוף הסשן). מבנה: הסבר ב-commit "מה שונה היסטורית ולמה".

---

## קישורים שימושיים

- אתר חי: https://kedma-live.com
- GSC: https://search.google.com/search-console
- GA4: (להוסיף קישור פרויקט)
- Vercel: (להוסיף קישור פרויקט)
