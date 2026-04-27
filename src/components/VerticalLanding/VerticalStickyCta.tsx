import { useEffect, useState } from 'react';
import { useFooterVisible } from '@/hooks/useFooterVisible';
import { useInlineCtaVisible } from '@/hooks/useInlineCtaVisible';

type Props = { label?: string; vertical?: string };

export default function VerticalStickyCta({ label = 'Add Your Firm →', vertical }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const footerVisible = useFooterVisible(0.05);
  const inlineVisible = useInlineCtaVisible(0.5);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = scrolled && !footerVisible && !inlineVisible;

  return (
    <div
      className="fixed left-0 right-0 z-[90] flex justify-center pointer-events-none"
      style={{
        bottom: 24,
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 200ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '0 16px',
      }}
    >
      <a
        href={vertical ? `/assess?vertical=${vertical}` : '/assess'}
        className="pointer-events-auto"
        style={{
          background: 'rgba(28,16,8,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(184,147,58,0.3)',
          color: '#B8933A',
          height: 56,
          padding: '0 28px',
          fontSize: 14,
          letterSpacing: '0.04em',
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 600,
          borderRadius: 999,
          display: 'inline-flex',
          alignItems: 'center',
          textDecoration: 'none',
          maxWidth: 'calc(100% - 16px)',
          boxShadow: '0 4px 16px -8px rgba(184,147,58,0.25)',
          pointerEvents: show ? 'auto' : 'none',
          transition: 'color 200ms, background 200ms, box-shadow 200ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#F5EFE0';
          e.currentTarget.style.background = '#B8933A';
          e.currentTarget.style.boxShadow = '0 6px 20px -6px rgba(184,147,58,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#B8933A';
          e.currentTarget.style.background = 'rgba(28,16,8,0.92)';
          e.currentTarget.style.boxShadow = '0 4px 16px -8px rgba(184,147,58,0.25)';
        }}
      >
        {label}
      </a>
    </div>
  );
}
