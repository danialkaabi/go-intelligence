import type { Company } from './types';

/**
 * Hand-researched company detail, layered over the bulk import.
 *
 * data/companies.json is replaced wholesale whenever a new company list is
 * imported, so anything researched by hand — description, background,
 * leadership, website, corrected country, provenance — lives here instead
 * and survives that replacement. Keyed by company id; these fields win.
 *
 * To profile a company: find its id on its profile page (the last part of
 * the URL) and add an entry below.
 */
export const COMPANY_DETAILS: Record<string, Partial<Company>> = {
  "adnoc-logistics-and-service": {
    duplicateOfId: "adnoc-logistics-and-services",
    notes: "Almost certainly the same company as ADNOC Logistics and Services, imported twice with a singular/plural spelling difference. Kept rather than merged — deciding which record survives is yours.",
  },

  "adnoc-logistics-and-services": {
    type: "Marine Logistics Provider",
    country: "United Arab Emirates",
    headquarters: "Abu Dhabi, UAE",
    website: "adnocls.ae",
    fleetSize: 340,
    employees: 11500,
    description: "Abu Dhabi-based global energy maritime logistics company, covering onshore and offshore energy logistics and international energy transportation.",
    background: "ADNOC Logistics & Services plc is the maritime logistics arm of ADNOC, headquartered in Abu Dhabi. It reports a fleet of more than 340 owned vessels plus over 600 chartered each year, and serves more than 100 customers across over 50 countries from offices in 19 cities, with a workforce of more than 11,500. Recent fleet growth includes very large crude carriers and very large ethane carriers alongside its offshore support tonnage.",
    leadership: [
      {
        name: "Captain Abdulkareem Al Masabi",
        role: "Chief Executive Officer",
      },
    ],
    notes: "fleetSize records owned vessels only; the company also charters 600+ vessels a year and quotes 900+ owned, chartered and operated in total.",
    provenance: {
      source: "adnocls.ae (company website)",
      retrievedAt: "2026-09-11",
      confidence: "high",
      url: "https://adnocls.ae",
    },
  },

  "astro-offshore": {
    type: "OSV Owner / Operator",
    country: "United Arab Emirates",
    headquarters: "Dubai, UAE",
    founded: 2009,
    website: "astro-offshore.com",
    fleetSize: 50,
    description: "Dubai-based offshore vessel owner and operator providing offshore support, vessel chartering, project management and consultancy. Part of the Adani Group.",
    background: "Founded in 2009, Astro Offshore has grown into one of Dubai's leading offshore vessel operators, passing 50 vessels with the delivery of Astro Achernar. The fleet spans AHTs, AHTS vessels, shoalbusters, DP2-class assets and barges, with newer units carrying smart notation and diesel-electric propulsion. Dubai and Singapore act as its two hubs, serving the Middle East, the Indian subcontinent, Far East Asia and Africa. The company is part of the Adani Group.",
    leadership: [
      {
        name: "Mark Humphreys",
        role: "Chief Executive Officer",
      },
      {
        name: "Markus De Jonge",
        role: "Chief Operating Officer",
      },
    ],
    provenance: {
      source: "astro-offshore.com (company website)",
      retrievedAt: "2026-09-11",
      confidence: "high",
      url: "https://astro-offshore.com",
    },
  },

  "britoil-offshore": {
    type: "OSV Owner / Operator",
    country: "Singapore",
    headquarters: "Singapore",
    founded: 1988,
    website: "britoil.com.sg",
    fleetSize: 60,
    description: "Singapore-based owner and operator of offshore support vessels, specialising in anchor-handling, towing and sea transportation.",
    background: "Britoil Offshore Services was founded in Singapore in 1988 by David John Hill. Its acquisition of Vroon Offshore Services in 2023 took the fleet past 60 offshore support vessels operating worldwide, spanning anchor handling tugs (AHT), anchor handling tug supply vessels (AHTS), platform supply vessels (PSV) and multi-purpose support vessels (MPSV).",
    leadership: [
      {
        name: "Florent Kirchhoff",
        role: "Chief Executive Officer",
      },
    ],
    notes: "Country corrected from Indonesia to Singapore: Britoil Offshore Services Pte Ltd is Singapore-registered and Singapore-headquartered.",
    provenance: {
      source: "britoil.com.sg (company website)",
      retrievedAt: "2026-09-11",
      confidence: "high",
      url: "https://www.britoil.com.sg",
    },
  },

  "seacor-marine-holdings": {
    type: "OSV Owner / Operator",
    country: "United States",
    headquarters: "Houston, Texas, USA",
    founded: 1989,
    website: "seacormarine.com",
    description: "Owner and operator of offshore marine support vessels, serving offshore oil and gas exploration and production and the offshore wind sector worldwide.",
    background: "SEACOR Marine's offshore marine services business was founded in 1989 and was spun off from SEACOR Holdings as an independent, separately listed company in 2017. Its fleet delivers cargo and personnel to offshore installations including wind farms, supports production and storage facilities, and provides construction, well work-over, wind farm installation and decommissioning support. Its principal executive office is at 12121 Wickchester Lane, Houston, Texas.",
    leadership: [
      {
        name: "John Gellert",
        role: "President & Chief Executive Officer",
      },
    ],
    notes: "Distinct from the separate SEACOR Holdings record, which was the former parent until the 2017 spin-off.",
    provenance: {
      source: "seacormarine.com (company website)",
      retrievedAt: "2026-09-11",
      confidence: "high",
      url: "https://seacormarine.com",
    },
  },

  "tidewater-marine": {
    type: "OSV Owner / Operator",
    country: "United States",
    headquarters: "Houston, Texas, USA",
    founded: 1956,
    website: "tdw.com",
    description: "The offshore support vessel business of the Tidewater group, operating the industry's largest OSV fleet across more than 60 countries.",
    background: "Tidewater created the workboat industry in 1956 with the launch of the Ebb Tide, the first offshore vessel purpose-built to support offshore oil and gas. It remains the largest OSV owner and operator in the industry, with over 90% of the fleet working internationally across more than 60 countries. The group is headquartered in Houston, Texas, with US marine operations based in Amelia, Louisiana and Houston, and international operations run through offices in over 30 countries.",
    leadership: [
      {
        name: "Quintin Kneen",
        role: "President & Chief Executive Officer",
      },
    ],
    notes: "tdw.com is the site of the listed parent, Tidewater Inc; this record is named for Tidewater Marine, its operating arm. The details above are group-level and the record may want splitting into parent and subsidiary. Tidewater Angola Marine, Tidewater Middle East and Tidewater Offshore Operations are separate records for the same group.",
    review: {
      confidence: "medium",
      flags: ["ambiguous-name"],
    },
    provenance: {
      source: "tdw.com (company website)",
      retrievedAt: "2026-09-11",
      confidence: "medium",
      url: "https://www.tdw.com",
    },
  },
};
