'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NAV_FLAT } from './nav';
import {
  IconCompanies,
  IconContracts,
  IconFleet,
  IconSearch,
} from '@/components/ui/Icons';

interface VesselHit {
  id: string;
  name: string;
  imo?: string;
  kind?: string;
  owner?: string;
}
interface CompanyHit {
  id: string;
  name: string;
  country?: string;
  vessels: number;
}
interface FixtureHit {
  name: string;
  imo?: string;
  kind?: string;
  fixtures: number;
}
interface SearchResult {
  vessels: VesselHit[];
  companies: CompanyHit[];
  fixtures: FixtureHit[];
  totals: { vessels: number; companies: number; fixtures: number };
}

const EMPTY: SearchResult = {
  vessels: [],
  companies: [],
  fixtures: [],
  totals: { vessels: 0, companies: 0, fixtures: 0 },
};

/** One navigable row, whatever section it came from. */
interface Row {
  key: string;
  href: string;
  label: string;
  sub?: string;
  note?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

/**
 * Platform search.
 *
 * Screens are matched here, in the browser, because the list is tiny and the
 * answer should be instant. Vessels and companies are matched by
 * /api/search: twenty-two thousand records are several megabytes and must
 * not travel to the browser just to be searched.
 */
export default function CommandPalette({
  open,
  seed,
  onClose,
}: {
  open: boolean;
  /** Text typed into the topbar before the palette opened. */
  seed?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [hits, setHits] = useState<SearchResult>(EMPTY);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const needle = q.trim();

  useEffect(() => {
    if (!open) return;
    setQ(seed ?? '');
    setActive(0);
    setHits(EMPTY);
    // Focus after paint so the field is ready for the next keystroke.
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }, [open, seed]);

  // One request per pause in typing, and an answer that arrives after a
  // newer one has been sent is dropped rather than shown.
  useEffect(() => {
    if (!open || needle.length < 2) {
      setHits(EMPTY);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(needle)}`, {
        signal: controller.signal,
      })
        .then((r) => (r.ok ? r.json() : EMPTY))
        .then((r: SearchResult) => {
          setHits(r);
          setLoading(false);
        })
        .catch(() => {
          // An aborted request is a newer keystroke, not a failure.
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 160);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, needle]);

  const screens = useMemo(() => {
    const n = needle.toLowerCase();
    if (!n) return NAV_FLAT;
    return NAV_FLAT.filter(
      (i) => i.label.toLowerCase().includes(n) || i.group.toLowerCase().includes(n),
    );
  }, [needle]);

  /** The sections, in the order they are offered. */
  const sections = useMemo(() => {
    const out: Array<{ label: string; rows: Row[] }> = [];

    if (hits.vessels.length > 0) {
      out.push({
        label:
          hits.totals.vessels > hits.vessels.length
            ? `Vessels · ${hits.vessels.length} of ${hits.totals.vessels.toLocaleString('en-US')}`
            : `Vessels · ${hits.vessels.length}`,
        rows: hits.vessels.map((v) => ({
          key: `v-${v.id}`,
          href: `/app/fleet/${v.id}`,
          label: v.name,
          sub: [v.imo ? `IMO ${v.imo}` : undefined, v.kind, v.owner]
            .filter(Boolean)
            .join(' · '),
          note: 'Vessel',
          icon: IconFleet,
        })),
      });
    }

    if (hits.companies.length > 0) {
      out.push({
        label:
          hits.totals.companies > hits.companies.length
            ? `Companies · ${hits.companies.length} of ${hits.totals.companies.toLocaleString('en-US')}`
            : `Companies · ${hits.companies.length}`,
        rows: hits.companies.map((c) => ({
          key: `c-${c.id}`,
          href: `/app/companies/${c.id}`,
          label: c.name,
          sub: [
            c.country,
            c.vessels > 0
              ? `${c.vessels.toLocaleString('en-US')} vessel${c.vessels === 1 ? '' : 's'}`
              : undefined,
          ]
            .filter(Boolean)
            .join(' · '),
          note: 'Company',
          icon: IconCompanies,
        })),
      });
    }

    // Vessels with charter history but no fleet record: an IMO off a
    // fixture should find something rather than nothing.
    if (hits.fixtures.length > 0) {
      out.push({
        label: 'In the charter book only · no vessel record',
        rows: hits.fixtures.map((f) => ({
          key: `f-${f.imo ?? f.name}`,
          href: `/app/contracts?q=${encodeURIComponent(f.name)}`,
          label: f.name,
          sub: [
            f.imo ? `IMO ${f.imo}` : undefined,
            f.kind,
            `${f.fixtures} fixture${f.fixtures === 1 ? '' : 's'}`,
          ]
            .filter(Boolean)
            .join(' · '),
          note: 'Fixtures',
          icon: IconContracts,
        })),
      });
    }

    if (screens.length > 0) {
      out.push({
        label: 'Screens',
        rows: screens.map((s) => ({
          key: `s-${s.href}`,
          href: s.href,
          label: s.label,
          note: s.group,
          icon: s.icon,
        })),
      });
    }

    // Whatever the palette shows, the full result set is one row away.
    if (needle.length >= 2) {
      out.push({
        label: 'Search everything',
        rows: [
          {
            key: 'all-fleet',
            href: `/app/fleet?q=${encodeURIComponent(needle)}`,
            label: `Search GO Fleet for “${needle}”`,
            note: 'Fleet',
            icon: IconFleet,
          },
          {
            key: 'all-companies',
            href: `/app/companies?q=${encodeURIComponent(needle)}`,
            label: `Search GO Companies for “${needle}”`,
            note: 'Companies',
            icon: IconCompanies,
          },
        ],
      });
    }

    return out;
  }, [hits, screens, needle]);

  const rows = useMemo(() => sections.flatMap((s) => s.rows), [sections]);

  const go = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, rows.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === 'Enter') {
        const target = rows[active];
        if (target) {
          e.preventDefault();
          go(target.href);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, rows, active, go, onClose]);

  // Keep the highlighted row in view as the arrows walk past the fold.
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current?.querySelector('.palette-item.is-active');
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  let index = -1;

  return (
    <div
      className="palette-scrim"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-field">
          <IconSearch size={15} />
          <input
            ref={inputRef}
            className="input palette-input"
            placeholder="Search vessel name, company, IMO, MMSI…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
          />
          {loading && <span className="palette-spinner" aria-label="Searching" />}
        </div>

        <div className="palette-list" ref={listRef}>
          {rows.length === 0 ? (
            <div className="palette-empty">
              {needle.length < 2 ? (
                <>
                  Type at least two characters.
                  <br />
                  <span style={{ fontSize: 12 }}>
                    Vessel name, company name, IMO, MMSI, call sign or GO id.
                  </span>
                </>
              ) : loading ? (
                'Searching…'
              ) : (
                <>
                  No vessel, company or screen matches “{needle}”.
                  <br />
                  <span style={{ fontSize: 12 }}>
                    Names match on any part; an IMO or MMSI matches from the
                    first digits.
                  </span>
                </>
              )}
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.label}>
                <div className="palette-group">{section.label}</div>
                {section.rows.map((row) => {
                  index += 1;
                  const i = index;
                  const Icon = row.icon;
                  return (
                    <button
                      key={row.key}
                      className={`palette-item${i === active ? ' is-active' : ''}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(row.href)}
                    >
                      <Icon size={15} />
                      <span className="palette-item-text">
                        <span className="palette-item-label">{row.label}</span>
                        {row.sub && (
                          <span className="palette-item-sub">{row.sub}</span>
                        )}
                      </span>
                      {row.note && (
                        <span className="palette-item-group">{row.note}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/** Small helper so the topbar and any screen can open the palette. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return { open, setOpen };
}

export { IconSearch };
