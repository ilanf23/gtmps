import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { submitMagnetUrl } from '@/lib/magnetSubmit';

// ─────────────────────────────────────────────────────────────────────────────
// HeroUrlField
//
// Embedded Magnet URL submission used in the homepage hero (DiscoverHero) and
// on every vertical landing page. Eliminates the `/assess` intermediate from
// the happy path - the form posts to Supabase via `submitMagnetUrl` and
// navigates straight to `/m/:slug`.
//
// Variants:
//   - `dark`  - pairs with the navy-on-gold hero (DiscoverHero).
//   - `light` - pairs with the cream vertical-landing hero.
// ─────────────────────────────────────────────────────────────────────────────

type Variant = 'dark' | 'light';

interface HeroUrlFieldProps {
  /** Vertical slug for analytics / routing context. Defaults to 'general'. */
  vertical?: string;
  /** Visual variant - defaults to 'dark' (Discover hero). */
  variant?: Variant;
  /** Override the submit-button label. Defaults to 'Build My Map →'. */
  submitLabel?: string;
  /** Footnote shown beneath the field. Optional. */
  foot?: string;
  /** Optional id, useful as a scroll/link target (e.g. "add-your-firm"). */
  id?: string;
}

export default function HeroUrlField({
  vertical = 'general',
  variant = 'dark',
  submitLabel = 'Build My Map →',
  foot,
  id,
}: HeroUrlFieldProps) {
  const navigate = useNavigate();
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitMagnetUrl(website, { verticalSlug: vertical });
      if (!result.ok) {
        if (result.validation) {
          setError(result.error);
        } else {
          toast.error(result.error);
        }
        setSubmitting(false);
        return;
      }
      navigate(result.destination, {
        state: { websiteUrl: result.normalizedUrl },
      });
    } catch (err) {
      console.error('Hero submit error:', err);
      toast.error('Something went wrong - please try again.');
      setSubmitting(false);
    }
  };

  const isDark = variant === 'dark';

  return (
    <>
      <style>{`
        .huf-form {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .huf-row {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }
        .huf-input {
          flex: 1;
          min-width: 0;
          padding: 14px 16px;
          font-family: 'Inter Tight', sans-serif;
          font-size: 15px;
          border-radius: 8px;
          outline: none;
          min-height: 52px;
          transition: border-color 180ms ease, background 180ms ease;
        }
        .huf-input--dark {
          background: rgba(245,239,224,0.05);
          border: 1px solid rgba(184,147,58,0.45);
          color: #F5EFE0;
        }
        .huf-input--dark::placeholder { color: rgba(245,239,224,0.4); }
        .huf-input--dark:focus {
          border-color: #B8933A;
          background: rgba(184,147,58,0.08);
        }
        .huf-input--light {
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(184,147,58,0.45);
          color: #1C1008;
        }
        .huf-input--light::placeholder { color: rgba(28,16,8,0.4); }
        .huf-input--light:focus {
          border-color: #B8933A;
          background: rgba(184,147,58,0.08);
        }
        .huf-go {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 22px;
          min-height: 52px;
          font-family: 'Inter Tight', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.04em;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: linear-gradient(135deg, #B8933A 0%, #D4AE48 100%);
          color: #0D1117;
          transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
          box-shadow: 0 6px 24px -8px rgba(184,147,58,0.55);
          white-space: nowrap;
        }
        .huf-go:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px -8px rgba(184,147,58,0.7);
        }
        .huf-go:disabled { opacity: 0.55; cursor: not-allowed; }
        .huf-spin {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(13,17,23,0.25);
          border-top-color: #0D1117;
          animation: huf-spin 700ms linear infinite;
        }
        @keyframes huf-spin { to { transform: rotate(360deg); } }
        .huf-error {
          font-family: 'Inter Tight', sans-serif;
          font-size: 13px;
          color: #E07A5F;
          margin: 0;
        }
        .huf-foot {
          font-family: 'Inter Tight', sans-serif;
          font-size: 12px;
          margin: 0;
        }
        .huf-foot--dark { color: rgba(245,239,224,0.55); }
        .huf-foot--light { color: rgba(28,16,8,0.55); }
        @media (max-width: 640px) {
          .huf-row { flex-direction: column; }
          .huf-go { padding: 14px 22px; }
        }
      `}</style>

      <form
        id={id}
        onSubmit={handleSubmit}
        className="huf-form"
        noValidate
        data-cta="add-your-firm"
        data-vertical={vertical}
      >
        <div className="huf-row">
          <input
            type="url"
            autoComplete="url"
            className={`huf-input ${isDark ? 'huf-input--dark' : 'huf-input--light'}`}
            placeholder="yourfirm.com"
            aria-label="Your firm's website URL"
            value={website}
            onChange={(e) => {
              setWebsite(e.target.value);
              if (error) setError(null);
            }}
          />
          <button type="submit" disabled={submitting} className="huf-go">
            {submitting ? (
              <>
                <span className="huf-spin" aria-hidden />
                Building…
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
        {error && <p className="huf-error">{error}</p>}
        {foot && (
          <p className={`huf-foot ${isDark ? 'huf-foot--dark' : 'huf-foot--light'}`}>{foot}</p>
        )}
      </form>
    </>
  );
}
