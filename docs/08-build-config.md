# Build Configuration Notes

## DO NOT add custom `manualChunks` in `vite.config.ts`

### Symptom
Live site loads a blank/black page. Console shows:
```
TypeError: Cannot read properties of undefined (reading 'createContext')
  at vendor-XXXX.js
```

### Cause
A custom `build.rollupOptions.output.manualChunks` function that splits React
into its own chunk (e.g. `react-vendor`) while leaving React-consuming libs
(Radix, Framer Motion, Supabase auth-helpers, etc.) in a separate `vendor`
chunk. With ES module preloading, the `vendor` chunk can evaluate before
`react-vendor` finishes initializing, so `React` is `undefined` when those
libs call `React.createContext(...)` at module top-level.

This only fails in production builds, never in `vite dev`, so it ships
unnoticed. The dev preview iframe also loads fine, masking the regression.

### Fix
Remove the custom `manualChunks` and let Rollup chunk by default. Vendor
caching is slightly less granular but correctness wins. If we ever need to
split chunks again, every chunk that imports React (directly or transitively)
must be in the same chunk as React itself, OR React must be marked as a
shared/external dependency that all chunks await.

### Verify before publishing
After any `vite.config.ts` change:
1. `npm run build && npm run preview`
2. Open the preview URL and check the browser console for `createContext` /
   `undefined` errors.
3. Only then publish.

### History
- 2026-05-06: Performance optimization sprint added a `manualChunks` splitter
  separating `react-vendor` from `vendor`. Production deploy showed a black
  screen on https://discover.mabbly.com. Reverted.
