## Why the reader is broken

The `<Document>` component is throwing into its `error` slot ("We couldn't load the book"), which means the HEAD check passed but pdf.js itself failed to parse. Two stacked problems are causing this:

### 1. Worker / API version mismatch (the primary culprit)

- `react-pdf@10.4.1` pins **`pdfjs-dist@5.4.296`**
- The project actually installed **`pdfjs-dist@5.6.205`** (a floating `^5.6.205` resolved during install)
- pdf.js refuses to run when the API version and the worker version don't match exactly, throwing `The API version "5.4.296" does not match the Worker version "5.6.205"`. That throw bubbles into `<Document onError>` and we render the error slot.

### 2. Worker URL resolution is fragile in the Lovable preview iframe

`pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()` works in normal Vite dev but is unreliable in the sandboxed preview iframe — the resolved blob/module URL can fail CORS or MIME checks. The standard fix is to copy the worker into `public/` once and reference it as a plain absolute path, which always works.

### 3. The HEAD content-type gate is too strict

Some hosts (and the Lovable preview proxy) return `application/octet-stream` on HEAD even though GET works. When that happens we currently render "Coming Soon" instead of letting pdf.js try. Not what's biting us in the screenshot, but worth softening so we don't trade one bug for another tomorrow.

## Should we ditch the PDF and paste the transcript instead?

No. PDF is the right format here:

- The book has typography, hierarchy, page rhythm, and (eventually) illustrations that a Markdown transcript would flatten into a blog post.
- The "no download" requirement is straightforward to enforce with PDF.js — disable the toolbar, block right-click, render via canvas only.
- The user expectation set by "Read the Book" is *the actual book*, not a web article version.
- We already have a per-page personalization layer ("Talk to the Book") that handles the conversational/extractive use case. Read = fidelity. Chat = personalization.

The fix is making the embedded reader bulletproof, not abandoning it.

## Fix plan

### A. Pin pdfjs-dist to the version react-pdf wants

Change `package.json` from `"pdfjs-dist": "^5.6.205"` to `"pdfjs-dist": "5.4.296"` (exact pin, no caret). Reinstall. This is the single most important fix — once API and worker versions match, the reader will load.

### B. Serve the worker from `public/`, not from a Vite-resolved import URL

- Copy `node_modules/pdfjs-dist/build/pdf.worker.min.mjs` to `public/pdf-worker/pdf.worker.min.mjs` so it ships as a static asset at `/pdf-worker/pdf.worker.min.mjs`.
- Add a tiny prebuild step (or just a one-time copy + a script entry) so future installs/upgrades refresh it. Simplest: a `prebuild`/`predev` npm script that runs `node -e "fs.copyFileSync(...)"`.
- In `BookReader.tsx`, set `pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs"`. No `new URL(..., import.meta.url)`, no module resolution gymnastics.

### C. Soften the existence check

Replace the strict `content-type.includes("pdf")` gate with: HEAD must return `r.ok` only. We don't need to inspect content-type — if the file exists, let pdf.js try to parse it. If pdf.js fails, the existing error slot already shows the right message.

### D. Add diagnostic logging on load failure

Wire `<Document onLoadError={(err) => console.error("PDF load error:", err)}>` so any future regression surfaces immediately in the Lovable console feed instead of leaving us guessing.

### E. Verify in the preview after the fix

After the changes ship, navigate to `/m/ilan_7fo8vw0kc4/read`, confirm the first page renders, paginate forward and back, toggle fullscreen, and confirm right-click is blocked.

## Files to change

- `package.json` — pin `pdfjs-dist` to `5.4.296`, add a `predev`/`prebuild` script that copies the worker into `public/pdf-worker/`
- `public/pdf-worker/pdf.worker.min.mjs` — new (copied from node_modules)
- `src/components/magnet/BookReader.tsx` — switch `workerSrc` to `/pdf-worker/pdf.worker.min.mjs`, drop the content-type check, add `onLoadError` logging

## Result

- The book renders inline in the Read tab on every microsite, branded to the client
- No download / no toolbar / no right-click save — same protections as today
- No CDN dependency, no version drift between the API and worker
- If anything ever breaks again, the error surfaces in console with a real stack trace instead of a silent "We couldn't load the book"
