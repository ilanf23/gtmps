## Change

Remove the `Validated by Copulsky.` line (and its trailing `<br />`) from the homepage hero subhead in `src/components/discover/DiscoverHero.tsx` (line 650).

### Before
```tsx
The largest research on GTM in professional services.<br />
<span className="kl-hl">500 practitioner interviews.</span><br />
Validated by Copulsky.<br />
The map shows where your firm sits in the <span className="kl-hl">Dead Zone</span>{' '}
- and the one chapter that fixes your biggest gap.
```

### After
```tsx
The largest research on GTM in professional services.<br />
<span className="kl-hl">500 practitioner interviews.</span><br />
The map shows where your firm sits in the <span className="kl-hl">Dead Zone</span>{' '}
- and the one chapter that fixes your biggest gap.
```

### Scope note

Only the homepage hero is in scope. The longer "Validated by Jonathan Copulsky (Former CMO Deloitte, Senior Lecturer Northwestern Kellogg)..." validation language used in the 8 vertical landings (`src/content/verticals.ts`) and `/about` is intentionally kept as social proof. If you want those removed too, say the word and I'll do a follow-up sweep.

### Tip

For tiny static text removals like this, you can also use Visual Edits (Edit button, bottom-left of the chat box), select the text, and delete it. Free, no credits used.