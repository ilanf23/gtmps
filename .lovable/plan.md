

# Fix Link Preview (OG Meta) for Pepper Group Page

## Problem
When sharing the `/pepper-group` URL, it shows the generic discover.mabbly.com preview (small, irrelevant screenshot) because the OG meta tags are hardcoded in `index.html` for the main page. Since this is a client-side SPA, social crawlers only see those static tags.

## Solution

### 1. Update `index.html` with route-aware defaults
Since this is a SPA and crawlers don't execute JS, we need a different approach. The best option within Lovable's constraints:

- **Create a dedicated OG image** for the Pepper Group page — a designed 1200×630 static image that looks premium (terracotta palette, "Pepper Group — Market Activation Profile" text, Mabbly branding)
- **Add dynamic document head updates** in `PepperGroup.tsx` using a `useEffect` to update `<title>` and OG meta tags at runtime (helps when shared from in-app browsers that do execute JS)

### 2. Generate OG image
Create a clean 1200×630 image with:
- Warm background (#FBF8F4 → #F3EDE6 gradient)
- "Pepper Group" in Playfair Display
- "Market Activation Profile" subtitle
- Mabbly branding
- Terracotta accent elements

### 3. Add runtime meta tag updates in PepperGroup.tsx
Use `useEffect` to dynamically set:
- `og:title` → "Pepper Group — Market Activation Profile | Mabbly"
- `og:description` → "Your Network Got Promoted Without You. A personalized market activation profile prepared for Tim Padgett & George Couris."
- `og:image` → the new OG image URL
- `twitter:card`, `twitter:image`, `twitter:title`, `twitter:description`

### 4. Alternatively: add a separate HTML entry or edge function
For crawlers that don't execute JS (Facebook, LinkedIn, Slack), the most reliable fix is a **backend function** that serves custom HTML with the right OG tags when it detects a bot user-agent on `/pepper-group`. This would be an edge function that intercepts the request and returns modified HTML.

## Recommended Approach
Combine both: runtime meta updates (step 3) for in-app browsers + an edge function for proper crawler support. This ensures the link preview looks premium everywhere.

