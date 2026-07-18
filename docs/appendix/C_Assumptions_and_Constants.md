# Appendix C — Assumptions & Constants (Single Source of Truth)

> **Purpose:** This is the canonical reference for every number and assumption used across the SAIL business plan. If a figure appears anywhere in this document set, it originates here. Change it here first, then propagate.
>
> **Status:** Draft v1.0 · **Date:** 2026-07-18 · **Owner:** Founding team

> **Two deliberate blanks:** All **development cost, effort (person-weeks), and timeline (weeks)** are intentionally left as **`_TBD_`** — the founding team will set these. Only **operating (infrastructure) costs** are quantified here.

---

## 1. Product Identity

| Item | Value |
|------|-------|
| **Product** | **SAIL** |
| **One-liner** | A multi-tenant SaaS that turns a small business's own transaction data + external signals (weather, holidays, local events) into KPI dashboards, demand forecasts, and prescriptive "what to do next" recommendations. |
| **Category** | Vertical AI analytics / decision-intelligence for SMB hospitality & retail-service |
| **Delivery mode** | Web app (responsive), multi-tenant cloud SaaS |

## 2. Team

| Role | Responsibility |
|------|----------------|
| **Founder** | Business, go-to-market, customer development, commercial strategy |
| **Developer / Technical Lead** | Architecture, build, data/ML, platform |
| **To hire / contract as we scale** | Data engineer, ML engineer, frontend/UI, designer, QA (as funding and traction allow) |

> This is **our own business plan** — a shared plan for building SAIL. It is not a proposal to an external client; the cost figures here are *our* build budget and operating costs.

## 3. Target Market (Customers)

- **Geography:** United States (launch), single- or few-location operators.
- **Segments:** Food & beverage (cafés, coffee shops, QSR, ice-cream), lodging (hotels, motels, B&Bs), small retail/service.
- **Common trait:** POS-driven, perishable or capacity-constrained inventory, sensitive to weather/holidays/local events, thin analytics tooling today.
- **Buyer persona:** Owner-operator or small-chain GM; not data-literate; wants answers, not dashboards to configure.

## 4. Subscription Tiers (our pricing to customers)

| Tier | Price (USD/mo) | Position |
|------|----------------|----------|
| **Starter** | **$200** | Core dashboard + baseline forecasting, 1 location, 1 data connector |
| **Growth** | **$500** | *Most popular* — full forecasting + prescriptive AI + external signals, multi-connector |
| **Scale** | **$800** | Multi-location, benchmarking, priority AI, API access, advanced ICP personalization |
| *(Recommended add-on)* | *$79–$99 "Lite"* | *Entry tier to de-risk the high $200 floor — see [Market & Feasibility](../02_Market_and_Feasibility.md).* |

Annual billing assumed at **~2 months free** (≈17% discount) as the default incentive.

## 5. Build Budget & Timeline — *to be decided*

- **Costing method:** effort-based, in person-weeks (pw), at a blended rate. **Rate, effort, durations, and totals are `_TBD_`** — the founding team will finalize them (in-house vs. contractor build changes the cash cost materially).
- Detail and the build-path options are in [Build Cost & Capital Plan](../11_Build_Cost_and_Commercials.md).

### Build phases (scope fixed; estimates blank)

| Phase | Scope headline | Effort | Duration | Build cost |
|-------|----------------|--------|----------|------------|
| **Phase 0** | Discovery & Design | `_TBD_` | `_TBD_` | `_TBD_` |
| **Phase 1** | MVP Foundation & First Insights | `_TBD_` | `_TBD_` | `_TBD_` |
| **Phase 2** | Intelligence & Multi-tier | `_TBD_` | `_TBD_` | `_TBD_` |
| **Phase 3** | Scale, MLOps & Hardening | `_TBD_` | `_TBD_` | `_TBD_` |

- **v1 (Phases 0–2):** cost `_TBD_`, duration `_TBD_`.
- **Full platform (Phases 0–3):** cost `_TBD_`, duration `_TBD_`.
- **Operating & maintenance run-rate (post-launch labor):** `_TBD_`.

## 6. Running Cost of Goods Sold (COGS) — Infrastructure & Tools

| Scale | Monthly all-in COGS (excl. Stripe %, excl. optional premium data) | Per-tenant COGS |
|-------|-------|-----------------|
| **MVP** (10–50 tenants) | **$300 – $700 / mo** | ~$10–$30 |
| **Scale** (~500 tenants) | **$2,500 – $5,000 / mo** | **~$6 – $15** |

- **Optional premium data** (PredictHQ events, Merge.dev/Rutter POS aggregation) can add **$650 – $2,500/mo** — see [Hosting & Infrastructure Costs](../10_Hosting_and_Infrastructure_Costs.md).
- **Infra gross margin** at scale ≈ **90%+** on subscription revenue (before labor/CAC).
- **Payment processing** (Stripe): ~2.9% + $0.30 per charge, +0.5% Billing.

## 7. Unit Economics (summary)

- **Blended ARPU** ≈ **$395** (tier mix 50% Starter / 35% Growth / 15% Scale); ≈ **$307** once a Lite tier dilutes the mix.
- **Per-tenant gross margin** ≈ **94%** (ARPU − COGS − Stripe); per-tenant contribution ≈ **$371/mo**.
- **Break-even** = monthly fixed operating budget ÷ per-tenant contribution. The operating budget (team labor) is `_TBD_`, so the break-even tenant count resolves once it is set.
- Full model in [Business Model & Unit Economics](../15_Business_Model_and_Unit_Economics.md).

## 8. Timeline — *to be decided*

| Milestone | Week |
|-----------|------|
| Discovery & design sign-off | `_TBD_` |
| MVP live (Phase 1) | `_TBD_` |
| Launch-ready v1 (Phase 2) | `_TBD_` |
| Full platform (Phase 3) | `_TBD_` |

## 9. Recommended Technology Stack (summary)

| Layer | Choice |
|-------|--------|
| **Frontend / app** | Next.js (React) + TypeScript + Tailwind + shadcn/ui + Tremor/Recharts; hosted on Vercel |
| **API / services** | FastAPI (Python) for data/ML services; Next.js route handlers for app BFF |
| **Auth & multi-tenancy** | Supabase Auth + Postgres Row-Level Security (RLS); tenant isolation by `tenant_id` |
| **Primary DB / warehouse** | Supabase Postgres (OLTP + analytics at MVP) → columnar (DuckDB/ClickHouse/BigQuery) at scale |
| **Ingestion / connectors** | Direct connectors (Square, Toast, Clover, Shopify, QuickBooks) or aggregator (Merge.dev / Rutter); CSV/Excel upload; manual entry |
| **Orchestration** | Prefect (daily cron pipelines) |
| **Transformation** | dbt Core (raw → staging → marts) |
| **Data validation** | Great Expectations / Pandera + dbt tests |
| **Forecasting** | Prophet (baseline) + LightGBM/XGBoost (regressors) + Nixtla StatsForecast (global/cold-start) |
| **GenAI insights** | Claude Haiku / GPT-4o-mini with structured output, grounded on computed metrics |
| **External signals** | Weather (Visual Crossing/OpenWeather), Holidays (Nager.Date/Calendarific), Events (Ticketmaster/SeatGeek/PredictHQ), Google Places |
| **Notifications** | Resend (email) + Twilio (SMS) |
| **Billing** | Stripe Billing (tiered subscriptions + metering) |
| **Observability** | Sentry (errors) + PostHog (product analytics) + Grafana/Better Stack (infra) |

The four-stage reference pipeline — **(1) Secure Data Ingestion → (2) Automated Transformation → (3) Predictive ML → (4) Prescriptive Output** — is adopted and extended throughout. See [System Architecture](../05_System_Architecture.md).

## 10. Key Assumptions

1. We own the product and the customer relationship; the build is done in-house and/or with contractors.
2. Customers can connect at least one data source (POS/e-commerce/accounting) **or** upload CSV; forecasting quality scales with data availability.
3. No card data is stored by SAIL — all payments delegated to Stripe (PCI SAQ-A scope).
4. English-first UI at launch; US holidays/timezones/currency (USD) only in v1.
5. Model accuracy targets are directional (see [AI/ML Strategy](../07_AI_ML_Strategy.md)); SMB data is often sparse/noisy — cold-start handled via pooled/benchmark priors.
6. Operating (infrastructure) cost figures are estimates; third-party prices are as of 2026-07 and change independently of us.
7. Development cost, effort, and timeline are `_TBD_` and will be set by the founding team.

## 11. Document Manifest

**Business plan**
- [README (index)](../../README.md)
- [00 — Summary](../00_Executive_Summary.md)
- [01 — Product Vision & Scope](../01_Product_Vision_and_Scope.md)
- [02 — Market & Feasibility](../02_Market_and_Feasibility.md)
- [03 — Functional Requirements](../03_Functional_Requirements.md)
- [04 — Subscription Tiers & Feature Matrix](../04_Subscription_Tiers_and_Feature_Matrix.md)
- [05 — System Architecture](../05_System_Architecture.md)
- [06 — Data Strategy & ETL](../06_Data_Strategy_and_ETL.md)
- [07 — AI / ML Strategy](../07_AI_ML_Strategy.md)
- [08 — Technology Stack](../08_Technology_Stack.md)
- [09 — Security & Compliance](../09_Security_and_Compliance.md)
- [10 — Hosting & Infrastructure Costs](../10_Hosting_and_Infrastructure_Costs.md)
- [11 — Build Cost & Capital Plan](../11_Build_Cost_and_Commercials.md)
- [12 — Delivery Plan & Timeline](../12_Delivery_Plan_and_Timeline.md)
- [13 — Risks, Assumptions & Dependencies](../13_Risks_Assumptions_Dependencies.md)
- [14 — Roadmap & Next Steps](../14_Tender_Summary_and_Next_Steps.md)
- [15 — Business Model & Unit Economics](../15_Business_Model_and_Unit_Economics.md)

**Appendices**
- [A — KPI & Metrics Catalog](A_KPI_and_Metrics_Catalog.md)
- [B — Data Sources & Integrations](B_Data_Sources_and_Integrations.md)
- [C — Assumptions & Constants](C_Assumptions_and_Constants.md) *(this file)*
- [D — Glossary](D_Glossary.md)
