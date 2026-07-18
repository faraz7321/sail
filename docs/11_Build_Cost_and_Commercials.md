# Build Cost & Capital Plan

**Project:** SAIL · **Doc:** 11 · **Date:** 2026-07-18 · **Status:** Draft v1.0

> Development cost, effort, and timeline are intentionally left as **_TBD_** — the founding team will finalize these. This document defines the *structure* of the build and what each phase delivers; only the operating (infrastructure) costs are quantified, in [Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md).

This document sets out how we — the founding team — will build and launch SAIL: the effort behind the platform, the two realistic paths to building it (outsourced vs. founder-led), the capital we need to reach break-even, and the operating run-rate afterwards. It is written for our own planning and is investor-readable. It reads alongside the [Delivery Plan & Timeline](12_Delivery_Plan_and_Timeline.md), the [Business Model & Unit Economics](15_Business_Model_and_Unit_Economics.md), and the running-cost detail in [Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md). All amounts are in **USD**; development cost, effort, and timeline are **_TBD_** pending founder decision, and the canonical operating figures live in [Appendix C](appendix/C_Assumptions_and_Constants.md).

---

## 1. How we cost the build

We cost SAIL **bottom-up by effort**, not by guesswork. Every workstream is estimated in **person-weeks (pw)** — one full-time engineer for one week — and the effort is the same regardless of who does the work.

To convert effort into money we apply a **blended benchmark rate of _TBD_ per person-week**. This rate is the **outsourced-equivalent cost**: what it would cost to hire a senior-led contractor team (nearshore/offshore engineers plus architect and part-time PM oversight) to build SAIL for us. The founders will finalize this rate; until then it stays **_TBD_**, and every dollar figure derived from it below is likewise **_TBD_**.

That benchmark serves two purposes:

- **If we outsource**, it is roughly the cash we would pay a contractor team (**_TBD_**).
- **If the developer builds it in-house** as technical co-founder, it is the **market value of the sweat equity** the team contributes (**_TBD_**) — the same asset created, but funded with time and equity rather than cash.

Either way, the effort is real. What changes between the two paths is not the value of the work but **how much of it we pay for in cash** (Section 4).

---

## 2. Effort breakdown (person-weeks per workstream per phase)

Effort is estimated per workstream and reconciles exactly to the phase envelopes (Phase 0 = _TBD_, Phase 1 = _TBD_, Phase 2 = _TBD_, Phase 3 = _TBD_; total = **_TBD_**).

| Workstream | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Total pw |
|---|---:|---:|---:|---:|---:|
| Discovery, UX & design | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| Foundation & multi-tenancy | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| Ingestion & connectors (POS/signals) | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| ETL & warehouse | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| ML & forecasting | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| GenAI & prescriptive | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| Dashboard UI & tiering | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| Notifications & reports | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| Security hardening | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| QA & testing | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| DevOps / CI-CD / MLOps | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| PM / delivery | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| **Total (pw)** | **_TBD_** | **_TBD_** | **_TBD_** | **_TBD_** | **_TBD_** |

Once the founders set the blended rate (_TBD_) and confirm total effort (_TBD_), this table reconciles to the full-platform build cost in Section 3 (_TBD_).

---

## 3. Phase cost & deliverables

Each phase is a self-contained slice of value with a known effort and outsourced-equivalent cost (both **_TBD_** pending founder decision).

| Phase | Scope headline | Effort | Duration | Build cost |
|---|---|---:|---:|---:|
| **Phase 0 — Discovery & Design** | Confirmed scope, architecture, and clickable prototype | _TBD_ | _TBD_ | _TBD_ |
| **Phase 1 — MVP Foundation & First Insights** | Multi-tenant MVP live with first dashboards & forecasting | _TBD_ | _TBD_ | _TBD_ |
| **Phase 2 — Intelligence & Multi-tier** | Prescriptive GenAI, better forecasting, full tiering | _TBD_ | _TBD_ | _TBD_ |
| **Phase 3 — Scale, MLOps & Hardening** | MLOps, scale, security & compliance hardening | _TBD_ | _TBD_ | _TBD_ |

**What each phase delivers:**

**Phase 0 — Discovery & Design**
- Confirmed scope, prioritized backlog, and success metrics
- Technical architecture and multi-tenant data model (see [System Architecture](05_System_Architecture.md))
- POS/connector feasibility assessment and integration shortlist
- UX wireframes and a clickable dashboard prototype
- Refined effort and cost for Phases 1–3

**Phase 1 — MVP Foundation & First Insights**
- Multi-tenant platform foundation (auth, tenant isolation, ICP personalization scaffolding)
- First POS + external-signal connectors, ETL pipeline, and warehouse
- Baseline forecasting (demand/sales) and the first live dashboards
- Daily cron ingestion + core notifications/reports
- **MVP live** for the pilot cohort (see [Delivery Plan](12_Delivery_Plan_and_Timeline.md))

**Phase 2 — Intelligence & Multi-tier**
- Prescriptive GenAI recommendations (per-tenant, ICP-aware)
- Improved forecasting accuracy and additional signal sources
- Full tiering enforcement (Starter / Growth / Scale; optional Lite) and entitlement gating
- Expanded dashboard depth and reporting

**Phase 3 — Scale, MLOps & Hardening**
- MLOps: automated retraining, model monitoring, drift detection
- Scale/performance work and infrastructure hardening
- Security hardening, audit logging, and compliance controls
- Load, resilience, and QA hardening for growth

### v1 vs. full platform

| Scope | Phases | Effort | Timeline | Build cost |
|---|---|---:|---:|---:|
| **v1 (our launch target)** | 0 → 2 | _TBD_ | _TBD_ | **_TBD_** |
| **Full platform** | 0 → 3 | _TBD_ | _TBD_ | **_TBD_** |

**Why v1 first.** Phases 0–2 deliver the complete commercial product — multi-tenant SaaS, live dashboards, forecasting, prescriptive AI, and full tiering — everything we need to onboard paying tenants and prove revenue. The MVP goes live first (timeline **_TBD_**), followed by the full v1 product (timeline **_TBD_**). Phase 3 (scale, MLOps, hardening) is deferred until real usage and tenant growth justify it; it turns a proven product into a hardened, self-improving platform and can be funded largely out of revenue by then.

---

## 4. Two build paths compared

We can create the same asset two ways. The difference is cash out vs. sweat equity.

| Dimension | (a) Outsourced / contractor build | (b) Founder-led in-house build |
|---|---|---|
| **Who builds** | Contractor team at a blended benchmark rate (_TBD_) | Developer-led (in-house), + selective contractor help on spikes |
| **v1 cash cost (Phases 0–2)** | **_TBD_** paid out | **_TBD_** (tools/infra + a little contract help) |
| **Full platform cash cost (0–3)** | **_TBD_** paid out | **_TBD_** cash; remainder is founder time |
| **Sweat-equity contribution** | None (all cash) | **_TBD_** in market-value effort, not cash |
| **Speed** | Faster raw throughput (more hands) | Constrained by founder bandwidth; contractors added to unblock |
| **Control & IP knowledge** | Coordination overhead; knowledge sits partly with contractors | Deep in-house ownership of the codebase and architecture |
| **Cash risk** | High up-front cash outlay before revenue | Low cash outlay; primary cost is time and opportunity |
| **Best when** | Capital is available and speed-to-market is paramount | Capital is scarce and the founding team can carry the build |

**Our plan.** We build **in-house (path b)**: the developer leads engineering; we buy only tools, infrastructure, and targeted contractor help for spikes. This keeps cash burn minimal while still creating an asset with a market value of **_TBD_** at v1. The outsourced figure remains our benchmark — it is what the same build is worth (**_TBD_**) if we ever needed to replace founder time with cash.

---

## 5. Capital required to launch

Capital-to-launch = the cash to build (or to buy the infra/help around a founder-led build) **plus** enough operating runway to reach break-even (~22–23 paying tenants — see [Business Model & Unit Economics](15_Business_Model_and_Unit_Economics.md)) **plus** a contingency buffer. The two paths are dramatically different in cash; all build and labor amounts below are **_TBD_** pending founder decision.

| Component | (a) Outsourced build | (b) Founder-led in-house build |
|---|---:|---:|
| Build spend (v1, Phases 0–2) | _TBD_ | _TBD_ |
| Operating runway to break-even (labor run-rate _TBD_/mo + infra) | _TBD_ | _TBD_¹ |
| Contingency buffer | _TBD_ | _TBD_ |
| **Total cash required to launch** | **_TBD_** | **_TBD_** |
| *Memo: sweat-equity contributed (non-cash)* | *—* | *_TBD_* |

¹ In the founder-led path the engineering/MLOps run-rate (_TBD_/mo) is largely the team's own effort (sweat equity), so pre-revenue **cash** operating cost is mostly infrastructure COGS (MVP ~$300–700/mo) plus a little tooling.

**Takeaway.** The founder-led path needs **_TBD_** of cash to build and carry SAIL to break-even, versus **_TBD_** if we outsourced and paid ourselves salaries. That cash figure (_TBD_) is the real capital ask to reach a self-sustaining product; everything above it is optional acceleration (faster hiring, front-loaded go-to-market) rather than a requirement to launch.

---

## 6. Post-launch operating run-rate

After launch, SAIL's ongoing effort — engineering iteration, MLOps (retraining, monitoring, drift), connector upkeep, and infrastructure maintenance — carries a labor run-rate of **_TBD_/month**. In the founder-led model this is predominantly our own time; as we grow past a couple of hundred tenants it converts into real payroll as we hire (see [Business Model & Unit Economics §7](15_Business_Model_and_Unit_Economics.md)).

On top of the operating labor run-rate sits **infrastructure & tooling COGS**, which scales with tenants:

- **MVP (10–50 tenants):** ~$300–$700/mo
- **Scale (~500 tenants):** ~$2,500–$5,000/mo
- **Per-tenant at scale:** ~$6–$15, at **~90%+ infra gross margin**

Full line-item detail — every host, tool, and data feed — is in [Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md).

---

## 7. Key assumptions

All figures rest on the assumptions and constants recorded in [Appendix C](appendix/C_Assumptions_and_Constants.md), including:

- The **blended benchmark rate** used to value effort (outsourced-equivalent) — **_TBD_**, to be set by the founders.
- Bottom-up **effort estimates** per phase and workstream — total **_TBD_** pw.
- **Founder bandwidth** sufficient to lead the in-house build, with contractor help available for spikes.
- Break-even at **~22–23 paying tenants** against a labor run-rate of **_TBD_/mo** plus infra.
- Third-party tool/infra prices as of **2026-07**; they move independently of us.

Material changes to these assumptions move the build cost and the capital plan together.

---

## Related documents

- [10 — Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md) — operating COGS in detail
- [12 — Delivery Plan & Timeline](12_Delivery_Plan_and_Timeline.md) — how and when we build it
- [15 — Business Model & Unit Economics](15_Business_Model_and_Unit_Economics.md) — pricing, ARPU, break-even, LTV/CAC
- [Appendix C — Assumptions & Constants](appendix/C_Assumptions_and_Constants.md) — canonical numbers (source of truth)
