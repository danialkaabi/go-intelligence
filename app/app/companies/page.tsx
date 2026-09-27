import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import StatTile from '@/components/ui/StatTile';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { IconChevron, IconDownload, IconSearch } from '@/components/ui/Icons';
import CompanyFilters from './CompanyFilters';
import { COMPANIES, COMPANY_COUNTRIES } from '@/data/companies';
import { vesselsForCompany } from '@/data/vessels';
import { REVIEW_FLAG_SHORT } from '@/lib/review';
import { num, orDash } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Companies',
  description: 'GO Companies — owners, operators and counterparties.',
};

const PER_PAGE = 50;

type SP = Record<string, string | string[] | undefined>;
const one = (sp: SP, k: string): string => {
  const v = sp[k];
  return (Array.isArray(v) ? v[0] : v) ?? '';
};

export default function CompaniesPage({ searchParams }: { searchParams: SP }) {
  const q = one(searchParams, 'q').trim().toLowerCase();
  const country = one(searchParams, 'country');
  const reviewOnly = Boolean(one(searchParams, 'review'));
  const profiledOnly = Boolean(one(searchParams, 'profiled'));
  const fleetOnly = Boolean(one(searchParams, 'fleet'));

  const withCountry = COMPANIES.filter((c) => c.country).length;
  const needingReview = COMPANIES.filter((c) => c.review).length;
  const profiled = COMPANIES.filter((c) => c.description).length;

  const results = COMPANIES.filter((c) => {
    if (country && c.country !== country) return false;
    if (reviewOnly && !c.review) return false;
    if (profiledOnly && !c.description) return false;
    if (fleetOnly && vesselsForCompany(c.id).length === 0) return false;
    if (q && !c.name.toLowerCase().includes(q)) return false;
    return true;
  });

  const pageNum = Math.max(1, Number(one(searchParams, 'page') || '1') || 1);
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
    return qs ? `/app/companies?${qs}` : '/app/companies';
  };

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Companies"
        title="Companies"
        sub="Owners and operators mapped through seven management tiers, with charter history on every profile."
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

      <CompanyFilters countries={COMPANY_COUNTRIES} />

      <Panel
        title={`Company directory · ${num(results.length)}${
          results.length !== COMPANIES.length ? ` of ${num(COMPANIES.length)}` : ''
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
            title="No companies match"
            body="Loosen the filters or clear the query to see the full directory."
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
                    return (
                      <tr key={c.id}>
                        <td className="td-strong">
                          <Link href={`/app/companies/${c.id}`} className="link-arrow" style={{ fontSize: 13 }}>
                            {c.name}
                          </Link>
                        </td>
                        <td>
                          {c.type ? <Badge tone="blue">{c.type}</Badge> : <span className="muted">—</span>}
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
              <div className="between" style={{ padding: '13px 16px', borderTop: '1px solid var(--line)' }}>
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
                    <button className="btn btn--quiet btn--sm" disabled>Previous</button>
                  )}
                  {current < pageCount ? (
                    <Link href={pageHref(current + 1)} className="btn btn--quiet btn--sm">
                      Next
                      <IconChevron size={13} />
                    </Link>
                  ) : (
                    <button className="btn btn--quiet btn--sm" disabled>Next</button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </Panel>
    </>
  );
}
