/**
 * A vessel photograph, or a quiet placeholder where none is recorded.
 *
 * Plain <img> rather than next/image: these are owner-supplied stills served
 * straight from /public, and the optimiser buys nothing over a file that is
 * already sized and compressed for the web.
 */
export default function VesselPhoto({
  src,
  name,
  ratio = '16 / 9',
  rounded = true,
}: {
  src?: string;
  name: string;
  ratio?: string;
  rounded?: boolean;
}) {
  const radius = rounded ? 'var(--r-lg)' : '0';

  if (!src) {
    return (
      <div
        style={{
          aspectRatio: ratio,
          borderRadius: radius,
          background: 'var(--surface-3)',
          border: '1px solid var(--line)',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--text-5)',
          fontSize: 12.5,
        }}
      >
        No photograph recorded
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      style={{
        width: '100%',
        aspectRatio: ratio,
        objectFit: 'cover',
        borderRadius: radius,
        border: '1px solid var(--line)',
        background: 'var(--surface-3)',
      }}
    />
  );
}

/** Small square crop for table rows. */
export function VesselThumb({ src, name }: { src?: string; name: string }) {
  const box = {
    width: 44,
    height: 30,
    borderRadius: 'var(--r-sm)',
    border: '1px solid var(--line)',
    flex: 'none' as const,
    background: 'var(--surface-3)',
  };
  if (!src) return <div style={box} aria-hidden />;
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      style={{ ...box, objectFit: 'cover' }}
    />
  );
}
