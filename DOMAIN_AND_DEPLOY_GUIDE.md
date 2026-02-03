# מדריך: העברת דומיין מ-Wix והרצת האתר באוויר

מדריך צעד-אחר-צעד להעלאת האתר ל-Vercel וחיבור הדומיין שלך (כרגע ב-Wix) לאתר החדש.

---

## חלק א': הרצת האתר באוויר (Vercel)

### שלב 1: חיבור הפרויקט ל-Vercel

1. **היכנס ל-[vercel.com](https://vercel.com)** והתחבר (או צור חשבון עם GitHub).
2. **Import Project** → **Import Git Repository**.
3. בחר את הריפו: `kedma-live---artist-management` (או החיבור ל-GitHub שלך).
4. **Configure Project**:
   - **Framework Preset**: Vite (אמור להתגלות אוטומטית).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. לחץ **Deploy**. בתוך דקה־שתיים האתר יהיה באוויר בכתובת כמו:  
   `https://kedma-live---artist-management.vercel.app`

### שלב 2: משתני סביבה ב-Vercel (חשוב)

ב-**Vercel** → הפרויקט → **Settings** → **Environment Variables** הוסף:

| משתנה | תיאור |
|--------|--------|
| `VITE_EMAILJS_PUBLIC_KEY` | מפתח ציבורי מ-EmailJS (טופס יצירת קשר) |
| `VITE_EMAILJS_SERVICE_ID` | Service ID מ-EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | Template ID מ-EmailJS |
| `VITE_UPCOMING_SHOWS_CSV_URL` | קישור ל-CSV של ההופעות (אם משתמשים ב-Google Sheets) |
| `GEMINI_API_KEY` | (אופציונלי) רק אם משתמשים ב-AI Consultant |

אחרי הוספה: **Redeploy** לפרויקט (Deployments → שלוש נקודות על ה-deploy האחרון → Redeploy).

---

## חלק ב': חיבור הדומיין מ-Wix ל-Vercel

יש שתי דרכים עיקריות:

- **אפשרות א'** – להשאיר את הדומיין רשום ב-Wix, רק לשנות לאן הוא מצביע (הכי פשוט).
- **אפשרות ב'** – להעביר את רישום הדומיין מ-Wix ל-Registrar אחר (למשל ל-Vercel/Namecheap/Google Domains).

רוב המשתמשים צריכים רק **אפשרות א'**.

---

### אפשרות א': הדומיין נשאר ב-Wix – רק להפנות ל-Vercel

מטרה: שהדומיין (למשל `kedma-live.com`) יפתח את האתר החדש ב-Vercel במקום את האתר ב-Wix.

#### ב-Vercel – הוספת הדומיין

1. ב-**Vercel** → הפרויקט → **Settings** → **Domains**.
2. הוסף את הדומיין: למשל `kedma-live.com` ו־`www.kedma-live.com`.
3. Vercel יציג לך **מה להזין ב-DNS** (רישומים כמו A, CNAME). **השאר את הטאב פתוח** – תצטרך את הערכים בשלב הבא.

#### ב-Wix – שינוי ה-DNS

1. **היכנס ל-[wix.com](https://www.wix.com)** → **My Sites** → האתר עם הדומיין.
2. **Settings** (הגדרות) → **Domains** → בחר את הדומיין.
3. חפש אפשרות כמו **Manage DNS** / **DNS Records** / **הגדרות DNS**.
4. **ערוך/הוסף רישומים** כך שיתאימו למה ש-Vercel ביקש:

   **אם Vercel מבקש CNAME ל-`www`:**

   - **סוג**: CNAME  
   - **Host/Name**: `www` (או `www.kedma-live.com` – תלוי בממשק)  
   - **Value/Points to**: `cname.vercel-dns.com`  
   - שמור.

   **אם Vercel מבקש רישום A לשורש הדומיין (kedma-live.com):**

   - **סוג**: A  
   - **Host/Name**: `@` או ריק (שורש הדומיין)  
   - **Value**: `76.76.21.21` (כתובת ה-IP ש-Vercel נותן – תבדוק ב-Domains ב-Vercel)  
   - שמור.

   אם ב-Wix אין אפשרות לערוך A/CNAME (דומיין "מונע" על ידי Wix), עוברים ל-**אפשרות ב'** או משתמשים ב-**Wix Forwarding** (להלן).

5. **הסר** (אם יש) רישומי A/CNAME שמורים שמפנים ל-Wix את אותו Host, כדי שלא יהיה עימות.

#### אימות ב-Vercel

- ב-**Vercel** → **Domains** יופיע סטטוס: Verifying → אחרי כמה דקות (עד 48 שעות) **Verified**.
- אם נשאר **Invalid Configuration**, בדוק שוב ב-Wix שהערכים תואמים בדיוק למה ש-Vercel מציג.

#### אם Wix לא נותן לערוך DNS (דומיין ב-Wix)

אם הדומיין "נעול" ב-Wix ואין DNS לעריכה:

1. ב-**Wix** → **Domains** → בחר את הדומיין.
2. חפש **Transfer domain out** / **Unlock domain** / **העברת דומיין**.
3. בצע **Unlock** ו-**קבל את קוד ההעברה (EPP/Authorization code)** במייל.
4. אז תוכל להעביר את הדומיין ל-Registrar אחר (אפשרות ב') ולנהל שם DNS, או לבדוק אם ל-Wix יש כעת אפשרות "Point domain elsewhere" ולהוסיף שם את הערכים של Vercel.

---

### אפשרות ב': העברת רישום הדומיין מ-Wix ל-Registrar אחר

מטרה: שהדומיין יהיה רשום אצל ספק אחר (למשל Vercel Domains או Namecheap), ושם תגדיר DNS שמפנה ל-Vercel.

#### 1. ב-Wix – שחרור הדומיין

1. **Wix** → **Domains** → הדומיין → **Advanced** / **Transfer Out**.
2. **Unlock** את הדומיין.
3. **קבל את קוד ההעברה (EPP/Authorization code)** – נשלח למייל שנרשם לרישום.
4. שמור את הקוד – תצטרך אותו אצל הספק החדש.

#### 2. רכישת/העברת דומיין ב-Vercel (או Registrar אחר)

**אם מעבירים ל-Vercel:**

1. **Vercel** → **Project** → **Settings** → **Domains** → **Add**.
2. הזן את הדומיין → יוצע לך לרכוש/להעביר דומיין דרך Vercel.
3. בחר **Transfer** והזן את **קוד ה-EPP** מ-Wix.
4. השלם תשלום (המשך שנת רישום). ההעברה יכולה לקחת 5–7 ימים.

**אם מעבירים ל-Namecheap/Google Domains וכו':**

1. היכנס ל-Namecheap (או ל-Registrar שבחרת).
2. **Transfer Domain** → הזן את שם הדומיין ואת **קוד ה-EPP** מ-Wix.
3. אחרי שההעברה מסתיימת, ב-**DNS Settings** אצל הספק החדש הוסף את הרישומים ש-Vercel מבקש (CNAME ל-`www`, A לשורש – כמו באפשרות א').

#### 3. חיבור ל-Vercel

- ב-**Vercel** → **Domains** הוסף שוב את אותו דומיין.
- אם ה-DNS מנוהל אצל Vercel (אחרי רכישה/העברה ב-Vercel), החיבור יהיה אוטומטי. אחרת הזן את ה-A וה-CNAME כמו באפשרות א'.

---

## חלק ג': עדכונים עתידיים (Deploy)

אחרי שהכל מחובר:

1. ערוך קוד/תוכן בפרויקט.
2. הרץ Terminal:
   ```bash
   ./deploy.sh "תיאור השינויים"
   ```
   (או: `git add .` → `git commit -m "..."` → `git push origin main`).
3. Vercel יעשה Deploy אוטומטי; תוך דקה־שתיים האתר המעודכן יהיה באוויר (כולל בדומיין המותאם).

---

## סיכום צעדים (רשימת בדיקה)

- [ ] חיבור הפרויקט ל-Vercel ו-Deploy ראשון
- [ ] הוספת משתני סביבה ב-Vercel (EmailJS, CSV, ובהתאם Gemini)
- [ ] הוספת הדומיין ב-Vercel (Settings → Domains)
- [ ] ב-Wix: עריכת DNS (CNAME ל-www, A לשורש) לפי הערכים מ-Vercel  
  **או** שחרור הדומיין והעברה ל-Registrar אחר ואז הגדרת DNS שם
- [ ] אימות ב-Vercel שהדומיין מסומן Verified
- [ ] בדיקה בדפדפן: `https://הדומיין-שלך.com` ו־`https://www.הדומיין-שלך.com`
- [ ] שימוש ב-`./deploy.sh` לעדכונים הבאים

אם תכתוב מה שם הדומיין ואיפה הוא כרגע רשום (רק Wix או גם אצל Registrar אחר), אפשר להתאים בדיוק את הצעדים (למשל רק "הפניה מ-Wix" בלי העברת רישום).