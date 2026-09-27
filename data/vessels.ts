import type { Vessel } from './types';
import { VESSEL_DETAILS } from './vessel-details';
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
export const VESSELS: Vessel[] = (imported as Vessel[]).map((v) =>
  VESSEL_DETAILS[v.id] ? { ...v, ...VESSEL_DETAILS[v.id] } : v,
);

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
  const tiers = [
    'beneficialOwnerId',
    'registeredOwnerId',
    'commercialManagerId',
    'operatorId',
    'technicalManagerId',
    'ismManagerId',
  ] as const;
  for (const v of VESSELS) {
    // A vessel naming the same company at several tiers appears once.
    const seen = new Set<string>();
    for (const t of tiers) {
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
  const tiers: Array<[string, keyof Vessel]> = [
    ['Beneficial Owner', 'beneficialOwnerId'],
    ['Registered Owner', 'registeredOwnerId'],
    ['Commercial Manager', 'commercialManagerId'],
    ['Operator', 'operatorId'],
    ['Technical Manager', 'technicalManagerId'],
    ['ISM Manager', 'ismManagerId'],
  ];
  const fleet = vesselsForCompany(companyId);
  const out: Partial<Record<string, number>> = {};
  for (const [tier, field] of tiers) {
    const n = fleet.filter((v) => v[field] === companyId).length;
    if (n > 0) out[tier] = n;
  }
  return out;
}
