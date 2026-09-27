import type { Vessel } from './types';

/**
 * Hand-authored vessel detail, layered over the bulk import.
 *
 * data/vessels.json is replaced wholesale every time a new fleet sheet
 * arrives, so anything researched by hand — spec-sheet particulars,
 * photographs, capability, provenance — lives here instead and survives
 * that replacement. Keyed by vessel id; these fields win over the import.
 *
 * To enrich a vessel: find its id on its profile page (the last part of the
 * URL) and add an entry below.
 */
export const VESSEL_DETAILS: Record<string, Partial<Vessel>> = {
  'astro-arcturus': {
    flag: 'Marshall Islands',
    built: 2010,
    classSociety: 'BV',
    mmsi: '538010205',
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

  'astro-aurora': {
    flag: 'Tuvalu',
    built: 2014,
    builder: 'Zhejiang Shipbuilding Co.',
    classSociety: 'BV',
    mmsi: '572916220',
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

  'astro-sagitta': {
    flag: 'Liberia',
    classSociety: 'ABS',
    mmsi: '636025119',
    callSign: '5LVW9',
    officialNo: '25119',
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
      'Build year is not stated on the spec sheet and has been left blank rather than estimated. The fleet database independently classes her AHTS (Medium), matching the size derived from her 90T bollard pull.',
    provenance: {
      source: 'Astro Offshore vessel spec sheet (Astro Sagitta)',
      retrievedAt: '2026-09-11',
      confidence: 'high',
    },
  },
};
