# Eliminate microsite theme flash on route change

## Root Cause

Each tab navigation inside a microsite (e.g. `/m/:slug` → `/m/:slug/chat`) unmounts and remounts `MagnetShell`. Its `useClientTheme(slug)` hook always initializes state to `MABBLY_DEFAULTS` (orange/beige), then fires an async Supabase RPC to fetch the branding. That ~1s round-trip is exactly the flash the user sees.

## Fix: Module-scoped theme cache keyed by slug

Update `src/hooks/useClientTheme.ts` so that:

1. **Cache resolved themes in a module-level `Map<slug, ClientTheme>`.** Once branding has been fetched for a slug, every subsequent mount in the same session reads it synchronously.
2. **Use a lazy `useState` initializer** that returns the cached theme for the current slug if present, otherwise `MABBLY_DEFAULTS`. The very first render of the next tab already paints with the correct dark theme — no flash.
3. **Skip the network call when cached.** Only fire the RPC when the slug has no cached entry (first visit).
4. **Write to cache on success** so the next navigation benefits.

### Key snippet

```ts
const themeCache = new Map<string, ClientTheme>();

export function useClientTheme(slug: string | undefined | null): ClientTheme {
  const [theme, setTheme] = useState<ClientTheme>(() =>
    slug && themeCache.has(slug) ? themeCache.get(slug)! : MABBLY_DEFAULTS,
  );

  useEffect(() => {
    if (!slug) { setTheme(MABBLY_DEFAULTS); return; }
    if (themeCache.has(slug)) { setTheme(themeCache.get(slug)!); return; }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("get_magnet_breakdown_by_slug", { _slug: slug });
      if (cancelled || error) return;
      const row = Array.isArray(data) ? data[0] : null;
      if (!row) return;
      const next = buildClientTheme(row as unknown as RawBranding);
      themeCache.set(slug, next);
      setTheme(next);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return theme;
}
```

## Why this approach (vs. alternatives)

- **Why not a loading spinner?** It would replace one bad UX (flash) with another (blank screen), and the first-ever visit would still show it. The cache eliminates the flash on intra-microsite navigation, which is where the user sees it.
- **Why not React Query?** Overkill for a single RPC. A 5-line module Map gives the same intra-session caching with zero new dependencies.
- **First-visit behavior preserved.** First load of a slug still briefly shows defaults then upgrades — same as today. Only repeat tab clicks within the microsite become instant.

## Files Modified

- `src/hooks/useClientTheme.ts` — add module-scoped cache + lazy state initializer.

No other files need to change. `MagnetShell` and `MagnetSite` consume the hook unchanged.