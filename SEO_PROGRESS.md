# SEO + GEO — מסמך מעקב חי

> **לקלוד:** זה מקור האמת היחיד למצב פרויקט ה-SEO. תקרא את זה בתחילת כל סשן ותעדכן אותו בסוף.
>
> **שפה:** עברית. ללא תרגום לאנגלית. כל הקוד עצמו נשאר באנגלית, אבל הטקסטים הגלויים והתיעוד — עברית.
>
> **מנהה:** לעדכן את הקובץ הזה בכל שינוי קוד או מצב.

---

## סטטוס כללי
**גל נוכחי:** גל 1 ✅ | גל 2 ✅ הסתיים (2.1, 2.2, 2.3, 2.4 הושלמו)
**עדכון אחרון:** 2026-05-26

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

## גל 2 — בניית נכסי תוכן 🚧 בעבודה

⚠️ **חשוב:** גל 2 דורש שינויי קוד אמיתיים (routing, קומפוננטות חדשות). לא רק תגי מטא.
לפני התחלה — להתייעץ עם המשתמש על סדר עדיפויות ולקבל אישור לכל commit.

### משימות (לפי עדיפות מומלצת)

#### 2.1 דפי אמן בודדים ✅ הושלם (26/05/2026)
- ✅ `react-router-dom` הוטמע. `BrowserRouter` ב-`index.tsx`, `Routes` ב-`App.tsx`.
- ✅ כל אמן מקבל route בעברית: `/artists/אביתר-בנאי`, `/artists/מארק-אליהו`, וכו' (URL-encoded UTF-8).
- ✅ `components/ArtistPage.tsx` חדש — דף מלא: תמונה, ביוגרפיה (`fullDetails`), קישורים (Spotify/Instagram/אתר), breadcrumb, CTA חזרה לטופס יצירת קשר.
- ✅ JSON-LD `Person` + `BreadcrumbList` דינמיים בכל דף אמן.
- ✅ `<title>` ו-`<meta description>` + Open Graph + Twitter Cards + canonical — מתעדכנים פר-אמן.
- ✅ `ArtistCard` נטוון ל-`<Link>` (במקום פתיחת modal) — מאפשר crawl, שיתוף ישיר ו-back/forward של הדפדפן.
- ✅ `public/sitemap.xml` כולל 7 URLs חדשים (אחד לכל אמן) + lastmod 26/05/2026.
- ✅ `vercel.json` כבר עם rewrite `/(.*)→/index.html` — תומך deep-link ל-SPA.
- ✅ `ArtistModal` הוסר משימוש (הקובץ קיים, ניתן למחיקה בעתיד אם לא נדרש).
- 📌 **לעשות אחר כך:** להגיש את ה-sitemap המעודכן ב-GSC, ולבדוק שדפי האמנים נסרקים (URL Inspection).

#### 2.2 Event schema + לוח הופעות חי ✅ הושלם (26/05/2026)
- ✅ JSON-LD דינמי ב-`components/UpcomingShows.tsx` כבר היה — שודרג:
  - `Event` → `MusicEvent`
  - `eventStatus` + `eventAttendanceMode` (חובה ב-Google Rich Results)
  - `performer`: `Person` → `MusicGroup`
  - `organizer`: קדמא לייב
  - `address` כ-`PostalAddress` עם `addressCountry: IL`
  - `offers` עם `priceCurrency: ILS` ו-`availability: InStock` כשיש קישור כרטיסים
- 📌 **לעשות אחר כך:** Rich Results Test לאחר deploy.

#### 2.3 סקשן FAQ ✅ הושלם (26/05/2026)
- ✅ `components/FAQ.tsx` חדש — accordion עם 6 שאלות נפוצות.
- ✅ `FAQPage` JSON-LD מוזרק דינמית.
- ✅ שאלות מכוונות-טרמים: "איך מזמינים?", "אילו אירועים?", "מחיר?", "אזורי פעילות?", "הזמנה מראש?", "שילוב אמנים?".
- ✅ סקציה גלויה בעמוד הבית, בין UpcomingShows ל-Contact.

#### 2.4 שדרוג Schema קיים ✅ הושלם (26/05/2026)
- ✅ איחוד ל-`@graph` יחיד ב-`index.html` (במקום שני scripts נפרדים).
- ✅ `EntertainmentBusiness` + `LocalBusiness` (multi-type) עם `@id` יחיד למניעת ישויות כפולות.
- ✅ הוספת `WebSite` schema עם `SearchAction` (סיכוי ל-sitelinks search box).
- ✅ הוספת `ItemList` של 7 האמנים עם קישורים ישירים לדפי האמן.
- ✅ `contactPoint` הורחב: נציג נוסף ל-Booking.
- ✅ `knowsAbout`, `areaServed`, `makesOffer` (Service) — מחזק את ה-Knowledge Graph.
- ✅ `logo` כ-`ImageObject` מלא עם width/height.
- 📌 **לעשות אחר כך:** Schema.org Validator + Rich Results Test לאחר deploy.

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
