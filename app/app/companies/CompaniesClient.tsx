'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import StatTile from '@/components/ui/StatTile';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import {
  IconChevron,
  IconCompanies,
  IconDownload,
  IconSearch,
} from '@/components/ui/Icons';
import { COMPANIES, COMPANY_COUNTRIES } from '@/data/companies';
import { MANAGEMENT_TIERS } from '@/lib/taxonomy';
import { REVIEW_FLAG_SHORT } from '@/lib/review';
import { num, orDash } from '@/lib/format';

const PER_PAGE = 50;

export default function CompaniesClient() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [reviewOnly, setReviewOnly] = useState(false);
  const [page, setPage] = useState(0);

  const withCountry = COMPANIES.filter((c) => c.country).length;
  const needingReview = COMPANIES.filter((c) => c.review).length;

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return COMPANIES.filter((c) => {
      if (country && c.country !== country) return false;
      if (reviewOnly && !c.review) return false;
      if (needle && !c.name.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [query, country, reviewOnly]);

  const pageCount = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pageCount - 1);
  const shown = results.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  /** Any filter change puts you back on the first page, or you can land on
   *  an empty one. */
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(0);
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
          label="Management tiers"
          value={MANAGEMENT_TIERS.length}
          accent="gold"
          foot={<span className="muted">Beneficial owner → ISM manager</span>}
        />
      </div>

      {/* ---------- Toolbar ---------- */}
      <div
        className="query-bar"
        style={{ marginBottom: 16, gap: 12, alignItems: 'center' }}
      >
        <div className="search" style={{ flex: '1 1 260px', minWidth: 200 }}>
          <span className="search-icon">
            <IconSearch size={15} />
          </span>
          <input
            className="input"
            placeholder="Search company name…"
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
          />
        </div>

        <select
          className="select"
          style={{ width: 'auto', minWidth: 190 }}
          value={country}
          onChange={(e) => reset(setCountry)(e.target.value)}
        >
          <option value="">All countries</option>
          {COMPANY_COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          className={`btn btn--sm ${reviewOnly ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => reset(setReviewOnly)(!reviewOnly)}
        >
          Needs review
        </button>

        {(query || country || reviewOnly) && (
          <button
            className="link-arrow"
            style={{ fontSize: 12.5 }}
            onClick={() => {
              setQuery('');
              setCountry('');
              setReviewOnly(false);
              setPage(0);
            }}
          >
            Clear
          </button>
        )}
      </div>

      <Panel
        title={`Company directory · ${num(results.length)}${
          results.length !== COMPANIES.length ? ` of ${num(COMPANIES.length)}` : ''
        }`}
        action={
          pageCount > 1 ? (
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
              Page {current + 1} of {num(pageCount)}
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
                    <th className="th-num">Fleet size</th>
                    <th>Entity review</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((c) => (
                    <tr key={c.id}>
                      <td className="td-strong">
                        <Link
                          href={`/app/companies/${c.id}`}
                          className="link-arrow"
                          style={{ fontSize: 13 }}
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td>
                        {c.type ? (
                          <Badge tone="blue">{c.type}</Badge>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>{orDash(c.country)}</td>
                      <td className="td-num">{orDash(c.fleetSize)}</td>
                      <td>
                        {c.review ? (
                          <Badge
                            tone={c.review.confidence === 'low' ? 'red' : 'amber'}
                            dot
                          >
                            {c.review.flags.length === 1
                              ? REVIEW_FLAG_SHORT[c.review.flags[0]!]
                              : `${c.review.flags.length} flags`}
                          </Badge>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && (
              <div
                className="between"
                style={{ padding: '13px 16px', borderTop: '1px solid var(--line)' }}
              >
                <span style={{ fontSize: 12.5, color: 'var(--text-4)' }}>
                  Showing {num(current * PER_PAGE + 1)}–
                  {num(Math.min((current + 1) * PER_PAGE, results.length))} of{' '}
                  {num(results.length)}
                </span>
                <div className="row g8">
                  <button
                    className="btn btn--quiet btn--sm"
                    onClick={() => setPage(current - 1)}
                    disabled={current === 0}
                  >
                    <span style={{ transform: 'rotate(180deg)', display: 'flex' }}>
                      <IconChevron size={13} />
                    </span>
                    Previous
                  </button>
                  <button
                    className="btn btn--quiet btn--sm"
                    onClick={() => setPage(current + 1)}
                    disabled={current >= pageCount - 1}
                  >
                    Next
                    <IconChevron size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Panel>
    </>
  );
}
