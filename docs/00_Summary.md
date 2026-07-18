# 00 — Summary

**Project:** SAIL · **Doc:** 00 · **Date:** 2026-07-18 · **Status:** Business Plan Draft v1.0

---

## The opportunity

US small businesses — cafés, coffee shops, ice-cream shops, restaurants, hotels, motels — generate rich transaction data every day and use almost none of it. They over-prep and waste stock, or under-prep and lose sales; they get blindsided by holidays, weather, and local events they could have planned for. Off-the-shelf BI tools are too complex, and enterprise forecasting is out of reach.

**SAIL** closes that gap. A business signs up, connects its POS (or uploads a spreadsheet), and within minutes gets a clean KPI dashboard, **demand forecasts** for the days ahead, and **plain-English prescriptive advice** — what to stock, staff, and promote — that blends its own history with live external signals (weather, holidays, local events). Every morning, automated jobs refresh the picture and personalize it to that specific business (its ICP, seasonality, and location).

## What we're building

A **multi-tenant SaaS** delivered through a four-stage intelligence pipeline:

1. **Secure Data Ingestion** — one-click POS/e-commerce/accounting connectors (Square, Toast, Clover, Shopify, QuickBooks), CSV upload, and per-tenant isolated storage.
2. **Automated Transformation** — nightly pipelines clean, validate, and structure messy data into analysis-ready models.
3. **Predictive ML** — time-series + gradient-boosted forecasting with external regressors, plus per-tenant personalization and cold-start priors from similar businesses.
4. **Prescriptive Output** — dashboards, forecasts, and an AI that translates numbers into specific actions, delivered in-app and via email/SMS alerts.

We monetize via **three tiers — $200 / $500 / $800 per month** — with higher tiers unlocking more connectors, deeper AI, multi-location, benchmarking, and API access. (We recommend testing a **$79–99 "Lite"** entry tier to de-risk the high $200 floor — see [Market & Feasibility](02_Market_and_Feasibility.md).)

## Is it feasible?

**Technically: yes, comfortably** — every component uses proven, off-the-shelf technology; nothing here requires research-grade invention. **Commercially: viable with eyes open.** The two real risks are (1) **price sensitivity** — $200/mo is a meaningful floor for a solo café, so tier positioning and the Lite option matter, and (2) **integration/data-quality breadth** — POS coverage and messy SMB data must be handled gracefully. Both are managed, not blockers. Full analysis in [Market & Feasibility](02_Market_and_Feasibility.md).

## What it takes to build

> **Development cost, effort, and timeline are intentionally left as `_TBD_`** — to be finalized by the team. This plan fixes the *scope and sequence* of the build; only operating (infrastructure) costs are quantified.

| Phase | Scope | Duration | Build cost |
|-------|-------|----------|------------|
| **0** | Discovery & Design | `_TBD_` | `_TBD_` |
| **1** | MVP Foundation & First Insights | `_TBD_` | `_TBD_` |
| **2** | Intelligence & Multi-tier | `_TBD_` | `_TBD_` |
| **3** | Scale, MLOps & Hardening | `_TBD_` | `_TBD_` |

See [Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md) for the phase deliverables and build-path options (in-house vs. contractor).

## What it costs to *run*

| Scale | Monthly infra + tools | Per tenant |
|-------|----------------------|------------|
| MVP (10–50 tenants) | **$300 – $700** | ~$10–$30 |
| Scale (~500 tenants) | **$2,500 – $5,000** | **~$6 – $15** |

At $200–$800 pricing, that's a **~90%+ gross-margin** business. Blended ARPU ≈ $395; per-tenant contribution ≈ $371/mo. Full model in [Business Model & Unit Economics](15_Business_Model_and_Unit_Economics.md); every tool itemized in [Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md).

## Why this wins

- **A compounding data moat:** the more businesses join, the better cold-start forecasts and benchmarks become — hard for a copycat to replicate.
- **Prescriptive, not just descriptive:** competitors show charts; SAIL tells owners what to do.
- **Fast time-to-value:** connect a POS, get insight the same day — the difference between churn and retention for SMBs.

## Next steps

1. **Run Phase 0 (Discovery & Design)** to lock scope and validate pricing with 5–10 target businesses.
2. Confirm the launch connector set (recommend **Square first**) and the initial vertical to nail (recommend **cafés/QSR**, then expand to lodging).
3. Decide the build path (in-house vs. contractor) and set the budget and schedule, then start Phase 1.

See [Roadmap & Next Steps](14_Tender_Summary_and_Next_Steps.md) for the full sequence.
