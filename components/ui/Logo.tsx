/**
 * The Gemini Offshore "GO" monogram.
 *
 * Drawn with `currentColor` so one file serves every surface: it renders
 * navy on the white marketing nav and white on the dark app sidebar,
 * with no second asset and no filters.
 */
export default function Logo({
  size = 26,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={(size * 136) / 66}
      height={size}
      viewBox="0 0 136 66"
      fill="none"
      className={className}
      role="img"
      aria-label="Gemini Offshore"
    >
      {/* G — a geometric circle broken at the right, closed by a centre bar */}
      <path
        d="M51.65 17.5 A25 25 0 1 0 55 30 L37 30"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="square"
        fill="none"
      />
      {/* O — set as an arch, open at the foot, echoing a sun on the horizon */}
      <path
        d="M102.34 50.48 A25 25 0 1 0 73.66 50.48"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="square"
        fill="none"
      />
      {/* The horizon: a tapered sweep beneath the mark */}
      <path
        d="M60 57.5 Q95 45.5 132 53.5 Q95 49.8 60 59.2 Z"
        fill="currentColor"
      />
    </svg>
  );
}
