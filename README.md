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

## Upcoming Shows (Airtable → Website)

The homepage includes an **Upcoming Shows** section that is pulled from Airtable via a **Vercel Serverless Function** at `/api/upcoming-shows`.

### Airtable requirements
- Create a dedicated **View** (you already did): `Website - Upcoming`
- Table: `show`
- Keep your filters/sort inside the View (recommended):
  - Filter: `עלה לאתר` is checked
  - Filter: `תאריך המופע` is today or later
  - Sort: `תאריך המופע` ascending

### Field mapping (from your Airtable view)
The API expects these field names (Hebrew):
- `תאריך המופע`
- `אמן`
- `מקום המופע`
- `קישור לרכישת כרטיסים`
- (publish/filtering is handled by the View via `עלה לאתר`)

### Vercel Environment Variables (Production/Preview)
Set these in Vercel → Project → Settings → Environment Variables:
- `AIRTABLE_API_TOKEN` (secret; do NOT commit)
- `AIRTABLE_BASE_ID` = `appWGKmmM9blhVBOB`
- `AIRTABLE_TABLE_ID_OR_NAME` = `show`
- `AIRTABLE_VIEW_NAME` = `Website - Upcoming`

Optional (only if you ever rename fields in Airtable):
- `AIRTABLE_FIELD_DATE` (default: `תאריך המופע`)
- `AIRTABLE_FIELD_ARTIST` (default: `אמן`)
- `AIRTABLE_FIELD_LOCATION` (default: `מקום המופע`)
- `AIRTABLE_FIELD_TICKETS_URL` (default: `קישור לרכישת כרטיסים`)
