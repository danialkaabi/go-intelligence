import type { Tender } from './types';

/**
 * GO TENDERS — the tender pipeline, field developments and EPC awards.
 *
 * Empty by design. Add tenders here and the phase pipeline, CAPEX
 * totals and vessel-demand forecast populate.
 *
 * Minimum required fields: id, name, operator, region, phase.
 * See data/types.ts for the full schema.
 */
export const TENDERS: Tender[] = [];

export function getTender(id: string): Tender | undefined {
  return TENDERS.find((p) => p.id === id);
}
