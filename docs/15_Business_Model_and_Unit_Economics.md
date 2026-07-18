# Business Model & Unit Economics

**Project:** SAIL · **Doc:** 15 · **Date:** 2026-07-18 · **Status:** Draft v1.0

This is **our** business model — how SAIL makes money, what a tenant is worth, and what it takes to reach profitability and scale. It is written for the founding team and is investor-readable. It builds on the packaging in [Subscription Tiers & Feature Matrix](04_Subscription_Tiers_and_Feature_Matrix.md), the cost basis in [Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md), and the build/capital picture in [Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md). Canonical numbers live in [Appendix C](appendix/C_Assumptions_and_Constants.md). All amounts are in **USD**.

---

## 1. Revenue model & pricing tiers

SAIL is a **recurring-revenue, multi-tenant SaaS**. Every customer pays a monthly (or annual) subscription; there is no per-seat sprawl or usage billing that a small owner can't predict. We price on a single **value metric**: the **depth of insight** a business receives, multiplied by the **breadth of what it can connect** and **how much of its operation it covers** (locations). Deeper insight, more connectors, and more locations move value — and price — together.

| Tier | Price (USD/mo) | Position |
|---|---:|---|
| **Starter** | **$200** | Core dashboard + baseline forecasting; 1 location, 1 connector |
| **Growth** *(most popular)* | **$500** | Full forecasting + external signals + prescriptive AI; multi-connector |
| **Scale** | **$800** | Multi-location, benchmarking, priority AI, API, advanced ICP |
| **Lite** *(optional)* | **$79–99** | Thin CSV-only entry tier to de-risk the $200 floor and widen the funnel |

- **Growth is the anchor.** It holds the features prospects fall in love with in the trial (prescriptive Morning Brief + external-signal forecasting), so it is the natural landing tier. Full rationale in [Subscription Tiers §6](04_Subscription_Tiers_and_Feature_Matrix.md).
- **Annual billing ≈ 2 months free** (~17% off) — our primary lever on cash flow and churn.
- **Lite is optional.** It widens the top of the funnel but is deliberately thin so it converts up rather than cannibalizing Growth.

---

## 2. Blended ARPU

Our blended ARPU depends on the tier mix. Our base case assumes a **50 / 35 / 15** split across Starter / Growth / Scale (Lite excluded from the base case):

| Tier | Price | Mix | Contribution |
|---|---:|---:|---:|
| Starter | $200 | 50% | $100 |
| Growth | $500 | 35% | $175 |
| Scale | $800 | 15% | $120 |
| **Blended ARPU** | | **100%** | **≈ $395** |

`(0.50 × 200) + (0.35 × 500) + (0.15 × 800) = 100 + 175 + 120 = $395`

**With Lite in the mix, ARPU dilutes.** Adding a low-price entry tier pulls the average down. An illustrative Lite-inclusive mix — 30% Lite ($89) / 33% Starter / 27% Growth / 10% Scale — gives:

`(0.30 × 89) + (0.33 × 200) + (0.27 × 500) + (0.10 × 800) ≈ 26.7 + 66 + 135 + 80 ≈ $307`

So we plan around **~$395 ARPU** without Lite and **~$307 ARPU** if Lite is broadly adopted. Lite trades ARPU for funnel width; we treat the diluted figure as our conservative case.

---

## 3. Per-tenant gross margin

SAIL is a high-margin software business. Per-tenant variable cost is tiny relative to price: infrastructure COGS of **~$6–15/tenant/mo** ([doc 10](10_Hosting_and_Infrastructure_Costs.md)) plus payment processing (**Stripe ~2.9% + $0.30** per charge).

Worked at blended ARPU of $395, using a mid COGS of ~$10:

| Line | Amount |
|---|---:|
| Revenue (ARPU) | $395.00 |
| Less: infra COGS (~mid) | −$10.00 |
| Less: Stripe (2.9% × $395 + $0.30) | −$11.76 |
| **Gross profit per tenant** | **≈ $373** |
| **Gross margin** | **≈ 94%** |

`$373 ÷ $395 ≈ 94.5%`

The margin barely moves across tiers: even a heavy tenant (~$15 COGS) on Starter clears well above 90%, and higher tiers are richer. **Per-tenant gross margin ≈ 94%** is the number we build everything else on.

---

## 4. Break-even analysis

We are gross-margin profitable from the **first** tenant. Break-even is the tenant count at which per-tenant contribution covers our **fixed monthly operating budget** — primarily team labor, which the founding team will set (see [doc 11](11_Build_Cost_and_Commercials.md)). It follows one formula:

> **Break-even tenants = monthly fixed operating budget ÷ per-tenant contribution**

- **Per-tenant contribution ≈ $371** — ARPU − infra COGS − Stripe ≈ $395 − $12 − $11.76 (using MVP-era COGS). It is robust to the COGS point used, because COGS is small relative to ARPU.
- **Monthly fixed operating budget = _TBD_** — team labor to be decided by the founding team.

Once the operating budget is set, break-even follows directly by dividing it by ~$371.

*Illustrative only (not a target and not a committed operating figure):* if the operating budget were hypothetically $10,000/mo, break-even would be ≈ $10,000 ÷ $371 ≈ **27 tenants**. Substitute the real budget once decided; the input stays **_TBD_**.

Per-tenant contribution is stable across the COGS range, so break-even scales cleanly with whatever budget is chosen:

| COGS assumption | Contribution / tenant |
|---|---:|
| **MVP COGS** (~$12/tenant) | ~$371 |
| **Scale COGS** (~$7/tenant) | ~$376 |

At blended ARPU (~$395), even a few dozen paying tenants produces MRR in the low five figures — a low, very reachable bar for whatever operating budget is set.

---

## 5. Growth scenarios

At blended ARPU ≈ $395, revenue and contribution scale as follows. **MRR = tenants × ARPU**; **ARR = MRR × 12**. Contribution here = **revenue − infra COGS** (it excludes Stripe and all fixed operating labor, which is _TBD_ — see §7), so it runs a little above the ~94% per-tenant gross margin from §3.

| Tenants | MRR | ARR | Infra COGS / mo | Contribution / mo (rev − infra) | Contribution margin |
|---:|---:|---:|---:|---:|---:|
| **50** | $19,750 | $237,000 | ~$600 | ~$19,150 | ~97% |
| **200** | $79,000 | $948,000 | ~$1,800 | ~$77,200 | ~98% |
| **500** | $197,500 | $2,370,000 | ~$3,500 | ~$194,000 | ~98% |

- At **50 tenants** we generate meaningful contribution; whether that clears break-even depends on the operating budget set in §4.
- At **500 tenants** SAIL is a **~$2.4M ARR** business at ~90%+ gross margin — the target scale referenced throughout the plan.
- Infra COGS grows sub-linearly (caching + shared external-signal lookups, [doc 10 §7](10_Hosting_and_Infrastructure_Costs.md)): ~$300–700/mo in the MVP band scaling to ~$2,500–5,000/mo at 500 tenants. Stripe (excluded above) scales with revenue, not servers.

---

## 6. CAC, LTV & payback (GTM assumptions)

The figures below are **go-to-market assumptions**, not build/development costs. Blended gross margin is ~94%; average customer lifetime is `1 ÷ monthly churn`; **LTV = ARPU × gross margin × lifetime**.

**Base case**

- **CAC assumption: $800** · ARPU: **$395** · gross margin: **94%** · monthly churn: **3%** → lifetime ≈ **33 months**
- **LTV** = ARPU × gross margin × lifetime = 395 × 0.94 × 33 ≈ **$12,250**
- **LTV : CAC** ≈ **15 : 1**
- **Payback** = CAC ÷ (ARPU × gross margin) = 800 ÷ 371 ≈ **~2.2 months**

**Conservative case** (Lite-diluted ARPU, higher churn, higher CAC)

- **CAC assumption: $1,200** · ARPU: **$307** · gross margin: **94%** · monthly churn: **5%** → lifetime ≈ **20 months**
- **LTV** = 307 × 0.94 × 20 ≈ **$5,770**
- **LTV : CAC** ≈ **4.8 : 1**
- **Payback** = 1,200 ÷ (307 × 0.94) = 1,200 ÷ 289 ≈ **~4.2 months**

Both cases clear the standard SaaS health bars (**LTV:CAC > 3:1**, **payback < 12 months**) with wide margin. Even conservatively, we recover acquisition cost in about a quarter and earn multiples of it over a customer's life.

---

## 7. Path to profitability & scaling to 500

**Profitability is close and cheap to reach.** We break even at a low tenant count (§4 — the exact count follows once the operating budget is set); every tenant beyond that drops ~$371/mo of contribution toward covering opex and then to the bottom line. Because the build is founder-led (low cash burn — [doc 11](11_Build_Cost_and_Commercials.md)), the company can become cash-flow self-sustaining at a small tenant count.

**What scaling to 500 tenants takes:**

- **Engineering & ops:** the founder-led operating run-rate (**_TBD_**) holds through early scale, then converts to payroll — plan for 1–2 engineering/MLOps hires and a customer-success/support hire as we cross a few hundred tenants. Any labor cost here is **_TBD_**. Opex grows step-wise, not linearly, and stays a small fraction of ~90%+ gross-margin revenue.
- **Go-to-market:** reaching 500 tenants is the main spend. At the assumed CAC (§6), cumulative acquisition cost is on the order of **500 × CAC** (≈ $400k at ~$800 CAC) over the growth period — largely fundable from gross profit **after** break-even, since each cohort pays back in ~2–4 months and then funds the next.
- **Infrastructure:** rises to ~$2,500–5,000/mo at 500 tenants but stays at ~90%+ gross margin ([doc 10](10_Hosting_and_Infrastructure_Costs.md)).

**Funding need.** The launch capital required is **_TBD_** (founder-led path — [doc 11 §5](11_Build_Cost_and_Commercials.md)). Beyond break-even, growth to 500 tenants can be **largely self-funded from gross profit**, or **accelerated with outside capital (amount _TBD_)** to front-load go-to-market and hiring and compress the timeline. Either way the unit economics — ~94% gross margin, ~2–4 month payback, double-digit LTV:CAC — make each incremental tenant strongly value-accretive.

---

## Related documents

- [04 — Subscription Tiers & Feature Matrix](04_Subscription_Tiers_and_Feature_Matrix.md) — packaging, gating, and tier rationale
- [10 — Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md) — COGS and infra gross margin in detail
- [11 — Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md) — build effort, capital required, operating run-rate
- [Appendix C — Assumptions & Constants](appendix/C_Assumptions_and_Constants.md) — canonical numbers (source of truth)
