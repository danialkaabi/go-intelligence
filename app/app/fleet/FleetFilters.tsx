'use client';

import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Panel from '@/components/ui/Panel';
import { IconChevron, IconClose, IconSearch } from '@/components/ui/Icons';

export interface Facet {
  /** Query-string key this facet writes to. */
  key: string;
  label: string;
  options: Array<{ value: string; count: number }>;
  defaultOpen?: boolean;
}

/**
 * The GO Fleet query builder.
 *
 * Filtering happens on the server — at eleven thousand vessels the database
 * cannot travel to the browser — so this component's only job is to write the
 * query string. The counts beside each option are computed server-side and
 * passed in.
 */
export default function FleetFilters({
  facets,
  inertGroups,
  children,
}: {
  facets: Facet[];
  /** Filter groups from the strategy book that need fields the records do
   *  not carry yet. Shown, but inert. */
  inertGroups: string[];
  /** The server-rendered results panel, placed in the right-hand column. */
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');

  const push = useCallback(
    (next: URLSearchParams) => {
      next.delete('page'); // any change to the query resets paging
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const toggle = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    const current = next.getAll(key);
    next.delete(key);
    for (const v of current) if (v !== value) next.append(key, v);
    if (!current.includes(value)) next.append(key, value);
    push(next);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (term.trim()) next.set('q', term.trim());
    else next.delete('q');
    push(next);
  };

  const active = facets.flatMap((f) =>
    params.getAll(f.key).map((v) => ({ key: f.key, label: f.label, value: v })),
  );
  const hasQuery = active.length > 0 || Boolean(params.get('q'));

  return (
    <>
      <div className="rail">
        <Panel
          title="Filter"
          action={
            hasQuery ? (
              <button
                className="link-arrow"
                style={{ fontSize: 11.5 }}
                onClick={() => router.push(pathname, { scroll: false })}
              >
                Clear
              </button>
            ) : undefined
          }
        >
          {facets.map((f) => (
            <RailSection key={f.key} label={f.label} defaultOpen={f.defaultOpen}>
              {f.options.length === 0 ? (
                <p style={{ fontSize: 11.5, color: 'var(--text-5)', padding: '4px 8px' }}>
                  Nothing recorded yet.
                </p>
              ) : (
                f.options.map((o) => {
                  const on = params.getAll(f.key).includes(o.value);
                  return (
                    <button
                      key={o.value}
                      className={`rail-opt${on ? ' is-on' : ''}`}
                      onClick={() => toggle(f.key, o.value)}
                    >
                      <span className="checkbox">
                        {on && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="m4.5 12.5 5 5 10-11" />
                          </svg>
                        )}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {o.value}
                      </span>
                      <span className="rail-count">{o.count.toLocaleString('en-US')}</span>
                    </button>
                  );
                })
              )}
            </RailSection>
          ))}

          {inertGroups.map((label) => (
            <RailSection label={label} key={label}>
              <p style={{ fontSize: 11.5, color: 'var(--text-5)', padding: '4px 8px', lineHeight: 1.55 }}>
                Activates once vessel records carry this field.
              </p>
            </RailSection>
          ))}
        </Panel>
      </div>

      <div id="fleet-query" className="stack g16" style={{ minWidth: 0 }}>
        <div className="query-bar">
          <span className="chip-op">Vessel type is</span>
          {active.length === 0 ? (
            <span style={{ fontSize: 12.5, color: 'var(--text-5)' }}>
              No filters applied — showing everything in the database
            </span>
          ) : (
            active.map((c) => (
              <span className="chip" key={`${c.key}-${c.value}`}>
                <span className="chip-op" style={{ padding: 0 }}>
                  {c.label}
                </span>
                {c.value}
                <button onClick={() => toggle(c.key, c.value)} aria-label={`Remove ${c.value}`}>
                  <IconClose size={11} />
                </button>
              </span>
            ))
          )}
        </div>

        <form className="search" onSubmit={submitSearch}>
          <span className="search-icon">
            <IconSearch size={15} />
          </span>
          <input
            className="input"
            placeholder="Search vessel name, IMO or GO id — press Enter"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </form>

        {children}
      </div>
    </>
  );
}

function RailSection({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rail-section">
      <button className="rail-head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {label}
        <IconChevron size={13} />
      </button>
      {open && <div className="rail-body">{children}</div>}
    </div>
  );
}
