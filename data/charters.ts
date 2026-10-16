import type { CompanyCharterSummary, Fixture } from './types';
import type { FixtureType } from '@/lib/taxonomy';
import { OWNERSHIP_TIER_FIELDS, VESSELS, vesselsForCompany } from './vessels';
import { COMPANY_MERGES } from './company-merges';
import imported from './charters.json';

/**
 * GO CHARTER BOOK — ten years of fixtures.
 *
 * One layer, deliberately: this is bulk data out of the charter workbook and
 * is replaced wholesale on re-import, so nothing is hand-edited here. A
 * fixture entered by hand belongs on the vessel, in `charterHistory`, where
 * it survives a re-import — the vessel profile shows both.
 *
 * Fixtures attach themselves to a vessel by IMO, and reach a company through
 * the vessels that company owns or manages, so neither join is maintained by
 * hand. A fixture whose vessel is not in the fleet database keeps its own
 * vessel name and is still counted — losing charter history because a vessel
 * record is missing would be the worse outcome.
 */
export const FIXTURES: Fixture[] = (imported as Fixture[]).map((f) =>
  // The owner on a fixture follows the same grouping as the fleet.
  f.ownerId && COMPANY_MERGES[f.ownerId]
    ? { ...f, ownerId: COMPANY_MERGES[f.ownerId] }
    : f,
);

/** Fixtures per vessel, newest first — the order the JSON already holds. */
const BY_VESSEL = (() => {
  const m = new Map<string, Fixture[]>();
  for (const f of FIXTURES) {
    if (!f.vesselId) continue;
    const list = m.get(f.vesselId);
    if (list) list.push(f);
    else m.set(f.vesselId, [f]);
  }
  return m;
})();

export function fixturesForVessel(vesselId: string): Fixture[] {
  return BY_VESSEL.get(vesselId) ?? [];
}

/** A charterer the charter data names only as withheld. Grouped with the
 *  rows that name nobody at all: commercially they say the same thing, even
 *  though the record keeps them apart. */
const WITHHELD = /^(undisclosed|not disclosed|unknown|confidential|n\/?a)$/i;

/** Fixtures whose vessel could not be matched to the fleet, so they appear
 *  on no vessel profile. Surfaced rather than buried. */
export const UNLINKED_FIXTURES: Fixture[] = FIXTURES.filter((f) => !f.vesselId);

/** Companies with charter history behind them — at least one fixture on at
 *  least one vessel they name. Precomputed: the company directory asks this
 *  of eight thousand records per request. */
export const COMPANIES_WITH_FIXTURES: ReadonlySet<string> = (() => {
  const s = new Set<string>();
  for (const v of VESSELS) {
    if (!BY_VESSEL.has(v.id)) continue;
    for (const t of OWNERSHIP_TIER_FIELDS) {
      const id = v[t];
      if (id) s.add(id);
    }
  }
  return s;
})();

/** Charterers behind each company's fleet, so the directory can answer
 *  "who has worked for Equinor" without walking every fixture per company. */
const CHARTERERS_BY_COMPANY = (() => {
  const m = new Map<string, Set<string>>();
  for (const v of VESSELS) {
    const fixtures = BY_VESSEL.get(v.id);
    if (!fixtures) continue;
    for (const t of OWNERSHIP_TIER_FIELDS) {
      const id = v[t];
      if (!id) continue;
      let set = m.get(id);
      if (!set) m.set(id, (set = new Set()));
      for (const f of fixtures) {
        if (f.charterer && !WITHHELD.test(f.charterer)) set.add(f.charterer);
      }
    }
  }
  return m;
})();

const NO_CHARTERERS: ReadonlySet<string> = new Set();

export function charterersForCompany(companyId: string): ReadonlySet<string> {
  return CHARTERERS_BY_COMPANY.get(companyId) ?? NO_CHARTERERS;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Running today, by the fixture's own start and derived end date. The end
 *  date is startDate + periodDays, so this is indicative, not contractual. */
export function isRunning(f: Fixture, on = today()): boolean {
  return Boolean(f.startDate && f.endDate && f.startDate <= on && on <= f.endDate);
}

export function runningFixtures(fixtures: Fixture[]): Fixture[] {
  const on = today();
  return fixtures.filter((f) => isRunning(f, on));
}

/** Where a fixture stands today. "Period not recorded" is its own answer
 *  rather than a guess: 1,296 rows carry no period and 304 no start date, so
 *  calling those completed would be inventing a fact. */
export const FIXTURE_STATUSES = [
  'Running now',
  'Not yet started',
  'Completed',
  'Period not recorded',
] as const;

export type FixtureStatus = (typeof FIXTURE_STATUSES)[number];

export function fixtureStatus(f: Fixture, on = today()): FixtureStatus {
  if (f.startDate && f.endDate) {
    if (f.startDate > on) return 'Not yet started';
    return f.endDate < on ? 'Completed' : 'Running now';
  }
  if (f.endDate) return f.endDate < on ? 'Completed' : 'Running now';
  if (f.startDate && f.startDate > on) return 'Not yet started';
  return 'Period not recorded';
}

/** Charter length, banded. Shortest first — a length reads as a scale
 *  rather than a popularity list. */
export const PERIOD_BANDS = [
  'Up to 1 week',
  '1–4 weeks',
  '1–3 months',
  '3–12 months',
  '1–3 years',
  'Over 3 years',
] as const;

export function periodBand(f: Fixture): string | undefined {
  const d = f.periodDays;
  if (!d) return undefined;
  if (d <= 7) return 'Up to 1 week';
  if (d <= 31) return '1–4 weeks';
  if (d <= 92) return '1–3 months';
  if (d <= 365) return '3–12 months';
  if (d <= 1095) return '1–3 years';
  return 'Over 3 years';
}

/** Every fixture of every vessel this company owns or manages, newest first.
 *
 *  Keyed off the vessel rather than the owner name on the charter row: the
 *  fleet record is the platform's own statement of who owns what, and a
 *  vessel that changed hands should still show its whole history on the
 *  profile of whoever holds it now. */
export function fixturesForCompanyFleet(companyId: string): Fixture[] {
  const out: Fixture[] = [];
  for (const v of vesselsForCompany(companyId)) {
    out.push(...fixturesForVessel(v.id));
  }
  return out.sort((a, b) =>
    (b.startDate ?? '').localeCompare(a.startDate ?? ''),
  );
}

/** Charterers this company's fleet has worked for, counted from the
 *  fixtures. Mirrors how tierCountsForCompany derives tier counts: no join
 *  to maintain, and it fills in as vessels and fixtures are added.
 *
 *  Fixtures with no charterer are grouped together and sorted last — more
 *  than half the rows in the charter data are spot and short-term work whose
 *  charterer was never published. */
export function charterSummaryForCompany(
  companyId: string,
): CompanyCharterSummary[] {
  const on = today();
  const groups = new Map<string, Fixture[]>();
  for (const f of fixturesForCompanyFleet(companyId)) {
    const key = !f.charterer || WITHHELD.test(f.charterer) ? '' : f.charterer;
    const list = groups.get(key);
    if (list) list.push(f);
    else groups.set(key, [f]);
  }

  const out: CompanyCharterSummary[] = [];
  for (const [charterer, fixtures] of groups) {
    const vessels = new Map<string, { id?: string; name: string }>();
    const types = new Set<FixtureType>();
    let firstStart: string | undefined;
    let lastEnd: string | undefined;
    let running = 0;

    for (const f of fixtures) {
      vessels.set(f.vesselId ?? f.vesselName, {
        id: f.vesselId,
        name: f.vesselName,
      });
      if (f.contractType) types.add(f.contractType);
      if (f.startDate && (!firstStart || f.startDate < firstStart)) {
        firstStart = f.startDate;
      }
      const end = f.endDate ?? f.startDate;
      if (end && (!lastEnd || end > lastEnd)) lastEnd = end;
      if (isRunning(f, on)) running += 1;
    }

    out.push({
      charterer: charterer || undefined,
      fixtures: fixtures.length,
      vessels: [...vessels.values()],
      firstStart,
      lastEnd,
      contractTypes: [...types],
      running,
    });
  }

  // Most-worked charterer first; undisclosed work last whatever its size.
  return out.sort((a, b) => {
    if (!a.charterer !== !b.charterer) return a.charterer ? -1 : 1;
    return b.fixtures - a.fixtures || b.vessels.length - a.vessels.length;
  });
}

/** What the charter book covers, for the pages that say so out loud. */
export const FIXTURE_COVERAGE = {
  fixtures: FIXTURES.length,
  linked: FIXTURES.length - UNLINKED_FIXTURES.length,
  vessels: BY_VESSEL.size,
  unlinked: UNLINKED_FIXTURES.length,
  unlinkedVessels: new Set(
    UNLINKED_FIXTURES.map((f) => f.imo ?? f.vesselName),
  ).size,
  charterers: new Set(
    FIXTURES.map((f) => f.charterer).filter(Boolean) as string[],
  ).size,
  firstStart: FIXTURES.reduce<string | undefined>(
    (min, f) => (f.startDate && (!min || f.startDate < min) ? f.startDate : min),
    undefined,
  ),
  lastStart: FIXTURES.reduce<string | undefined>(
    (max, f) => (f.startDate && (!max || f.startDate > max) ? f.startDate : max),
    undefined,
  ),
} as const;
