import { UNLINKED_FIXTURES } from '@/data/charters';
import { COMPANIES } from '@/data/companies';
import { VESSELS, vesselsForCompany } from '@/data/vessels';

/**
 * Platform search, over the whole database.
 *
 * SERVER ONLY. This module pulls in the vessel and company datasets, which
 * run to several megabytes — importing it from a client component would ship
 * all of it to the browser. It is imported by the search route handler and
 * nothing else; the palette in the browser calls that route.
 *
 * The lowercase forms every query needs are built once per process rather
 * than per request: twenty-two thousand records is cheap to scan, but not
 * cheap to re-normalise on every keystroke.
 */

export interface VesselHit {
  id: string;
  name: string;
  imo?: string;
  /** Size class or sub-type — enough to tell two vessels of a name apart. */
  kind?: string;
  owner?: string;
}

export interface CompanyHit {
  id: string;
  name: string;
  country?: string;
  vessels: number;
}

/** A vessel that only exists in the charter book — it has fixtures but no
 *  record in the fleet, so it has no profile to open. */
export interface FixtureHit {
  name: string;
  imo?: string;
  kind?: string;
  fixtures: number;
}

export interface SearchResult {
  vessels: VesselHit[];
  companies: CompanyHit[];
  fixtures: FixtureHit[];
  /** Total matches, so the palette can offer the full result set. */
  totals: { vessels: number; companies: number; fixtures: number };
}

/** Separators in these names are not reliable — the fleet import carries
 *  "Skandi.Mercury" and "GO-002907" — so both the index and the query are
 *  reduced to words before anything is compared. */
function norm(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const COMPANY_NAME = new Map(COMPANIES.map((c) => [c.id, c.name]));

const VESSEL_INDEX = VESSELS.map((v) => ({
  v,
  name: norm(v.name),
  goId: norm(v.goId ?? ''),
  call: norm(v.callSign ?? v.callSignNo ?? ''),
}));

const COMPANY_INDEX = COMPANIES.map((c) => ({
  c,
  name: norm(c.name),
  /** Fleet size breaks ties: searching "tidewater" should offer the arm
   *  that runs six hundred vessels before a single-ship subsidiary. */
  fleet: vesselsForCompany(c.id).length,
}));

/** One row per vessel the charter book names but the fleet does not hold,
 *  so an IMO off a fixture still finds something. */
const FIXTURE_INDEX = (() => {
  const m = new Map<string, FixtureHit & { key: string }>();
  for (const f of UNLINKED_FIXTURES) {
    const key = f.imo ?? f.vesselName;
    const row = m.get(key);
    if (row) row.fixtures += 1;
    else {
      m.set(key, {
        key: norm(f.vesselName),
        name: f.vesselName,
        imo: f.imo,
        kind: f.vesselType,
        fixtures: 1,
      });
    }
  }
  return [...m.values()];
})();

/** Lower is better. Identifier hits come first: someone pasting an IMO
 *  number wants that vessel, not every vessel whose name contains it. */
function scoreVessel(
  row: (typeof VESSEL_INDEX)[number],
  needle: string,
  words: string[],
  digits: string,
  numeric: boolean,
): number | undefined {
  if (digits) {
    if (row.v.imo === digits || row.v.mmsi === digits) return 0;
    // Prefix-matching identifiers only where the query is itself a number.
    // "astro 2" is a name with a number in it, and must not return every
    // vessel whose MMSI happens to begin with a 2.
    if (numeric && digits.length >= 3) {
      if (row.v.imo?.startsWith(digits) || row.v.mmsi?.startsWith(digits)) {
        return 4;
      }
    }
  }
  if (row.goId === needle || row.call === needle) return 1;
  if (row.name === needle) return 2;
  if (row.name.startsWith(needle)) return 3;
  if (row.name.includes(needle)) return 5;
  if (row.goId.includes(needle)) return 6;
  // Last resort: every word somewhere in the name, so "aurora astro" still
  // finds Astro Aurora.
  if (words.length > 1 && words.every((w) => row.name.includes(w))) return 7;
  return undefined;
}

function scoreCompany(
  row: (typeof COMPANY_INDEX)[number],
  needle: string,
  words: string[],
): number | undefined {
  if (row.name === needle) return 0;
  if (row.name.startsWith(needle)) return 1;
  if (row.name.includes(needle)) return 2;
  if (words.length > 1 && words.every((w) => row.name.includes(w))) return 3;
  return undefined;
}

export function search(query: string, limit = 7): SearchResult {
  const needle = norm(query.slice(0, 64));
  const digits = query.replace(/\D/g, '');
  // "9639842" and "IMO 9639842" are identifier queries; "Astro 2" is not.
  const numeric = needle.length > 0 && /^(imo|mmsi)?[0-9 ]+$/.test(needle);
  const words = needle.split(' ').filter(Boolean);
  if (needle.length < 2) {
    return {
      vessels: [],
      companies: [],
      fixtures: [],
      totals: { vessels: 0, companies: 0, fixtures: 0 },
    };
  }

  const vesselHits: Array<{ row: (typeof VESSEL_INDEX)[number]; score: number }> = [];
  for (const row of VESSEL_INDEX) {
    const score = scoreVessel(row, needle, words, digits, numeric);
    if (score !== undefined) vesselHits.push({ row, score });
  }

  const companyHits: Array<{ row: (typeof COMPANY_INDEX)[number]; score: number }> = [];
  for (const row of COMPANY_INDEX) {
    const score = scoreCompany(row, needle, words);
    if (score !== undefined) companyHits.push({ row, score });
  }

  // Ties break on name, so the same query always returns the same order.
  vesselHits.sort((a, b) => a.score - b.score || a.row.name.localeCompare(b.row.name));
  companyHits.sort(
    (a, b) =>
      a.score - b.score ||
      b.row.fleet - a.row.fleet ||
      a.row.name.localeCompare(b.row.name),
  );

  // Only vessels the fleet does not hold: anything it does hold is already
  // above, with a profile to open.
  const fixtureHits = FIXTURE_INDEX.filter(
    (r) =>
      (digits.length >= 3 && r.imo === digits) ||
      (!numeric && needle.length >= 3 && r.key.includes(needle)),
  ).sort((a, b) => b.fixtures - a.fixtures || a.name.localeCompare(b.name));

  return {
    vessels: vesselHits.slice(0, limit).map(({ row: { v } }) => ({
      id: v.id,
      name: v.name,
      imo: v.imo,
      kind: v.sizeClass ?? v.subType,
      owner:
        (v.beneficialOwnerId && COMPANY_NAME.get(v.beneficialOwnerId)) ||
        (v.registeredOwnerId && COMPANY_NAME.get(v.registeredOwnerId)) ||
        undefined,
    })),
    companies: companyHits.slice(0, limit).map(({ row: { c, fleet } }) => ({
      id: c.id,
      name: c.name,
      country: c.country,
      vessels: fleet,
    })),
    fixtures: fixtureHits.slice(0, 4).map(({ name, imo, kind, fixtures }) => ({
      name,
      imo,
      kind,
      fixtures,
    })),
    totals: {
      vessels: vesselHits.length,
      companies: companyHits.length,
      fixtures: fixtureHits.length,
    },
  };
}
