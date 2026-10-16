import type { Vessel } from './types';
import { VESSEL_DETAILS } from './vessel-details';
import { COMPANY_MERGES } from './company-merges';
import imported from './vessels.json';

/**
 * GO FLEET — the vessel database.
 *
 * Two layers:
 *
 *   data/vessels.json    the bulk import — one record per vessel from the GO
 *                        Fleet database sheet. Replaced wholesale on re-import.
 *   data/vessel-details  hand-researched detail (spec-sheet particulars,
 *                        photographs, capability, provenance), keyed by id.
 *                        Survives a re-import and wins over it.
 *
 * Fields absent from both stay absent — the import carries names, types,
 * sizes and ownership, and nothing else, so flag, build year and hire status
 * read as "Not recorded" until someone fills them in.
 *
 * A vessel attaches itself to a company through any of its ownership and
 * management tier ids, so adding a vessel populates that company's profile
 * with no join to maintain by hand.
 */
/** The six vessel fields that name a company. "Commercially Controlled" is
 *  the seventh management tier and has no field of its own, so it is absent
 *  here rather than reported as zero. */
export const OWNERSHIP_TIER_FIELDS = [
  'beneficialOwnerId',
  'registeredOwnerId',
  'commercialManagerId',
  'operatorId',
  'technicalManagerId',
  'ismManagerId',
] as const;

export type OwnershipTierField = (typeof OWNERSHIP_TIER_FIELDS)[number];

export const OWNERSHIP_TIER_LABELS: Record<OwnershipTierField, string> = {
  beneficialOwnerId: 'Beneficial Owner',
  registeredOwnerId: 'Registered Owner',
  commercialManagerId: 'Commercial Manager',
  operatorId: 'Operator',
  technicalManagerId: 'Technical Manager',
  ismManagerId: 'ISM Manager',
};

export const VESSELS: Vessel[] = (imported as Vessel[]).map((v) => {
  const merged = VESSEL_DETAILS[v.id] ? { ...v, ...VESSEL_DETAILS[v.id] } : { ...v };
  // Ownership follows the grouping: a vessel filed under a duplicate company
  // record belongs to the record that duplicate was folded into.
  for (const tier of OWNERSHIP_TIER_FIELDS) {
    const id = merged[tier];
    if (id && COMPANY_MERGES[id]) merged[tier] = COMPANY_MERGES[id];
  }
  return merged;
});

/** Indexed lookups — a linear scan over 11k records per call is too slow
 *  when a page resolves many vessels at once. */
const BY_ID = new Map(VESSELS.map((v) => [v.id, v]));
const BY_IMO = new Map(VESSELS.filter((v) => v.imo).map((v) => [v.imo!, v]));

export function getVessel(id: string): Vessel | undefined {
  return BY_ID.get(id);
}

export function getVesselByImo(imo: string): Vessel | undefined {
  return BY_IMO.get(imo);
}

/** Vessels a company touches at any ownership or management tier. */
const BY_COMPANY = (() => {
  const m = new Map<string, Vessel[]>();
  for (const v of VESSELS) {
    // A vessel naming the same company at several tiers appears once.
    const seen = new Set<string>();
    for (const t of OWNERSHIP_TIER_FIELDS) {
      const id = v[t];
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const list = m.get(id);
      if (list) list.push(v);
      else m.set(id, [v]);
    }
  }
  return m;
})();

export function vesselsForCompany(companyId: string): Vessel[] {
  return BY_COMPANY.get(companyId) ?? [];
}

/** Vessel counts per management tier, derived from the vessel records.
 *
 *  "Commercially Controlled" has no corresponding field on a vessel, so it
 *  is left out rather than reported as zero. */
export function tierCountsForCompany(
  companyId: string,
): Partial<Record<string, number>> {
  const fleet = vesselsForCompany(companyId);
  const out: Partial<Record<string, number>> = {};
  for (const field of OWNERSHIP_TIER_FIELDS) {
    const n = fleet.filter((v) => v[field] === companyId).length;
    if (n > 0) out[OWNERSHIP_TIER_LABELS[field]] = n;
  }
  return out;
}

/* ---------- What a company's fleet is made of ---------- */

/** The distinct vessel attributes present across one company's fleet.
 *
 *  Built once, because the company directory filters eight thousand records
 *  against five of these per request and a scan per company per facet would
 *  be far too slow. */
export interface FleetFacets {
  category: Set<string>;
  subType: Set<string>;
  sizeClass: Set<string>;
  flag: Set<string>;
  status: Set<string>;
  /** The tiers this company is named at, e.g. "Technical Manager". */
  tierRole: Set<string>;
  /** A single bucket, so fleet size filters like any other facet. */
  fleetSize: Set<string>;
}

/** Vessel fields read straight off each vessel in the fleet. */
const VESSEL_FACET_FIELDS = [
  'category',
  'subType',
  'sizeClass',
  'flag',
  'status',
] as const;

export const FLEET_FACET_FIELDS = [
  ...VESSEL_FACET_FIELDS,
  'tierRole',
  'fleetSize',
] as const;

export type FleetFacetField = (typeof FLEET_FACET_FIELDS)[number];

/** Fleet-size bands, smallest first — the order the rail shows them in,
 *  since a size band reads as a scale rather than a popularity list. */
export const FLEET_SIZE_BANDS = [
  '1 vessel',
  '2–5',
  '6–20',
  '21–50',
  '51–200',
  'Over 200',
] as const;

function fleetSizeBand(n: number): string {
  if (n <= 1) return '1 vessel';
  if (n <= 5) return '2–5';
  if (n <= 20) return '6–20';
  if (n <= 50) return '21–50';
  if (n <= 200) return '51–200';
  return 'Over 200';
}

const EMPTY_FACETS: FleetFacets = {
  category: new Set(),
  subType: new Set(),
  sizeClass: new Set(),
  flag: new Set(),
  status: new Set(),
  tierRole: new Set(),
  fleetSize: new Set(),
};

const FACETS_BY_COMPANY = (() => {
  const m = new Map<string, FleetFacets>();
  for (const [companyId, fleet] of BY_COMPANY) {
    const f: FleetFacets = {
      category: new Set(),
      subType: new Set(),
      sizeClass: new Set(),
      flag: new Set(),
      status: new Set(),
      tierRole: new Set(),
      fleetSize: new Set([fleetSizeBand(fleet.length)]),
    };
    for (const v of fleet) {
      for (const field of VESSEL_FACET_FIELDS) {
        const val = v[field];
        if (val) f[field].add(String(val));
      }
      for (const t of OWNERSHIP_TIER_FIELDS) {
        if (v[t] === companyId) f.tierRole.add(OWNERSHIP_TIER_LABELS[t]);
      }
    }
    m.set(companyId, f);
  }
  return m;
})();

/** What kinds of vessel this company operates — so the directory can answer
 *  "who runs large AHTS" without a scan per company. */
export function fleetFacetsForCompany(companyId: string): FleetFacets {
  return FACETS_BY_COMPANY.get(companyId) ?? EMPTY_FACETS;
}
