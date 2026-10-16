/**
 * GO INTELLIGENCE — record schemas
 *
 * These are the shapes every record in the platform takes. The arrays that
 * use them (data/vessels.ts, data/companies.ts, …) ship empty on purpose —
 * fill them in with your own records and every screen populates itself.
 *
 * Optional fields are genuinely optional: a record with only the required
 * fields renders correctly, with the gaps shown as "Not recorded" rather
 * than as broken UI.
 */

import type {
  AlertSeverity,
  AlertType,
  CharterType,
  CompanyType,
  ConfidenceLevel,
  ContractStatus,
  FixtureType,
  ManagementTier,
  RateUnit,
  TenderPhase,
  Region,
  VesselCategory,
  VesselStatus,
} from '@/lib/taxonomy';

/** Provenance carried by any field that came from outside the platform. */
export interface Provenance {
  source: string;
  retrievedAt?: string;
  confidence?: ConfidenceLevel;
  url?: string;
}

/* ---------- Vessel ---------- */

export interface AISPosition {
  lat: number;
  lon: number;
  /** ISO 8601 timestamp of the fix. */
  timestamp: string;
  speedKn?: number;
  headingDeg?: number;
  navStatus?: string;
  destination?: string;
  /** Field, block or custom zone the vessel is currently inside. */
  inZone?: string;
  daysInZone?: number;
}

export interface CharterRecord {
  /** Month and year the fixture began, e.g. "Jan 2025". */
  date: string;
  charterType: CharterType;
  /** USD per day. Leave undefined where the rate is not disclosed. */
  ratePerDay?: number;
  charterer: string;
  fieldContractedTo?: string;
  durationMonths?: number;
  region?: Region;
  notes?: string;
  provenance?: Provenance;
}

export interface Vessel {
  /** URL-safe unique id, e.g. "astro-arcturus" — the primary key.
   *
   *  Not the IMO: plenty of real spec sheets carry no IMO number, and some
   *  craft never receive one, so the key cannot depend on it. */
  id: string;
  name: string;
  /** The owner's own identifier for the vessel, e.g. "GO-002907". */
  goId?: string;
  /** Optional: 61 imported rows carry no readable type at all. */
  category?: VesselCategory;
  /** e.g. "AHTS", "PSV". Must be a sub-type of `category`. */
  subType?: string;
  /** e.g. "AHTS (Large)". */
  sizeClass?: string;
  /** Optional: a builder's spec sheet says nothing about commercial status,
   *  so a vessel can be recorded long before its status is known. */
  status?: VesselStatus;

  /** IMO number where the vessel has one. */
  imo?: string;
  mmsi?: string;
  flag?: string;
  callSignNo?: string;
  officialNo?: string;
  callSign?: string;
  built?: number;
  builder?: string;
  classSociety?: string;

  /** Company ids, resolved against data/companies.ts. */
  beneficialOwnerId?: string;
  registeredOwnerId?: string;
  commercialManagerId?: string;
  operatorId?: string;
  technicalManagerId?: string;
  ismManagerId?: string;

  region?: Region;
  operatingIn?: string;
  fieldOperator?: string;

  /** Principal particulars. */
  loaM?: number;
  beamM?: number;
  /** Moulded depth. */
  depthM?: number;
  draftM?: number;
  dwt?: number;
  grt?: number;
  bollardPullT?: number;
  deckAreaM2?: number;
  accommodation?: number;
  dpClass?: string;
  /** Total persons on board the vessel can accommodate. */
  totalPob?: number;
  /** Installed power in brake horsepower, where quoted that way. */
  bhp?: number;
  /** Usable clear deck area. */
  deckSpaceM2?: number;
  /** Free-text speed note, e.g. "12.5 kn max / 8 kn eco". */
  speedNote?: string;
  /** The size figure as the source stated it, e.g. "5,150 BHP", "300 FT".
   *  Kept verbatim because the unit varies by vessel class and some of it
   *  (feet) is water depth rather than length. */
  sizeNote?: string;
  /** Free-form capability tags: "FiFi 1", "Oil Rec", "ROV ready", … */
  features?: string[];

  eediScore?: number;
  ciiRating?: 'A' | 'B' | 'C' | 'D' | 'E';

  position?: AISPosition;
  charterHistory?: CharterRecord[];

  photoUrl?: string;
  notes?: string;
  provenance?: Provenance;
}

/* ---------- Company ---------- */

/** Count of vessels a company touches at each of the seven tiers. */
export type TierCounts = Partial<Record<ManagementTier, number>>;

export interface CompanyCharterRecord {
  charterer: string;
  /** e.g. "6 PSVs". */
  vessels: string;
  /** e.g. "2023 – Present". */
  period: string;
  natureOfAgreement: string;
  provenance?: Provenance;
}

export interface RegionalPresence {
  region: Region;
  vesselCount: number;
  /** 0–100. */
  utilisationPct?: number;
}

/** Why a company still needs exact-entity review, carried over from the
 *  source list so the uncertainty travels with the record. */
export type ReviewFlag =
  /** Generic or abbreviated name may match multiple legal entities. */
  | 'ambiguous-name'
  /** No readable flag; exact legal entity not uniquely confirmed. */
  | 'no-flag'
  /** OCR spelling was normalised and should be checked against an
   *  official name. */
  | 'ocr-normalised';

export interface EntityReview {
  confidence: 'low' | 'medium';
  flags: ReviewFlag[];
}

export interface Leader {
  name: string;
  /** e.g. "Chief Executive Officer", "Managing Director". */
  role: string;
}

export interface Company {
  /** URL-safe unique id, e.g. "falcon-marine". */
  id: string;
  name: string;
  /** Optional: the imported list carries names and countries only, so most
   *  records have no type until one is recorded. */
  type?: CompanyType;

  country?: string;
  headquarters?: string;
  founded?: number;
  website?: string;
  fleetSize?: number;
  employees?: number;
  parentCompanyId?: string;

  /** How the website was established, since it was found by search rather
   *  than supplied. Per-field provenance, because `provenance` describes
   *  the record as a whole. */
  websiteSource?: string;

  /** One or two sentences — what the company is and does. */
  description?: string;
  /** The longer narrative: history, ownership, market position. */
  background?: string;
  /** CEO, Managing Director, Chairman and so on. */
  leadership?: Leader[];

  operatingRegions?: Region[];
  tierCounts?: TierCounts;
  regionalPresence?: RegionalPresence[];
  charterHistory?: CompanyCharterRecord[];

  /** Counterparty notes — adverse flags, sanctions screening outcome, etc. */
  riskNotes?: string;
  logoUrl?: string;
  notes?: string;
  provenance?: Provenance;

  /** Present while the legal entity behind this name is still unconfirmed. */
  review?: EntityReview;

  /** Set when this record looks like a second entry for another company.
   *  Both records are kept — merging is a decision for whoever owns the
   *  data, not something an import should do silently. */
  duplicateOfId?: string;

  /** Names of duplicate records folded into this one, from
   *  data/company-merges.ts. The old names are kept and shown rather than
   *  thrown away: someone searching for one should still find the company. */
  alsoKnownAs?: string[];
}

/* ---------- Contract ---------- */

export interface Contract {
  id: string;
  /** Vessel id, resolved against data/vessels.ts. */
  vesselId: string;
  vesselName: string;
  vesselType: string;
  charterer: string;
  /** Company id of the owner on the other side of the fixture. */
  ownerId?: string;

  charterType: CharterType;
  ratePerDay?: number;
  /** Signed percentage against the regional benchmark, e.g. -8 or +5. */
  vsBenchmarkPct?: number;

  /** ISO dates. */
  startDate?: string;
  expiryDate?: string;

  status: ContractStatus;
  region?: Region;
  fieldOrTender?: string;
  /** Annualised contract value in USD. */
  annualisedValue?: number;
  optionPeriods?: string;
  notes?: string;
  provenance?: Provenance;
}

/* ---------- Fixture ---------- */

/** A field the charter data carries that its own sources did not: the data
 *  preparer worked it out and marked it. Carried through so the platform can
 *  show a derived value as derived rather than as fact. */
export type FixtureDerivedField = 'startDate' | 'charterer' | 'owner';

/**
 * One row of the charter book — a single fixture, as recorded.
 *
 * Separate from CharterRecord, which is the shape for entering a fixture by
 * hand. A fixture out of the charter data carries its own currency and rate
 * basis (most of these rates are not in dollars, and relabelling them as
 * though they were would be a lie), the period exactly as it was written,
 * and the preparer's marks on anything derived or doubtful.
 */
export interface Fixture {
  id: string;

  /** Vessel id, where the fixture resolved to a vessel in the fleet. Absent
   *  where the vessel is not in the fleet database — the fixture is still
   *  recorded, because dropping it would lose charter history. */
  vesselId?: string;
  /** The vessel as the charter data names it. All there is to show when the
   *  vessel is not in the fleet. */
  vesselName: string;
  imo?: string;
  /** Type and size as the charter data holds them, which can read
   *  differently from the fleet record for the same vessel. */
  vesselType?: string;
  size?: string;

  /** ISO date the fixture began. */
  startDate?: string;
  /** As written: "14 days", "1 yr 6 mths". */
  period?: string;
  periodDays?: number;
  /** startDate plus periodDays — approximate by construction, and never a
   *  substitute for the contract. */
  endDate?: string;

  contractType?: FixtureType;
  rate?: number;
  /** ISO 4217, e.g. "USD", "NOK", "GBP". */
  currency?: string;
  rateUnit?: RateUnit;

  charterer?: string;
  /** Beneficial owner at the time of the fixture, as the charter data holds
   *  it. Vessels change hands, so this is not always today's owner. */
  ownerName?: string;
  ownerId?: string;

  /** The preparer's note where the row wants an eye on it. */
  reviewNote?: string;
  derived?: FixtureDerivedField[];
}

/** One charterer's dealings with a company's fleet, counted from the
 *  fixtures rather than maintained by hand. */
export interface CompanyCharterSummary {
  charterer?: string;
  fixtures: number;
  /** Distinct vessels, so the summary can link straight to them. */
  vessels: Array<{ id?: string; name: string }>;
  /** ISO dates: earliest start and latest end seen. */
  firstStart?: string;
  lastEnd?: string;
  contractTypes: FixtureType[];
  /** Fixtures running today. */
  running: number;
}

/* ---------- Tender ---------- */

export interface Tender {
  id: string;
  name: string;
  operator: string;
  operatorId?: string;
  region: Region;
  phase: TenderPhase;

  /** CAPEX in USD. */
  capex?: number;
  /** Forecast vessel demand, e.g. 12. */
  vesselsNeeded?: number;
  vesselTypesNeeded?: string[];

  field?: string;
  epcContractor?: string;
  tenderCloseDate?: string;
  awardDate?: string;
  firstOilDate?: string;
  waterDepthM?: number;
  notes?: string;
  provenance?: Provenance;
}

/* ---------- Market ---------- */

export interface RateBenchmark {
  region: Region;
  /** e.g. "AHTS (Large)". */
  sizeClass: string;
  lowUsdPerDay: number;
  highUsdPerDay: number;
  /** Mid-point used for the headline figure; derived if omitted. */
  midUsdPerDay?: number;
  /** Signed percentage change over the comparison window. */
  changePct?: number;
  asOf?: string;
  provenance?: Provenance;
}

export interface UtilisationPoint {
  region: Region;
  /** 0–100. */
  utilisationPct: number;
  vesselCount?: number;
  asOf?: string;
  /** Same measure twelve months earlier, for the trend arrow. */
  priorYearPct?: number;
}

/* ---------- Alerts ---------- */

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  body?: string;
  /** ISO timestamp. */
  createdAt: string;
  read?: boolean;

  /** Whatever the alert points at. */
  vesselId?: string;
  companyId?: string;
  contractId?: string;
  tenderId?: string;
  zone?: string;
}

/* ---------- Portfolio ---------- */

export interface PortfolioEntry {
  vesselId: string;
  addedAt?: string;
  note?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  entries: PortfolioEntry[];
  /** Saved GO Fleet query that produced this portfolio, if any. */
  savedQuery?: string;
}

/* ---------- Account ---------- */

export type AccountTier = 'shipowner' | 'financier' | 'noc-epc';

export interface Account {
  organisation: string;
  tier: AccountTier;
  /** Display name of the signed-in user. */
  userName: string;
  userRole?: string;
  seatsUsed?: number;
}
