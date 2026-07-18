# Risks, Assumptions & Dependencies

**Project:** SAIL · **Doc:** 13 · **Date:** 2026-07-18 · **Status:** Draft v1.0

This document records the venture risks we are managing on SAIL, the assumptions the plan rests on, the dependencies we rely on, and how contingency is built into the build. It complements the [Delivery Plan & Timeline](12_Delivery_Plan_and_Timeline.md), the budget in [Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md), and the economics in [Business Model & Unit Economics](15_Business_Model_and_Unit_Economics.md). Baseline numbers and assumptions are consolidated in [Appendix C](appendix/C_Assumptions_and_Constants.md).

---

## 1. Risk register

Likelihood and Impact are rated H/M/L. Owner is the accountable role (Founder, Developer, or Both).

| ID | Risk | Category | Likelihood | Impact | Mitigation | Owner |
|---|---|---|:--:|:--:|---|---|
| R01 | SMB willingness-to-pay below the $200 Starter floor | Commercial | M | H | Validate pricing with 5–10 target businesses early; optional Lite tier ($79–99) as an on-ramp; quantify ROI per tenant before scaling | Both |
| R02 | POS integration breakage / high connector maintenance burden | Technical | H | H | Connector feasibility in Phase 0; abstraction layer over POS APIs; contract tests + monitoring; connector upkeep sits inside our operating run-rate (_TBD_) | Developer |
| R03 | Data quality / sparsity from SMB sources | Data | H | M | Data profiling in Phase 0; validation & cleaning in ETL; graceful degradation; flag low-confidence outputs | Developer |
| R04 | Forecast accuracy weak / cold-start for new tenants | ML | M | H | Baseline + segment/cohort priors for cold-start; backtesting; confidence intervals surfaced to users; iterate in Phase 2 | Developer |
| R05 | LLM hallucination in prescriptive recommendations | ML / GenAI | M | H | Ground recommendations in tenant data; guardrails + validation; cite drivers; human-review framing; eval suite before release | Developer |
| R06 | Customer churn / low activation | Commercial | M | H | Fast time-to-value via MVP; onboarding flows; activation metrics; prescriptive nudges; continuous enhancement post-launch | Both |
| R07 | Funding / runway risk — can't fund the full build or the operating run-rate | Financial | M | H | MVP-first to reach revenue fast; in-house build lowers cash burn; keep the operating run-rate (_TBD_) lean; stage spend behind validation gates; line up funding before committing to Phases 2–3 | Both |
| R08 | Execution / bandwidth risk — small team overcommitted | Delivery | H | M | Tight, MVP-first scope; contractors for spikes (data eng / ML / QA); phase gates; WIP limits; ruthless prioritization | Both |
| R09 | Key-person dependency (esp. the sole technical lead) | Delivery | M | H | Documented architecture; clean, reviewed code; contractor overlap on critical components; avoid bus-factor-1 on core systems; cross-train where feasible | Both |
| R10 | Go-to-market / CAC risk — acquisition cost exceeds LTV or pipeline is slow | Commercial | M | H | Café/QSR beachhead + Square-first connector; referral loops; validate CAC in pilots; see [Business Model & Unit Economics](15_Business_Model_and_Unit_Economics.md) | Founder |
| R11 | Competitive response / analytics commoditization | External / Market | M | M | Prescriptive AI grounded in tenant data + ICP as the moat; speed to market; deep POS integrations; see [Market & Feasibility](02_Market_and_Feasibility.md) | Both |
| R12 | Security incident / data breach across tenant data | Security | L | H | Tenant isolation by design; least-privilege; encryption in transit/at rest; hardening & audit logging in Phase 3; secrets management | Developer |
| R13 | Third-party API price changes (POS, data signals, LLM) | External | M | M | Pluggable providers; monitor usage; COGS reflected in tier pricing; renegotiate/switch where feasible (see [Doc 10](10_Hosting_and_Infrastructure_Costs.md)) | Developer |
| R14 | TCPA / SMS consent & messaging compliance | Compliance | M | H | Consent capture & opt-out by design; quiet-hours + rate controls; documented audit trail; we own regulatory diligence before customer-facing messaging | Both |
| R15 | Model / data privacy leakage across tenants | Data / Privacy | L | H | Strict per-tenant isolation in data and model context; no cross-tenant training without consent; access controls; privacy review | Developer |

---

## 2. Assumptions

The plan and budget assume the following. Material deviation is re-planned at the next phase gate. The authoritative list is in [Appendix C](appendix/C_Assumptions_and_Constants.md).

- Development cost, effort, and timeline are decided by the founding team and recorded in [Appendix C](appendix/C_Assumptions_and_Constants.md) (treated as _TBD_ here); an in-house build is a lower cash outlay than an outsourced-equivalent.
- POS/API access via test/sandbox accounts is obtained by end of Phase 0; APIs are documented and reasonably stable.
- A committed set of **5–10 target/pilot businesses** is available for pricing validation and Phase 1 onboarding.
- We keep a fast internal feedback loop, and both of us are available to decide at each phase gate.
- Cloud/tooling infrastructure COGS are reflected in tier pricing ([Doc 10](10_Hosting_and_Infrastructure_Costs.md)); the operating labor run-rate is _TBD_.
- Scope per phase matches the [Delivery Plan](12_Delivery_Plan_and_Timeline.md); tier definitions (Starter $200 / Growth $500 / Scale $800; optional Lite $79–99) are stable.
- Regulatory/compliance diligence (TCPA, data privacy) is our responsibility; we build to those requirements.
- Indicative start is **early August 2026**; the delivery timeline runs from W0 (total duration _TBD_).

---

## 3. Dependencies

**Our own (founding team):**
- POS test/sandbox accounts, credentials, and any required data-sharing setup (Founder).
- Committed 5–10 target/pilot businesses and their cooperation for onboarding/feedback (Founder).
- Timely internal decisions and gate go/no-go from both of us.
- SMS/email sender accounts and consent processes; brand assets and content.
- Regulatory/legal diligence (TCPA, privacy) before customer-facing messaging goes live.
- Funding/runway to cover the build budget and the operating run-rate.

**Third-party:**
- POS platforms and their API availability, rate limits, and stability.
- External signal/data providers (feeds used for forecasting).
- LLM/GenAI provider and cloud infrastructure ([Doc 10](10_Hosting_and_Infrastructure_Costs.md)).
- SMS/email delivery providers.

---

## 4. Contingency & buffer approach

- **Ranges absorb estimation risk.** Each phase is estimated as a band; the high end covers normal discovery friction (extra connector variants, additional cleaning, an added feedback loop). The build budget is confirmed at the Phase 0 gate once unknowns are reduced.
- **Phase gates cap exposure.** A hard go/no-go after every phase means risk is contained to one phase at a time; we can pause or re-scope without stranding spend.
- **Schedule buffer.** Sprint planning holds a small buffer, and phase boundaries carry slack to absorb bandwidth crunches (R08) or connector surprises (R02) without cascading into later phases.
- **Runway buffer.** We keep a cash buffer for the operating run-rate and stage spend behind validation gates, so a funding gap (R07) doesn't strand the build.
- **Contingency handling.** Realized risks that push scope beyond the phase envelope are re-scoped and re-planned at the next gate; COGS movements (R13) are reflected in the run-rate and tier pricing.
- **Risk review.** The register is reviewed at each phase gate; likelihood/impact and owners are updated as we progress.

---

## Related documents

- [00 — Summary](00_Summary.md)
- [02 — Market & Feasibility](02_Market_and_Feasibility.md)
- [05 — System Architecture](05_System_Architecture.md)
- [10 — Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md)
- [11 — Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md)
- [12 — Delivery Plan & Timeline](12_Delivery_Plan_and_Timeline.md)
- [14 — Roadmap & Next Steps](14_Tender_Summary_and_Next_Steps.md)
- [15 — Business Model & Unit Economics](15_Business_Model_and_Unit_Economics.md)
- [Appendix C — Assumptions & Constants](appendix/C_Assumptions_and_Constants.md)
