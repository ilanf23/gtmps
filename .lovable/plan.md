# Magnet Microsite — 4-Page Restructure

Transform the current single-page magnet experience at `/m/:slug` into a 4-page microsite with a shared nav bar that also covers `/book`.

## Architecture

### New routes (slug-scoped, all share the nav)
| Route | Purpose | Source |
|---|---|---|
| `/m/:slug` | **MAP** — the existing breakdown | Current `MagnetBreakdown.tsx` (untouched content) |
| `/m/:slug/chat` | **Book Chat** — talk to the GTM book | New, OpenAI gpt-4o-mini |
| `/m/:slug/read` | **Read the Book** — embedded PDF reader | New, PDF served from `/public` |
| `/m/:slug/feedback` | **Feedback** — contact form | New, sends email to `adam@mabbly.com` |

The standalone `/book` route also gets the same nav (linking back to `/m/:slug` for slug-aware tabs when a slug is in storage; otherwise nav points to base routes).

### New shared layout component
**`src/components/magnet/MagnetShell.tsx`** — wraps all 4 magnet pages with:
- Persistent top nav bar (dark theme matching breakdown: `#120D05` bg, `#B8933A` gold accents)
- Tab-style nav: `MAP · Talk to the Book · Read · Feedback`
- Active tab indicator (gold underline)
- Mobile: collapses to a horizontal scroll strip (no hamburger — only 4 items)
- Logo left ("Mabbly · GTM") · Tabs center · Visitor first name right (fetched once via existing RPC)

## Page-by-page implementation

### 1. MAP page (`/m/:slug`)
- Wrap existing `MagnetSite.tsx` polling/loading flow inside `MagnetShell`
- Once status === 'complete', render `MagnetBreakdown` (unchanged)
- The existing `MagnetChat` floating widget on the breakdown is **removed** — chat lives on its own page now
- Loading and error states stay as-is but get the nav shell

### 2. Book Chat page (`/m/:slug/chat`)
**New component**: `src/components/magnet/BookChat.tsx`
- Full-page OpenAI-style chat UI (centered column, max-w-3xl)
- Streaming token-by-token rendering with markdown via `react-markdown` (already a common pattern, will add)
- Input pinned to bottom, multiline textarea, Enter to send / Shift+Enter for newline
- Welcome message: "Ask me anything about the GTM book."
- No persistence — session-scoped messages in component state

**New edge function**: `supabase/functions/book-chat/index.ts`
- Uses **OpenAI direct (`gpt-4o-mini`)** with streaming SSE
- System prompt: scoped strictly to the GTM book content
- Book content injected as a long system message (extracted from PDF — see Reader section below)
- Reuses existing `OPENAI_API_KEY` secret
- Returns 402 / 429 with friendly messages

**Book content for the LLM**: I'll extract text from the PDF you upload using `pdfplumber` and write it to `supabase/functions/book-chat/_book-content.ts` as an exported string constant. This gives the model the full book as context without runtime PDF parsing.
- If the book is large (> ~120k tokens), I'll chunk it and include only top-level summaries + chapter excerpts with a note in the welcome message.
- This file is regenerated whenever you upload a new version of the PDF.

### 3. Reader page (`/m/:slug/read`)
**New component**: `src/components/magnet/BookReader.tsx`
- Embeds `/relationship-revenue-os.pdf` (placed in `/public`) using a native `<iframe>` with PDF.js viewer fallback
- Top toolbar: "Download PDF" button (links to file directly)
- Full-height reader, responsive
- **Action item for you**: drop the PDF into `/public/relationship-revenue-os.pdf` after this ships. Until then, the page shows a styled placeholder ("Book uploading soon").

### 4. Feedback page (`/m/:slug/feedback`)
**New component**: `src/components/magnet/FeedbackForm.tsx`
- Form fields (zod-validated client + server side):
  - Name (required, max 100)
  - Email (required, valid email, max 255)
  - Feedback (required, max 2000)
  - Hidden: `slug` from URL params
- Submit calls new edge function
- Success state replaces form: "Thanks. Adam reads every one."
- Loading + error states with toast

**Email delivery**: Uses Lovable's built-in transactional email system (no Resend, no API keys needed).
1. Call `email_domain--scaffold_transactional_email` to set up infra
2. New edge function `supabase/functions/submit-feedback/index.ts`:
   - Validates input with zod
   - Calls the scaffolded `send-transactional-email` function
   - Sends to `adam@mabbly.com` with subject `New magnet feedback from {name}` and body containing all fields + the slug
3. **No database storage** (per your "Email only" choice — no `magnet_feedback` table)
4. Note: this requires a verified email sending domain. If the project doesn't have one yet, the scaffold tool will prompt for setup. I'll guide you through it when the time comes.

## Routing changes (`src/App.tsx`)

```tsx
<Route path="/m/:slug" element={<MagnetSite />} />
<Route path="/m/:slug/chat" element={<MagnetBookChatPage />} />
<Route path="/m/:slug/read" element={<MagnetBookReaderPage />} />
<Route path="/m/:slug/feedback" element={<MagnetFeedbackPage />} />
<Route path="/book" element={<MagnetBook />} />  {/* gets nav shell too */}
```

Each new page is a thin wrapper that passes the slug into `MagnetShell` and renders its child component.

## Files created
- `src/components/magnet/MagnetShell.tsx` — nav wrapper
- `src/components/magnet/BookChat.tsx` — chat UI w/ streaming
- `src/components/magnet/BookReader.tsx` — PDF embed
- `src/components/magnet/FeedbackForm.tsx` — feedback form
- `src/pages/MagnetBookChatPage.tsx`, `MagnetBookReaderPage.tsx`, `MagnetFeedbackPage.tsx` — route components
- `supabase/functions/book-chat/index.ts` — streaming chat function
- `supabase/functions/book-chat/_book-content.ts` — extracted book text (regenerated when you upload PDF)
- `supabase/functions/submit-feedback/index.ts` — feedback handler

## Files modified
- `src/App.tsx` — register 3 new routes
- `src/pages/MagnetSite.tsx` — wrap content in `MagnetShell`
- `src/pages/MagnetBook.tsx` — wrap in `MagnetShell` (slug-less variant)
- `src/components/magnet/MagnetBreakdown.tsx` — remove the floating `MagnetChat` widget (chat is now its own page)
- `package.json` — add `react-markdown` for chat rendering

## Open follow-ups (your action)
1. **Upload the GTM book PDF** — I'll place it in `/public/relationship-revenue-os.pdf` and extract its text for the chatbot
2. **Verify email domain** in Lovable Cloud → Emails (only required if not already done) so feedback emails can send to `adam@mabbly.com`

## Test plan
After ship:
1. Visit `/m/<existing-slug>` → MAP renders with new nav bar at top
2. Click "Talk to the Book" → routes to `/m/<slug>/chat`, shows empty chat with welcome message
3. Send a chat message → streams reply token-by-token from gpt-4o-mini
4. Click "Read" → routes to `/m/<slug>/read`, shows PDF embed (or placeholder if PDF not yet uploaded)
5. Click "Feedback" → form renders; submit a test → email arrives at `adam@mabbly.com`
6. Visit `/book` → same nav shell renders; tabs work without a slug (link to base routes)
7. Active tab indicator follows current route correctly
8. Mobile (375px wide): nav strip is horizontally scrollable, tabs remain tappable