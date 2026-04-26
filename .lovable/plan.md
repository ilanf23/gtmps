
# Make the GTM Assessment form interactive

Transform `/m` from a static form into a live "build your breakdown" experience. As the user types, a progress bar fills, a phase label updates, insight badges fade in, and a real-time Dead Zone Value estimate appears the moment CRM size and deal size are both selected.

All changes are scoped to `src/pages/MagnetAssess.tsx`. **No** changes to validation, submit handler, slug generation, Supabase insert, edge function, or routing.

## 1. Watch all field values reactively

Switch from default react-hook-form usage to using `watch()` so we can react to every keystroke / select change:

```ts
const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({ ... });

const watched = watch();
const { name, role, websiteUrl, linkedinUrl, email,
        crmSize, dealSize, bdChallenge, caseStudiesUrl, teamPageUrl } = watched;
```

## 2. Progress percentage (weighted)

```ts
const fieldWeights = {
  name: 10, role: 5, websiteUrl: 20, email: 10,
  crmSize: 15, dealSize: 15, bdChallenge: 10,
  linkedinUrl: 5, caseStudiesUrl: 5, teamPageUrl: 5,
};
const progress = Object.entries(fieldWeights).reduce((sum, [k, w]) => {
  const v = watched[k as keyof FormValues];
  return sum + (v && String(v).trim() !== '' ? w : 0);
}, 0);
```

## 3. Dynamic phase label

```ts
const getProgressLabel = (p: number) => {
  if (p === 0)   return 'Start building your breakdown →';
  if (p < 20)    return 'Setting up your profile...';
  if (p < 40)    return 'Mapping your firm context...';
  if (p < 60)    return 'Identifying your orbits...';
  if (p < 80)    return 'Calculating your Dead Zone...';
  if (p < 100)   return 'Almost there, breakdown nearly ready...';
  return 'Full breakdown unlocked';
};
```

(No hyphens / em dashes per project memory; uses commas + arrow.)

## 4. Live Dead Zone Value

```ts
const crmMidpoints = { under_100: 75, '100_300': 200, '300_700': 500, '700_plus': 800 };
const dealMidpoints = { under_50k: 35000, '50k_150k': 100000, '150k_500k': 325000, '500k_plus': 650000 };

const deadZoneValue = (crmSize && dealSize)
  ? Math.round((crmMidpoints[crmSize] ?? 0) * 0.81 * (dealMidpoints[dealSize] ?? 0) * 0.03 / 1000)
  : null; // value in $K
```

## 5. Insight badges

Four badges that conditionally render as small chips:

| Badge | Trigger | Label |
|---|---|---|
| website | `websiteUrl` filled | `⊙ Website: Ready to analyze` |
| deadzone | `deadZoneValue !== null` | `⊙ Dead Zone estimate: ~$<value>K` |
| layer | `bdChallenge` filled | `⊙ Starting layer: PROVE / ACTIVATE / DESIGN / COMPOUND` (mapped from challenge) |
| proof | `caseStudiesUrl` filled | `⊙ Proof assets: Will be analyzed` |

Layer mapping:
- `finding_new` → PROVE
- `reengaging_past` → ACTIVATE
- `converting_warm` → DESIGN
- `consistent_intros` → ACTIVATE
- `generating_inbound` → COMPOUND

**Styling note**: Instead of generic blue/amber/green/purple Tailwind utilities (which would clash with the form's editorial cream + gold palette), each badge uses on-brand tints:

- website → `border-[#1C1008]/20 bg-[#1C1008]/5 text-[#1C1008]/80`
- deadzone → `border-[#B8933A]/40 bg-[#B8933A]/10 text-[#8a6e2b]` (gold, the money moment)
- layer → `border-[#3D5A4A]/30 bg-[#3D5A4A]/8 text-[#3D5A4A]` (sage)
- proof → `border-[#8B3A2A]/30 bg-[#8B3A2A]/8 text-[#8B3A2A]` (rust)

## 6. Dead Zone "money moment" pulse

When the Dead Zone badge first appears, pulse it briefly so the user notices:

```ts
const [deadZonePulsed, setDeadZonePulsed] = useState(false);
useEffect(() => {
  if (deadZoneValue !== null && !deadZonePulsed) {
    const t = setTimeout(() => setDeadZonePulsed(true), 2000);
    return () => clearTimeout(t);
  }
}, [deadZoneValue, deadZonePulsed]);
```

Apply `animate-pulse` to the deadzone badge while `deadZoneValue !== null && !deadZonePulsed`.

## 7. Progress block (rendered above form fields)

Inserted between the header copy and the `<form>`, styled to match the existing editorial aesthetic (no shadcn tokens, no rounded-xl — keeps the flat, sharp-cornered look):

```tsx
<div className="mt-8 p-5 border border-black/10 bg-black/[0.02]">
  <div className="flex justify-between items-center mb-2">
    <span className="text-xs uppercase tracking-wider font-medium text-[#1C1008]">
      {getProgressLabel(progress)}
    </span>
    <span className="text-xs font-mono text-[#1C1008]/60">{progress}%</span>
  </div>

  <div className="w-full h-1 bg-black/10 overflow-hidden">
    <div
      className="h-full bg-[#B8933A] transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>

  {badges.some(b => b.condition) && (
    <div className="flex flex-wrap gap-2 mt-4">
      {badges.filter(b => b.condition && b.label).map(b => (
        <span
          key={b.id}
          className={`text-[11px] px-3 py-1 border font-medium tracking-wide
                      transition-opacity duration-300 ${b.color}
                      ${b.id === 'deadzone' && !deadZonePulsed ? 'animate-pulse' : ''}`}
        >
          {b.label}
        </span>
      ))}
    </div>
  )}
</div>
```

Sharp corners (no `rounded-full` / `rounded-xl`) to match the existing form's flat editorial style.

## 8. Submit button reflects progress state

Replace the existing button label/disabled logic:

```tsx
<button
  type="submit"
  disabled={submitting || progress < 60}
  className="w-full h-12 bg-[#B8933A] hover:bg-[#a07c2e] text-[#120D05] 
             font-semibold tracking-wide uppercase text-sm transition-colors 
             flex items-center justify-center gap-2 
             disabled:opacity-50 disabled:cursor-not-allowed"
>
  {submitting ? (
    <><span className="h-4 w-4 rounded-full border-2 border-[#120D05]/30 border-t-[#120D05] animate-spin" /> BUILDING…</>
  ) : progress < 60 ? (
    `COMPLETE YOUR PROFILE (${progress}%)`
  ) : progress === 100 ? (
    'GENERATE FULL BREAKDOWN →'
  ) : (
    'GENERATE BREAKDOWN →'
  )}
</button>
```

Disabled until 60% (name + website + email + at least one dropdown), preventing thin submissions while still allowing skip of optional fields.

## What does NOT change

- Field order, labels, placeholders, helper text
- Zod schema and validation behavior
- `onSubmit` handler, slug generation, Supabase insert, `enrich-magnet` invocation
- Routing / navigation
- Page heading and intro copy above the form
- Edge function (`enrich-magnet`) — already consumes the new fields from the previous task

## Files touched

- **Edited**: `src/pages/MagnetAssess.tsx` (only file)
