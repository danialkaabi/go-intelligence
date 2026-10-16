import type { Company } from './types';
import { COMPANY_DETAILS } from './company-details';
import { COMPANY_MERGES, MERGED_NAMES, canonicalCompanyId } from './company-merges';
import imported from './companies.json';

/**
 * GO COMPANIES — owner, operator and counterparty records.
 *
 * Two layers:
 *
 *   data/companies.json    the bulk import — names, and where the source had
 *                          them, a registration country and the reason entity
 *                          review is outstanding. Replaced on re-import.
 *   data/company-details   hand-researched detail (description, background,
 *                          leadership, website, corrected country), keyed by
 *                          id. Survives a re-import and wins over it.
 *
 * Nothing is recorded that was not in a source: type, headquarters, website,
 * leadership and fleet size stay absent rather than guessed, and each profile
 * shows them as "Not recorded" until filled in.
 *
 * Vessels attach themselves: set a vessel's registeredOwnerId,
 * beneficialOwnerId or any other tier id to a company id and the vessel
 * appears on that company's fleet list automatically.
 */
export const COMPANIES: Company[] = (imported as Company[])
  // A record folded into another is not a company of its own any more.
  .filter((c) => !COMPANY_MERGES[c.id])
  .map((c) => {
    const merged = { ...c, ...(COMPANY_DETAILS[c.id] ?? {}) };
    const also = MERGED_NAMES[c.id];
    return also ? { ...merged, alsoKnownAs: also } : merged;
  });

const BY_ID = new Map(COMPANIES.map((c) => [c.id, c]));

/** Resolves a folded record's id to the one that kept it, so a link made
 *  before the records were grouped still opens the company. */
export function getCompany(id: string): Company | undefined {
  return BY_ID.get(id) ?? BY_ID.get(canonicalCompanyId(id));
}

export { canonicalCompanyId };

/** Resolve a company id to its display name, for table cells. */
export function companyName(id?: string): string | undefined {
  if (!id) return undefined;
  return getCompany(id)?.name;
}

