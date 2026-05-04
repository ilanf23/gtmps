/**
 * Smooth-scroll the homepage hero's URL field into the middle of the viewport
 * and flash a red attention outline so visitors know where to act. Used by
 * every "Build Your Map" / "Add Your Firm" CTA on the Discover homepage now
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

  const input = hero.querySelector<HTMLInputElement>('input[type="url"]');

  if (!input) {
    hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  input.scrollIntoView({ behavior: 'smooth', block: 'center' });

  input.classList.remove('huf-input--attention');
  // Force reflow so the animation restarts on repeat clicks.
  void input.offsetWidth;
  input.classList.add('huf-input--attention');
  window.setTimeout(() => {
    input.classList.remove('huf-input--attention');
  }, 2400);

  if (focus) {
    // Defer focus so smooth scroll doesn't fight the focus jump.
    window.setTimeout(() => input.focus({ preventScroll: true }), 400);
  }
}
