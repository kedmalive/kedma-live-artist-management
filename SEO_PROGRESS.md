# SEO + GEO — מסמך מעקב חי

> **לקלוד:** זה מקור האמת היחיד למצב פרויקט ה-SEO. תקרא את זה בתחילת כל סשן ותעדכן אותו בסוף.
>
> **שפה:** עברית. ללא תרגום לאנגלית. כל הקוד עצמו נשאר באנגלית, אבל הטקסטים הגלויים והתיעוד — עברית.
>
> **מנהה:** לעדכן את הקובץ הזה בכל שינוי קוד או מצב.

---

## סטטוס כללי
**גל נוכחי:** גל 1 ✅ | גל 2 ✅ | גל 4 (GEO ל-AI) 🚧 בעבודה
**עדכון אחרון:** 2026-05-29

---

## גל 1 — תיקוני יסוד ✅ הסתיים

- ✅ `public/sitemap.xml` — נקי, רק `https://kedma-live.com/` עם `lastmod` תקין
- ✅ `public/robots.txt` — פתוח ל-AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- ✅ `public/llms.txt` — נוצר בגל 4 (לא היה קיים בפועל למרות שתועד כאן בעבר)
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

## גל 4 — GEO ל-AI (ChatGPT / Perplexity / Claude) 🚧 בעבודה

⚠️ **פער שהתגלה:** גל 1 תיעד `llms.txt` ו-robots.txt "פתוח ל-AI crawlers" כ-✅, אבל בפועל הקובץ `llms.txt` לא היה קיים ו-robots.txt הכיל רק `User-agent: *`. תוקן בגל זה.

### משימות

#### 4.1 `public/llms.txt` ✅ הושלם (29/05/2026)
- ✅ נוצר קובץ `llms.txt` מלא לפי מוסכמת llmstxt.org (כותרת + summary + סקשנים עם קישורים).
- ✅ תיאור החברה, אזורי פעילות, סוגי אירועים, פרטי קשר ואנשי קשר.
- ✅ רשימת 7 האמנים עם קטגוריה, שם אנגלי וקישור ישיר לדף האמן.
- ✅ סיכום שאלות נפוצות (6 שאלות) בפורמט Q&A קצר לציטוט ע"י LLMs.
- ✅ קישורים לעמודי הבית, FAQ, הופעות ויצירת קשר.

#### 4.2 robots.txt — הרשאות מפורשות ל-AI crawlers ✅ הושלם (29/05/2026)
- ✅ נוספו כללי `Allow` מפורשים: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot(-Extended), Bingbot, CCBot, cohere-ai.

### לעשות אחר כך (גל 4 — נותר)
- 📌 לאחר deploy: לוודא ש-`https://kedma-live.com/llms.txt` ו-`robots.txt` מוגשים נכון (Content-Type, 200).
- 📌 לשקול `llms-full.txt` עם ביוגרפיות מלאות (fullDetails) לכל אמן.
- 📌 להרחיב את ה-FAQ (כיום 6 שאלות) בשאלות מכוונות-AI: "מי האמנים הכי מבוקשים?", "כמה עולה להזמין X?", "אמן לחתונה דתית".
- 📌 לבדוק ציטוט בפועל ב-ChatGPT/Perplexity על שאילתות כמו "הזמנת אמנים לאירוע בישראל".

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
