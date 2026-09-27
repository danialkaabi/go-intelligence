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

  "aesen": {
    country: "Singapore",
    notes: "Country corrected from United Kingdom to Singapore. Singapore-based crewboat and offshore support operator, formerly Miclyn Express Offshore.",
    review: undefined,
    provenance: {
      source: "Country verified against Riviera Maritime / Splash247 / MagicPort",
      retrievedAt: "2026-09-27",
      confidence: "high",
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

  "azerbaijan-caspian-shipping": {
    website: "asco.az",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "bourbon": {
    country: "France",
    notes: "Country corrected from Malaysia to France. Offshore marine services group based in Marseille.",
    review: undefined,
    provenance: {
      source: "Country verified against Wikipedia (Bourbon group)",
      retrievedAt: "2026-09-27",
      confidence: "high",
    },
    website: "bourbonoffshore.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
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

  "china-oilfield-services-limited": {
    website: "cosl.com.cn",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "cnooc-limited": {
    website: "cnoocltd.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "companhia-brasileira-de-offshore": {
    website: "grupocbo.com.br",
    websiteSource: "Website found by web search (medium confidence: named in a search summary, not seen as a result URL).",
  },

  "cosl": {
    website: "cosl.com.cn",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "eastern-navigation": {
    website: "easternnavigation.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "edison-chouest-offshore": {
    website: "chouest.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "equinor": {
    website: "equinor.com",
    websiteSource: "Website found by web search (medium confidence: named in a search summary, not seen as a result URL).",
  },

  "esvagt-a-s": {
    website: "esvagt.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "gac-marine": {
    country: "United Arab Emirates",
    notes: "Country corrected from United Kingdom to United Arab Emirates. GAC Group is headquartered in Dubai; GAC Marine registered at Dubai International Financial Centre.",
    review: undefined,
    provenance: {
      source: "Country verified against gac.com",
      retrievedAt: "2026-09-27",
      confidence: "high",
    },
    website: "gac.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "grupo-cbo": {
    website: "grupocbo.com.br",
    websiteSource: "Website found by web search (medium confidence: named in a search summary, not seen as a result URL).",
  },

  "halul-offshore": {
    country: "Qatar",
    notes: "Country corrected from Nigeria to Qatar. Halul Offshore Services Co W.L.L., Doha — formed in 2000 by Qatar Navigation and Qatar Shipping.",
    review: undefined,
    provenance: {
      source: "Country verified against milahaoffshore.com / Dun & Bradstreet",
      retrievedAt: "2026-09-27",
      confidence: "high",
    },
    website: "milahaoffshore.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "harvey-gulf-marine": {
    website: "harveygulf.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "hornbeck-offshore-services": {
    website: "hornbeckoffshore.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "maridive-and-oil-services-s-a-e": {
    website: "maridive.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "maridive-sae": {
    website: "maridive.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "modec-inc": {
    website: "modec.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "mutawa-marine-works": {
    website: "mutawamarine.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "noble-corporation": {
    website: "noblecorp.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "northern-offshore-services": {
    country: "Sweden",
    notes: "Country corrected from United Kingdom to Sweden. Head office on Donsö, Gothenburg; branch offices in Denmark, the US and the UK.",
    review: undefined,
    provenance: {
      source: "Country verified against n-o-s.eu",
      retrievedAt: "2026-09-27",
      confidence: "high",
    },
    website: "n-o-s.eu",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "oil-and-natural-gas-company": {
    website: "ongcindia.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "penguin-international": {
    country: "Singapore",
    notes: "Country corrected from Indonesia to Singapore. Singapore-listed shipbuilder and operator; SGX-listed, yards in Singapore and Batam.",
    review: undefined,
    provenance: {
      source: "Country verified against penguin.com.sg / SGX",
      retrievedAt: "2026-09-27",
      confidence: "high",
    },
    website: "penguin.com.sg",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "petrobras": {
    country: "Brazil",
    notes: "Country corrected from Norway to Brazil. Brazilian state-controlled oil company, headquartered in Rio de Janeiro.",
    review: undefined,
    provenance: {
      source: "Country verified against petrobras.com.br / Wikipedia",
      retrievedAt: "2026-09-27",
      confidence: "high",
    },
    website: "petrobras.com.br",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "posh-fleet-services-pte": {
    website: "posh.com.sg",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "promar-shipping": {
    country: "Switzerland",
    notes: "Country corrected from Hong Kong to Switzerland. Promar Shipping Services S.A., headquartered in Geneva since 2002.",
    review: undefined,
    provenance: {
      source: "Country verified against UN Global Compact / MagicPort",
      retrievedAt: "2026-09-27",
      confidence: "high",
    },
  },

  "rawabi-vallianz-offshore-services": {
    website: "rawabi.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "saudi-aramco": {
    website: "aramco.com",
    websiteSource: "Website found by web search (medium confidence: named in a search summary, not seen as a result URL).",
  },

  "sbm-offshore": {
    country: "Netherlands",
    notes: "Country corrected from United Kingdom to Netherlands. SBM Offshore N.V., registered in the Netherlands (no. 62829327), head office Amsterdam, Euronext Amsterdam listed.",
    review: undefined,
    provenance: {
      source: "Country verified against sbmoffshore.com",
      retrievedAt: "2026-09-27",
      confidence: "high",
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

  "solstad-maritime": {
    country: "Norway",
    notes: "Country corrected from Indonesia to Norway. Norwegian offshore vessel owner, headquartered in Skudeneshavn.",
    review: undefined,
    provenance: {
      source: "Country verified against Wikipedia (Solstad Offshore) / MarketScreener",
      retrievedAt: "2026-09-27",
      confidence: "high",
    },
    website: "solstad.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "solstad-rederi-as": {
    website: "solstad.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
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

  "transocean-inc": {
    website: "deepwater.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },

  "zakher-marine-international": {
    website: "zakhermarine.com",
    websiteSource: "Website found by web search (high confidence: returned as a search result URL).",
  },
};
