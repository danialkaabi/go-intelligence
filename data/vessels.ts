import type { Vessel } from './types';

/**
 * GO FLEET — vessel records.
 *
 * Every field here comes from the owner's own spec sheet unless the record's
 * provenance says otherwise. Where a sheet is silent — hire status, and the
 * build year on Astro Sagitta — the field is left absent rather than guessed,
 * and the profile shows it as "Not recorded".
 *
 * The primary key is `id`, not `imo`: two of the three sheets below carry no
 * IMO number at all, and some craft never receive one.
 *
 * A vessel attaches itself to a company through any of the six ownership and
 * management tier ids. Set registeredOwnerId (or beneficialOwnerId,
 * operatorId, commercialManagerId, technicalManagerId, ismManagerId) to a
 * company id from data/companies.ts and the vessel appears on that company's
 * profile automatically.
 *
 * See data/types.ts for the full schema and lib/taxonomy.ts for the allowed
 * values of category, subType, sizeClass, status and region.
 */
export const VESSELS: Vessel[] = [
  {
    id: 'astro-arcturus',
    name: 'Astro Arcturus',
    category: 'OCV',
    subType: 'Maintenance / Work Vessel',

    imo: '9500871',
    mmsi: '538010205',
    flag: 'Marshall Islands',
    built: 2010,
    classSociety: 'BV',

    registeredOwnerId: 'astro-offshore',
    commercialManagerId: 'astro-offshore',

    loaM: 61.2,
    beamM: 16.0,
    depthM: 6.0,
    grt: 2042,
    dwt: 1623,
    bhp: 4000,
    deckSpaceM2: 345,
    totalPob: 84,
    speedNote: '12.5 kn max / 8 kn eco',
    features: [
      '30T SWL kingpost crane',
      'Four-point mooring',
      'Twin azimuth thrusters',
      '8T bow thruster',
      '84 POB accommodation',
    ],

    photoUrl: '/images/vessels/astro-arcturus.jpg',
    notes:
      'Spec sheet titles the vessel a 61m maintenance / work vessel; AIS registries list her as a utility or supply vessel. IMO and MMSI are not on the spec sheet and were taken from vessel registries that corroborate its build year, flag and 61.20m length.',
    provenance: {
      source: 'Astro Offshore vessel spec sheet (Astro Arcturus)',
      retrievedAt: '2026-09-11',
      confidence: 'high',
    },
  },

  {
    id: 'astro-aurora',
    name: 'Astro Aurora',
    category: 'OCV',
    subType: 'Multipurpose Support (MPSV)',

    imo: '9639842',
    mmsi: '572916220',
    flag: 'Tuvalu',
    built: 2014,
    builder: 'Zhejiang Shipbuilding Co.',
    classSociety: 'BV',

    registeredOwnerId: 'astro-offshore',
    commercialManagerId: 'astro-offshore',

    loaM: 100.0,
    beamM: 21.0,
    depthM: 8.0,
    draftM: 6.0,
    grt: 6000,
    dwt: 4858,
    bollardPullT: 70,
    deckSpaceM2: 1000,
    totalPob: 105,
    dpClass: 'DP3',
    speedNote: '12 kn max / 10 kn service',
    features: [
      'DP3',
      '150T AHC knuckle-boom crane',
      '40T secondary knuckle boom',
      '20m / 11T helideck',
      'FiFi Class 1',
      'Oil recovery',
      'Moonpool provision 8m x 8m',
      '105 POB accommodation',
    ],

    photoUrl: '/images/vessels/astro-aurora.jpg',
    notes:
      'IMO and MMSI are not on the spec sheet and were taken from vessel registries that corroborate its build year, flag, 100m length and 4,858T deadweight.',
    provenance: {
      source: 'Astro Offshore vessel spec sheet (Astro Aurora)',
      retrievedAt: '2026-09-11',
      confidence: 'high',
    },
  },

  {
    id: 'astro-sagitta',
    name: 'Astro Sagitta',
    category: 'OSV',
    subType: 'AHTS',
    sizeClass: 'AHTS (Medium)',

    imo: '1091161',
    mmsi: '636025119',
    callSign: '5LVW9',
    officialNo: '25119',
    flag: 'Liberia',
    classSociety: 'ABS',

    registeredOwnerId: 'astro-offshore',
    commercialManagerId: 'astro-offshore',

    loaM: 64.8,
    beamM: 16.0,
    depthM: 6.8,
    draftM: 5.1,
    dwt: 1528.7,
    bollardPullT: 90,
    deckSpaceM2: 420,
    dpClass: 'DP2',
    features: [
      'Diesel-electric',
      'DP2 — Kongsberg K-POS DP-22',
      'Smart notation technology',
      '200T anchor-handling / towing winch',
      '300T shark jaw',
      '250T SWL stern roller',
      'FiFi Class 1',
      'Oil recovery (OSR-C2)',
    ],

    photoUrl: '/images/vessels/astro-sagitta.jpg',
    notes:
      'Build year is not stated on the spec sheet and has been left blank rather than estimated. Size class derived from 90T bollard pull under the common AHTS banding — correct it if your own bands differ.',
    provenance: {
      source: 'Astro Offshore vessel spec sheet (Astro Sagitta)',
      retrievedAt: '2026-09-11',
      confidence: 'high',
    },
  },
];

export function getVessel(id: string): Vessel | undefined {
  return VESSELS.find((v) => v.id === id);
}

export function getVesselByImo(imo: string): Vessel | undefined {
  return VESSELS.find((v) => v.imo === imo);
}

/** Vessels a company touches at any ownership or management tier. */
export function vesselsForCompany(companyId: string): Vessel[] {
  return VESSELS.filter(
    (v) =>
      v.registeredOwnerId === companyId ||
      v.beneficialOwnerId === companyId ||
      v.operatorId === companyId ||
      v.commercialManagerId === companyId ||
      v.technicalManagerId === companyId ||
      v.ismManagerId === companyId,
  );
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
  const out: Partial<Record<string, number>> = {};
  for (const [tier, field] of tiers) {
    const n = VESSELS.filter((ves) => ves[field] === companyId).length;
    if (n > 0) out[tier] = n;
  }
  return out;
}
