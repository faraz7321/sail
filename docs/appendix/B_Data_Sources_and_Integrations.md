# Appendix B — Data Sources & Integrations

**Project:** SAIL · **Appendix:** B · **Date:** 2026-07-18 · **Status:** Draft v1.0

> **Purpose:** This is the catalog of every data source and integration SAIL consumes — the internal transaction systems that describe what the business did, and the external signal APIs that explain why. For each source it records the type, the data it provides, how we connect, the authentication model, the cost basis, and the delivery phase. Pricing and volume assumptions are the responsibility of [Appendix C](C_Assumptions_and_Constants.md) and are not restated here; ingestion and modelling mechanics live in [Data Strategy & ETL](../06_Data_Strategy_and_ETL.md).

---

## How to read this catalog

- **Type** — the category of system (POS, e-commerce, accounting, aggregator, external signal API).
- **Integration method** — how SAIL pulls the data: native API, OAuth-authorized API, aggregator/unified API, webhook, or file upload.
- **Auth** — the authentication model the tenant (or we, on their behalf) use to authorize access.
- **Cost basis** — how the source is priced *to us* (free tier, per-call, per-connection, revenue-share, or free-with-attribution). Actual dollar figures live in [Appendix C](C_Assumptions_and_Constants.md).
- **Priority / Phase** — the roadmap phase in which the source is targeted (Phase 1 = MVP, Phase 2 = expansion, Phase 3 = differentiation/scale). Consolidated in Section 6.

---

## 1. POS systems (internal)

The primary source of truth for most tenants: sales, items, dayparts, discounts, and (sometimes) labor and inventory. Square is the launch priority because it dominates the SMB café/coffee/QSR segment and has a clean OAuth API.

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **Square** | POS | Orders, line items, payments, discounts, refunds, catalog, some labor/inventory | Native REST API + webhooks | OAuth 2.0 (tenant-authorized) | Free API (Square monetizes payments) | **Phase 1** | Launch anchor; best coverage of target SMB segment. Webhooks give near-real-time order events. |
| **Toast** | POS | Restaurant orders, menu/modifiers, checks, labor, voids/comps | Native REST API | OAuth 2.0 / partner credentials | Free API; partner onboarding required | Phase 2 | Strong in full-service restaurants; richer F&B fields (comps, voids, menu mix). |
| **Clover** | POS | Orders, items, payments, inventory, employees | Native REST API + webhooks | OAuth 2.0 | Free API | Phase 2 | Common in SMB retail and quick-service; per-merchant app authorization. |
| **Lightspeed** | POS | Sales, items, inventory, customers (Retail & Restaurant editions) | Native REST API | OAuth 2.0 | Free API | Phase 2 | Two product lines (Retail/K-Series); mapping differs by edition. |
| **Shopify POS** | POS | In-store orders unified with online store; products, inventory | Shopify Admin API (shared with e-commerce) | OAuth 2.0 | Free API within Shopify plan | Phase 2 | Shares the Shopify connector; in-store + online in one data model. |

---

## 2. E-commerce (internal)

Online sales channel data for tenants who sell beyond the counter. Complements POS to give a full channel-mix picture (see **Sales by channel** in [Appendix A](A_KPI_and_Metrics_Catalog.md)).

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **Shopify** | E-commerce | Online orders, products, inventory, customers, fulfilment | Shopify Admin API + webhooks | OAuth 2.0 | Free API within Shopify plan | Phase 2 | Same connector serves Shopify POS; single OAuth grant covers both. |
| **WooCommerce** | E-commerce | Orders, products, inventory, customers (WordPress) | REST API | API key pair (consumer key/secret) over HTTPS | Free (self-hosted) | Phase 3 | Self-hosted variability; auth is key-based, not OAuth. Lower priority. |

---

## 3. Accounting (internal)

Provides cost, margin, and P&L context that POS alone cannot — enabling gross margin, COGS, and labor cost % (see [Appendix A](A_KPI_and_Metrics_Catalog.md)). Often authorized by the tenant's bookkeeper rather than the owner.

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **QuickBooks Online** | Accounting | COGS, expenses, P&L accounts, invoices, payroll summaries | Native REST API | OAuth 2.0 | Free API (developer account) | Phase 2 | Dominant SMB accounting platform in the US; key for margin KPIs. |
| **Xero** | Accounting | COGS, expenses, P&L, invoices | Native REST API | OAuth 2.0 | Free API | Phase 3 | Secondary to QuickBooks in the US SMB market. |

---

## 4. Integration aggregators (build-vs-buy)

Unified APIs that normalize many POS/accounting/e-commerce providers behind a single integration. They trade a per-connection or subscription fee for dramatically reduced engineering and maintenance surface.

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **Merge.dev** | Aggregator (unified API) | Normalized accounting, HRIS, and (via categories) commerce data across many providers | Single unified REST API + webhooks | OAuth per linked account, managed by Merge | Per-connection / subscription | Phase 2–3 | Strong for accounting/HRIS breadth; one integration → many back-ends. |
| **Rutter** | Aggregator (unified API) | Normalized commerce, POS, and accounting data across providers | Single unified REST API + webhooks | OAuth per linked account, managed by Rutter | Per-connection / usage | Phase 2–3 | Commerce/POS-oriented; useful to cover long-tail POS without per-vendor builds. |

### Build-vs-buy trade-off (brief)

- **Build direct (Phase 1 posture).** For the launch anchor (Square) and the highest-value platforms (QuickBooks), building direct connectors is worthwhile: full field fidelity, no per-connection fee, no third-party dependency, and the depth needed for F&B-specific fields (comps, voids, modifiers) that aggregators sometimes flatten.
- **Buy an aggregator (Phase 2–3 posture).** For the long tail of POS/accounting systems, a unified API (Merge.dev or Rutter) removes the cost of building and maintaining dozens of connectors and their OAuth/webhook plumbing. The cost is a per-connection or subscription fee and some loss of field granularity.
- **Recommended path.** Build Square (and later QuickBooks) direct; adopt an aggregator once demand for long-tail platforms outstrips the value of hand-building each one. This keeps Phase 1 cheap and high-fidelity while preserving a low-effort path to breadth later. See [Data Strategy & ETL](../06_Data_Strategy_and_ETL.md) and cost implications in [Hosting & Infrastructure Costs](../10_Hosting_and_Infrastructure_Costs.md).

---

## 5. External signal APIs

These are SAIL's differentiator: they explain and predict demand rather than merely report it. Grouped by signal type. Weather and holidays are Phase 1 because they are high-impact, low-cost, and drive the first forecasts.

### 5a. Weather

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **Visual Crossing** | External — weather | Historical + forecast weather (temp, precip, conditions) by location | REST API | API key | Free tier + per-call above | **Phase 1** | Strong historical depth for backtesting demand models; primary weather source. |
| **OpenWeather** | External — weather | Current + forecast weather | REST API | API key | Free tier + per-call | Phase 1 | Fallback / secondary; wide coverage. |
| **Tomorrow.io** | External — weather | Hyper-local forecast + weather intelligence | REST API | API key | Free tier + subscription | Phase 3 | Higher-precision option if weather sensitivity proves material. |

### 5b. Holidays

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **Nager.Date** | External — holidays | Public holidays by country/year (free, open) | REST API | None (public) | Free | **Phase 1** | Zero-cost baseline for US public holidays; ideal MVP source. |
| **Calendarific** | External — holidays | Global holidays incl. regional/observances | REST API | API key | Free tier + subscription | Phase 2 | Adds regional/state and observance granularity beyond Nager.Date. |

### 5c. Events

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **PredictHQ** | External — events | Ranked, demand-impact-scored events (aggregated, deduped) | REST API | API key | Subscription | Phase 3 | Purpose-built for demand forecasting; highest signal quality, highest cost. |
| **Ticketmaster Discovery** | External — events | Concerts, sports, and ticketed events by location/date | REST API | API key | Free tier + rate limits | Phase 2 | Good coverage of large ticketed events near the tenant. |
| **SeatGeek** | External — events | Ticketed events, venues, performers | REST API | API key (client ID) | Free tier | Phase 3 | Secondary event source; overlaps Ticketmaster. |
| **Eventbrite** | External — events | Local/community/organizer-listed events | REST API | OAuth / API token | Free tier | Phase 3 | Captures smaller local events the ticketing giants miss. |

### 5d. Places / foot-traffic

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **Google Places** | External — places | Place details, popular-times, nearby POIs | REST API | API key | Free credit + per-call | Phase 2 | Popular-times as a proxy for footfall; ubiquitous coverage. |
| **Foursquare** | External — places | Venue/POI data, categories, nearby context | REST API | API key | Free tier + per-call | Phase 3 | Supplementary POI/context signal. |
| **Placer.ai / SafeGraph** | External — foot-traffic | Measured/estimated foot-traffic and visit patterns | REST API / data feed | API key / contract | Enterprise subscription | Phase 3 | Highest-fidelity footfall; enterprise pricing — reserve for Scale tenants/use cases. |

### 5e. Reviews

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **Google Business Profile** | External — reviews | Ratings, reviews, profile metrics for the tenant's own listing | REST API | OAuth 2.0 (tenant-owned listing) | Free API | Phase 3 | Ties reputation to sales; tenant authorizes their own profile. |
| **Yelp** | External — reviews | Business ratings, review counts, categories | Fusion REST API | API key | Free tier + rate limits | Phase 3 | Broad SMB coverage; review-volume trend as a demand/reputation signal. |

### 5f. Search trends

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **Google Trends** | External — search trends | Relative search interest for terms/categories by region | Unofficial API / scheduled pull | None (public, unofficial) | Free (no official SLA) | Phase 3 | Leading-indicator demand signal; no official API, so treat as best-effort. |

---

## 6. Manual / file inputs (always available)

The universal fallback so any tenant can onboard even without a supported system. These are Phase 1 because they de-risk onboarding and guarantee a path to first value.

| Source | Type | Data provided | Integration method | Auth | Cost basis | Priority / Phase | Notes |
|--------|------|---------------|--------------------|------|------------|------------------|-------|
| **CSV / Excel upload** | Internal — file | Sales/transactions, inventory, or historical data via mapped columns | In-app file upload + column mapper | App login | Free | **Phase 1** | Guarantees onboarding for any tenant; also the migration/backfill path. |
| **Manual entry** | Internal — form | Owner-keyed daily sales/covers/room-nights | In-app forms | App login | Free | **Phase 1** | Smallest operators with no POS; keeps the funnel open to everyone. |

---

## 7. Integration roadmap (phased)

Recommended sequencing. **Phase 1 delivers the smallest set that produces a real forecast**: one dominant POS (Square) + a universal fallback (CSV/manual) + the two highest-impact, lowest-cost external signals (weather + holidays). Phases 2 and 3 add breadth and differentiation. Cost impact of each phase is developed in [Hosting & Infrastructure Costs](../10_Hosting_and_Infrastructure_Costs.md).

| Source | Category | Phase 1 (MVP) | Phase 2 (Expansion) | Phase 3 (Differentiation / Scale) |
|--------|----------|:-------------:|:-------------------:|:---------------------------------:|
| **Square** | POS | ● | | |
| CSV / Excel upload | File | ● | | |
| Manual entry | Form | ● | | |
| Visual Crossing (weather) | External | ● | | |
| OpenWeather (weather) | External | ● | | |
| Nager.Date (holidays) | External | ● | | |
| Toast | POS | | ● | |
| Clover | POS | | ● | |
| Lightspeed | POS | | ● | |
| Shopify / Shopify POS | E-comm / POS | | ● | |
| QuickBooks Online | Accounting | | ● | |
| Calendarific (holidays) | External | | ● | |
| Ticketmaster (events) | External | | ● | |
| Google Places (foot-traffic) | External | | ● | |
| Merge.dev / Rutter (aggregators) | Aggregator | | ● | ● |
| WooCommerce | E-commerce | | | ● |
| Xero | Accounting | | | ● |
| PredictHQ / SeatGeek / Eventbrite | External events | | | ● |
| Foursquare / Placer.ai / SafeGraph | External foot-traffic | | | ● |
| Google Business Profile / Yelp | External reviews | | | ● |
| Tomorrow.io (weather) | External | | | ● |
| Google Trends | External | | | ● |

**Rationale for the Phase 1 recommendation:** Square + CSV/manual covers the widest slice of target SMBs with the least engineering; weather and holidays are free-to-cheap, universally relevant, and immediately improve forecasts. This proves the core value loop (transactions + external signals → forecast → recommendation) before investing in the long tail of connectors or premium signal feeds.

---

## Related documents

- [06 — Data Strategy & ETL](../06_Data_Strategy_and_ETL.md) — how these sources are ingested, normalized, and modelled downstream.
- [10 — Hosting & Infrastructure Costs](../10_Hosting_and_Infrastructure_Costs.md) — cost impact of the phased integration roadmap and external-API call volumes.
- [03 — Functional Requirements](../03_Functional_Requirements.md) — connection UX, authorization flows, and data-freshness requirements.
- [07 — AI/ML Strategy](../07_AI_ML_Strategy.md) — how internal + external signals combine in the forecasting pipeline.
- [Appendix A — KPI & Metrics Catalog](A_KPI_and_Metrics_Catalog.md) — the metrics these sources feed.
- [Appendix C — Assumptions & Constants](C_Assumptions_and_Constants.md) — canonical source for all pricing, volumes, and named constants.
- [Appendix D — Glossary](D_Glossary.md) — definitions of OAuth, webhook, ELT/ETL, aggregator, and other terms used above.
