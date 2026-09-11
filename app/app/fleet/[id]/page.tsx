import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import Badge, { statusTone } from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import VesselPhoto from '@/components/ui/VesselPhoto';
import { IconArrow, IconFleet, IconMaps } from '@/components/ui/Icons';
import { VESSELS, getVessel } from '@/data/vessels';
import { companyName } from '@/data/companies';
import { benchmarkFor } from '@/data/market';
import { orDash, rateBand, usd } from '@/lib/format';
import { MANAGEMENT_TIERS } from '@/lib/taxonomy';

type Params = { params: { id: string } };

export function generateMetadata({ params }: Params): Metadata {
  const vessel = getVessel(params.id);
  return { title: vessel ? vessel.name : 'Vessel profile' };
}

export function generateStaticParams() {
  return VESSELS.map((v) => ({ id: v.id }));
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

export default function VesselProfilePage({ params }: Params) {
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
        <VesselPhoto src={vessel.photoUrl} name={vessel.name} ratio="21 / 9" />
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

      <Panel title="Charter history">
        {!vessel.charterHistory || vessel.charterHistory.length === 0 ? (
          <EmptyState
            icon={<IconArrow size={22} />}
            title="No charter history recorded"
            body="Who fixed this vessel, at what rate, for how long and against which field — the commercial record most platforms do not hold."
            file="data/vessels.ts"
            fields={['date', 'charterType', 'ratePerDay', 'charterer', 'fieldContractedTo']}
          />
        ) : (
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
        )}
      </Panel>
    </>
  );
}
