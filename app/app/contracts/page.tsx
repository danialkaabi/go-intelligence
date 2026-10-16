import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import StatTile from '@/components/ui/StatTile';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { statusTone } from '@/components/ui/Badge';
import FixtureTable from '@/components/app/FixtureTable';
import { IconContracts, IconDownload } from '@/components/ui/Icons';
import { CONTRACTS } from '@/data/contracts';
import {
  FIXTURES,
  FIXTURE_COVERAGE,
  UNLINKED_FIXTURES,
  runningFixtures,
} from '@/data/charters';
import {
  daysUntil,
  expiresIn,
  num,
  signedPct,
  usd,
  year,
} from '@/lib/format';

export const metadata: Metadata = {
  title: 'Contracts',
  description: 'GO Contracts — the live charter book.',
};

/** What is running today moves with the date, so the page is re-rendered
 *  rather than frozen into the build. */
export const revalidate = 3600;

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

export default function ContractsPage() {
  // The charter book is the fixture data: a fixture is live when today sits
  // between its start and the end implied by its period.
  const running = runningFixtures(FIXTURES).sort((a, b) =>
    (a.endDate ?? '').localeCompare(b.endDate ?? ''),
  );
  const expiring90 = running.filter((f) => {
    const d = daysUntil(f.endDate);
    return d !== undefined && d >= 0 && d <= 90;
  }).length;
  const withRate = running.filter((f) => f.rate !== undefined).length;

  /** Renewal exposure bucketed into the next four quarters. */
  const exposure = QUARTERS.map((q, i) => {
    const lo = i * 91;
    const hi = (i + 1) * 91;
    const count = running.filter((f) => {
      const d = daysUntil(f.endDate);
      return d !== undefined && d >= lo && d < hi;
    }).length;
    return { q, count };
  });

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
        if (f.startDate && (!row.last || f.startDate > row.last)) {
          row.last = f.startDate;
        }
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
        sub="The charter book, built from ten years of fixtures. What is on hire now, what rolls off next, and where the renewal exposure sits."
        actions={
          <button className="btn btn--ghost btn--sm" disabled>
            <IconDownload size={14} />
            Export to Excel
          </button>
        }
      />

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatTile
          label="Running today"
          value={running.length === 0 ? '—' : num(running.length)}
          empty={running.length === 0}
          foot={`${withRate} with a rate on record`}
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
        title={`Charter book · running today${running.length ? ` · ${running.length}` : ''}`}
        action={
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
            Sorted by roll-off
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        {running.length === 0 ? (
          <EmptyState
            icon={<IconContracts size={22} />}
            title="Nothing on hire on today's date"
            body="A fixture counts as live when today falls between its start date and the end implied by its stated period. The book holds plenty of history; none of it reaches today."
            file="data/charters.json"
            fields={['startDate', 'period', 'contractType', 'rate', 'charterer']}
          />
        ) : (
          <FixtureTable fixtures={running} showVessel showOwner markRunning={false} />
        )}
      </Panel>

      <Panel title="Renewal exposure · next 12 months" style={{ marginBottom: 16 }}>
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
                  {running.length === 0 ? 'No fixtures running' : 'rolling off'}
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
            Bucketed from each fixture&rsquo;s start plus its stated period. Periods in
            the charter data are approximate, so this shows where exposure clusters
            — not a date to hold anyone to.
          </p>
        </div>
      </Panel>

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
          style={{ marginBottom: 16 }}
        >
          <div className="panel-body" style={{ borderBottom: '1px solid var(--line)' }}>
            <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
              These fixtures name a vessel the fleet database does not hold, so their
              history reaches no vessel profile. Add the vessel — with the IMO where
              there is one — and its fixtures attach themselves.
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
        <Panel title="Charter book · recorded by hand">
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
