// Official LinkedIn "In Bug", implemented per https://brand.linkedin.com/in-logo
// The bug is a filled rounded square; only the three approved variants are exposed.
// Do not recolor outside these variants and do not pair with the word "LinkedIn".

type Variant = 'blue' | 'black' | 'white';

interface LinkedInIconProps {
  size?: number;
  variant?: Variant;
  className?: string;
  title?: string;
}

const PALETTE: Record<Variant, { bug: string; in: string }> = {
  blue: { bug: '#0A66C2', in: '#FFFFFF' },
  black: { bug: '#000000', in: '#FFFFFF' },
  white: { bug: '#FFFFFF', in: '#000000' },
};

export default function LinkedInIcon({
  size = 16,
  variant = 'blue',
  className,
  title,
}: LinkedInIconProps) {
  const colors = PALETTE[variant];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect width="256" height="256" rx="40" fill={colors.bug} />
      <path
        fill={colors.in}
        d="M85.336 167v-71h-23.665v71H85.337zM73.504 86.32c8.252 0 13.388-5.473 13.388-12.314-.154-6.99-5.136-12.305-13.235-12.305-8.1 0-13.388 5.315-13.388 12.305 0 6.84 5.135 12.314 13.082 12.314h.153zM98.165 167h23.66V127.33c0-2.123.155-4.25.78-5.77 1.7-4.25 5.6-8.652 12.13-8.652 8.566 0 11.99 6.527 11.99 16.094V167h23.658v-39.74c0-21.864-11.677-32.038-27.252-32.038-12.737 0-18.36 7.058-21.487 11.92h.155v-10.244h-23.65c.31 6.682 0 71 0 71h.016z"
      />
    </svg>
  );
}
