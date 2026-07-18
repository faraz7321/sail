# 03 — Functional Requirements

**Project:** SAIL · **Doc:** 03 · **Date:** 2026-07-18 · **Status:** Draft v1.0

---

This document specifies **what SAIL must do**, organized as functional modules. Each module lists a short description, representative user stories, and testable acceptance criteria. Roles referenced: **Owner** (the SMB account owner/admin), **Manager** (a delegated location manager), **Staff** (read-limited operational user), and **Platform Admin** (our own back-office team — see Module 13). Tier gating referenced here (Lite / Starter / Growth / Scale) is defined in full in [Subscription Tiers & Feature Matrix](04_Subscription_Tiers_and_Feature_Matrix.md); the KPIs and forecast targets are catalogued in [Appendix A — KPI & Metrics Catalog](appendix/A_KPI_and_Metrics_Catalog.md). All figures and tier prices originate in [Appendix C](appendix/C_Assumptions_and_Constants.md).

---

## Module 1 — Sign-up, Onboarding & Data-Connector Setup

**Description.** The first-run experience that takes a business owner from landing page to first insight in a single session. Covers account creation, tenant provisioning, plan/trial selection, guided data-source connection (OAuth connector or CSV), and the "activation" moment where the first dashboard and baseline forecast render.

**User stories.**
- As an **Owner**, I want to sign up and start a 14-day free trial without entering card details up front, so that I can evaluate SAIL with zero commitment.
- As an **Owner**, I want a guided wizard that connects my POS in a few clicks, so that I don't need technical help to get started.
- As an **Owner** whose POS isn't supported yet, I want to upload a CSV/Excel export and have it mapped automatically, so that I can still get value on day one.
- As an **Owner**, I want to see a meaningful dashboard and forecast the same day I connect, so that I trust the product is worth paying for.

**Acceptance criteria.**
- Email + password and at least one social/OAuth sign-in are supported; email verification is required before first insight is delivered.
- A new tenant is provisioned with isolated storage on sign-up (tenant isolation model per [System Architecture](05_System_Architecture.md)).
- The onboarding wizard has explicit, resumable steps: **business profile → connect data → confirm timezone/currency → first insight**, with a visible progress indicator and the ability to exit and resume without data loss.
- Business profile capture includes vertical (café / coffee shop / restaurant / ice-cream / hotel / motel / retail-service), location(s), timezone, and operating hours — used to seed ICP personalization and cold-start priors ([AI/ML Strategy](07_AI_ML_Strategy.md)).
- At least one connector (**Square** at launch) completes an OAuth flow and triggers an initial historical backfill; the user sees a live progress state, not a blank screen.
- CSV upload accepts common POS export formats, auto-detects delimiter/encoding, presents a **column-mapping preview**, and validates required fields (date, item, quantity, amount) before ingest.
- "Time to first insight" for a Square connection with ≥90 days of history is **under 10 minutes** end-to-end in the happy path.
- The trial is provisioned on the **Growth** feature set by default so the prospect experiences the full value; downgrade to the selected paid tier happens at conversion (see Module 10).

---

## Module 2 — Data Source Management & Health

**Description.** The ongoing control surface for every connected data source: connection status, last-sync time, sync history, error surfacing, token re-authorization, backfill/refresh triggers, and disconnection. This module is what keeps insights trustworthy after onboarding.

**User stories.**
- As an **Owner**, I want to see at a glance whether each connection is healthy and when it last synced, so that I know my insights are current.
- As an **Owner**, I want to be told immediately and told *how to fix it* when a connector's authorization expires, so that I don't silently lose data.
- As a **Manager**, I want to trigger a manual re-sync after a busy day, so that the next Morning Brief reflects the latest numbers.
- As an **Owner**, I want to add, replace, or remove a data source without losing my historical data, so that switching POS providers isn't destructive.

**Acceptance criteria.**
- Each source shows a status of **Healthy / Syncing / Needs re-auth / Error / Disconnected**, with last successful sync timestamp and next scheduled sync.
- Automated daily sync runs on the platform cron; a manual **"Sync now"** control is available and rate-limited to prevent abuse.
- Expired/revoked OAuth tokens produce a **"Reconnect"** call-to-action in-app plus an email alert (Module 6); reconnection restores syncing without re-doing the full backfill.
- Sync errors are human-readable (e.g., "Square returned a rate limit — we'll retry automatically at 02:00") and never expose raw stack traces to the tenant.
- Removing a source is confirmable and reversible for a grace period; historical data already ingested is retained per the tier's retention limit ([04](04_Subscription_Tiers_and_Feature_Matrix.md)).
- Connector count is enforced against the tier limit; attempting to exceed it prompts an upgrade path rather than a hard failure.
- A per-source **data-freshness badge** propagates to the dashboard so users can tell when a KPI is based on stale data.

---

## Module 3 — KPI Dashboard

**Description.** The default landing surface after login: a clean, at-a-glance view of the business's key performance indicators with period comparisons, trends, and drill-down. The catalogue of available KPIs and their formulas is maintained in [Appendix A — KPI & Metrics Catalog](appendix/A_KPI_and_Metrics_Catalog.md).

**User stories.**
- As an **Owner**, I want to see revenue, transactions, and average ticket for today vs. comparable periods, so that I know how the business is doing without doing math.
- As a **Manager**, I want to filter the dashboard by location and date range, so that I can analyze the site I run.
- As an **Owner**, I want each KPI to show its trend and its change vs. last period, so that I can spot problems early.
- As an **Owner**, I want the dashboard to load fast even on my phone behind the counter, so that I actually use it.

**Acceptance criteria.**
- Core KPIs render for every tier: total revenue, transaction count, average ticket/basket, top items, day-part/hourly distribution, and week-over-week / year-over-year change (subject to available history).
- Every KPI supports a **date-range selector** (today, 7d, 30d, custom) and a comparison period, with clear "insufficient history" states.
- KPIs link back to their definition in [Appendix A](appendix/A_KPI_and_Metrics_Catalog.md) via an info affordance, so numbers are never ambiguous.
- Multi-location tenants (Scale) can view **per-location** and **rolled-up all-locations** dashboards and switch between them.
- The dashboard is fully responsive (mobile, tablet, desktop) and meets the performance target in the NFR section (**p95 < 2s** on cached data).
- Data-freshness indicator from Module 2 is visible; a stale-data banner appears if the last sync is older than the expected daily window.
- Empty/first-run states guide the user toward connecting more data rather than showing blank charts.

---

## Module 4 — Demand Forecasting Views

**Description.** Forward-looking projections of demand at product, category, and day/day-part granularity, with a selectable horizon and confidence bands. Baseline forecasting is available from Starter; full multi-factor forecasting with external regressors is a Growth+ capability. Modeling approach (Prophet + LightGBM/XGBoost, cold-start priors) is detailed in [AI/ML Strategy](07_AI_ML_Strategy.md).

**User stories.**
- As an **Owner**, I want a forecast of tomorrow's and next week's demand, so that I can prep and staff correctly.
- As a **Manager**, I want to see the forecast for a specific product or category, so that I can order the right quantities.
- As an **Owner**, I want to see a confidence range, not just a single number, so that I understand how much to trust it.
- As an **Owner**, I want to know *why* the forecast is high or low (e.g., "heatwave + local event"), so that the number is actionable.

**Acceptance criteria.**
- Forecast views support granularity by **product, category, and day / day-part**, and a **horizon selector** (baseline: next-day and 7-day; Growth+: up to 30-day, subject to data sufficiency).
- Each forecast displays a **point estimate plus confidence interval** (e.g., P10–P90 band) and a plain-language reliability indicator.
- Growth+ forecasts incorporate **external signals** (weather, holidays, local events) as regressors and surface the top contributing drivers for each forecast period.
- Forecasts degrade gracefully for low-history/cold-start tenants using pooled/benchmark priors, with an explicit "early estimate — improves with more data" label.
- Historical **forecast-vs-actual accuracy** is viewable so users (and we) can see the model earning trust over time; accuracy metrics reconcile with [Appendix A](appendix/A_KPI_and_Metrics_Catalog.md).
- Forecasts refresh automatically via the daily cron and expose a "last computed" timestamp.
- Tier gating is enforced: Starter shows baseline forecast only; external-signal-driven forecasting is blocked below Growth with an upgrade prompt.

---

## Module 5 — Prescriptive Recommendations & the Daily "Morning Brief"

**Description.** SAIL's differentiator: it turns numbers into **specific actions**. Every morning, an automated job composes a per-tenant "Morning Brief" — a short, plain-English digest of what happened, what's coming, and what to do about it (stock, staff, promote). Recommendations are generated by an LLM grounded strictly on the tenant's computed metrics and forecasts ([AI/ML Strategy](07_AI_ML_Strategy.md)). Prescriptive AI is a Growth+ capability.

**User stories.**
- As an **Owner**, I want a short daily brief that tells me exactly what to stock and staff today, so that I make better decisions in two minutes over coffee.
- As an **Owner**, I want recommendations tied to a reason and an expected impact, so that I can decide whether to act.
- As a **Manager**, I want to mark a recommendation as done or dismissed, so that the brief stays relevant and I can track follow-through.
- As an **Owner**, I want the brief to sound like it knows my business (my vertical, my seasonality), so that I trust the advice.

**Acceptance criteria.**
- A **Morning Brief** is generated per tenant on the daily cron and available in-app; delivery via email/SMS is handled by Module 6 per user preference.
- Each recommendation includes: **the action, the rationale (grounded in specific metrics/forecast drivers), and an expected impact or confidence** — no ungrounded claims.
- Recommendations are **actionable and specific** (e.g., "Prep ~20% more cold brew Thu–Sat; forecast +18% on a heatwave and the downtown fair") rather than generic advice.
- Users can mark recommendations **Done / Dismissed / Snooze**, and the state persists and informs future briefs.
- Personalization uses the tenant's ICP/vertical profile from Module 1 to tune tone and priorities ("advanced ICP personalization" defined in [07](07_AI_ML_Strategy.md), deepest at Scale).
- All LLM output is grounded on computed values; the system must not surface a metric or number that isn't derived from the tenant's own data or benchmarks. A guardrail/validation step rejects hallucinated figures.
- Below Growth, the brief is limited to a descriptive summary (no prescriptive AI) with an upgrade prompt; daily AI-insight volume is capped per tier (see limits table in [04](04_Subscription_Tiers_and_Feature_Matrix.md)).

---

## Module 6 — Alerts & Notifications

**Description.** The proactive delivery layer across **in-app, email (Resend), and SMS (Twilio)**. Covers the Morning Brief delivery, threshold/anomaly alerts, connector-health alerts, and billing/account notices — all governed by per-user preferences and quiet hours.

**User stories.**
- As an **Owner**, I want to receive my Morning Brief by email every day, so that I see it without logging in.
- As an **Owner**, I want an SMS only for urgent things (a big forecast spike, a broken connector), so that I'm not spammed.
- As a **Manager**, I want to set thresholds (e.g., "alert me if daily revenue is 20% below forecast"), so that I catch problems the same day.
- As an **Owner**, I want to control which channels and what times notifications use, so that I stay in control.

**Acceptance criteria.**
- Three channels are supported: **in-app notification center, email, and SMS**; each notification type can be independently enabled per channel per user.
- Notification types include: Morning Brief, anomaly/threshold alert, forecast spike/drop alert, connector-health alert, and account/billing notices.
- **Quiet hours** and timezone-aware scheduling are respected; SMS is never sent outside a configurable window.
- SMS consumption is metered against the tier's **SMS credit** allowance ([04](04_Subscription_Tiers_and_Feature_Matrix.md)); exhausted credits fall back to email with a notice, and overage packs are purchasable (Module 10 / Add-ons).
- Every outbound email/SMS is logged with delivery status; failures are retried and surfaced in an audit view.
- All email includes unsubscribe/preference management; SMS honors STOP/HELP keywords for compliance.
- Threshold alerts are user-configurable per KPI where the tier permits, and evaluated on each data refresh.

---

## Module 7 — Peer Benchmarking

**Description.** Anonymized, aggregated comparison of a tenant's performance against similar businesses (same vertical, comparable size/region cohort). Benchmarking is a **Scale-tier** capability and a core part of the data moat. Privacy-preserving aggregation is mandatory.

**User stories.**
- As an **Owner** (Scale), I want to see how my average ticket and growth compare to similar cafés in my region, so that I know if I'm leading or lagging.
- As an **Owner**, I want benchmarks to be anonymous and never reveal another business, so that I trust the data is safe and fair.
- As a **Manager**, I want to benchmark a specific KPI over time against the cohort, so that I can set realistic targets.

**Acceptance criteria.**
- Benchmarks are computed against a **cohort of similar tenants** (vertical + size/region band) and shown as percentile/range positions, never as another named business.
- A **minimum cohort size (k-anonymity threshold)** must be met before any benchmark is displayed; below threshold, the feature shows "not enough peers yet."
- Only aggregated, anonymized statistics leave a tenant's boundary — no raw cross-tenant data is ever exposed (see [Security & Compliance](09_Security_and_Compliance.md)).
- Benchmarkable KPIs are a defined subset of [Appendix A](appendix/A_KPI_and_Metrics_Catalog.md); each shows the tenant's value vs. cohort median and percentile.
- Benchmarking is gated to **Scale**; lower tiers see a teaser/upgrade prompt.
- Tenants can opt out of contributing to benchmarks; opting out disables their access to peer benchmarks (contribution is reciprocal).

---

## Module 8 — Reports & Exports

**Description.** On-demand and scheduled generation of shareable reports (PDF) and raw data extracts (CSV), covering dashboards, forecasts, and the Morning Brief history. Enables owners to share with partners, accountants, or franchise HQ.

**User stories.**
- As an **Owner**, I want to export my KPIs and forecasts to CSV, so that I can use them in my own spreadsheet or share with my accountant.
- As an **Owner**, I want a clean monthly PDF summary emailed to me automatically, so that I have a record without lifting a finger.
- As a **Manager**, I want to generate a report for a custom date range and location, so that I can review a specific period.

**Acceptance criteria.**
- Users can export the current dashboard/forecast view to **CSV** (raw values) and **PDF** (formatted, branded) for a selected date range and location.
- **Scheduled reports** can be configured (e.g., weekly/monthly) and delivered by email via Resend on the cron.
- PDF reports are legible, paginated, and include the period, location, data-freshness stamp, and KPI definitions reference.
- CSV exports use stable column headers and ISO-8601 dates for downstream compatibility.
- Export/report availability and frequency respect tier gating (e.g., scheduled reports and higher-frequency exports on higher tiers per [04](04_Subscription_Tiers_and_Feature_Matrix.md)).
- Large exports generate asynchronously with a "your export is ready" notification rather than blocking the UI.

---

## Module 9 — Account, Users & Roles (RBAC)

**Description.** Management of the tenant account, team members, and role-based access control. Seat counts and role availability are tier-dependent. Multi-location tenants can scope a user to specific locations.

**User stories.**
- As an **Owner**, I want to invite my manager and give them access to only their location, so that they see what's relevant and nothing more.
- As an **Owner**, I want to control who can change billing vs. who can only view dashboards, so that sensitive actions are protected.
- As a **Manager**, I want to manage my own profile and notification preferences, so that I control my experience without bothering the owner.

**Acceptance criteria.**
- Roles are supported with distinct permission sets: **Owner/Admin** (full, incl. billing), **Manager** (operational + location-scoped analytics), **Staff/Viewer** (read-limited).
- Users are invited by email with a secure, expiring invitation link; invitees set their own credentials.
- **Location scoping** restricts a Manager/Staff user to assigned location(s) for multi-location tenants.
- Billing and plan changes are restricted to Owner/Admin; connector management is Admin/Manager per configuration.
- **Seat count** is enforced against the tier limit; exceeding it prompts an upgrade or add-on seat purchase (Module 10 / Add-ons).
- All privileged actions (role change, connector removal, billing change, data export) are recorded in an audit log (see [Security & Compliance](09_Security_and_Compliance.md)).
- A user can belong to exactly one tenant boundary; cross-tenant access is impossible by design (RLS-enforced — [05](05_System_Architecture.md)).

---

## Module 10 — Billing & Subscription Management

**Description.** Self-service subscription lifecycle powered by **Stripe Billing**: trial, plan selection, upgrade/downgrade with proration, monthly/annual toggle, payment method management, invoices, dunning, and cancellation. No card data touches SAIL (PCI SAQ-A — [Appendix C](appendix/C_Assumptions_and_Constants.md), [09](09_Security_and_Compliance.md)).

**User stories.**
- As an **Owner**, I want to start on a 14-day trial and add my card only when I decide to keep it, so that trying SAIL is risk-free.
- As an **Owner**, I want to upgrade from Starter to Growth and be charged only the fair prorated difference, so that upgrading feels safe.
- As an **Owner**, I want to switch to annual billing to save ~two months, so that I'm rewarded for committing.
- As an **Owner**, I want to see my invoices and update my card myself, so that I never have to email support for billing.

**Acceptance criteria.**
- **14-day free trial** with no card required; a clear countdown and pre-expiry reminders (Module 6) drive conversion.
- All plan tiers (Lite / Starter / Growth / Scale) and **monthly ↔ annual** toggling are selectable self-service; annual applies the **~2-months-free (~17%)** discount from [Appendix C](appendix/C_Assumptions_and_Constants.md).
- **Upgrades** take effect immediately with **proration**; **downgrades** take effect at the next billing period (with clear messaging on features/limits that will be lost).
- Feature and usage limits (Modules 2–8) are enforced in real time against the active subscription; a downgrade that violates current usage (e.g., too many locations/seats/connectors) is blocked or guided to resolution before it applies.
- Payment method management, invoice history/download, and receipts are self-service via the Stripe customer portal or an embedded equivalent.
- **Dunning**: failed payments trigger retry + notification; grace period before feature restriction; cancellation is self-service and confirms the effective end date and data-retention consequences.
- Overage/add-on purchases (extra SMS, extra location, extra seats — see [04](04_Subscription_Tiers_and_Feature_Matrix.md)) are billed through the same Stripe subscription.
- No PAN/card data is stored by SAIL; all sensitive payment operations are delegated to Stripe.

---

## Module 11 — Public API & Webhooks (Scale tier)

**Description.** Programmatic access to a tenant's own KPIs, forecasts, and recommendations, plus outbound webhooks for key events. This is a **Scale-tier** capability for tenants that want to embed SAIL data in their own tools. Design detailed in [System Architecture](05_System_Architecture.md).

**User stories.**
- As an **Owner** (Scale), I want an API key to pull my forecasts into my own systems, so that SAIL fits my existing workflow.
- As a **developer** acting for a Scale tenant, I want webhooks for events like "new Morning Brief" or "anomaly detected," so that I can react in real time.
- As an **Owner**, I want to rotate or revoke API keys, so that I stay in control of access.

**Acceptance criteria.**
- A documented **REST API** exposes read access to the tenant's KPIs, forecasts, and recommendations, scoped strictly to that tenant (no cross-tenant access).
- **API keys** are self-service: create, name, rotate, and revoke; keys are shown once and stored hashed.
- **Webhooks** can be configured for defined events (e.g., morning_brief.created, anomaly.detected, connector.needs_reauth) with signed payloads and delivery retries.
- API access is **metered and rate-limited** against the tier's API-call allowance ([04](04_Subscription_Tiers_and_Feature_Matrix.md)); limits and 429 handling are documented.
- API is gated to **Scale**; keys cannot be created on lower tiers.
- Interactive API documentation (OpenAPI) is published for Scale tenants.

---

## Module 12 — Help, Support & In-App Guidance

**Description.** The support surface embedded in the product: contextual tips, onboarding checklists, a help center/knowledge base, and a support-request path. SLA for support responses is tier-dependent.

**User stories.**
- As an **Owner**, I want contextual help right where I'm stuck, so that I don't have to leave the app to figure things out.
- As an **Owner**, I want to reach support and know when I'll hear back, so that I'm not left guessing.
- As a new user, I want a checklist showing what to do next, so that I get full value quickly.

**Acceptance criteria.**
- An **onboarding checklist** tracks setup completion (connect data, set preferences, invite team) and links each step to its action.
- **Contextual help** (tooltips, "what is this?" affordances) is available on KPIs and forecasts, linking to [Appendix A](appendix/A_KPI_and_Metrics_Catalog.md) definitions where relevant.
- A **searchable help center / knowledge base** is accessible in-app.
- A **support-request path** (in-app form/chat and/or email) captures tenant/context automatically; response SLA is surfaced and matches the tier ([04](04_Subscription_Tiers_and_Feature_Matrix.md): e.g., email/community for lower tiers, priority for Scale).
- Product analytics (PostHog) instrument onboarding and feature adoption to inform guidance improvements, respecting privacy ([09](09_Security_and_Compliance.md)).

---

## Module 13 — Admin / Back-Office (Platform Admin)

**Description.** The internal console for **our own team** to operate the SaaS: tenant management, subscription oversight, secure impersonation for support, feature flags, and platform health. Not visible to end-customer tenants.

**User stories.**
- As a **Platform Admin**, I want to view and manage all tenants and their subscription status, so that I can operate the business.
- As a **Platform Admin**, I want to securely impersonate a tenant (read-only by default) to diagnose an issue, so that I can support customers effectively without compromising trust.
- As a **Platform Admin**, I want feature flags to roll out or gate capabilities per tenant/tier, so that we can release safely and run pilots.
- As a **Platform Admin**, I want to see connector-health and job-run status across all tenants, so that I can catch platform-wide problems early.

**Acceptance criteria.**
- A **tenant directory** lists all tenants with plan, status, usage against limits, connector health, and last activity; supports search and filter.
- **Secure impersonation** is available to authorized admins only, defaults to read-only, requires a reason, is **fully audit-logged**, and shows a clear "impersonating" banner throughout the session.
- **Feature flags** can enable/disable capabilities globally, per tier, or per tenant, enabling staged rollout and pilots.
- Admins can view **cron/job-run status** (sync jobs, forecast jobs, Morning Brief generation) with success/failure and re-run controls.
- Admin actions (impersonation, flag changes, manual plan/limit overrides, data operations) are recorded in an immutable audit log ([09](09_Security_and_Compliance.md)).
- Admin access uses a separate elevated role, protected by MFA, and is entirely inaccessible from any tenant-facing surface.
- Admins can view (not export in bulk without safeguards) aggregate platform metrics: active tenants, MRR by tier, churn signals, job failure rates.

---

## Consolidated Functional Requirements

Priority uses **MoSCoW** (Must / Should / Could / Won't-for-v1). "Min. Tier" is the lowest subscription tier at which the requirement is available to the end customer (Admin/back-office items apply to our own team and are marked **n/a**). Tier definitions: [Subscription Tiers & Feature Matrix](04_Subscription_Tiers_and_Feature_Matrix.md).

| FR-ID | Requirement | Module | Priority | Min. Tier |
|-------|-------------|--------|----------|-----------|
| FR-01 | Self-service sign-up with email + OAuth and email verification | M1 | Must | Lite |
| FR-02 | Card-free 14-day trial provisioned on full (Growth) feature set | M1 | Must | Lite |
| FR-03 | Guided, resumable onboarding wizard with progress indicator | M1 | Must | Lite |
| FR-04 | OAuth POS connector (Square at launch) with historical backfill | M1/M2 | Must | Starter |
| FR-05 | CSV/Excel upload with auto column mapping and validation | M1/M2 | Must | Lite |
| FR-06 | Data-source health dashboard (status, last sync, next sync) | M2 | Must | Starter |
| FR-07 | Token re-auth / reconnect flow with alert on expiry | M2 | Must | Starter |
| FR-08 | Manual "Sync now" (rate-limited) + automated daily sync | M2 | Must | Starter |
| FR-09 | Enforce connector-count limit per tier with upgrade prompt | M2/M10 | Must | Starter |
| FR-10 | Core KPI dashboard with period comparison and trends | M3 | Must | Lite |
| FR-11 | Date-range + comparison selector with insufficient-history states | M3 | Must | Lite |
| FR-12 | KPI definitions linked to Appendix A catalog | M3 | Should | Lite |
| FR-13 | Per-location and rolled-up dashboards | M3 | Must | Scale |
| FR-14 | Baseline demand forecast (next-day, 7-day) with confidence band | M4 | Must | Starter |
| FR-15 | Full forecasting with external-signal regressors + drivers | M4 | Must | Growth |
| FR-16 | Selectable forecast horizon (up to 30-day) | M4 | Should | Growth |
| FR-17 | Forecast-vs-actual accuracy view | M4 | Should | Starter |
| FR-18 | Cold-start forecasting via pooled/benchmark priors | M4 | Should | Starter |
| FR-19 | Prescriptive recommendations grounded on tenant metrics | M5 | Must | Growth |
| FR-20 | Automated daily "Morning Brief" per tenant | M5 | Must | Growth |
| FR-21 | Recommendation state: Done / Dismissed / Snooze | M5 | Should | Growth |
| FR-22 | ICP/vertical personalization of insights | M5 | Should | Growth |
| FR-23 | Advanced ICP personalization (priority AI) | M5 | Could | Scale |
| FR-24 | Guardrail rejecting ungrounded/hallucinated figures | M5 | Must | Growth |
| FR-25 | In-app notification center | M6 | Must | Lite |
| FR-26 | Email notifications (Resend) incl. Morning Brief delivery | M6 | Must | Starter |
| FR-27 | SMS notifications (Twilio) metered by credit allowance | M6 | Should | Growth |
| FR-28 | User-configurable channels, quiet hours, thresholds | M6 | Should | Starter |
| FR-29 | SMS STOP/HELP + email unsubscribe compliance | M6 | Must | Growth |
| FR-30 | Peer benchmarking vs. anonymized cohort (k-anonymity) | M7 | Should | Scale |
| FR-31 | Benchmark opt-out (reciprocal) | M7 | Should | Scale |
| FR-32 | CSV + PDF export of dashboards/forecasts | M8 | Must | Starter |
| FR-33 | Scheduled reports delivered by email | M8 | Should | Growth |
| FR-34 | Async generation for large exports with notify-on-ready | M8 | Could | Starter |
| FR-35 | RBAC roles: Owner/Admin, Manager, Staff/Viewer | M9 | Must | Starter |
| FR-36 | Location-scoped user access | M9 | Should | Scale |
| FR-37 | Seat-count enforcement per tier + add-on seats | M9/M10 | Must | Starter |
| FR-38 | Tenant audit log of privileged actions | M9/M13 | Must | Starter |
| FR-39 | Stripe subscription lifecycle (trial, plan select, portal) | M10 | Must | Lite |
| FR-40 | Upgrade with proration; downgrade at period end | M10 | Must | Starter |
| FR-41 | Monthly/annual toggle with ~17% annual discount | M10 | Must | Lite |
| FR-42 | Real-time feature/usage-limit enforcement per subscription | M10 | Must | Lite |
| FR-43 | Dunning, grace period, self-service cancellation | M10 | Must | Lite |
| FR-44 | Add-on / overage purchases via Stripe | M10 | Should | Starter |
| FR-45 | REST API (read) scoped to tenant | M11 | Should | Scale |
| FR-46 | Self-service API keys (create/rotate/revoke, hashed) | M11 | Should | Scale |
| FR-47 | Signed webhooks with retries for key events | M11 | Could | Scale |
| FR-48 | API rate limiting/metering per tier | M11 | Should | Scale |
| FR-49 | Published OpenAPI documentation | M11 | Could | Scale |
| FR-50 | Onboarding checklist + contextual in-app help | M12 | Should | Lite |
| FR-51 | Searchable help center / knowledge base | M12 | Should | Lite |
| FR-52 | Support-request path with tier-based SLA surfaced | M12 | Must | Starter |
| FR-53 | Admin tenant directory (plan, status, usage, health) | M13 | Must | n/a |
| FR-54 | Secure, audited, read-default impersonation with MFA | M13 | Must | n/a |
| FR-55 | Feature flags (global / tier / tenant) | M13 | Should | n/a |
| FR-56 | Admin cron/job-run monitoring with re-run controls | M13 | Should | n/a |
| FR-57 | Immutable admin audit log | M13 | Must | n/a |
| FR-58 | Admin platform metrics (active tenants, MRR by tier, churn) | M13 | Could | n/a |

---

## Non-Functional Requirements

NFRs are kept concise here; the architectural and control detail behind them lives in [System Architecture](05_System_Architecture.md) and [Security & Compliance](09_Security_and_Compliance.md).

| NFR-ID | Category | Target / Requirement |
|--------|----------|----------------------|
| NFR-01 | **Performance** | Dashboard interactive load **p95 < 2s** on cached/pre-aggregated data; KPI drill-downs **< 1s**; forecast view render **< 3s**. |
| NFR-02 | **Performance (batch)** | Daily cron (sync → transform → forecast → Morning Brief) completes within the overnight window so all tenants have fresh insight before local business open. |
| NFR-03 | **Availability** | **≥ 99.5%** monthly uptime for the tenant-facing app; graceful degradation (stale-data banner) when a data source or model job is delayed. |
| NFR-04 | **Scalability** | Architecture supports growth from tens of tenants (MVP) to **~500+ tenants** and multi-location without redesign; batch jobs scale horizontally. See [10 — Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md) for the cost envelope. |
| NFR-05 | **Reliability / data integrity** | Idempotent, retriable sync and pipeline jobs; validation (Great Expectations / dbt tests) gates bad data from reaching insights; no partial/duplicated ingests. |
| NFR-06 | **Security & tenant isolation** | Strict per-tenant isolation (Postgres RLS by `tenant_id`); encryption in transit and at rest; no card data stored (PCI SAQ-A). Full controls in [Security & Compliance](09_Security_and_Compliance.md). |
| NFR-07 | **Privacy** | Cross-tenant data never exposed; benchmarking uses only anonymized, k-anonymous aggregates; PII handling and retention per [09](09_Security_and_Compliance.md). |
| NFR-08 | **Usability** | Owner-operator-friendly: no data literacy required; first insight achievable unaided; plain-language insights over jargon; sensible empty/error states everywhere. |
| NFR-09 | **Accessibility** | Target **WCAG 2.1 AA** — keyboard navigation, sufficient contrast, screen-reader labels on charts/KPIs, non-color-dependent status indicators. |
| NFR-10 | **Responsiveness** | Fully responsive across mobile, tablet, and desktop; primary flows usable on a phone at the counter. |
| NFR-11 | **Observability** | Errors (Sentry), product analytics (PostHog), and infra/job monitoring in place; job failures alert our team (Module 13). |
| NFR-12 | **Maintainability** | Modular services, typed codebase, documented connectors; adding a new connector or KPI is additive, not a rewrite. See [System Architecture](05_System_Architecture.md). |
| NFR-13 | **Compliance** | US-focused v1 (USD, US holidays/timezones); SMS/email compliance (STOP/HELP, unsubscribe); auditability of privileged actions. |
| NFR-14 | **Localization (v1 scope)** | English-first UI, USD, US timezones/holidays at launch; architecture leaves room for future locales (Won't-for-v1 beyond US). |

---

## Related documents

- [01 — Product Vision & Scope](01_Product_Vision_and_Scope.md)
- [04 — Subscription Tiers & Feature Matrix](04_Subscription_Tiers_and_Feature_Matrix.md)
- [05 — System Architecture](05_System_Architecture.md)
- [07 — AI / ML Strategy](07_AI_ML_Strategy.md)
- [09 — Security & Compliance](09_Security_and_Compliance.md)
- [10 — Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md)
- [Appendix A — KPI & Metrics Catalog](appendix/A_KPI_and_Metrics_Catalog.md)
- [Appendix C — Assumptions & Constants](appendix/C_Assumptions_and_Constants.md)
