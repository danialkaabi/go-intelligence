import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import Badge, { statusTone } from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import VesselPhotoDrop from '@/components/ui/VesselPhotoDrop';
import FixtureTable from '@/components/app/FixtureTable';
import { uploadedPhotoUrl } from '@/lib/vessel-photos';
import { IconArrow, IconFleet, IconMaps } from '@/components/ui/Icons';
import { getVessel } from '@/data/vessels';
import { companyName } from '@/data/companies';
import { fixturesForVessel, runningFixtures } from '@/data/charters';
import { benchmarkFor } from '@/data/market';
import { date, money, orDash, rateBand, usd, yearSpan } from '@/lib/format';
import { FIXTURE_TYPE_LABELS } from '@/lib/taxonomy';

type Params = { params: { id: string } };

export function generateMetadata({ params }: Params): Metadata {
  const vessel = getVessel(params.id);
  return { title: vessel ? vessel.name : 'Vessel profile' };
}

/** Vessel pages render on demand rather than being prerendered: eleven
 *  thousand of them would dominate every build, and most are never opened. */
export const dynamicParams = true;

/** Whether a fixture is running is a fact about today, so a rendered page
 *  is not kept for longer than an hour. */
export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

function Spec({
  k,
  v,
  href,
}: {
  k: string;
  v?: string | number | null;
  href?: string;
}) {
  const missing = v === undefined || v === null || v === '';
  return (
    <div className="spec">
      <div className="spec-k">{k}</div>
      <div className={`spec-v${missing ? ' spec-v--empty' : ''}`}>
        {missing ? (
          'Not recorded'
        ) : href ? (
          <Link href={href} className="link-arrow" style={{ fontSize: 14 }}>
            {v}
          </Link>
        ) : (
          v
        )}
      </div>
    </div>
  );
}

const m = (n?: number) => (n === undefined ? undefined : `${n} m`);
const t = (n?: number) => (n === undefined ? undefined : `${n.toLocaleString('en-US')} T`);

export default async function VesselProfilePage({ params }: Params) {
  const vessel = getVessel(params.id);

  if (!vessel) {
    return (
      <>
        <PageHead
          eyebrow="Intelligence · GO Fleet"
          title="Vessel profile"
          actions={
            <Link href="/app/fleet" className="btn btn--ghost btn--sm">
              Back to Fleet
            </Link>
          }
        />
        <Panel>
          <EmptyState
            icon={<IconFleet size={22} />}
            title={`No vessel recorded under “${params.id}”`}
            body="This is the vessel profile layout: photograph, principal particulars, ownership across the management tiers, capability, the regional benchmark for its class, and full charter history."
            file="data/vessels.ts"
            primaryHref="/app/fleet"
            primaryLabel="Back to Fleet"
          />
        </Panel>
      </>
    );
  }

  // An uploaded photograph sits on top of anything committed by hand:
  // uploading is the more recent deliberate act.
  const uploaded = await uploadedPhotoUrl(vessel.id);

  // Fixtures find the vessel by themselves, through the IMO the charter data
  // carries — nothing on the vessel record points at its charter history.
  const fixtures = fixturesForVessel(vessel.id);
  const running = runningFixtures(fixtures);
  const charterers = new Set(
    fixtures.map((f) => f.charterer).filter(Boolean) as string[],
  );
  const span = {
    from: fixtures.reduce<string | undefined>(
      (min, f) => (f.startDate && (!min || f.startDate < min) ? f.startDate : min),
      undefined,
    ),
    to: fixtures.reduce<string | undefined>(
      (max, f) => {
        const end = f.endDate ?? f.startDate;
        return end && (!max || end > max) ? end : max;
      },
      undefined,
    ),
  };

  const benchmark =
    vessel.region && vessel.sizeClass
      ? benchmarkFor(vessel.region, vessel.sizeClass)
      : undefined;

  const owners: Array<[string, string | undefined]> = [
    ['Beneficial Owner', vessel.beneficialOwnerId],
    ['Registered Owner', vessel.registeredOwnerId],
    ['Commercial Manager', vessel.commercialManagerId],
    ['Operator', vessel.operatorId],
    ['Technical Manager', vessel.technicalManagerId],
    ['ISM Manager', vessel.ismManagerId],
  ];

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Fleet"
        title={vessel.name}
        actions={
          <>
            <Link href="/app/maps" className="btn btn--ghost btn--sm">
              <IconMaps size={14} />
              Show on map
            </Link>
            <Link href="/app/fleet" className="btn btn--quiet btn--sm">
              Back to Fleet
            </Link>
          </>
        }
      />

      <div className="row g10 wrapflex" style={{ marginBottom: 18 }}>
        <Badge tone="blue">{vessel.subType}</Badge>
        {vessel.sizeClass && <Badge tone="grey">{vessel.sizeClass}</Badge>}
        {vessel.dpClass && <Badge tone="gold">{vessel.dpClass}</Badge>}
        {vessel.flag && <Badge tone="grey">{vessel.flag} flag</Badge>}
        {vessel.status ? (
          <Badge tone={statusTone(vessel.status)} dot>
            {vessel.status}
          </Badge>
        ) : (
          <Badge tone="grey">Status not recorded</Badge>
        )}
      </div>

      {/* ---------- Photograph ---------- */}
      <div style={{ marginBottom: 16 }}>
        <VesselPhotoDrop
          vesselId={vessel.id}
          name={vessel.name}
          initialUrl={uploaded ?? vessel.photoUrl}
          curatedUrl={vessel.photoUrl}
        />
      </div>

      <Panel title="Particulars" style={{ marginBottom: 16 }}>
        <div className="spec-grid">
          <Spec k="IMO" v={vessel.imo} />
          <Spec k="MMSI" v={vessel.mmsi} />
          <Spec k="Call sign" v={vessel.callSign ?? vessel.callSignNo} />
          <Spec k="Flag" v={vessel.flag} />
          <Spec k="Built" v={vessel.built} />
          <Spec k="Builder" v={vessel.builder} />
          <Spec k="Class" v={vessel.classSociety} />
          <Spec k="Type" v={`${vessel.category} · ${vessel.subType}`} />
        </div>
      </Panel>

      <div className="grid grid-2" style={{ marginBottom: 16, alignItems: 'start' }}>
        <Panel title="Principal dimensions">
          <div className="spec-grid">
            <Spec k="Length OA" v={m(vessel.loaM)} />
            <Spec k="Breadth moulded" v={m(vessel.beamM)} />
            <Spec k="Depth moulded" v={m(vessel.depthM)} />
            <Spec k="Draft" v={m(vessel.draftM)} />
            <Spec k="Gross tonnage" v={t(vessel.grt)} />
            <Spec k="Deadweight" v={t(vessel.dwt)} />
            <Spec
              k="Bollard pull"
              v={vessel.bollardPullT ? `${vessel.bollardPullT} T` : undefined}
            />
            <Spec
              k="Deck space"
              v={vessel.deckSpaceM2 ? `${vessel.deckSpaceM2.toLocaleString('en-US')} m²` : undefined}
            />
            <Spec k="Installed power" v={vessel.bhp ? `${vessel.bhp.toLocaleString('en-US')} BHP` : undefined} />
            <Spec k="Accommodation" v={vessel.totalPob ? `${vessel.totalPob} POB` : undefined} />
            <Spec k="DP class" v={vessel.dpClass} />
            <Spec k="Speed" v={vessel.speedNote} />
          </div>
        </Panel>

        <div className="stack g16">
          <Panel title="Ownership & management">
            <div className="panel-body stack g10">
              {owners.map(([tier, id]) => (
                <div
                  key={tier}
                  className="between"
                  style={{ paddingBottom: 9, borderBottom: '1px solid var(--line)' }}
                >
                  <span style={{ fontSize: 12, color: 'var(--text-4)' }}>{tier}</span>
                  {id ? (
                    <Link
                      href={`/app/companies/${id}`}
                      className="link-arrow"
                      style={{ fontSize: 13 }}
                    >
                      {companyName(id) ?? id}
                    </Link>
                  ) : (
                    <span className="muted" style={{ fontSize: 13 }}>
                      Not recorded
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Capability">
            <div className="panel-body">
              {vessel.features && vessel.features.length > 0 ? (
                <div className="row g8 wrapflex">
                  {vessel.features.map((f) => (
                    <span className="plan-feat" key={f}>
                      {f}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted" style={{ fontSize: 13 }}>
                  No capability tags recorded.
                </p>
              )}
            </div>
          </Panel>
        </div>
      </div>

      <Panel
        title={`${vessel.sizeClass ?? vessel.subType} benchmark${vessel.region ? ` · ${vessel.region}` : ''}`}
        style={{ marginBottom: 16 }}
      >
        <div className="panel-body">
          {benchmark ? (
            <div className="between wrapflex">
              <span className="num" style={{ fontSize: 24 }}>
                {rateBand(benchmark.lowUsdPerDay, benchmark.highUsdPerDay)}
              </span>
              <span className="muted" style={{ fontSize: 12 }}>
                Indicative term rate — confirm with broker quotes
              </span>
            </div>
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>
              No benchmark recorded for this class and region. Add one to{' '}
              <span className="mono" style={{ color: 'var(--blue-400)' }}>
                data/market.ts
              </span>{' '}
              and it appears here, and as the variance column in the charter book.
            </p>
          )}
        </div>
      </Panel>

      {(vessel.notes || vessel.provenance) && (
        <Panel title="Record" style={{ marginBottom: 16 }}>
          <div className="panel-body stack g14">
            {vessel.notes && (
              <div>
                <div className="plan-meta-k" style={{ marginBottom: 7 }}>
                  Notes
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
                  {vessel.notes}
                </p>
              </div>
            )}
            {vessel.provenance && (
              <div
                style={
                  vessel.notes
                    ? { borderTop: '1px solid var(--line)', paddingTop: 14 }
                    : undefined
                }
              >
                <div className="plan-meta-k" style={{ marginBottom: 7 }}>
                  Source
                </div>
                <div className="row g10 wrapflex">
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
                    {vessel.provenance.source}
                  </span>
                  {vessel.provenance.confidence && (
                    <Badge
                      tone={
                        vessel.provenance.confidence === 'low'
                          ? 'red'
                          : vessel.provenance.confidence === 'medium'
                            ? 'amber'
                            : 'green'
                      }
                    >
                      {vessel.provenance.confidence} confidence
                    </Badge>
                  )}
                  {vessel.provenance.retrievedAt && (
                    <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-5)' }}>
                      Retrieved {vessel.provenance.retrievedAt}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Panel>
      )}

      {/* ---------- Charter history ---------- */}
      <Panel
        title={
          fixtures.length > 0
            ? `Charter history · ${fixtures.length} fixture${fixtures.length === 1 ? '' : 's'}`
            : 'Charter history'
        }
        action={
          fixtures.length > 0 ? (
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
              {yearSpan(span.from, span.to)}
            </span>
          ) : undefined
        }
        style={{ marginBottom: 16 }}
      >
        {fixtures.length === 0 ? (
          <EmptyState
            icon={<IconArrow size={22} />}
            title="No charter history recorded"
            body="The charter book holds ten years of fixtures, matched to vessels by IMO number. None of them is this vessel — either it has not been fixed in that window, or its IMO is not on any of those rows."
            file="data/charters.json"
            fields={[
              'startDate',
              'period',
              'contractType',
              'rate',
              'currency',
              'charterer',
            ]}
          />
        ) : (
          <>
            <div className="panel-body" style={{ borderBottom: '1px solid var(--line)' }}>
              {running.length > 0 ? (
                <div className="stack g8">
                  {running.map((f) => (
                    <div key={f.id} className="between wrapflex">
                      <span style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
                        <Badge tone="green" dot>
                          Running now
                        </Badge>{' '}
                        {f.contractType
                          ? (FIXTURE_TYPE_LABELS[f.contractType] ?? f.contractType)
                          : 'Fixture'}
                        {f.charterer ? ` to ${f.charterer}` : ' — charterer not disclosed'}
                        {f.endDate ? ` through ${date(f.endDate)}` : ''}
                      </span>
                      {f.rate !== undefined && (
                        <span className="num" style={{ fontSize: 15 }}>
                          {money(f.rate, f.currency, f.rateUnit)}
                        </span>
                      )}
                    </div>
                  ))}
                  <p className="muted" style={{ fontSize: 12 }}>
                    Taken from the fixture&rsquo;s stated period, not from a contract on
                    file — confirm before relying on it.
                  </p>
                </div>
              ) : (
                <div className="row g16 wrapflex">
                  <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
                    No fixture running today on this record.
                  </span>
                  <span className="muted" style={{ fontSize: 12.5 }}>
                    {charterers.size > 0
                      ? `${charterers.size} charterer${charterers.size === 1 ? '' : 's'} named across its history`
                      : 'No charterer named on any of its fixtures'}
                  </span>
                </div>
              )}
            </div>
            <FixtureTable fixtures={fixtures} showOwner />
          </>
        )}
      </Panel>

      {/* Fixtures entered by hand live on the vessel record, where they
          survive a re-import of the charter book. */}
      {vessel.charterHistory && vessel.charterHistory.length > 0 && (
        <Panel title="Charter history · recorded by hand">
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Charter type</th>
                  <th className="th-num">Rate (USD/day)</th>
                  <th>Charterer</th>
                  <th>Field contracted to</th>
                </tr>
              </thead>
              <tbody>
                {vessel.charterHistory.map((c, i) => (
                  <tr key={`${c.date}-${i}`}>
                    <td className="td-strong">{c.date}</td>
                    <td>{c.charterType}</td>
                    <td className="td-num">{usd(c.ratePerDay)}</td>
                    <td>{c.charterer}</td>
                    <td>{orDash(c.fieldContractedTo)}</td>
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
