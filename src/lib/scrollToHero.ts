/**
 * Smooth-scroll the homepage hero into view and optionally focus the embedded
 * URL field. Used by every "Add your firm" CTA on the Discover homepage now
 * that `/assess` is gone and the hero owns submission.
 *
 * Cross-page CTAs (Awards, MagnetSite, etc.) navigate to `/#hero` instead;
 * the Discover page reads `location.hash` on mount and calls this helper.
 */
export function scrollToHero(opts: { focus?: boolean } = {}): void {
  const { focus = true } = opts;
  if (typeof document === 'undefined') return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  hero.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (focus) {
    const input = hero.querySelector<HTMLInputElement>('input[type="url"]');
    if (input) {
      // Defer focus so smooth scroll doesn't fight the focus jump
      window.setTimeout(() => input.focus({ preventScroll: true }), 400);
    }
  }
}
