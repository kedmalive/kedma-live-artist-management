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
2. Set environment variables in `.env.local`:
   - `GEMINI_API_KEY` - Your Gemini API key (optional, only for AI Consultant feature)
   - `VITE_EMAILJS_PUBLIC_KEY` - Your EmailJS Public Key (for contact form)
   - `VITE_EMAILJS_SERVICE_ID` - Your EmailJS Service ID (for contact form)
   - `VITE_EMAILJS_TEMPLATE_ID` - Your EmailJS Template ID (for contact form)
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

## Contact Form Setup (EmailJS)

The contact form sends submissions via **EmailJS** (free tier: 200 emails/month) and opens WhatsApp with a pre-filled message.

### How to Set Up EmailJS

#### Step 1: Create EmailJS Account
1. Sign up at [emailjs.com](https://www.emailjs.com) (free account)
2. Verify your email address

#### Step 2: Add Email Service
1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** (you'll need it later)

#### Step 3: Create Email Template
1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Set **To Email** to your email address (e.g., `info@kedma-live.com`)
4. Set **From Name** to: `{{from_name}}`
5. Set **Subject** to: `New Contact Form Submission from {{from_name}}`
6. In the **Content** field, use this template:

```
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Event Type: {{event_type}}
Message: {{message}}
```

7. **Copy the Template ID** (you'll need it later)

#### Step 4: Get Public Key
1. Go to **Account** → **General** in the dashboard
2. Find your **Public Key** and copy it

#### Step 5: Add to Environment Variables
Add these to your `.env.local` file:

```
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

#### Step 6: Deploy
If deploying to Vercel, add these same variables in **Vercel** → **Project** → **Settings** → **Environment Variables**.

### How It Works
- When a user submits the form:
  1. An email is sent to your configured email address via EmailJS
  2. WhatsApp opens with a pre-filled message containing all form data
  3. User can review and send the WhatsApp message manually

### Notes
- EmailJS is optional - if credentials are not configured, the form will still open WhatsApp
- WhatsApp link works immediately without any setup
- The form includes basic validation (required fields, email format)
