# 04 — Subscription Tiers & Feature Matrix

**Project:** SAIL · **Doc:** 04 · **Date:** 2026-07-18 · **Status:** Draft v1.0

---

This document defines how SAIL is packaged and sold to end customers — the **tiers, what each unlocks, the usage limits, add-ons, and the upgrade/trial mechanics** — and the rationale behind the packaging. Prices are our SaaS pricing to *our* customers and originate in [Appendix C](appendix/C_Assumptions_and_Constants.md). Feature semantics ("priority AI," "advanced ICP personalization") are defined in [AI/ML Strategy](07_AI_ML_Strategy.md); the cost basis behind each limit is in [Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md). Functional detail per feature is in [Functional Requirements](03_Functional_Requirements.md).

---

## 1. Tiering philosophy & gating strategy

SAIL is priced on a single, honest **value metric: the depth of insight a business receives, multiplied by the breadth of what it can connect and how much of its operation it can cover.** Concretely, three dials move value — and therefore price — together:

1. **Insight depth** — descriptive KPIs → predictive forecasts → prescriptive AI recommendations. Deeper insight is where the willingness-to-pay lives.
2. **Connector breadth** — how many data sources a tenant can wire in (more sources → richer, more accurate insight).
3. **Location coverage** — single site vs. multi-location roll-ups and benchmarking (bigger operators get more, and can pay more).

**Gating principles:**

- **Gate on value, not on friction.** We never cripple core usability (dashboards, one connector, baseline forecasting are available cheaply). We gate the *depth* customers upgrade for: prescriptive AI, external signals, multi-location, benchmarking, and API.
- **Every tier is complete for its persona.** A solo café on Starter gets a genuinely useful product; it upgrades because it grows, not because it was left broken.
- **Limits map to real COGS.** AI-insight volume, SMS credits, API calls, and data retention are the cost-bearing dials ([10](10_Hosting_and_Infrastructure_Costs.md)); limits are set so each tier stays comfortably margin-positive while feeling generous.
- **Upgrades are always one obvious step away.** When a tenant hits a wall (extra location, more connectors, wants the Morning Brief), the product shows the exact tier that unblocks them.
- **Lite is a validated recommendation, not baseline scope.** The $79–99 Lite tier exists to de-risk the $200 Starter floor and widen the top of the funnel; it is deliberately thin so it pulls price-sensitive owners in without cannibalizing Growth.

---

## 2. The feature matrix

Legend: **✓** = included · **—** = not available · text = included with the stated limit/qualifier. Full feature definitions in [Functional Requirements](03_Functional_Requirements.md).

| Feature area | Feature | **Lite ($79–99)** | **Starter ($200)** | **Growth ($500)** *(most popular)* | **Scale ($800)** |
|---|---|---|---|---|---|
| **Data & connectors** | CSV / Excel upload | ✓ | ✓ | ✓ | ✓ |
| | POS/e-commerce/accounting connectors (Square, Toast, Clover, Shopify, QuickBooks) | — | 1 connector | Multi-connector | Multi-connector |
| | Historical backfill | 90 days | ✓ | ✓ | ✓ |
| | Data-source health & re-auth | ✓ | ✓ | ✓ | ✓ |
| | Automated daily sync | ✓ | ✓ | ✓ | ✓ |
| **Dashboard & KPIs** | Core KPI dashboard | ✓ | ✓ | ✓ | ✓ |
| | Period comparison & trends | ✓ | ✓ | ✓ | ✓ |
| | Full KPI catalog ([App. A](appendix/A_KPI_and_Metrics_Catalog.md)) | Core subset | ✓ | ✓ | ✓ |
| | Per-location & rolled-up dashboards | — | — | — | ✓ |
| **Forecasting** | Baseline demand forecast (next-day, 7-day) | Limited | ✓ | ✓ | ✓ |
| | Confidence intervals | — | ✓ | ✓ | ✓ |
| | External-signal regressors (weather/holidays/events) | — | — | ✓ | ✓ |
| | Extended horizon (up to 30-day) | — | — | ✓ | ✓ |
| | Forecast-vs-actual accuracy view | — | ✓ | ✓ | ✓ |
| **Prescriptive AI** | Daily "Morning Brief" | — | Descriptive only | ✓ Prescriptive | ✓ Prescriptive |
| | Prescriptive recommendations (stock/staff/promote) | — | — | ✓ | ✓ |
| | ICP / vertical personalization | — | Basic | ✓ | ✓ Advanced |
| | Priority AI (higher-quality models/queue) | — | — | — | ✓ |
| **External signals** | Weather | — | — | ✓ | ✓ |
| | Holidays | — | Basic | ✓ | ✓ |
| | Local events (premium event data) | — | — | Add-on | ✓ |
| **Benchmarking** | Anonymized peer benchmarking | — | — | Teaser | ✓ |
| **Alerts** | In-app notifications | ✓ | ✓ | ✓ | ✓ |
| | Email alerts & digests (Resend) | Digest only | ✓ | ✓ | ✓ |
| | SMS alerts (Twilio) | — | — | ✓ (credit-metered) | ✓ (credit-metered) |
| | Custom thresholds / anomaly alerts | — | ✓ | ✓ | ✓ |
| **Users & roles** | Seats | 1 | 2 | 5 | 15 (+ add-on) |
| | RBAC (Owner / Manager / Staff) | — | ✓ | ✓ | ✓ |
| | Location-scoped access | — | — | — | ✓ |
| **Reports** | CSV / PDF export | — | ✓ | ✓ | ✓ |
| | Scheduled reports | — | — | ✓ | ✓ |
| **API** | REST API (read) + webhooks | — | — | — | ✓ |
| | API keys (create/rotate/revoke) | — | — | — | ✓ |
| **Support** | Support channel | Community / self-serve | Email | Priority email | Priority + onboarding assist |
| | SLA (first response) | Best-effort | 2 business days | 1 business day | Same business day |

---

## 3. Usage limits per tier

These are the cost-bearing dials. Limits are set generously relative to real per-tenant COGS (~$6–$30/tenant/mo — [Appendix C](appendix/C_Assumptions_and_Constants.md), [10](10_Hosting_and_Infrastructure_Costs.md)) so they rarely bind for a well-fit customer, yet protect margin against outliers.

| Limit | **Lite ($79–99)** | **Starter ($200)** | **Growth ($500)** | **Scale ($800)** |
|---|---|---|---|---|
| **Locations** | 1 | 1 | 1 | Up to 5 (+ add-on) |
| **Connectors** | 0 (CSV only) | 1 | Up to 3 | Up to 10 |
| **Data history retained** | 90 days | 13 months | 24 months | 36 months |
| **Forecast horizon** | 7 days | 7 days | 30 days | 30 days |
| **AI insights / day** (Morning Brief + recs) | — | 1 (descriptive) | Up to 10 | Up to 30 (priority queue) |
| **Users / seats** | 1 | 2 | 5 | 15 |
| **SMS credits / mo** | 0 | 0 | 100 | 400 |
| **API calls / mo** | — | — | — | 100,000 |
| **Scheduled reports** | — | — | Up to 5 | Up to 20 |
| **Support SLA** | Best-effort | 2 business days | 1 business day | Same business day |

*Numeric limits (AI insights/day, SMS credits, API calls, retention windows) are v1 defaults, tunable post-launch against observed COGS and usage; the value metric and gating boundaries are fixed.*

---

## 4. Add-ons & overages

Add-ons let a tenant extend a tier without forcing a full upgrade, and give us incremental revenue on the exact dials that carry cost. All are billed through the same Stripe subscription ([Functional Requirements M10](03_Functional_Requirements.md)).

| Add-on / overage | Applies to | Indicative price | Notes |
|---|---|---|---|
| **Extra location** | Scale | +$120 / location / mo | Beyond the included 5; each adds ingestion + compute COGS. |
| **Extra SMS pack** | Growth, Scale | $15 / 250 SMS | Consumed after monthly credit; exhausted credits fall back to email. |
| **Premium event-data add-on** | Growth | +$99 / mo | Unlocks premium local-events signal (PredictHQ-class) on Growth; included at Scale. Cost basis in [10](10_Hosting_and_Infrastructure_Costs.md). |
| **White-glove onboarding** | Any | $499 one-time | Hands-on setup by our team: connector wiring, data cleanup, KPI walkthrough. |
| **Extra seats** | Starter, Growth, Scale | $25 / seat / mo | Beyond the tier's included seats. |
| **Extended history / retention** | Growth, Scale | Quote | For tenants needing history beyond the tier cap; priced to storage COGS. |

---

## 5. Trials, upgrade/downgrade, proration & annual discount

- **Free trial.** **14-day free trial, no card required.** The trial runs on the **Growth** feature set so prospects experience prescriptive AI and external signals — the features that drive conversion. At trial end the tenant selects a paid tier (or lapses to a read-only/expired state).
- **Upgrades.** Take effect **immediately**, with **proration** — the tenant is charged only the prorated difference for the remainder of the billing period, and new features/limits unlock at once. Upgrading is the default recommended path whenever a tenant hits a wall.
- **Downgrades.** Take effect **at the end of the current billing period** (no mid-cycle refunds). Before a downgrade applies, the product checks current usage against the target tier's limits (locations, seats, connectors, history) and, if the downgrade would violate them, blocks it with clear guidance to resolve first.
- **Proration engine.** Handled by Stripe Billing; SAIL enforces the corresponding feature/limit state in real time on plan change ([Functional Requirements M10](03_Functional_Requirements.md)).
- **Annual billing.** Monthly ↔ annual toggle is self-service. **Annual = ~2 months free (~17% off)** per [Appendix C](appendix/C_Assumptions_and_Constants.md) — e.g., Growth annual ≈ **$5,000/yr** vs. $6,000 monthly. Annual is positioned as the reward for commitment and the primary lever on cash flow and churn.
- **Dunning & cancellation.** Failed payments trigger retries + notification and a grace period before feature restriction; cancellation is self-service and states the effective end date and data-retention consequences.

---

## 6. Rationale — who each tier serves, and why Growth is the anchor

| Tier | Primary persona | Job it does | Why priced here |
|---|---|---|---|
| **Lite ($79–99)** | Curious solo owner, extremely price-sensitive; single café/kiosk, no interest in wiring a POS yet | "Show me my numbers from a spreadsheet." Descriptive dashboard + limited forecast. | A low, almost impulse-level entry that widens the funnel and de-risks the $200 floor. Deliberately thin (CSV-only, 1 seat, no prescriptive AI) so it converts up rather than cannibalizes. |
| **Starter ($200)** | Established single-location owner ready to connect one POS | "Connect my POS, give me a real dashboard and a dependable next-week forecast." | The credible baseline for a serious single-site operator: real connector, RBAC, exports, confidence-banded forecasting — enough to run on, not enough to stop wanting the Brief. |
| **Growth ($500)** — **most popular** | Growing owner-operator who wants the product to *tell them what to do* | Full forecasting **with external signals** + **prescriptive AI Morning Brief** + multi-connector + SMS. The complete "SAIL as decision-maker" experience. | Priced as the **value anchor**: it holds the features prospects fall in love with in the trial, so it's the natural landing tier. |
| **Scale ($800)** | Multi-location operator / small chain / franchise GM | "Run several sites, benchmark against peers, plug SAIL into my own systems." Multi-location roll-ups, benchmarking, priority AI, advanced ICP, API. | Captures the higher willingness-to-pay of multi-site operators; the incremental $300 over Growth is trivially justified by one avoided stockout across several locations. |

**Why Growth is positioned as the most-popular anchor:**

- **It is the trial experience.** Because the 14-day trial runs on Growth features, every prospect's first taste of SAIL *is* Growth. Landing them on the tier they already experienced is the path of least resistance.
- **It holds the moment of value.** Prescriptive recommendations and external-signal forecasting — the "SAIL told me to prep for the heatwave and I sold out anyway" moment — live at Growth, not Starter. That is where perceived value crosses the $500 line.
- **Classic center-stage / decoy framing.** Starter ($200) makes Growth feel like a small step up for a large jump in capability; Scale ($800) makes Growth feel like the sensible, non-extravagant choice. The middle option is where a well-designed three-tier ladder concentrates demand — and Growth is engineered to be that middle.
- **Best margin-to-satisfaction balance.** At ~$6–$15/tenant COGS at scale ([Appendix C](appendix/C_Assumptions_and_Constants.md)), Growth's $500 price carries the strongest contribution while still feeling fair to the customer — the healthiest cell to concentrate the book of business in.
- **"Priority AI" and "advanced ICP"** (defined in [AI/ML Strategy](07_AI_ML_Strategy.md)) are intentionally reserved for Scale so that Growth remains the complete-but-not-maxed tier — leaving a clear, desirable upgrade for operators who grow into multi-location.

---

## Related documents

- [01 — Product Vision & Scope](01_Product_Vision_and_Scope.md)
- [03 — Functional Requirements](03_Functional_Requirements.md)
- [07 — AI / ML Strategy](07_AI_ML_Strategy.md)
- [09 — Security & Compliance](09_Security_and_Compliance.md)
- [10 — Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md)
- [Appendix A — KPI & Metrics Catalog](appendix/A_KPI_and_Metrics_Catalog.md)
- [Appendix C — Assumptions & Constants](appendix/C_Assumptions_and_Constants.md)
