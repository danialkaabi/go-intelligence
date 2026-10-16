import type { CompanyCharterSummary, Fixture } from './types';
import type { FixtureType } from '@/lib/taxonomy';
import { vesselsForCompany } from './vessels';
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
export const FIXTURES: Fixture[] = imported as Fixture[];

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

/** Fixtures whose vessel could not be matched to the fleet, so they appear
 *  on no vessel profile. Surfaced rather than buried. */
export const UNLINKED_FIXTURES: Fixture[] = FIXTURES.filter((f) => !f.vesselId);

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

/** A charterer the charter data names only as withheld. Grouped with the
 *  rows that name nobody at all: commercially they say the same thing, even
 *  though the record keeps them apart. */
const WITHHELD = /^(undisclosed|not disclosed|unknown|confidential|n\/?a)$/i;

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
