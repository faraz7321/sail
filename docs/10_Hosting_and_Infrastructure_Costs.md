# 10 — Hosting & Infrastructure Costs

**Project:** SAIL · **Doc:** 10 · **Date:** 2026-07-18 · **Status:** Draft v1.0

---

## 1. Approach & cost-model assumptions

This document is the **itemized running-cost breakdown**: every hosting service and tool, what it costs, and how the total scales. It covers **operating cost (COGS)** — the recurring monthly bill to run SAIL — **not** the one-time build cost, which is in [Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md).

**Modelling rules**

- **Two reference points:** **MVP** (10–50 tenants, early production) and **Scale** (~500 tenants). Numbers below use ~30 tenants as the MVP midpoint and 500 for Scale.
- **Usage-based, pass-through at cost.** Third-party API usage (weather, events, LLM, SMS) is billed to SAIL at provider rates and passed through at cost; we do not mark up infrastructure.
- **Prices as of 2026-07.** Provider list prices; committed-use/annual discounts (§7) are *not* assumed in the base case, so figures are conservative.
- **Two exclusions from the base subtotal:** (a) **Stripe** payment-processing fees — a percentage of *revenue*, not an infra cost (§4); (b) **optional premium data** (PredictHQ, Merge.dev/Rutter) — kept in a separate table (§3).
- **Canonical envelope:** MVP **$300–$700/mo** all-in; Scale **$2,500–$5,000/mo**; per-tenant COGS at scale **~$6–$15**; infra gross margin **~90%+**. These originate in [Appendix C](appendix/C_Assumptions_and_Constants.md); the line items below are built to total inside them.

---

## 2. Master itemized table

Every host/tool. MVP = ~10–50 tenants; Scale = ~500 tenants. Free-tier items are shown at **$0** with the tier noted.

| Category | Tool / Service | Pricing basis | MVP $/mo (10–50 tenants) | Scale $/mo (~500 tenants) | Notes |
|---|---|---|---:|---:|---|
| **Web hosting / CDN** | Vercel | Per-seat plan + usage (bandwidth, functions) | 20 | 150 | Pro plan at MVP; Scale adds bandwidth + serverless/edge function usage. Read path is cached, so cost grows sub-linearly. |
| **ML/ETL compute** | Fly.io / AWS Fargate (FastAPI) | vCPU-hours + RAM; scale-to-low between cron runs | 110 | 700 | Nightly ingest→validate→transform→forecast→insight. Scale-to-near-zero off-cron keeps this efficient. Largest single line at scale. |
| **Database + Auth + Storage** | Supabase (Postgres + Auth + Storage) | Plan + compute add-on + storage/egress | 25 | 400 | Pro plan at MVP; Scale = larger compute instance + PITR + storage growth (optional read replica for Scale tenants). |
| **Cache / queue / rate-limit** | Upstash Redis | Per-request (serverless) or fixed | 10 | 120 | Caching, per-tenant rate limits, lightweight queues. Pay-per-use keeps MVP tiny. |
| **Object storage** | AWS S3 / Cloudflare R2 | GB stored + operations (+ egress; R2 = $0 egress) | 5 | 60 | Landing vault (raw payloads), file uploads, exports. R2 preferred to avoid egress fees. |
| **Orchestration** | Prefect Cloud | Free tier → paid by workflow volume | 0 | 200 | Free tier covers MVP run volume; Scale needs a paid tier for concurrency/retention across ~500 nightly flows. |
| **Transformation** | dbt Core | Open-source (self-hosted) | 0 | 0 | Free. Runs on the Fargate/Fly compute already counted above. |
| **Data quality** | Great Expectations | Open-source | 0 | 0 | Free. Validation gate runs inside the pipeline compute. |
| **LLM API** | Claude Haiku / GPT-4o-mini | Per token (input + output) | 55 | 450 | Daily per-tenant insight + on-demand Q&A. See derivation below. Prompt caching/batching (§7) holds this down. |
| **Forecasting compute** | Prophet + LightGBM/XGBoost + Nixtla | Own compute (no vendor) | 0 | 0 | **Negligible incremental** — runs inside the Fargate/Fly nightly job already costed above; no separate GPU/vendor bill. |
| **Weather data** | Visual Crossing / OpenWeather | Free tier → per-call | 15 | 150 | Cached per location/day, shared across tenants in the same area — cost grows with distinct locations, not tenant count. |
| **Holidays data** | Nager.Date (free) / Calendarific | Free / low paid tier | 0 | 20 | Nager.Date free covers most needs; small Calendarific line at scale for coverage/reliability. |
| **Events data (base)** | Ticketmaster / SeatGeek | Free / low-cost tiers | 0 | 0 | Free-ish public tiers cover baseline event signals. Premium coverage is the optional PredictHQ line in §3. |
| **Places / venue enrichment** | Google Places | Per-request (monthly free credit) | 30 | 250 | Location enrichment + geocoding; results cached to stay inside/near the free credit at MVP. |
| **Email** | Resend | Per-email, tiered | 20 | 120 | Transactional + notification email (digests, alerts). |
| **SMS** | Twilio | Per-segment + carrier + A2P fees | 35 | 500 | Alert SMS to owners. Volume-driven; ~2–3 msgs/tenant/day at scale + 10DLC fees. Consent-gated (see Security §6.3). |
| **Error monitoring** | Sentry | Per-event tier | 29 | 120 | Team plan at MVP; higher event volume + retention at scale. |
| **Product analytics** | PostHog | Free tier → per-event | 0 | 100 | Generous free tier covers MVP; paid events at scale. |
| **Uptime / logs** | Better Stack (+ Grafana OSS) | Free tier → paid | 0 | 50 | Free tier at MVP; paid log volume/heartbeats at scale. Grafana OSS is free if self-hosted. |
| **Domain / DNS / misc** | Registrar + DNS + edge/CDN misc | Fixed + small usage | 20 | 60 | Domain, DNS, TLS (managed/free), small miscellany. |
| | | **Base subtotal** | **≈ $375/mo** | **≈ $3,450/mo** | Within canonical envelopes ($300–700 MVP; $2,500–5,000 Scale). Excludes Stripe (§4) & optional premium (§3). |

**Envelope check:** MVP line items sum to **~$375** (inside $300–700; the band absorbs 10-vs-50-tenant and usage variance). Scale line items sum to **~$3,450** (inside $2,500–5,000, with headroom for spikes). Both exclude Stripe and optional-premium rows by design.

---

## 3. Optional premium add-ons (kept OUT of the base subtotal)

These are opt-in, high-value data upgrades. They are **not** in the §2 subtotal and would typically be enabled per-tenant (often billed through to Growth/Scale tiers) rather than run platform-wide.

| Add-on | Purpose | Pricing basis | Monthly cost | Notes |
|---|---|---|---:|---|
| **PredictHQ** | Premium demand-impacting events (attendance-weighted, ranked) | Subscription by coverage/volume | $500 – $2,000 | Materially better event signal than free tiers; enable for event-sensitive tenants. |
| **Merge.dev / Rutter** | Unified POS/commerce aggregation (one API for many POS) | Per linked account / connection tier | $150 – $500 | Alternative to building direct connectors; see trade-off in §6. |
| | | **Optional total** | **$650 – $2,500/mo** | Matches canonical optional-premium band. Added on top of §2 only when enabled. |

---

## 4. Stripe payment-processing note

Stripe is **not an infrastructure cost** — it is a percentage of the revenue SAIL collects, so it scales with billings, not servers. It is therefore excluded from the §2 subtotal and shown here for completeness.

- **Rate:** ~**2.9% + $0.30 per successful charge**, plus ~**0.5% Stripe Billing** on recurring invoices → effective **~3.4% + $0.30/charge**. Pass-through at cost; prices as of 2026-07.
- **Illustrative at scale:** ~500 tenants at a blended ~$400/mo ARPU ≈ **$200,000 MRR**. Processing ≈ 3.4% × $200,000 + 500 × $0.30 ≈ **~$6,950/mo**. This is netted against gross revenue in the P&L, **not** part of hosting COGS.

Tier pricing (Starter $200 / Growth $500 / Scale $800; optional Lite $79–99) is in [Appendix C](appendix/C_Assumptions_and_Constants.md); commercial modelling is in [Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md).

---

## 5. Per-tenant COGS derivation & gross margin

**Base per-tenant COGS at scale** = base subtotal ÷ tenants = **$3,450 ÷ 500 ≈ $6.9/tenant/mo**.

Fully-loaded per-tenant COGS varies with usage — a heavy tenant (more SMS alerts, more on-demand LLM queries, more distinct locations, premium data) costs more than a light one:

| Tenant profile | Monthly COGS | Driver |
|---|---:|---|
| **Light** (dashboards + daily insight, few alerts) | ~$6 | Shared compute + cached signals; minimal SMS/LLM |
| **Typical** | ~$8–10 | Baseline LLM + moderate SMS + Places usage |
| **Heavy** (many alerts, frequent Q&A, multi-location) | ~$12–15 | SMS volume + LLM tokens + more distinct weather/Places lookups |

This lands squarely in the canonical **~$6–$15/tenant** range.

**Gross margin vs. pricing** (Starter $200 / Growth $500 / Scale $800):

| Tier | Price/mo | ~COGS/mo | Gross margin |
|---|---:|---:|---:|
| Starter | $200 | ~$8 | ~96% |
| Growth | $500 | ~$10 | ~98% |
| Scale | $800 | ~$13 | ~98% |

Even on the lightest Lite tier ($79–99) with a heavy-usage tenant (~$15), margin stays **>80%**; across the book the infra gross margin is **~90%+**, consistent with [Appendix C](appendix/C_Assumptions_and_Constants.md). The economics improve with scale: MVP per-tenant COGS is ~$12 (~$375 ÷ 30) because fixed costs spread over few tenants; at 500 tenants it falls to ~$7 as those fixed costs amortize.

**LLM line-item derivation (for auditability).** Per tenant/day at scale ≈ one daily insight (~10k in / 2k out) + ~3 on-demand queries (~18k in / 3k out) ≈ 28k input + 5k output tokens. Over 500 tenants × 30 days at a blended ~$0.30/M input and ~$1.50/M output ≈ **$240/mo** of raw token cost; the **$450** line item carries headroom for retries, heavier Haiku use on prescriptive text, embeddings, and caching misses. Forecasting adds no vendor cost (own compute).

---

## 6. Direct connectors vs. aggregator (build vs. buy)

POS ingestion can be built directly or bought via an aggregator (Merge.dev / Rutter). The trade-off:

| | Direct connectors (build) | Aggregator (Merge.dev / Rutter) |
|---|---|---|
| **Running cost** | ~$0 marginal (own compute) | $150–$500+/mo (§3) |
| **Build cost** | High — one integration per POS, ongoing maintenance | Low — one integration covers many POS |
| **Coverage / time-to-market** | Slow; each POS is bespoke | Fast; broad POS coverage day one |
| **Reliability / maintenance** | You own breakage when POS APIs change | Vendor absorbs upstream changes |
| **Data control** | Full control, no third party in the path | Tenant POS data transits a subprocessor (see Security §10) |

**Recommendation:** start with the aggregator to reach market and validate demand, then selectively build direct connectors for the 2–3 most common POS systems once volume justifies removing the per-connection fee. This keeps early running cost low and converts to owned connectors where the unit economics pay back.

---

## 7. Cost-control levers

| Lever | Effect |
|---|---|
| **LLM caching & batching** | Prompt caching for stable context + batching daily insight generation cuts LLM tokens materially; a single grounded prompt per tenant/day beats ad-hoc calls. |
| **Cache external signals** | Weather/holidays/events/Places cached per location/day and shared across co-located tenants — cost scales with distinct locations, not tenant count. |
| **Free tiers first** | dbt Core, Great Expectations, Grafana OSS, Nager.Date, PostHog/Better Stack free tiers, and free event tiers carry MVP at ~$0. |
| **Scale-to-low compute** | Fly.io/Fargate scale down between nightly cron runs — pay for the batch window, not idle capacity. |
| **Committed-use discounts** | At scale, annual/committed plans (Vercel, Supabase, cloud compute, Sentry) typically cut 10–30% — not assumed in the conservative base case, so real Scale cost trends toward the low end. |
| **Columnar warehouse only when needed** | Stay on Supabase Postgres for OLTP + analytics at MVP/early Scale; add a columnar warehouse (BigQuery/DuckDB/ClickHouse) only when analytical query volume justifies it — avoid paying for a warehouse prematurely. |
| **Prefer $0-egress storage (R2)** | Cloudflare R2 avoids S3 egress fees on exports/large payloads. |

---

## 8. Hosting-architecture options compared

Three deployable topologies. The recommended stack is what §2 is costed on; the AWS and Azure options are provided because our reference diagram implies a cloud-native/Azure path.

| Option | Composition | Pros | Cons | Rough MVP $/mo | Rough Scale $/mo |
|---|---|---|---|---:|---:|
| **Recommended** — Vercel + Supabase + Fly.io | Next.js on Vercel; Supabase (PG+Auth+Storage); FastAPI on Fly.io/Fargate; managed add-ons | Fastest to ship; least DevOps; generous free/low tiers; managed Auth+RLS out of the box | Multi-vendor; some ceiling on very-large-DB tuning | **~$375** | **~$3,450** |
| **All-AWS** | Amplify/CloudFront + RDS/Aurora + ECS Fargate + ElastiCache + S3 + Cognito | Single vendor/bill; deep control; enterprise procurement-friendly; committed-use discounts | More DevOps/IAM overhead; must rebuild RLS+Auth ergonomics; higher baseline | ~$500–700 | ~$3,500–5,000 |
| **Azure** (client reference stack) | Static Web Apps/App Service + Azure Database for PostgreSQL Flexible Server + Container Apps + Azure Cache for Redis + Blob Storage + Entra ID | Enterprise/Microsoft-shop friendly; strong compliance posture; EA discounts | Highest ops overhead of the three; Postgres RLS+Auth wiring is more manual; typically the priciest baseline | ~$550–750 | ~$3,800–5,200 |

All three stay within (or near) the canonical Scale envelope; the **Recommended** stack sits comfortably at the low end because it leans on managed services and free tiers, minimizing both running cost and DevOps headcount. AWS/Azure become more attractive at large enterprise scale or when a single-vendor procurement/compliance requirement exists. Detailed component mapping is in [System Architecture](05_System_Architecture.md) and [Technology Stack](08_Technology_Stack.md).

**One-time build cost** (engineering to deliver the platform) is out of scope here — see [Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md).

---

## Related documents

- [05 — System Architecture](05_System_Architecture.md) — the components being costed
- [06 — Data Strategy & ETL](06_Data_Strategy_and_ETL.md) — pipeline that drives compute cost
- [07 — AI/ML Strategy](07_AI_ML_Strategy.md) — LLM & forecasting usage behind those lines
- [08 — Technology Stack](08_Technology_Stack.md) — full tool inventory
- [09 — Security & Compliance](09_Security_and_Compliance.md) — isolation/DR options with cost impact
- [11 — Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md) — one-time build cost & Stripe in the P&L
- [Appendix B — Data Sources & Integrations](appendix/B_Data_Sources_and_Integrations.md) — data-source pricing detail
- [Appendix C — Assumptions & Constants](appendix/C_Assumptions_and_Constants.md) — canonical numbers (source of truth)
