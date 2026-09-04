# STARS Club Website

A redesigned, interactive multi-page site for the St. Albert Recreation & Sports Cultural Club (STARS Club), inspired by the motion/interaction style of monogrid.com.

## What's inside

```
index.html        Home
about.html         About
initiatives.html   Initiatives (the club's 9 objectives, grouped)
donate.html        Donate
events.html        Events / schedule
gallery.html        Photo gallery with lightbox
contact.html        Contact form
css/style.css       All styling + design tokens
js/main.js           Nav, scroll reveals, constellation canvas, lightbox, form
```

No build tools, no frameworks — just HTML/CSS/JS. Open `index.html` in a browser to preview locally, or drag the whole folder into Netlify/Vercel, or push it to a GitHub repo and turn on GitHub Pages.

## Hosting it

### Netlify (recommended — and the contact form works automatically)
1. Create a free Netlify account.
2. Drag the `stars-club-site` folder onto netlify.com/drop, or connect it to a GitHub repo.
3. Done. The contact form already has `data-netlify="true"` and a hidden honeypot field, so Netlify auto-detects it and emails you submissions — no extra setup, no backend code.

### GitHub Pages
1. Push this folder to a GitHub repo.
2. In repo Settings → Pages, set the source to your main branch.
3. The contact form won't work as-is (GitHub Pages can't process form submissions) — see "Contact form on other hosts" below.

### Contact form on other hosts
If you're not using Netlify, swap the form's `action` attribute in `contact.html` to a service like:
- **Formspree** (formspree.io) — free tier, just sign up and replace `action="/contact.html"` with the endpoint they give you (e.g. `action="https://formspree.io/f/xxxxxxx"`).
- **Web3Forms** (web3forms.com) — similar, free, no signup-heavy backend needed.

## Editable events spreadsheet

The Events page (`events.html`) can pull its event list live from a Google Sheet — edit a row in the sheet, refresh the website, and the change is live. No code, no redeploy.

### 1. Create the sheet
1. Go to sheets.google.com and create a new blank sheet.
2. Import the included `events-template.csv` (File → Import → Upload) to get the correct headers and a few starter rows, **or** just type these column headers into row 1 yourself:

   `DateBig | DateSmall | Title | Description | Category`

   - **DateBig** — the big bold text (e.g. `Jul 4`, `TBA`, `All`)
   - **DateSmall** — the small text under it (e.g. `2026`, `season`)
   - **Title** — event name
   - **Description** — one or two sentences
   - **Category** — short tag like `Sport`, `Service`, `Culture`

3. Add one row per event below the header row. Delete a row to remove an event from the site; add a row to add one.

### 2. Publish it to the web
1. In the sheet: **File → Share → Publish to web**.
2. Under "Link", choose the specific sheet/tab (not "Entire document").
3. Under the format dropdown, choose **Comma-separated values (.csv)**.
4. Click **Publish**, confirm, then copy the generated URL (it will look like `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv`).

### 3. Connect it to the site
1. Open `events.html`.
2. Find this line near the bottom, just before `<script src="js/main.js"></script>`:
   ```html
   window.STARS_EVENTS_SHEET_URL = "PASTE_YOUR_PUBLISHED_SHEET_CSV_URL_HERE";
   ```
3. Replace the placeholder text with the URL you copied. Save and re-upload/redeploy the file.

That's it — the page fetches that CSV on every page load. Edit any cell in the sheet (Google re-publishes automatically within a minute or two), and the website reflects it on next visit. If the sheet can't be reached for any reason, the page quietly falls back to the default "Badminton & Volleyball Drop-In" row so it never shows broken or empty.

**Note:** the published CSV link is public to anyone who has it (that's what makes it fetchable from the website) — don't put anything sensitive in that sheet.

## Editable photo gallery

The Gallery page works the same way as Events — a Google Sheet feeds the photo grid, so you can add, remove, or reorder photos without touching code.

**Important limitation to know up front:** Google Photos doesn't offer a public way for a website to read your account/album directly (there's no "publish to web" option like Sheets has). The workaround below is the closest practical equivalent — you grab a direct link to each photo and drop it in a sheet, the same way you manage events.

### 1. Get a direct link to each photo
1. Open the photo in Google Photos (in a browser).
2. Right-click the image and choose **"Open image in new tab"** (or **"Copy image address"**, depending on your browser).
3. The URL in that new tab (starting with `https://lh3.googleusercontent.com/...`) is your direct image link — copy it.

   *(Any other publicly-accessible image URL works too — Wix media links, Imgur, a Google Drive "anyone with the link" share converted to a direct link, etc.)*

### 2. Build the sheet
1. Create a new Google Sheet and import `gallery-template.csv` (File → Import → Upload), or type these headers into row 1 yourself:

   `ImageURL | Caption | Category`

   - **ImageURL** — the direct image link from step 1
   - **Caption** — short text shown under the photo (optional)
   - **Category** — `sport`, `community`, or `facilities` (controls which filter tab shows the photo)

2. One row per photo. Delete a row to remove a photo from the site.

### 3. Publish and connect
Same steps as Events:
1. **File → Share → Publish to web** → choose the sheet/tab → format **CSV** → Publish → copy the URL.
2. Open `gallery.html`, find:
   ```html
   window.STARS_GALLERY_SHEET_URL = "PASTE_YOUR_PUBLISHED_GALLERY_SHEET_CSV_URL_HERE";
   ```
3. Paste your link in, save, and redeploy.

If the sheet is empty, unreachable, or left as the placeholder, the page just shows the default photos already built into `gallery.html` — it never breaks or shows blank.

## Accepting real donations

The Donate page collects a name, email, amount, and frequency, then sends the donor to **PayPal's hosted checkout** to actually pay — this means real credit/debit cards work, and PayPal (not this website) handles all the security and compliance, which is the only realistic way to take cards on a plain static site.

### One-time donations (works as soon as you add your email)
1. Create a free **PayPal Business account** at paypal.com/ca/business if you don't have one.
2. Open `donate.html`, find:
   ```html
   paypalBusinessEmail: "PASTE_YOUR_PAYPAL_BUSINESS_EMAIL_HERE",
   ```
3. Replace the placeholder with your PayPal Business email. Save and redeploy.

That's it — one-time gifts at any amount (including a custom amount the donor types in) will work immediately. Donors can pay by card without needing a PayPal account themselves.

### Recurring (monthly/yearly) donations — optional, more setup
PayPal recurring billing works through a separate "Subscribe" button tied to **one fixed amount**, not the flexible amount selector on the page. To turn it on:
1. In your PayPal Business dashboard: **Pay & Get Paid → Subscriptions** → create a button for your chosen monthly amount (and another for yearly, if you want both).
2. Copy the **hosted button ID** PayPal gives you.
3. Paste it into `donate.html`:
   ```html
   monthlyHostedButtonId: "...",
   yearlyHostedButtonId: "...",
   ```
Until you've done this, the site will politely tell donors that recurring giving isn't live yet and point them to your email instead of failing silently.

**Heads up:** PayPal isn't free for the club to receive — they take a standard transaction fee (a percentage + a small flat fee per transaction). That's normal for any card processor, just worth knowing.

## Customizing

- **Colors / fonts**: edit the `:root` variables at the top of `css/style.css`.
- **Text content**: edit directly in each `.html` file — all copy is plain HTML, no templating.
- **Images**: currently hot-linked from the old Wix site's media CDN (`static.wixstatic.com`) so nothing broke during the rebuild. For full independence, download those images and host them locally in an `/images` folder, then update the `src=""` paths.
- **Navigation**: the menu list appears identically near the top of every page (inside `<nav class="nav-overlay">`) — edit in one file and copy to the others if you add/remove pages.
- **Constellation animation density**: each `<canvas class="hero-canvas" data-density="...">` controls how many "stars" appear — raise/lower that number per page.

## Notes

- Fully responsive, keyboard accessible, and respects `prefers-reduced-motion`.
- The donate, fees, and schedule links currently point to your existing Google Docs / PDF — replace with new ones any time.
- "Stars Club Connect" in the footer links to your existing base44 app — keep or remove as needed.
