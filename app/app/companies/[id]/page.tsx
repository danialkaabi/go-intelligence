import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import Badge, { statusTone } from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import {
  IconCompanies,
  IconContracts,
  IconFleet,
  IconShield,
} from '@/components/ui/Icons';
import { COMPANIES, getCompany } from '@/data/companies';
import { VESSELS } from '@/data/vessels';
import { MANAGEMENT_TIERS } from '@/lib/taxonomy';
import { REVIEW_FLAG_LABELS, REVIEW_RESOLUTION } from '@/lib/review';
import { orDash, pct } from '@/lib/format';

type Params = { params: { id: string } };

export function generateMetadata({ params }: Params): Metadata {
  const company = getCompany(params.id);
  return { title: company ? company.name : 'Company profile' };
}

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ id: c.id }));
}

function Spec({ k, v, href }: { k: string; v?: string | number | null; href?: string }) {
  const missing = v === undefined || v === null || v === '';
  return (
    <div className="spec">
      <div className="spec-k">{k}</div>
      <div className={`spec-v${missing ? ' spec-v--empty' : ''}`}>
        {missing ? (
          'Not recorded'
        ) : href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow"
            style={{ fontSize: 14 }}
          >
            {v}
          </a>
        ) : (
          v
        )}
      </div>
    </div>
  );
}

/** A prompt shown where a narrative field has not been written yet. */
function ToFill({ what, field }: { what: string; field: string }) {
  return (
    <p style={{ fontSize: 13, color: 'var(--text-4)', lineHeight: 1.7 }}>
      {what}{' '}
      <span className="mono" style={{ color: 'var(--blue-400)' }}>
        {field}
      </span>{' '}
      in <span className="mono">data/companies.ts</span>.
    </p>
  );
}

export default function CompanyProfilePage({ params }: Params) {
  const company = getCompany(params.id);

  if (!company) {
    return (
      <>
        <PageHead
          eyebrow="Intelligence · GO Companies"
          title="Company profile"
          actions={
            <Link href="/app/companies" className="btn btn--ghost btn--sm">
              Back to Companies
            </Link>
          }
        />
        <Panel>
          <EmptyState
            icon={<IconCompanies size={22} />}
            title={`No company recorded under “${params.id}”`}
            body="This is the company profile layout: background and description, leadership, vessels by role across all seven management tiers, regional presence, the fleet list and charter history."
            file="data/companies.ts"
            primaryHref="/app/companies"
            primaryLabel="Back to Companies"
          />
        </Panel>
      </>
    );
  }

  // Vessels attach themselves: any vessel naming this company at any
  // ownership tier turns up here without a join being maintained by hand.
  const fleet = VESSELS.filter(
    (v) =>
      v.registeredOwnerId === company.id ||
      v.beneficialOwnerId === company.id ||
      v.operatorId === company.id ||
      v.commercialManagerId === company.id ||
      v.technicalManagerId === company.id ||
      v.ismManagerId === company.id,
  );

  const duplicateOf = company.duplicateOfId
    ? getCompany(company.duplicateOfId)
    : undefined;

  const websiteHref = company.website
    ? company.website.startsWith('http')
      ? company.website
      : `https://${company.website}`
    : undefined;

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Companies"
        title={company.name}
        actions={
          <Link href="/app/companies" className="btn btn--quiet btn--sm">
            Back to Companies
          </Link>
        }
      />

      <div className="row g10 wrapflex" style={{ marginBottom: 18 }}>
        {company.type ? (
          <Badge tone="blue">{company.type}</Badge>
        ) : (
          <Badge tone="grey">Type not recorded</Badge>
        )}
        {company.country && <Badge tone="grey">Registered in {company.country}</Badge>}
        {company.founded && <Badge tone="gold">Est. {company.founded}</Badge>}
        {company.review && (
          <Badge tone={company.review.confidence === 'low' ? 'red' : 'amber'} dot>
            Entity review outstanding
          </Badge>
        )}
        {company.duplicateOfId && <Badge tone="red" dot>Suspected duplicate</Badge>}
        {company.provenance && <Badge tone="green" dot>Profiled</Badge>}
      </div>

      {/* ---------- Suspected duplicate ---------- */}
      {duplicateOf && (
        <Panel style={{ marginBottom: 16 }}>
          <div className="panel-body between wrapflex">
            <div style={{ maxWidth: '70ch' }}>
              <div className="row g10" style={{ marginBottom: 8, color: 'var(--red)' }}>
                <IconCompanies size={16} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
                  Looks like a second entry for {duplicateOf.name}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65 }}>
                Both records are kept. Merging them is a decision for whoever
                owns the data, not something an import should do silently.
              </p>
            </div>
            <Link href={`/app/companies/${duplicateOf.id}`} className="btn btn--ghost btn--sm">
              Open {duplicateOf.name}
            </Link>
          </div>
        </Panel>
      )}

      {/* ---------- Entity review ---------- */}
      {company.review && (
        <Panel style={{ marginBottom: 16 }}>
          <div className="panel-body">
            <div className="row g10" style={{ marginBottom: 10, color: 'var(--amber)' }}>
              <IconShield size={16} />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
                Legal entity not yet confirmed ·{' '}
                {company.review.confidence === 'low' ? 'Low' : 'Medium'} confidence
              </span>
            </div>
            <ul className="stack g8" style={{ marginBottom: 12 }}>
              {company.review.flags.map((f) => (
                <li
                  key={f}
                  className="row g10"
                  style={{ alignItems: 'flex-start', fontSize: 13, color: 'var(--text-3)' }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'var(--amber)',
                      marginTop: 7,
                      flex: 'none',
                    }}
                  />
                  <span style={{ lineHeight: 1.6 }}>{REVIEW_FLAG_LABELS[f]}</span>
                </li>
              ))}
            </ul>
            <div className="well">
              <div className="plan-meta-k" style={{ marginBottom: 6 }}>
                To resolve
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
                {REVIEW_RESOLUTION}
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* ---------- Profile ---------- */}
      <Panel title="Profile" style={{ marginBottom: 16 }}>
        <div className="spec-grid">
          <Spec k="Registered country" v={company.country} />
          <Spec k="Headquarters" v={company.headquarters} />
          <Spec k="Founded" v={company.founded} />
          <Spec k="Company type" v={company.type} />
          <Spec
            k="Fleet size"
            v={company.fleetSize ? `${company.fleetSize} vessels` : undefined}
          />
          <Spec k="Employees" v={company.employees} />
          <Spec k="Website" v={company.website} href={websiteHref} />
          <Spec k="Operating regions" v={company.operatingRegions?.join(', ')} />
        </div>
      </Panel>

      {/* ---------- About ---------- */}
      <div className="grid grid-2" style={{ marginBottom: 16, alignItems: 'start' }}>
        <Panel title="About">
          <div className="panel-body stack g16">
            <div>
              <div className="plan-meta-k" style={{ marginBottom: 8 }}>
                Description
              </div>
              {company.description ? (
                <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {company.description}
                </p>
              ) : (
                <ToFill what="A sentence or two on what this company is and does. Add" field="description" />
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <div className="plan-meta-k" style={{ marginBottom: 8 }}>
                Background
              </div>
              {company.background ? (
                <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {company.background}
                </p>
              ) : (
                <ToFill
                  what="History, ownership and market position — the longer narrative. Add"
                  field="background"
                />
              )}
            </div>
          </div>
        </Panel>

        <Panel title="Leadership">
          <div className="panel-body">
            {company.leadership && company.leadership.length > 0 ? (
              <div className="stack g12">
                {company.leadership.map((p) => (
                  <div className="well row g12" key={`${p.name}-${p.role}`}>
                    <span
                      className="avatar"
                      style={{ width: 36, height: 36, fontSize: 12 }}
                    >
                      {p.name
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase())
                        .join('')}
                    </span>
                    <div>
                      <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-5)', marginTop: 2 }}>
                        {p.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ToFill
                what="Chief executive, managing director, chairman — whoever you deal with. Add"
                field="leadership"
              />
            )}
          </div>
        </Panel>
      </div>

      {/* ---------- Management tiers ---------- */}
      <Panel title="Management structure · vessels by role" style={{ marginBottom: 16 }}>
        <div className="panel-body">
          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(146px, 1fr))', gap: 12 }}
          >
            {MANAGEMENT_TIERS.map((tier) => {
              const count = company.tierCounts?.[tier];
              return (
                <div className="well" key={tier}>
                  <div
                    className="num"
                    style={{
                      fontSize: 24,
                      color: count === undefined ? 'var(--text-5)' : 'var(--text)',
                    }}
                  >
                    {count ?? '—'}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'var(--text-4)',
                      marginTop: 6,
                      lineHeight: 1.45,
                    }}
                  >
                    {tier}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <div className="grid grid-2" style={{ marginBottom: 16, alignItems: 'start' }}>
        <Panel title="Regional presence">
          <div className="panel-body">
            {!company.regionalPresence || company.regionalPresence.length === 0 ? (
              <ToFill
                what="Vessel count and utilisation per basin. Add"
                field="regionalPresence"
              />
            ) : (
              <div className="stack g16">
                {company.regionalPresence.map((r) => (
                  <div className="meter-row" key={r.region}>
                    <div className="meter-head">
                      <span className="meter-label">{r.region}</span>
                      <span className="meter-val">
                        {r.vesselCount} vsl · {pct(r.utilisationPct)}
                      </span>
                    </div>
                    <div className="meter">
                      <div
                        className="meter-fill"
                        style={{ width: `${Math.min(100, r.utilisationPct ?? 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <Panel
          title={`Fleet${fleet.length ? ` · ${fleet.length}` : ''}`}
          action={
            fleet.length > 0 ? (
              <Link href="/app/fleet" className="link-arrow" style={{ fontSize: 12 }}>
                GO Fleet
              </Link>
            ) : undefined
          }
        >
          {fleet.length === 0 ? (
            <div className="panel-body">
              <p style={{ fontSize: 13, color: 'var(--text-4)', lineHeight: 1.7 }}>
                No vessels in the database name this company. Vessels attach
                themselves — set a vessel&rsquo;s{' '}
                <span className="mono" style={{ color: 'var(--blue-400)' }}>
                  registeredOwnerId
                </span>{' '}
                (or any other ownership tier) to{' '}
                <span className="mono" style={{ color: 'var(--blue-400)' }}>
                  &quot;{company.id}&quot;
                </span>{' '}
                and it appears here.
              </p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Vessel</th>
                    <th>Type</th>
                    <th>Region</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fleet.map((v) => (
                    <tr key={v.imo}>
                      <td className="td-strong">
                        <Link href={`/app/fleet/${v.imo}`}>{v.name}</Link>
                      </td>
                      <td>{orDash(v.sizeClass ?? v.subType)}</td>
                      <td>{orDash(v.region)}</td>
                      <td>
                        <Badge tone={statusTone(v.status)} dot>
                          {v.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {/* ---------- Record notes and source ---------- */}
      {(company.notes || company.provenance) && (
        <Panel title="Record" style={{ marginBottom: 16 }}>
          <div className="panel-body stack g14">
            {company.notes && (
              <div>
                <div className="plan-meta-k" style={{ marginBottom: 7 }}>
                  Notes
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>
                  {company.notes}
                </p>
              </div>
            )}

            {company.provenance && (
              <div
                style={
                  company.notes
                    ? { borderTop: '1px solid var(--line)', paddingTop: 14 }
                    : undefined
                }
              >
                <div className="plan-meta-k" style={{ marginBottom: 7 }}>
                  Source
                </div>
                <div className="row g10 wrapflex">
                  {company.provenance.url ? (
                    <a
                      href={company.provenance.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-arrow"
                      style={{ fontSize: 13 }}
                    >
                      {company.provenance.source}
                    </a>
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
                      {company.provenance.source}
                    </span>
                  )}
                  {company.provenance.confidence && (
                    <Badge
                      tone={
                        company.provenance.confidence === 'low'
                          ? 'red'
                          : company.provenance.confidence === 'medium'
                            ? 'amber'
                            : 'green'
                      }
                    >
                      {company.provenance.confidence} confidence
                    </Badge>
                  )}
                  {company.provenance.retrievedAt && (
                    <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-5)' }}>
                      Retrieved {company.provenance.retrievedAt}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Panel>
      )}

      {/* ---------- Charter history ---------- */}
      <Panel title="Charter history · company level">
        {!company.charterHistory || company.charterHistory.length === 0 ? (
          <EmptyState
            icon={<IconContracts size={22} />}
            title="No charter history recorded"
            body="Every GO Companies profile carries this section: which charterers this company has worked with, how many vessels, over what period, and the nature of the agreement."
            file="data/companies.ts"
            fields={['charterer', 'vessels', 'period', 'natureOfAgreement']}
          />
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Charterer</th>
                  <th>Vessels</th>
                  <th>Period</th>
                  <th>Nature of agreement</th>
                </tr>
              </thead>
              <tbody>
                {company.charterHistory.map((h, i) => (
                  <tr key={`${h.charterer}-${i}`}>
                    <td className="td-strong">{h.charterer}</td>
                    <td>{h.vessels}</td>
                    <td>{h.period}</td>
                    <td>{h.natureOfAgreement}</td>
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
