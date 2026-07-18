# 08 — Technology Stack

**Project:** SAIL · **Doc:** 08 · **Date:** 2026-07-18 · **Status:** Draft v1.0

---

This document specifies the recommended technology for each layer of SAIL, the reasoning behind each choice, and the concrete build-vs-buy decisions that shape cost and delivery speed. It pairs with [System Architecture](05_System_Architecture.md) (how the pieces fit) and [Appendix C](appendix/C_Assumptions_and_Constants.md) (the canonical stack summary). All cost pointers reference [Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md).

The guiding principle is **lean, managed, and boring where it doesn't differentiate; invested where it does.** SAIL's moat is its data pipeline, forecasting quality, and prescriptive AI — not its auth server or its email sender. So we buy commodity infrastructure (auth, billing, email/SMS, error tracking) and build the differentiated pipeline (transforms, features, models, grounded briefs).

---

## 1. Master stack table

| Layer | Recommended choice | Why | Alternative | Cost pointer |
|---|---|---|---|---|
| **Frontend** | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui | One React framework covering SSR/RSC, routing, and the BFF; TS for safety; Tailwind + shadcn for fast, consistent, ownable UI | Remix / Vite SPA + separate API | Vercel tier — see [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **App BFF** | Next.js Route Handlers | Colocated with the UI; owns session, entitlements, read-aggregation; no extra service to run | Standalone Node/Express BFF | Included in Vercel — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Backend / ML API** | FastAPI (Python) | Python is where the data/ML ecosystem lives; async, typed (Pydantic), OpenAPI out of the box | Flask, Litestar, Django REST | Container host (Fly/Railway/Render) — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Auth** | Supabase Auth | Integrates natively with Postgres RLS via JWT `tenant_id` claim; email + OAuth logins; no separate identity service | Auth0 (enterprise/reference), Clerk | Supabase plan — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Primary DB** | Supabase Postgres | System of record; RLS for multi-tenancy; mature, cheap, one system for OLTP + early analytics | Neon, RDS Postgres, Azure SQL | Supabase plan — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Analytics / warehouse** | Supabase Postgres marts (MVP) → columnar (DuckDB / ClickHouse / BigQuery) at scale | Defer the warehouse until scan-heavy queries justify it; columnar only when analytics load hurts OLTP | Snowflake, Redshift | Grows with scale — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Object storage** | Supabase Storage / Cloudflare R2 (S3-compatible) | Per-tenant landing vault for raw payloads + uploads; R2 has no egress fees | AWS S3, Azure Blob (reference) | Per-GB — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Cache / queue** | Upstash Redis | Serverless, pay-per-request; BFF cache, API rate limiting, lightweight job queue | Redis Cloud, SQS + ElastiCache | Usage-based — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Orchestration** | Prefect | Pythonic flows, dynamic per-tenant fan-out, retries, cron schedules; low ops burden | Apache Airflow (reference), Dagster | Prefect Cloud/self-host — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Transformation** | dbt Core | Versioned SQL medallion (raw→staging→marts), tests, lineage, docs; industry standard | SQLMesh, hand-written SQL | Self-host free — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Data validation** | Great Expectations / Pandera + dbt tests | Gate the pipeline on schema/range/null/dup checks before publishing numbers | Soda Core, custom pytest | Self-host free — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Forecasting libs** | Prophet (baseline) + LightGBM/XGBoost (regressors) + Nixtla StatsForecast (global/cold-start) | Coverage across seasonality, external regressors, and sparse/new-tenant series; all open-source | Statsmodels, NeuralForecast, Darts | Compute only — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **GenAI / LLM** | Claude Haiku / GPT-4o-mini, structured output grounded on computed metrics | Cheap, fast, good enough for grounded narration; structured output keeps briefs schema-valid | Azure OpenAI (reference), Llama self-host | Per-token — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **External-data APIs** | Weather (Visual Crossing/OpenWeather), Holidays (Nager.Date/Calendarific), Events (Ticketmaster/SeatGeek/PredictHQ), Google Places | The regressors that make forecasts location- and context-aware | Weatherstack, Abstract, Eventbrite | Mostly freemium; PredictHQ premium — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **POS / accounting integration** | Direct (Square/Toast/Clover/Shopify/QuickBooks) **or** aggregator (Merge.dev/Rutter); + CSV/Excel | Direct for the launch connector; aggregator to fan out coverage without N integrations | Plaid (financial), custom per-vendor | Aggregator per-connection — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Charts / BI** | Tremor + Recharts (in-app React) | Owns UX + theming, embeds natively in the workspace, no per-seat BI cost | Metabase embedded (reference), Superset | Free (in-app) — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Email** | Resend | Developer-first, React-email templates, good deliverability | SendGrid (reference), Postmark | Per-email — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **SMS** | Twilio | Ubiquitous, reliable US SMS + short-code path | MessageBird, AWS SNS | Per-message — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Billing** | Stripe Billing | Tiered subscriptions, metering, dunning, webhooks; no card data in SAIL (PCI SAQ-A) | Paddle, Chargebee | % + per-txn — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **Observability** | Sentry (errors) + PostHog (product analytics) + Grafana / Better Stack (infra + pipeline SLAs) | Errors, funnels, and infra/pipeline health across the whole stack | Datadog, New Relic | Freemium tiers — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **CI/CD** | GitHub Actions + Vercel deploys | PR previews, lint/type/test/dbt gates, gated migrations; standard and free at this scale | GitLab CI, CircleCI | Free tier — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |
| **IaC** | Terraform | Reproducible envs across Supabase/Vercel/cloud; version-controlled infra | Pulumi, SST | N/A — [doc 10](10_Hosting_and_Infrastructure_Costs.md) |

---

## 2. Recommended lean stack vs. Enterprise / reference stack

Our reference diagram includes an enterprise/reference stack. SAIL launches on the **lean stack** (managed, cheaper, faster to ship) and graduates individual layers to the enterprise equivalent only when a concrete trigger appears — not wholesale.

| Layer | Lean stack (recommended) | Enterprise / reference stack | Graduate when… |
|---|---|---|---|
| Backend/ML API | FastAPI | FastAPI | Same choice — no change needed |
| Auth | Supabase Auth | Auth0 | Enterprise SSO/SAML, advanced RBAC, or compliance procurement requires it |
| Object storage | Supabase Storage / R2 | AWS S3 / Azure Blob | Standardizing on a cloud, needing lifecycle/Glacier tiers or data-residency controls |
| Orchestration | Prefect | Apache Airflow | Large DAG estate + a dedicated data-eng team already on Airflow |
| Primary DB / warehouse | Supabase Postgres | PostgreSQL / Azure SQL + dedicated warehouse | Analytics load hurts OLTP; move marts to columnar (see [Architecture §7](05_System_Architecture.md)) |
| Transformation | dbt Core (self-host) | dbt (Core/Cloud) | Need managed scheduling, docs hosting, and CI for a bigger analytics team → dbt Cloud |
| Forecasting | Prophet / XGBoost / StatsForecast | Statsmodels / Prophet / XGBoost | Same family; add deep-learning models only if accuracy plateaus |
| GenAI | Claude Haiku / GPT-4o-mini (API) | Azure OpenAI (GPT-4o-mini) | Enterprise data-processing agreements / regional hosting mandate a cloud-hosted model |
| Charts / BI | Tremor / Recharts (in-app) | Metabase embedded | Buyers demand self-serve ad-hoc exploration beyond curated dashboards |
| Email | Resend | SendGrid | High-volume deliverability contracts or existing SendGrid relationship |
| SMS | Twilio | Twilio | Same choice |

**Rule of thumb:** start lean, migrate one layer at a time behind the abstractions already in the architecture (routing layer for DB, connector layer for sources, provider adapters for LLM/email). Wholesale enterprise adoption at MVP burns budget for capabilities SMB tenants don't yet need.

---

## 3. Build-vs-buy decisions

| Decision | Recommendation | Rationale |
|---|---|---|
| **Aggregator (Merge.dev/Rutter) vs. direct connectors** | **Direct for the launch connector (Square); aggregator to fan out coverage** | Direct gives full fidelity + no per-connection markup for the one connector that covers most launch tenants. Beyond that, maintaining N POS/accounting integrations is a treadmill — an aggregator normalizes many sources behind one contract, trading per-connection cost for engineering time. Keep the connector layer abstract so either can back a given source. Detail in [Appendix B](appendix/B_Data_Sources_and_Integrations.md). |
| **In-app charts (Tremor/Recharts) vs. embedded Metabase** | **Build in-app with Tremor/Recharts** | Prescriptive UX (annotated forecasts, "what to do" cards) needs bespoke components Metabase can't render; in-app keeps theming, mobile, and interactivity fully owned with no embed/per-seat cost. Revisit Metabase only if buyers demand self-serve ad-hoc exploration. |
| **Supabase vs. raw AWS/Azure** | **Supabase at MVP; selectively adopt cloud primitives at scale** | Supabase bundles Postgres + Auth + Storage + RLS in one managed product — huge time savings and the RLS-native multi-tenancy SAIL depends on. Raw AWS/Azure gives more control but multiplies ops. Move specific layers (storage → S3/R2, DB → managed Postgres) only when scale or procurement demands. |
| **Prefect vs. Airflow** | **Prefect** | Prefect's Python-native, dynamic per-tenant fan-out and low operational overhead fit a lean team; Airflow's DAG-heavy model and ops burden are overkill until there's a dedicated data-eng function (the reference stack's context). |
| **Self-host dbt Core vs. dbt Cloud** | **Self-host dbt Core (run inside Prefect)** | dbt Core is free and runs as a task in the nightly flow — no extra scheduler needed since Prefect already orchestrates. Graduate to dbt Cloud only when a growing analytics team needs managed scheduling, hosted docs/lineage, and its own CI. |

---

## 4. Language & framework rationale

- **Python for data/ML services.** The entire forecasting and data ecosystem — pandas/polars, Prophet, LightGBM/XGBoost, StatsForecast, Great Expectations, MLflow, dbt's Python integrations — is Python-first. FastAPI gives typed, async, OpenAPI-documented services with minimal ceremony, so the same language spans ingestion, transforms, features, models, and the GenAI service.
- **Next.js + TypeScript for the app.** One framework delivers Server Components (fast, data-heavy dashboards), routing, and the BFF in a single deployable on Vercel. TypeScript end-to-end on the frontend catches contract drift; Tailwind + shadcn/ui give a consistent, ownable design system without a UI-vendor dependency.
- **One BFF, not many.** The Next.js route handlers are the single browser-facing contract: they own session, entitlement checks, and read-aggregation, and delegate anything CPU/Python-heavy to FastAPI. This keeps the client dumb and secure (no direct DB access from the browser; RLS enforced under a tenant JWT), avoids a second API surface to secure, and lets the two tiers scale on different signals (I/O vs. compute).

This split — **TypeScript for the experience, Python for the intelligence, one BFF between them** — is the smallest sensible team footprint that still separates the fast read path from the heavy write path described in [System Architecture](05_System_Architecture.md).

---

## 5. Notable libraries

| Area | Libraries |
|---|---|
| **Data wrangling** | `pandas`, `polars` (large/perf-critical transforms), `pyarrow` |
| **Validation & contracts** | `pydantic` (API + config models), `great_expectations`, `pandera`, dbt tests |
| **DB access** | `sqlalchemy`, `asyncpg`, `psycopg`, `supabase-py`; `alembic` (migrations) |
| **Forecasting / ML** | `prophet`, `lightgbm`, `xgboost`, `statsforecast` (Nixtla), `scikit-learn`, `mlflow` (tracking/registry) |
| **Orchestration / transform** | `prefect`, `dbt-core` + `dbt-postgres` |
| **GenAI** | `anthropic`, `openai`, `instructor` / native structured-output (schema-validated briefs), `tiktoken` |
| **Integrations & payments** | `stripe`, `twilio`, `resend`; source SDKs (Square, Shopify, QuickBooks) or `merge`/Rutter client |
| **Frontend** | `next`, `react`, `typescript`, `tailwindcss`, `shadcn/ui`, `@tremor/react`, `recharts`, `@tanstack/react-query`, `zod` (client-side contracts) |
| **Observability** | `sentry-sdk` / `@sentry/nextjs`, `posthog-python` / `posthog-js` |
| **Testing** | `pytest`, `pytest-asyncio` (backend); `vitest`, `playwright` (frontend) |

---

## Related documents

- [05 — System Architecture](05_System_Architecture.md) — how these components fit and run
- [06 — Data Strategy & ETL](06_Data_Strategy_and_ETL.md) — dbt medallion, validation, pipeline internals
- [07 — AI / ML Strategy](07_AI_ML_Strategy.md) — forecasting models, feature store, GenAI grounding
- [09 — Security & Compliance](09_Security_and_Compliance.md) — auth, RLS, encryption, PCI scope
- [10 — Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md) — per-tool costs, MVP vs. scale envelopes
- [Appendix B — Data Sources & Integrations](appendix/B_Data_Sources_and_Integrations.md) — connector catalog, aggregator vs. direct
- [Appendix C — Assumptions & Constants](appendix/C_Assumptions_and_Constants.md) — canonical stack summary
