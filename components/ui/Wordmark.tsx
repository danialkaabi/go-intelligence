import Link from 'next/link';
import Logo from './Logo';

/**
 * The Gemini Offshore / GO Intelligence lockup: the GO monogram alongside
 * the wide-tracked uppercase setting used throughout the strategy book.
 *
 * The mark inherits `currentColor`, so the lockup renders navy on the white
 * marketing nav and white on the dark app sidebar from a single component.
 */
export default function Wordmark({
  href = '/',
  size = 'md',
  stacked = true,
  mark = true,
}: {
  href?: string | null;
  size?: 'sm' | 'md' | 'lg';
  stacked?: boolean;
  /** Set false where the monogram would crowd the text. */
  mark?: boolean;
}) {
  const markSize = size === 'lg' ? 34 : size === 'sm' ? 19 : 25;
  const textSize = size === 'lg' ? 16 : size === 'sm' ? 9.5 : 10.5;

  const inner = (
    <span className="lockup">
      {mark && <Logo size={markSize} className="lockup-mark" />}
      <span className="lockup-text">
        <span
          className="wordmark"
          style={{ fontSize: textSize, letterSpacing: '0.2em' }}
        >
          GO Intelligence
        </span>
        {stacked && <span className="lockup-sub">Gemini Offshore</span>}
      </span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="GO Intelligence — home">
      {inner}
    </Link>
  );
}
