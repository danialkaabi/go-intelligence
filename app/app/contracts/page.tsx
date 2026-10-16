import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import StatTile from '@/components/ui/StatTile';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { statusTone } from '@/components/ui/Badge';
import FixtureTable from '@/components/app/FixtureTable';
import FilterRail, { type Facet } from '@/components/app/FilterRail';
import { IconChevron, IconDownload, IconSearch } from '@/components/ui/Icons';
import { CONTRACTS } from '@/data/contracts';
import {
  FIXTURES,
  FIXTURE_COVERAGE,
  FIXTURE_STATUSES,
  PERIOD_BANDS,
  UNLINKED_FIXTURES,
  fixtureStatus,
  periodBand,
} from '@/data/charters';
import { daysUntil, expiresIn, num, signedPct, usd, year } from '@/lib/format';
import type { Fixture } from '@/data/types';

export const metadata: Metadata = {
  title: 'Contracts',
  description: 'GO Contracts — the live charter book.',
};

const PER_PAGE = 50;
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

/** A fixture with the things worth filtering on worked out once, rather
 *  than recomputed for every facet on every row. */
interface Row {
  f: Fixture;
  status: string;
  year: string;
  band: string;
  vesselType: string;
  charterer: string;
  owner: string;
  contract: string;
  currency: string;
  basis: string;
}

const BASIS: Record<string, string> = {
  pd: 'Per day',
  pa: 'Per year',
  lumpsum: 'Lump sum',
};

/** Facets read straight off a row. */
const FACETS: Array<{ key: string; label: string; field: keyof Row; defaultOpen?: boolean }> = [
  { key: 'st', label: 'Status', field: 'status', defaultOpen: true },
  { key: 'ct', label: 'Contract', field: 'contract' },
  { key: 'vt', label: 'Vessel type', field: 'vesselType' },
  { key: 'chr', label: 'Charterer', field: 'charterer' },
  { key: 'own', label: 'Owner at the time', field: 'owner' },
  { key: 'yr', label: 'Year fixed', field: 'year' },
  { key: 'per', label: 'Charter length', field: 'band' },
  { key: 'cur', label: 'Currency', field: 'currency' },
  { key: 'bas', label: 'Rate basis', field: 'basis' },
];

/** Independent flags: ticking two means both must hold. */
const RECORD_FLAGS: Array<{ value: string; test: (f: Fixture) => boolean }> = [
  { value: 'Rate disclosed', test: (f) => f.rate !== undefined },
  { value: 'Charterer named', test: (f) => Boolean(f.charterer) },
  { value: 'Linked to a vessel', test: (f) => Boolean(f.vesselId) },
  { value: 'No vessel record', test: (f) => !f.vesselId },
  { value: 'Flagged for review', test: (f) => Boolean(f.reviewNote) },
  { value: 'Contains derived values', test: (f) => Boolean(f.derived?.length) },
];

const INERT = ['Region', 'Field', 'Rate vs benchmark'];

/** Facets whose options read as a scale, in that order rather than by count. */
const ORDERED: Record<string, readonly string[]> = {
  st: FIXTURE_STATUSES,
  per: PERIOD_BANDS,
};

type SP = Record<string, string | string[] | undefined>;
const many = (sp: SP, k: string): string[] => {
  const v = sp[k];
  return v === undefined ? [] : Array.isArray(v) ? v : [v];
};

export default function ContractsPage({ searchParams }: { searchParams: SP }) {
  const q = (many(searchParams, 'q')[0] ?? '').trim().toLowerCase();
  const selected: Record<string, string[]> = Object.fromEntries([
    ...FACETS.map((f) => [f.key, many(searchParams, f.key)]),
    ['rec', many(searchParams, 'rec')],
  ]);

  const rows: Row[] = FIXTURES.map((f) => ({
    f,
    status: fixtureStatus(f),
    year: f.startDate ? f.startDate.slice(0, 4) : '',
    band: periodBand(f) ?? '',
    vesselType: f.vesselType ?? '',
    charterer: f.charterer ?? '',
    owner: f.ownerName ?? '',
    contract: f.contractType ?? '',
    currency: f.currency ?? '',
    basis: f.rateUnit ? (BASIS[f.rateUnit] ?? f.rateUnit) : '',
  }));

  /** One row against the query, optionally ignoring one facet so that
   *  facet's counts say what each option would return. */
  const matches = (r: Row, skip?: string) => {
    if (q) {
      const hit =
        r.f.vesselName.toLowerCase().includes(q) ||
        (r.f.imo ?? '').includes(q) ||
        r.charterer.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q);
      if (!hit) return false;
    }
    for (const f of FACETS) {
      if (f.key === skip) continue;
      const sel = selected[f.key]!;
      if (sel.length && !sel.includes(String(r[f.field]))) return false;
    }
    if (skip !== 'rec') {
      for (const v of selected.rec!) {
        const flag = RECORD_FLAGS.find((x) => x.value === v);
        if (flag && !flag.test(r.f)) return false;
      }
    }
    return true;
  };

  const results = rows.filter((r) => matches(r));

  const facets: Facet[] = [
    ...FACETS.map((f) => {
      const counts = new Map<string, number>();
      for (const r of rows) {
        if (!matches(r, f.key)) continue;
        const val = String(r[f.field]);
        if (!val) continue;
        counts.set(val, (counts.get(val) ?? 0) + 1);
      }
      const order = ORDERED[f.key];
      const options = order
        ? order.filter((v) => counts.has(v)).map((v) => ({ value: v, count: counts.get(v)! }))
        : f.key === 'yr'
          ? [...counts.entries()]
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([value, count]) => ({ value, count }))
          : [...counts.entries()]
              .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
              .slice(0, 40)
              .map(([value, count]) => ({ value, count }));
      return { key: f.key, label: f.label, defaultOpen: f.defaultOpen, options };
    }),
    {
      key: 'rec',
      label: 'Record',
      mode: 'all' as const,
      options: RECORD_FLAGS.map((x) => ({
        value: x.value,
        count: rows.filter(
          (r) =>
            matches(r, 'rec') &&
            x.test(r.f) &&
            selected.rec!.every((v) => {
              const other = RECORD_FLAGS.find((o) => o.value === v);
              return !other || other.test(r.f);
            }),
        ).length,
      })).filter((o) => o.count > 0 || selected.rec!.includes(o.value)),
    },
  ];

  // Exposure follows the query: filter to AHTS and you get AHTS exposure.
  const running = results
    .filter((r) => r.status === 'Running now')
    .map((r) => r.f)
    .sort((a, b) => (a.endDate ?? '').localeCompare(b.endDate ?? ''));
  const expiring90 = running.filter((f) => {
    const d = daysUntil(f.endDate);
    return d !== undefined && d >= 0 && d <= 90;
  }).length;
  const exposure = QUARTERS.map((qr, i) => ({
    q: qr,
    count: running.filter((f) => {
      const d = daysUntil(f.endDate);
      return d !== undefined && d >= i * 91 && d < (i + 1) * 91;
    }).length,
  }));

  const filtered = results.length !== FIXTURES.length;
  const pageNum = Math.max(1, Number(many(searchParams, 'page')[0] ?? '1') || 1);
  const pageCount = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(pageNum, pageCount);
  const shown = results.slice((current - 1) * PER_PAGE, current * PER_PAGE).map((r) => r.f);

  const pageHref = (n: number) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (k === 'page' || v === undefined) continue;
      for (const x of Array.isArray(v) ? v : [v]) p.append(k, x);
    }
    if (n > 1) p.set('page', String(n));
    const qs = p.toString();
    return qs ? `/app/contracts?${qs}#book-query` : '/app/contracts#book-query';
  };

  // Vessels whose fixtures sit in the book but which are not in the fleet
  // database, so their history reaches no vessel profile.
  const orphans = (() => {
    const m = new Map<
      string,
      { name: string; imo?: string; type?: string; rows: number; last?: string }
    >();
    for (const f of UNLINKED_FIXTURES) {
      const key = f.imo ?? f.vesselName;
      const row = m.get(key);
      if (row) {
        row.rows += 1;
        if (f.startDate && (!row.last || f.startDate > row.last)) row.last = f.startDate;
      } else {
        m.set(key, {
          name: f.vesselName,
          imo: f.imo,
          type: f.vesselType,
          rows: 1,
          last: f.startDate,
        });
      }
    }
    return [...m.values()].sort((a, b) => b.rows - a.rows);
  })();

  const handEntered = CONTRACTS.filter((c) => c.status !== 'Completed').sort(
    (a, b) =>
      (daysUntil(a.expiryDate) ?? Number.MAX_SAFE_INTEGER) -
      (daysUntil(b.expiryDate) ?? Number.MAX_SAFE_INTEGER),
  );

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Contracts"
        title="Contracts"
        sub="The charter book, built from ten years of fixtures. Query it by charterer, owner, contract form, length or rate — then see what is on hire now and what rolls off next."
        actions={
          <button className="btn btn--ghost btn--sm" disabled>
            <IconDownload size={14} />
            Export to Excel
          </button>
        }
      />

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile
          label={filtered ? 'Running · this query' : 'Running today'}
          value={running.length === 0 ? '—' : num(running.length)}
          empty={running.length === 0}
          foot={`${running.filter((f) => f.rate !== undefined).length} with a rate on record`}
        />
        <StatTile
          label="Rolling off < 90 days"
          value={running.length === 0 ? '—' : expiring90}
          empty={running.length === 0}
          accent="amber"
          foot="By the period on the fixture"
        />
        <StatTile
          label="Vessels covered"
          value={num(FIXTURE_COVERAGE.vessels)}
          accent="green"
          foot={`${num(FIXTURE_COVERAGE.unlinkedVessels)} not yet in the fleet`}
        />
        <StatTile
          label="Fixtures on record"
          value={num(FIXTURE_COVERAGE.fixtures)}
          accent="gold"
          foot={`${year(FIXTURE_COVERAGE.firstStart)} – ${year(FIXTURE_COVERAGE.lastStart)} · ${num(FIXTURE_COVERAGE.charterers)} charterers`}
        />
      </div>

      <Panel
        title={`Renewal exposure · next 12 months${filtered ? ' · this query' : ''}`}
        style={{ marginBottom: 16 }}
      >
        <div className="panel-body">
          <div className="grid grid-4">
            {exposure.map((e) => (
              <div className="well" key={e.q}>
                <div className="plan-meta-k" style={{ marginBottom: 8 }}>
                  {e.q}
                </div>
                <div
                  className="num"
                  style={{
                    fontSize: 26,
                    color: running.length === 0 ? 'var(--text-5)' : 'var(--text)',
                  }}
                >
                  {running.length === 0 ? '—' : e.count}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-5)', marginTop: 5 }}>
                  {running.length === 0 ? 'Nothing running' : 'rolling off'}
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
            Bucketed from each fixture&rsquo;s start plus its stated period, across
            whatever the query selects. Periods in the charter data are
            approximate, so this shows where exposure clusters — not a date to
            hold anyone to.
          </p>
        </div>
      </Panel>

      <div className="fleet-layout">
        <FilterRail
          facets={facets}
          inertGroups={INERT}
          anchorId="book-query"
          queryLead="Fixture where"
          emptyQueryLabel="No filters applied — showing the whole charter book"
          searchPlaceholder="Search vessel, IMO, charterer or owner — press Enter"
        >
          <Panel
            title={`Charter book · ${num(results.length)} fixture${
              results.length === 1 ? '' : 's'
            }${filtered ? ` of ${num(FIXTURES.length)}` : ''}`}
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
                title="No fixtures match this query"
                body="Loosen a filter or clear the query to see the whole charter book."
              />
            ) : (
              <>
                <FixtureTable fixtures={shown} showVessel showOwner />
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

      {/* Fixtures whose vessel is missing from the fleet: visible, so the
          gap can be closed, rather than silently dropped. */}
      {orphans.length > 0 && (
        <Panel
          title={`Fixtures with no vessel record · ${num(UNLINKED_FIXTURES.length)} rows over ${num(orphans.length)} vessels`}
          action={
            <Link href="/app/fleet" className="link-arrow" style={{ fontSize: 12 }}>
              GO Fleet
            </Link>
          }
          style={{ marginTop: 16 }}
        >
          <div className="panel-body" style={{ borderBottom: '1px solid var(--line)' }}>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
              These fixtures name a vessel the fleet database does not hold, so their
              history reaches no vessel profile. Add the vessel — with the IMO where
              there is one — and its fixtures attach themselves. They are in the book
              above too, under{' '}
              <span className="mono" style={{ color: 'var(--blue-400)' }}>
                Record → No vessel record
              </span>
              .
            </p>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Vessel as named</th>
                  <th>IMO</th>
                  <th>Type</th>
                  <th className="th-num">Fixtures</th>
                  <th>Last fixed</th>
                </tr>
              </thead>
              <tbody>
                {orphans.slice(0, 50).map((o) => (
                  <tr key={o.imo ?? o.name}>
                    <td className="td-strong">{o.name}</td>
                    <td className="mono" style={{ fontSize: 12 }}>
                      {o.imo ?? <span className="muted">None</span>}
                    </td>
                    <td>{o.type ?? <span className="muted">—</span>}</td>
                    <td className="td-num">{o.rows}</td>
                    <td className="mono" style={{ fontSize: 12 }}>
                      {year(o.last)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orphans.length > 50 && (
            <div
              className="panel-body"
              style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}
            >
              <p style={{ fontSize: 12, color: 'var(--text-4)' }}>
                {orphans.length - 50} more vessels are in the same position.
              </p>
            </div>
          )}
        </Panel>
      )}

      {/* The hand-kept charter book, for fixtures entered directly. */}
      {handEntered.length > 0 && (
        <Panel title="Charter book · recorded by hand" style={{ marginTop: 16 }}>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Vessel</th>
                  <th>Type</th>
                  <th>Charterer</th>
                  <th className="th-num">Rate/day</th>
                  <th className="th-num">vs Benchmark</th>
                  <th>Expires in</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {handEntered.map((c) => (
                  <tr key={c.id}>
                    <td className="td-strong">
                      <Link href={`/app/fleet/${c.vesselId}`}>{c.vesselName}</Link>
                    </td>
                    <td>{c.vesselType}</td>
                    <td>{c.charterer}</td>
                    <td className="td-num">{usd(c.ratePerDay)}</td>
                    <td
                      className="td-num"
                      style={{
                        color:
                          c.vsBenchmarkPct === undefined
                            ? 'var(--text-5)'
                            : c.vsBenchmarkPct >= 0
                              ? 'var(--green)'
                              : 'var(--red)',
                      }}
                    >
                      {signedPct(c.vsBenchmarkPct)}
                    </td>
                    <td className="mono">{expiresIn(c.expiryDate)}</td>
                    <td>
                      <Badge tone={statusTone(c.status)} dot>
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </>
  );
}
