import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import type { Fixture, FixtureDerivedField } from '@/data/types';
import { isRunning } from '@/data/charters';
import { date, money, orDash } from '@/lib/format';
import { FIXTURE_TYPE_LABELS } from '@/lib/taxonomy';

const DERIVED_REASON: Record<FixtureDerivedField, string> = {
  startDate:
    'Start date was missing from the source. Worked out from the vessel’s age on this row, or from neighbouring rows of the same source sheet — accurate to about a month.',
  charterer:
    'Charterer was missing from the source. Matched from a published fleet status report, or inferred from the vessel’s surrounding fixtures.',
  owner:
    'Beneficial owner was missing from the source. Taken from the same vessel’s other rows, or from fleet naming and public record.',
};

/** Marks a value the data preparer worked out rather than one the source
 *  carried, so a derived figure never reads as a recorded fact. */
function Derived({ field }: { field: FixtureDerivedField }) {
  return (
    <abbr
      title={DERIVED_REASON[field]}
      style={{
        color: 'var(--blue-400)',
        textDecoration: 'none',
        cursor: 'help',
        fontSize: 11,
        verticalAlign: 'super',
        marginLeft: 3,
      }}
    >
      †
    </abbr>
  );
}

/**
 * The charter book as a table. Used on the vessel profile, where every row
 * is the same vessel, and on the company profile, where the vessel column
 * turns on.
 *
 * Nothing here is interactive, so it stays a server component and the
 * fixtures never cross into the browser bundle.
 */
export default function FixtureTable({
  fixtures,
  showVessel = false,
  showOwner = false,
  markRunning = true,
}: {
  fixtures: Fixture[];
  showVessel?: boolean;
  showOwner?: boolean;
  /** Off where every row is running anyway, so the column stays narrow. */
  markRunning?: boolean;
}) {
  const anyDerived = fixtures.some((f) => f.derived?.length);
  const anyNote = fixtures.some((f) => f.reviewNote);

  return (
    <>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {showVessel && <th>Vessel</th>}
              <th>Start</th>
              <th>Period</th>
              <th>Contract</th>
              <th className="th-num">Rate</th>
              <th>Charterer</th>
              {showOwner && <th>Owner at the time</th>}
              {anyNote && <th>Note</th>}
            </tr>
          </thead>
          <tbody>
            {fixtures.map((f) => {
              const derived = new Set(f.derived ?? []);
              const running = markRunning && isRunning(f);
              return (
                <tr key={f.id}>
                  {showVessel && (
                    <td className="td-strong">
                      {f.vesselId ? (
                        <Link href={`/app/fleet/${f.vesselId}`}>{f.vesselName}</Link>
                      ) : (
                        f.vesselName
                      )}
                    </td>
                  )}
                  <td className={showVessel ? undefined : 'td-strong'}>
                    {f.startDate ? (
                      <>
                        {date(f.startDate)}
                        {derived.has('startDate') && <Derived field="startDate" />}
                      </>
                    ) : (
                      <span className="muted">Not recorded</span>
                    )}
                  </td>
                  <td>
                    {f.period ? (
                      <>
                        {f.period}
                        {f.endDate && (
                          <span
                            className="mono"
                            style={{ color: 'var(--text-5)', fontSize: 11.5, marginLeft: 6 }}
                          >
                            to {date(f.endDate)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className="row g8 wrapflex">
                      {f.contractType ? (
                        <abbr
                          title={FIXTURE_TYPE_LABELS[f.contractType] ?? f.contractType}
                          style={{ textDecoration: 'none' }}
                        >
                          <Badge tone="blue">{f.contractType}</Badge>
                        </abbr>
                      ) : (
                        <span className="muted">—</span>
                      )}
                      {running && (
                        <Badge tone="green" dot>
                          Running
                        </Badge>
                      )}
                    </span>
                  </td>
                  <td className="td-num">{money(f.rate, f.currency, f.rateUnit)}</td>
                  <td>
                    {f.charterer ? (
                      <>
                        {f.charterer}
                        {derived.has('charterer') && <Derived field="charterer" />}
                      </>
                    ) : (
                      <span className="muted">Not disclosed</span>
                    )}
                  </td>
                  {showOwner && (
                    <td>
                      {f.ownerId ? (
                        <Link href={`/app/companies/${f.ownerId}`} className="link-arrow">
                          {f.ownerName}
                        </Link>
                      ) : (
                        orDash(f.ownerName)
                      )}
                      {derived.has('owner') && <Derived field="owner" />}
                    </td>
                  )}
                  {anyNote && (
                    <td style={{ maxWidth: 260 }}>
                      {f.reviewNote ? (
                        <span style={{ fontSize: 12, color: 'var(--amber)' }}>
                          {f.reviewNote}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(anyDerived || anyNote) && (
        <div
          className="panel-body"
          style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}
        >
          <p style={{ fontSize: 12, color: 'var(--text-4)', lineHeight: 1.65 }}>
            {anyDerived && (
              <>
                <span style={{ color: 'var(--blue-400)' }}>†</span> filled in by the
                data preparer rather than carried by the source — hover for the
                basis.{' '}
              </>
            )}
            {anyNote && (
              <>
                Notes in amber are the preparer&rsquo;s own, on rows worth an eye.{' '}
              </>
            )}
            End dates are the start plus the stated period, so treat them as
            indicative and not as the contract.
          </p>
        </div>
      )}
    </>
  );
}
