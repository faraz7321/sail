# SAIL — Business Plan

**Version:** Draft v1.0 · **Date:** 2026-07-18 · **Status:** Confidential draft

A multi-tenant SaaS that lets US small businesses (cafés, hotels, ice-cream shops, motels, restaurants) connect their data and get **KPI dashboards**, **demand forecasts**, and **plain-English prescriptive recommendations** — blending their own history with external signals (weather, holidays, local events), refreshed by daily automated jobs, personalized per business. Monetized via three tiers **($200 / $500 / $800 per month)**.

> **📖 Read the plan in your browser:** open **[the SAIL viewer](https://faraz7321.github.io/sail/)** (hosted via GitHub Pages).
>
> **Note:** Development cost, effort, and timeline are intentionally left as `_TBD_` throughout — to be finalized by the team. Only operating (infrastructure) costs are quantified.

---

## Documents

| # | Document | What it answers |
|---|----------|-----------------|
| — | [Summary](docs/00_Executive_Summary.md) | The whole thing on one page. |
| 01 | [Product Vision & Scope](docs/01_Product_Vision_and_Scope.md) | The idea, who it's for, scope in/out. |
| 02 | [Market & Feasibility](docs/02_Market_and_Feasibility.md) | Market size, competitors, honest risks, pricing reality. |
| 03 | [Functional Requirements](docs/03_Functional_Requirements.md) | Every feature/module + user stories. |
| 04 | [Subscription Tiers & Feature Matrix](docs/04_Subscription_Tiers_and_Feature_Matrix.md) | What each of $200/$500/$800 unlocks. |
| 05 | [System Architecture](docs/05_System_Architecture.md) | End-to-end build (the 4-stage pipeline + diagrams). |
| 06 | [Data Strategy & ETL](docs/06_Data_Strategy_and_ETL.md) | How we get, clean, transform, store data. |
| 07 | [AI / ML Strategy](docs/07_AI_ML_Strategy.md) | Models, training, ICP personalization, MLOps. |
| 08 | [Technology Stack](docs/08_Technology_Stack.md) | Every tool/framework + why, with alternatives. |
| 09 | [Security & Compliance](docs/09_Security_and_Compliance.md) | Multi-tenant isolation, PII, SOC 2/PCI/GDPR-CCPA. |
| 10 | [Hosting & Infrastructure Costs](docs/10_Hosting_and_Infrastructure_Costs.md) | Itemized monthly cost of every tool & host. |
| 11 | [Build Cost & Capital Plan](docs/11_Build_Cost_and_Commercials.md) | Build scope & deliverables (cost `_TBD_`). |
| 12 | [Delivery Plan & Timeline](docs/12_Delivery_Plan_and_Timeline.md) | Phases, milestones, team (durations `_TBD_`). |
| 13 | [Risks, Assumptions & Dependencies](docs/13_Risks_Assumptions_Dependencies.md) | Risk register + mitigations. |
| 14 | [Roadmap & Next Steps](docs/14_Tender_Summary_and_Next_Steps.md) | Build path + immediate next moves. |
| 15 | [Business Model & Unit Economics](docs/15_Business_Model_and_Unit_Economics.md) | ARPU, margin, break-even, LTV/CAC, MRR/ARR. |

**Appendices:** [A — KPI Catalog](docs/appendix/A_KPI_and_Metrics_Catalog.md) · [B — Data Sources](docs/appendix/B_Data_Sources_and_Integrations.md) · [C — Assumptions & Constants](docs/appendix/C_Assumptions_and_Constants.md) *(single source of truth)* · [D — Glossary](docs/appendix/D_Glossary.md)

---

## Repo layout

```
index.html            → the viewer shell (open the hosted link)
assets/css/styles.css → styles
assets/js/app.js      → viewer logic + the document manifest
assets/js/*.min.js    → marked (Markdown) + mermaid (diagrams), vendored
docs/                 → all business-plan documents (Markdown)
docs/appendix/        → appendices A–D
CLAUDE.md             → guide + conventions for future edits
```

## Viewing & editing

- **Live:** <https://faraz7321.github.io/sail/> (public, but `noindex` — not listed by search engines; anyone with the link can view).
- **Locally:** the viewer fetches Markdown over HTTP, so don't open `index.html` from disk — run a server from this folder: `python3 -m http.server 8080`, then open <http://localhost:8080/>.
- **Edit a document:** edit the relevant file in `docs/` — the viewer loads it live, no build step.
- **Add / remove / reorder a document:** update the `DOCS` manifest in [assets/js/app.js](assets/js/app.js).

*All figures reconcile to [Appendix C](docs/appendix/C_Assumptions_and_Constants.md). See [CLAUDE.md](CLAUDE.md) for conventions.*
