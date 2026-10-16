import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import StatTile from '@/components/ui/StatTile';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import FilterRail, { type Facet } from '@/components/app/FilterRail';
import { IconChevron, IconDownload, IconSearch } from '@/components/ui/Icons';
import { COMPANIES } from '@/data/companies';
import {
  FLEET_SIZE_BANDS,
  type FleetFacetField,
  fleetFacetsForCompany,
  vesselsForCompany,
} from '@/data/vessels';
import { COMPANIES_WITH_FIXTURES, charterersForCompany } from '@/data/charters';
import { REVIEW_FLAG_SHORT } from '@/lib/review';
import { num, orDash } from '@/lib/format';
import type { Company } from '@/data/types';

export const metadata: Metadata = {
  title: 'Companies',
  description: 'GO Companies — owners, operators and counterparties.',
};

const PER_PAGE = 50;

/** Facets that ask what a company's fleet is made of. The same five the
 *  fleet database is filtered by — asked of the company instead: tick
 *  "AHTS" here and you get the companies that run one, not the vessels. */
const FLEET_FACETS: Array<{
  key: string;
  label: string;
  field: FleetFacetField;
  defaultOpen?: boolean;
}> = [
  { key: 'cat', label: 'Vessel type', field: 'category', defaultOpen: true },
  { key: 'sub', label: 'Sub-type', field: 'subType' },
  { key: 'size', label: 'Size class', field: 'sizeClass' },
  { key: 'flag', label: 'Flag', field: 'flag' },
  { key: 'status', label: 'Vessel status', field: 'status' },
  { key: 'tier', label: 'Tier role', field: 'tierRole' },
  { key: 'fleet', label: 'Fleet size', field: 'fleetSize' },
];

/** Facets that ask about the company record itself. */
const OWN_FACETS: Array<{ key: string; label: string; field: keyof Company }> = [
  { key: 'country', label: 'Registered country', field: 'country' },
  { key: 'type', label: 'Company type', field: 'type' },
];

/** Independent record flags. Ticking two means both must hold, which is why
 *  this group combines with 'all' rather than 'any'. */
const RECORD_FLAGS: Array<{ value: string; test: (c: Company) => boolean }> = [
  { value: 'Has vessels', test: (c) => vesselsForCompany(c.id).length > 0 },
  { value: 'Has charter history', test: (c) => COMPANIES_WITH_FIXTURES.has(c.id) },
  { value: 'Profiled', test: (c) => Boolean(c.description) },
  { value: 'Website recorded', test: (c) => Boolean(c.website) },
  { value: 'Awaiting entity review', test: (c) => Boolean(c.review) },
  { value: 'Suspected duplicate', test: (c) => Boolean(c.duplicateOfId) },
];

const INERT = ['Operating region', 'Risk & sanctions'];

type SP = Record<string, string | string[] | undefined>;
const many = (sp: SP, k: string): string[] => {
  const v = sp[k];
  return v === undefined ? [] : Array.isArray(v) ? v : [v];
};

export default function CompaniesPage({ searchParams }: { searchParams: SP }) {
  const q = (many(searchParams, 'q')[0] ?? '').trim().toLowerCase();
  const selected: Record<string, string[]> = Object.fromEntries([
    ...FLEET_FACETS.map((f) => [f.key, many(searchParams, f.key)]),
    ...OWN_FACETS.map((f) => [f.key, many(searchParams, f.key)]),
    ['chr', many(searchParams, 'chr')],
    ['rec', many(searchParams, 'rec')],
  ]);

  /** One company against the query, optionally ignoring one facet so that
   *  facet's counts say what each option would return. */
  const matches = (c: Company, skip?: string) => {
    if (q && !c.name.toLowerCase().includes(q)) return false;
    for (const f of FLEET_FACETS) {
      if (f.key === skip) continue;
      const sel = selected[f.key]!;
      if (!sel.length) continue;
      const have = fleetFacetsForCompany(c.id)[f.field];
      if (!sel.some((v) => have.has(v))) return false;
    }
    for (const f of OWN_FACETS) {
      if (f.key === skip) continue;
      const sel = selected[f.key]!;
      if (sel.length && !sel.includes(String(c[f.field] ?? ''))) return false;
    }
    if (skip !== 'chr' && selected.chr!.length) {
      const worked = charterersForCompany(c.id);
      if (!selected.chr!.some((v) => worked.has(v))) return false;
    }
    if (skip !== 'rec') {
      for (const v of selected.rec!) {
        const flag = RECORD_FLAGS.find((r) => r.value === v);
        if (flag && !flag.test(c)) return false;
      }
    }
    return true;
  };

  // Filtering runs on the server: eight thousand records with their fleets
  // behind them is far too much to hand to the browser.
  const results = COMPANIES.filter((c) => matches(c));

  const facets: Facet[] = [
    ...FLEET_FACETS.map((f) => {
      const counts = new Map<string, number>();
      for (const c of COMPANIES) {
        if (!matches(c, f.key)) continue;
        for (const val of fleetFacetsForCompany(c.id)[f.field]) {
          counts.set(val, (counts.get(val) ?? 0) + 1);
        }
      }
      const options =
        f.field === 'fleetSize'
          ? FLEET_SIZE_BANDS.filter((b) => counts.has(b)).map((b) => ({
              value: b,
              count: counts.get(b)!,
            }))
          : top(counts);
      return { key: f.key, label: f.label, defaultOpen: f.defaultOpen, options };
    }),
    ...OWN_FACETS.map((f) => {
      const counts = new Map<string, number>();
      for (const c of COMPANIES) {
        if (!matches(c, f.key)) continue;
        const val = c[f.field];
        if (val === undefined || val === null || val === '') continue;
        counts.set(String(val), (counts.get(String(val)) ?? 0) + 1);
      }
      return { key: f.key, label: f.label, options: top(counts) };
    }),
    (() => {
      const counts = new Map<string, number>();
      for (const c of COMPANIES) {
        if (!matches(c, 'chr')) continue;
        for (const name of charterersForCompany(c.id)) {
          counts.set(name, (counts.get(name) ?? 0) + 1);
        }
      }
      return { key: 'chr', label: 'Charterer', options: top(counts) };
    })(),
    {
      key: 'rec',
      label: 'Record',
      mode: 'all' as const,
      options: RECORD_FLAGS.map((r) => ({
        value: r.value,
        // Counted against the rest of the query and the other ticked flags,
        // so a flag that would return nothing says so before it is ticked.
        count: COMPANIES.filter(
          (c) =>
            matches(c, 'rec') &&
            r.test(c) &&
            selected.rec!.every((v) => {
              const other = RECORD_FLAGS.find((x) => x.value === v);
              return !other || other.test(c);
            }),
        ).length,
      })).filter((o) => o.count > 0 || selected.rec!.includes(o.value)),
    },
  ];

  const withCountry = COMPANIES.filter((c) => c.country).length;
  const needingReview = COMPANIES.filter((c) => c.review).length;
  const profiled = COMPANIES.filter((c) => c.description).length;

  const pageNum = Math.max(1, Number(many(searchParams, 'page')[0] ?? '1') || 1);
  const pageCount = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(pageNum, pageCount);
  const shown = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (k === 'page' || v === undefined) continue;
      for (const x of Array.isArray(v) ? v : [v]) p.append(k, x);
    }
    if (n > 1) p.set('page', String(n));
    const qs = p.toString();
    return qs ? `/app/companies?${qs}#company-query` : '/app/companies#company-query';
  };

  const filtered = results.length !== COMPANIES.length;

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Companies"
        title="Companies"
        sub="Owners and operators mapped through seven management tiers, filtered by the vessels they actually run."
        actions={
          <button className="btn btn--ghost btn--sm" disabled>
            <IconDownload size={14} />
            Export to Excel
          </button>
        }
      />

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile label="Companies" value={num(COMPANIES.length)} />
        <StatTile
          label="Country recorded"
          value={num(withCountry)}
          accent="green"
          foot={
            <span className="muted">
              {Math.round((withCountry / COMPANIES.length) * 100)}% of records
            </span>
          }
        />
        <StatTile
          label="Awaiting entity review"
          value={num(needingReview)}
          accent="amber"
          foot={<span className="muted">Legal entity unconfirmed</span>}
        />
        <StatTile
          label="Profiled"
          value={num(profiled)}
          accent="gold"
          empty={profiled === 0}
          foot={<span className="muted">Description &amp; source recorded</span>}
        />
      </div>

      <div className="fleet-layout">
        <FilterRail
          facets={facets}
          inertGroups={INERT}
          anchorId="company-query"
          queryLead="Company where"
          emptyQueryLabel="No filters applied — showing the whole directory"
          searchPlaceholder="Search company name — press Enter"
        >
          <Panel
            title={`Company directory · ${num(results.length)}${
              filtered ? ` of ${num(COMPANIES.length)}` : ''
            }`}
            action={
              pageCount > 1 ? (
                <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
                  Page {num(current)} of {num(pageCount)}
                </span>
              ) : undefined
            }
          >
            {results.length === 0 ? (
              <EmptyState
                icon={<IconSearch size={22} />}
                title="No companies match this query"
                body="Loosen a filter or clear the query to see the full directory."
              />
            ) : (
              <>
                <div className="table-scroll">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Country</th>
                        <th className="th-num">Vessels</th>
                        <th>Profile</th>
                        <th>Entity review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((c) => {
                        const fleet = vesselsForCompany(c.id).length;
                        const kinds = [...fleetFacetsForCompany(c.id).subType];
                        return (
                          <tr key={c.id}>
                            <td className="td-strong" style={{ maxWidth: 290 }}>
                              <Link
                                href={`/app/companies/${c.id}`}
                                className="link-arrow"
                                style={{ fontSize: 13 }}
                              >
                                {c.name}
                              </Link>
                              {/* What they run, under the name: it is the
                                  reason most of these filters exist, and it
                                  costs no column width. */}
                              {kinds.length > 0 && (
                                <div
                                  style={{
                                    fontSize: 11.5,
                                    color: 'var(--text-5)',
                                    marginTop: 3,
                                    fontWeight: 400,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {kinds.slice(0, 3).join(' · ')}
                                  {kinds.length > 3 && ` +${kinds.length - 3}`}
                                </div>
                              )}
                            </td>
                            <td>
                              {c.type ? (
                                <Badge tone="blue">{c.type}</Badge>
                              ) : (
                                <span className="muted">—</span>
                              )}
                            </td>
                            <td>{orDash(c.country)}</td>
                            <td className="td-num">
                              {fleet ? num(fleet) : <span className="muted">—</span>}
                            </td>
                            <td>
                              {c.description ? (
                                <Badge tone="green" dot>
                                  Profiled
                                </Badge>
                              ) : c.website ? (
                                <Badge tone="blue" dot>
                                  Website
                                </Badge>
                              ) : (
                                <span className="muted">—</span>
                              )}
                            </td>
                            <td>
                              {c.review ? (
                                <Badge tone={c.review.confidence === 'low' ? 'red' : 'amber'} dot>
                                  {c.review.flags.length === 1
                                    ? REVIEW_FLAG_SHORT[c.review.flags[0]!]
                                    : `${c.review.flags.length} flags`}
                                </Badge>
                              ) : (
                                <span className="muted">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {pageCount > 1 && (
                  <div
                    className="between"
                    style={{ padding: '13px 16px', borderTop: '1px solid var(--line)' }}
                  >
                    <span style={{ fontSize: 12.5, color: 'var(--text-4)' }}>
                      Showing {num((current - 1) * PER_PAGE + 1)}–
                      {num(Math.min(current * PER_PAGE, results.length))} of {num(results.length)}
                    </span>
                    <div className="row g8">
                      {current > 1 ? (
                        <Link href={pageHref(current - 1)} className="btn btn--quiet btn--sm">
                          <span style={{ transform: 'rotate(180deg)', display: 'flex' }}>
                            <IconChevron size={13} />
                          </span>
                          Previous
                        </Link>
                      ) : (
                        <button className="btn btn--quiet btn--sm" disabled>
                          Previous
                        </button>
                      )}
                      {current < pageCount ? (
                        <Link href={pageHref(current + 1)} className="btn btn--quiet btn--sm">
                          Next
                          <IconChevron size={13} />
                        </Link>
                      ) : (
                        <button className="btn btn--quiet btn--sm" disabled>
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </Panel>
        </FilterRail>
      </div>
    </>
  );
}

/** The options worth showing in a rail section, busiest first. */
function top(counts: Map<string, number>) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 40)
    .map(([value, count]) => ({ value, count }));
}
