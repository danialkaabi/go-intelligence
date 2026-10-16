import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/app/PageHead';
import Panel from '@/components/ui/Panel';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { statusTone } from '@/components/ui/Badge';
import { VesselThumb } from '@/components/ui/VesselPhoto';
import {
  IconChevron,
  IconDownload,
  IconFleet,
  IconPortfolio,
  IconSearch,
} from '@/components/ui/Icons';
import FilterRail, { type Facet } from '@/components/app/FilterRail';
import { VESSELS } from '@/data/vessels';
import { companyName } from '@/data/companies';
import { num, orDash } from '@/lib/format';
import { uploadedPhotoMap } from '@/lib/vessel-photos';
import type { Vessel } from '@/data/types';

export const metadata: Metadata = {
  title: 'Fleet',
  description: 'GO Fleet — offshore vessel intelligence and database.',
};

const PER_PAGE = 50;

/** Facet keys, and the vessel field each one filters on. */
const FACETS: Array<{ key: string; label: string; field: keyof Vessel; defaultOpen?: boolean }> = [
  { key: 'cat', label: 'Vessel type', field: 'category', defaultOpen: true },
  { key: 'sub', label: 'Sub-type', field: 'subType' },
  { key: 'size', label: 'Size class', field: 'sizeClass' },
  { key: 'flag', label: 'Flag', field: 'flag' },
  { key: 'status', label: 'Status', field: 'status' },
];

const INERT = [
  'Built',
  'Features',
  'Company',
  'Energy efficiency',
  'AIS raw',
  'AIS derived',
  'Transactions',
];

type SP = Record<string, string | string[] | undefined>;
const many = (sp: SP, k: string): string[] => {
  const v = sp[k];
  return v === undefined ? [] : Array.isArray(v) ? v : [v];
};

export default async function FleetPage({ searchParams }: { searchParams: SP }) {
  // One lookup for the whole page, not one per row.
  const photos = await uploadedPhotoMap();
  const q = (many(searchParams, 'q')[0] ?? '').trim().toLowerCase();
  const selected = Object.fromEntries(
    FACETS.map((f) => [f.key, many(searchParams, f.key)]),
  );

  // Filtering runs here, on the server: the database is far too large to
  // hand to the browser for client-side search.
  const results = VESSELS.filter((v) => {
    for (const f of FACETS) {
      const sel = selected[f.key]!;
      if (sel.length && !sel.includes(String(v[f.field] ?? ''))) return false;
    }
    if (!q) return true;
    return (
      v.name.toLowerCase().includes(q) ||
      (v.imo ?? '').includes(q) ||
      (v.goId ?? '').toLowerCase().includes(q)
    );
  });

  // Counts reflect the rest of the query, so they say what each option would
  // actually return rather than its total across the whole database.
  const facets: Facet[] = FACETS.map((f) => {
    const others = VESSELS.filter((v) => {
      for (const g of FACETS) {
        if (g.key === f.key) continue;
        const sel = selected[g.key]!;
        if (sel.length && !sel.includes(String(v[g.field] ?? ''))) return false;
      }
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        (v.imo ?? '').includes(q) ||
        (v.goId ?? '').toLowerCase().includes(q)
      );
    });
    const counts = new Map<string, number>();
    for (const v of others) {
      const val = v[f.field];
      if (val === undefined || val === null || val === '') continue;
      counts.set(String(val), (counts.get(String(val)) ?? 0) + 1);
    }
    return {
      key: f.key,
      label: f.label,
      defaultOpen: f.defaultOpen,
      options: [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 40)
        .map(([value, count]) => ({ value, count })),
    };
  });

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
    return qs ? `/app/fleet?${qs}#fleet-query` : '/app/fleet#fleet-query';
  };

  const filtered = results.length !== VESSELS.length;

  return (
    <>
      <PageHead
        eyebrow="Intelligence · GO Fleet"
        title="Fleet"
        sub="Full vessel-type taxonomy, size class, ownership, AIS position and in-zone filters — combined in one query."
        actions={
          <>
            <button className="btn btn--ghost btn--sm" disabled>
              <IconPortfolio size={14} />
              Save as portfolio
            </button>
            <button className="btn btn--ghost btn--sm" disabled>
              <IconDownload size={14} />
              Export to Excel
            </button>
          </>
        }
      />

      <div className="fleet-layout">
        <FilterRail
          facets={facets}
          inertGroups={INERT}
          anchorId="fleet-query"
          queryLead="Vessel type is"
          emptyQueryLabel="No filters applied — showing everything in the database"
          searchPlaceholder="Search vessel name, IMO or GO id — press Enter"
        >
      <Panel
        title={
          VESSELS.length === 0
            ? 'Results'
            : `Results · ${num(results.length)} vessel${results.length === 1 ? '' : 's'}${
                filtered ? ` of ${num(VESSELS.length)}` : ''
              }`
        }
        action={
          pageCount > 1 ? (
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-5)' }}>
              Page {num(current)} of {num(pageCount)}
            </span>
          ) : undefined
        }
      >
        {VESSELS.length === 0 ? (
          <EmptyState
            icon={<IconFleet size={22} />}
            title="No vessels in the database yet"
            body="GO Fleet is the offshore vessel database. The filter rail, taxonomy and query builder are live — they just have nothing to query."
            file="data/vessels.json"
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={<IconSearch size={22} />}
            title="No vessels match this query"
            body="Loosen a filter or clear the query to see the full database."
          />
        ) : (
          <>
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th />
                    <th>Vessel</th>
                    <th>IMO</th>
                    <th>Type</th>
                    <th>Beneficial owner</th>
                    <th>Registered owner</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((v) => (
                    <tr key={v.id}>
                      <td style={{ width: 44, paddingRight: 0 }}>
                        <VesselThumb src={photos.get(v.id) ?? v.photoUrl} name={v.name} />
                      </td>
                      <td className="td-strong">
                        <Link href={`/app/fleet/${v.id}`} className="link-arrow" style={{ fontSize: 13 }}>
                          {v.name}
                        </Link>
                      </td>
                      <td className="mono">{orDash(v.imo)}</td>
                      <td>{orDash(v.sizeClass ?? v.subType)}</td>
                      <td>
                        {v.beneficialOwnerId ? (
                          <Link href={`/app/companies/${v.beneficialOwnerId}`}>
                            {companyName(v.beneficialOwnerId)}
                          </Link>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>
                        {v.registeredOwnerId ? (
                          <Link href={`/app/companies/${v.registeredOwnerId}`}>
                            {companyName(v.registeredOwnerId)}
                          </Link>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>
                        {v.status ? (
                          <Badge tone={statusTone(v.status)} dot>
                            {v.status}
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
