'use client';

import { useCallback, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconSearch } from '@/components/ui/Icons';

/**
 * Directory controls. Filtering runs on the server — seven thousand company
 * records cannot travel to the browser — so this only writes the query string.
 */
export default function CompanyFilters({ countries }: { countries: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [term, setTerm] = useState(params.get('q') ?? '');

  const push = useCallback(
    (next: URLSearchParams) => {
      next.delete('page');
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  };

  const toggle = (key: string) => setParam(key, params.get(key) ? null : '1');

  const dirty =
    Boolean(params.get('q')) ||
    Boolean(params.get('country')) ||
    Boolean(params.get('review')) ||
    Boolean(params.get('profiled'));

  return (
    <div className="query-bar" style={{ marginBottom: 16, gap: 12, alignItems: 'center' }}>
      <form
        className="search"
        style={{ flex: '1 1 260px', minWidth: 200 }}
        onSubmit={(e) => {
          e.preventDefault();
          setParam('q', term.trim() || null);
        }}
      >
        <span className="search-icon">
          <IconSearch size={15} />
        </span>
        <input
          className="input"
          placeholder="Search company name — press Enter"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </form>

      <select
        className="select"
        style={{ width: 'auto', minWidth: 190 }}
        value={params.get('country') ?? ''}
        onChange={(e) => setParam('country', e.target.value || null)}
      >
        <option value="">All countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        className={`btn btn--sm ${params.get('review') ? 'btn--primary' : 'btn--ghost'}`}
        onClick={() => toggle('review')}
      >
        Needs review
      </button>

      <button
        className={`btn btn--sm ${params.get('profiled') ? 'btn--primary' : 'btn--ghost'}`}
        onClick={() => toggle('profiled')}
      >
        Profiled
      </button>

      <button
        className={`btn btn--sm ${params.get('fleet') ? 'btn--primary' : 'btn--ghost'}`}
        onClick={() => toggle('fleet')}
      >
        Has vessels
      </button>

      {dirty && (
        <button
          className="link-arrow"
          style={{ fontSize: 12.5 }}
          onClick={() => router.push(pathname, { scroll: false })}
        >
          Clear
        </button>
      )}
    </div>
  );
}
