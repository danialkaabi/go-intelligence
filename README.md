# GO Intelligence

**Offshore commercial intelligence platform — by Gemini Offshore.**

One connected knowledge graph for offshore commercial decisions: vessels,
companies, contracts, tenders, infrastructure and market data.

This repository is the **complete platform design**. Every screen, every
filter, every layout is built and working. **No records are included** —
the vessel, company, contract, tender and market data is yours to add.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm run start        # serve the production build
```

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
3. Import the repository. Vercel detects Next.js automatically — the
   defaults are correct and no environment variables are required.
4. Deploy.

Every push to the default branch redeploys.

---

## What is here

### Public site

| Route       | Screen                                                        |
| ----------- | ------------------------------------------------------------- |
| `/`         | Landing — vision, problem, solution, ten modules, data pipeline, competitive position |
| `/platform` | Module detail and the offshore charter cycle                   |
| `/pricing`  | The three account types                                        |
| `/company`  | Vision, market opportunity, three-year roadmap, leadership, contact |
| `/login`    | Sign-in (not yet wired to an identity provider)                |

### The platform

| Route                  | Module                                               |
| ---------------------- | ---------------------------------------------------- |
| `/app`                 | Dashboard — fleet, utilisation, rates, portfolio, alerts |
| `/app/fleet`           | GO Fleet — the vessel database and query builder      |
| `/app/fleet/[imo]`     | Vessel profile — particulars, benchmark, charter history |
| `/app/companies`       | GO Companies — owners, operators, counterparties       |
| `/app/companies/[id]`  | Company profile — seven management tiers, fleet, charter history |
| `/app/contracts`       | GO Contracts — the live charter book                   |
| `/app/tenders`        | GO Tenders — field developments and the tender pipeline |
| `/app/maps`            | GO Maps & Layers — spatial intelligence                |
| `/app/market`          | GO Market — day-rate benchmarks and utilisation        |
| `/app/ai`              | GO AI — the commercial agent                          |
| `/app/alerts`          | GO Alerts — the signal feed                           |
| `/app/portfolio`       | My Portfolio — saved vessel watchlists                |
| `/app/data`            | **Data Manager — start here to add records**          |
| `/app/api`             | GO API — endpoints and keys                           |
| `/app/settings`        | Account, workspace defaults, integrations             |

---

## Adding your data

Open **`/app/data`** in the running app. It lists every record type, the
file it lives in, the fields it requires, and what each one feeds.

### What is already loaded

| Records | Count | Source |
| --- | --- | --- |
| Vessels | 13,639 | GO Fleet database, first and second batches |
| Companies | 8,144 | GO Companies workbook, plus owners found on vessel records |
| Fixtures | 9,279 | GO charter data, 2005–2029, 2,593 vessels |
| Vessel photographs | 3 | Astro Offshore spec sheets |
| Profiled companies | 5 | Researched from company websites |

Everything else — tenders, market benchmarks, alerts — is empty.

### How the data is layered

Bulk records live in JSON and are replaced wholesale on re-import. Anything
researched by hand lives in a TypeScript overlay beside it, keyed by id, and
wins over the import:

| Bulk (replaced on import) | Overlay (survives import) |
| --- | --- |
| `data/vessels.json` | `data/vessel-details.ts` |
| `data/companies.json` | `data/company-details.ts` |
| `data/charters.json` | a vessel's `charterHistory`, a company's `charterHistory` |

`data/vessels.ts` and `data/companies.ts` merge the two and export the result.
So re-importing a newer fleet sheet cannot flatten a spec sheet you typed in
by hand, or a company you profiled from its website.

### Filtering

GO Fleet and GO Companies share one query builder (`components/app/FilterRail`)
and both filter on the server — neither database can travel to the browser.
Counts beside each option are computed against the rest of the query, so a
number says what ticking that option would actually return.

The company directory is filtered by **what a company runs**, not only by its
own record: vessel type, sub-type, size class, flag and vessel status are read
off its fleet, so ticking "AHTS (Large)" returns the companies that operate
one. Alongside those: the tier it is named at, fleet-size band, registered
country, company type, the charterers its fleet has worked for, and record
flags (profiled, has charter history, awaiting entity review, and so on).
Options within a group combine as *either*; groups combine as *and*; the
record flags combine as *all*, and the rail says so.

Those cross-fleet facets are precomputed once per process in
`fleetFacetsForCompany` and `charterersForCompany` — eight thousand companies
filtered against eleven facets per request is too much to recompute per row.

### How charter history reaches a page

Nothing on a vessel points at its fixtures, and nothing on a company points
at its charter history. Both joins are made at read time:

- a fixture finds its vessel by **IMO** — exact, and no IMO in the charter
  data hits two vessels — falling back to an exact vessel name where that
  name belongs to one vessel only;
- a company's charter history is every fixture of every vessel that names it
  at any of the six ownership and management tiers.

So adding a vessel, or correcting who owns it, repopulates both pages with
no join to maintain. A fixture whose vessel is not in the fleet is kept and
listed on the Contracts screen rather than dropped, so the gap is visible.

Values the charter data's own sources did not carry — a start date worked
out from the vessel's age, a charterer matched from a fleet status report,
an owner taken from the same vessel's other rows — are marked with a dagger
wherever they appear, and never shown as recorded fact.

All records live in `/data` as typed arrays:

| File                 | Export                            |
| -------------------- | --------------------------------- |
| `data/vessels.ts`    | `VESSELS`                         |
| `data/companies.ts`  | `COMPANIES`                       |
| `data/charters.ts`   | `FIXTURES`                        |
| `data/contracts.ts`  | `CONTRACTS`                       |
| `data/tenders.ts`   | `TENDERS`                        |
| `data/market.ts`     | `RATE_BENCHMARKS`, `UTILISATION`  |
| `data/alerts.ts`     | `ALERTS`                          |
| `data/portfolio.ts`  | `PORTFOLIOS`                      |
| `data/account.ts`    | `ACCOUNT`                         |

Add an object to the array and every count, chart, filter and table across
the platform recalculates from it. Nothing is hard-coded into a page.

The allowed values — vessel categories, sub-types, size classes, regions,
the seven management tiers, tender phases, contract statuses — are in
`lib/taxonomy.ts`. TypeScript rejects anything outside them, so a typo
fails at build time rather than showing up as a wrong row on a screen.

Full field-by-field schemas are in `data/types.ts`.

### Example

```ts
// data/vessels.ts
export const VESSELS: Vessel[] = [
  {
    imo: '9784521',
    name: 'Vessel Name',
    category: 'OSV',
    subType: 'AHTS',
    sizeClass: 'AHTS (Large)',
    status: 'On Hire',
    flag: 'Panama',
    built: 2018,
    region: 'Middle East Gulf',
    registeredOwnerId: 'your-company-id',
  },
];
```


---

## Vessel photographs

Every vessel profile has a drop zone: drag an image onto it, or click to
choose one, and it uploads. JPEG, PNG or WebP, up to 8MB.

Uploads go to **Vercel Blob**, because Vercel runs on a read-only
filesystem and a dropped file cannot be written into `public/` on the
deployed site. Each photo is stored at `vessels/<vessel id>.<ext>` with the
random suffix disabled, so a vessel's photo is always at the same address
and no mapping has to be kept anywhere.

### Connecting the store

1. Vercel dashboard → your project → **Storage** → **Create Database** → **Blob**
2. Connect it to this project. Vercel adds `BLOB_READ_WRITE_TOKEN` itself.
3. Redeploy.

Until that is done the drop zone still renders and says exactly what to set
up; nothing else on the platform is affected.

To check whether the token actually reached a deployment, open
`/api/vessel-photo` in a browser. It answers at request time:

```json
{ "configured": true, "photosStored": 3 }
```

A `configured: false` there means the variable is genuinely missing from
that deployment — not that a page is stale.

### Precedence

A photo committed to the repo in `data/vessel-details.ts` (`photoUrl`)
shows until something is uploaded for that vessel; an upload then takes
precedence, because uploading is the more recent deliberate act. Removing
the upload falls back to the committed file.

### ⚠ The endpoint is unauthenticated

`/api/vessel-photo` has no auth, because the platform has none. Anyone who
can reach the site can upload or delete a vessel photograph. The route
checks that the id names a real vessel, that the file is an image and that
it is under 8MB, which stops arbitrary writes into the store — but it does
not stop a stranger who finds the URL.

Before this is public, turn on **Vercel → Settings → Deployment Protection**,
or put real authentication in front of the app.

---

## Design system

The palette, typography and layout language are taken from the Gemini
Offshore strategy book:

- **Ground** — deep navy `#0a0f1a`, with a panel stack up through `#26375c`
- **Instrumentation** — steel blue `#5fa8e8` for accents, hairlines and active states
- **Gold** — `#d6a44e`, used sparingly for premium tiers, section rules and emphasis
- **Signal** — green `#5fbf7a`, amber `#e0a94e`, red `#e05a5a`
- **Wordmark** — wide-tracked uppercase, the brand's most recognisable signature
- **Numbers** — tabular monospace everywhere figures are compared

Everything lives in `app/globals.css`, organised in numbered sections from
tokens through to the marketing site. There is no CSS framework and no UI
library — the whole system is about 1,500 lines of plain CSS driven by
custom properties.

Empty states are treated as a primary experience rather than an edge case:
the platform ships with no records, so each one explains what the screen is
for, which fields a record carries, and which file to add it to.

---

## The logo

`components/ui/Logo.tsx` is the GO monogram, drawn as inline SVG using
`currentColor`. That is what lets one component serve every surface: it
renders navy on the white marketing nav and white on the dark app sidebar,
with no second asset and no CSS filters.

It is a **reconstruction** of the Gemini Offshore mark, redrawn from the
brand artwork rather than exported from it. To drop in the authentic file:

1. Put your artwork in `public/` (e.g. `public/logo.svg`).
2. Replace the body of `components/ui/Logo.tsx` with an `<img>` or an
   inline copy of your SVG.

If you use a single-colour SVG, keep `fill="currentColor"` on its paths and
the automatic light/dark inversion keeps working. If you use a PNG with a
fixed colour, you will need a second white version for the sidebar.

The lockup that pairs the mark with the text is `components/ui/Wordmark.tsx`.

---

## Structure

```
app/                 Routes (Next.js App Router)
  globals.css        The entire design system
  page.tsx           Landing
  app/               The platform, behind the app shell
components/
  ui/                Panel, StatTile, Badge, EmptyState, Wordmark, Icons
  app/               AppShell, sidebar nav, command palette, PageHead
  marketing/         Site nav, footer, layout
data/                Record modules — your data goes here
  types.ts           Full schemas
lib/
  taxonomy.ts        Controlled vocabularies
  format.ts          Formatting helpers
  plans.ts           The three account types
```

---

## Not yet connected

The platform is intentionally front-end only. These are the seams to wire
up, listed in the app at `/app/settings`:

- **Authentication** — `/login` currently links straight through to `/app`
- **Database** — swap the `/data` exports for queries; no screen changes
- **AIS provider** — live vessel positions
- **Map tiles** — a basemap for GO Maps & Layers
- **Language model** — answers for GO AI
- **Email / CRM** — the contact form and alert delivery

---

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · plain CSS. No runtime
dependencies beyond React and Next.
