<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1M1qpItMSinwULCTR5oRzBJumDLGEY-M7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Upcoming Shows (Google Sheets → Website)

The homepage includes an **Upcoming Shows** section that automatically pulls data from a **Google Sheets** published as CSV. Update the sheet and the website updates automatically (no code changes needed).

### How to Set Up Google Sheets

#### Step 1: Create the Sheet
1. Create a new Google Sheet (e.g., `Kedma Live - Upcoming Shows`)
2. Create a sheet tab named `Upcoming` (or any name you prefer)

#### Step 2: Set Up Column Headers (Row 1)
Add these exact column headers in **row 1** (in English to avoid encoding issues):
- `date`
- `artist`
- `location`
- `ticketsUrl`
- `publish`

#### Step 3: Format Your Data
- **date**: Format as `YYYY-MM-DD` (e.g., `2026-01-28`)
- **artist**: Artist name (Hebrew is fine)
- **location**: Venue/location name (Hebrew is fine)
- **ticketsUrl**: Full URL (can be empty)
- **publish**: `TRUE` or `FALSE` (only `TRUE` rows will appear on the website)

#### Step 4: Example Rows
| date | artist | location | ticketsUrl | publish |
|------|--------|----------|------------|---------|
| 2026-01-28 | שי צברי | רידינג 3 | https://www.eventer.co.il/... | TRUE |
| 2026-01-29 | רביד פלוטניק | גבעת ברנר |  | FALSE |

#### Step 5: Publish as CSV
1. In Google Sheets: **File** → **Share** → **Publish to the web**
2. Select the sheet: `Upcoming` (or your sheet name)
3. Format: **Comma-separated values (.csv)**
4. Click **Publish**
5. **Copy the URL** that appears (this is your CSV URL)

### Vercel Environment Variables

Set this in **Vercel** → **Project** → **Settings** → **Environment Variables**:

- **Key**: `VITE_UPCOMING_SHOWS_CSV_URL`
- **Value**: The CSV URL from Step 5 above
- **Environment**: Production + Preview

After saving, **Redeploy** your site.

### Fallback
If the CSV URL is not configured or fails to load, the site will automatically fall back to `data/upcoming-shows.json`.

### Notes
- The CSV is **publicly readable** (anyone with the URL can see the data)
- Only rows with `publish=TRUE` will appear on the website
- The website shows up to 12 upcoming shows, sorted by date
- Updates appear immediately after refreshing the page (no redeploy needed)
