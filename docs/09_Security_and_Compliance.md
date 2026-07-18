# 09 — Security & Compliance

**Project:** SAIL · **Doc:** 09 · **Date:** 2026-07-18 · **Status:** Draft v1.0

---

## 1. Security principles & threat model overview

SAIL is a **multi-tenant SaaS that handles SMB financial data** — POS revenue, transaction histories, and derived margins for cafés, restaurants, ice-cream shops, hotels, and motels. This data is commercially sensitive but is **not, by design, regulated payment-card or health data** (see §5). The security posture is therefore calibrated to *confidentiality of business financials + strong tenant isolation*, not to PCI-DSS Level 1 or HIPAA.

**Guiding principles**

| Principle | How it shows up in SAIL |
|---|---|
| **Secure by default** | RLS-on by default on every tenant table; deny-by-default network and IAM policies; no public buckets. |
| **Least privilege** | RBAC roles scoped to a single `tenant_id`; service credentials scoped per-service; no shared "god" keys. |
| **Defense in depth** | Isolation enforced at DB (RLS), app (BFF authz), and network layers — a bug in one layer is not a full breach. |
| **Data minimization** | We collect POS/aggregate sales, never card PANs or full customer PII (see §5). |
| **Tenant isolation is the product** | Cross-tenant leakage is the single highest-severity failure class; it is tested continuously (§2). |
| **Auditable** | Every privileged action and data access path emits an audit record (§7). |

**Threat model (abbreviated STRIDE view)**

| Threat | Primary risk in SAIL | Primary control |
|---|---|---|
| **Spoofing** | Stolen tenant credentials | Supabase Auth + MFA + short-lived JWTs, session binding (§3) |
| **Tampering** | Malicious writes to another tenant's data | RLS `tenant_id` predicates + parameterized queries (§2, §7) |
| **Repudiation** | "I didn't change that setting" | Append-only audit log (§7) |
| **Information disclosure** | **Cross-tenant data leakage** (top risk) | RLS + BFF authz + isolation test suite (§2); ML anonymization (§8) |
| **Denial of service** | Cron/LLM cost-amplification, scraping | Rate limiting, per-tenant quotas, WAF (§7) |
| **Elevation of privilege** | Staff → Owner escalation, key theft | RBAC least privilege, secrets vaulting, KMS (§3, §4) |

Architecture context: [System Architecture](05_System_Architecture.md) · [Technology Stack](08_Technology_Stack.md). Canonical assumptions: [Appendix C](appendix/C_Assumptions_and_Constants.md).

---

## 2. Multi-tenant data isolation

Isolation is enforced primarily in the database via **PostgreSQL Row-Level Security (RLS)** on Supabase, with the application layer as a second, independent check.

### 2.1 The model

- Every tenant-scoped table carries a non-null `tenant_id uuid` column with a foreign key to `tenants(id)`.
- **RLS is `ENABLE`d and `FORCE`d** on every such table (FORCE ensures even the table owner is subject to policy, closing the "owner bypass" gap).
- The tenant identity is carried in the Supabase Auth JWT as a claim and read inside policies via `auth.jwt()` / a `current_tenant_id()` helper, so the predicate cannot be spoofed by the client.

Representative policy (illustrative):

```sql
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON metrics
  USING      (tenant_id = current_tenant_id())
  WITH CHECK (tenant_id = current_tenant_id());
```

- `USING` blocks reads/updates/deletes of other tenants' rows; `WITH CHECK` blocks a tenant from *writing* a row stamped with someone else's `tenant_id`.
- The FastAPI/ETL tier connects with a role that **also** sets the tenant context per unit of work (via `SET LOCAL request.jwt.claims` or a scoped session), so backend jobs are subject to the same policies rather than running as an unrestricted superuser. The service-role key is used only for genuinely cross-tenant control-plane operations (billing sync, platform admin) and never reaches the browser.

### 2.2 How it is tested

Isolation is treated as a **continuously verified invariant**, not a one-time review:

| Test type | What it proves | Cadence |
|---|---|---|
| **Automated RLS unit tests** (pgTAP / SQL fixtures) | Every tenant table denies cross-tenant `SELECT/INSERT/UPDATE/DELETE` | Every CI run |
| **Two-tenant integration tests** | Tenant A's JWT cannot read/write Tenant B's rows through the real BFF + API path | Every CI run |
| **"New table" guard** | CI fails if any tenant-scoped table ships without RLS enabled + a policy (schema lint) | Every migration |
| **Fuzz / negative tests** | Missing/forged `tenant_id` claim → zero rows, never all rows | Every CI run |
| **Periodic manual review + pen test** | Business-logic isolation (exports, shared links, cross-tenant IDs in URLs) | Quarterly + annual pen test (§7) |

Because a single missing policy is catastrophic, the CI schema-lint gate is a hard release blocker.

### 2.3 When to offer stronger isolation (schema- or DB-per-tenant)

Shared-table + RLS is the default for all tiers and is appropriate for the vast majority of SMB tenants. Stronger physical isolation is offered selectively at the **Scale tier** and for enterprise/regulatory buyers:

| Model | Isolation | Cost / ops overhead | When to offer |
|---|---|---|---|
| **Shared tables + RLS** (default) | Logical (row-level) | Lowest | All tiers; default for Starter/Growth/Scale |
| **Schema-per-tenant** | Logical + namespace | Medium (migration fan-out, connection mgmt) | Scale tenants needing data residency clarity, heavier per-tenant customization, or "no shared table" contractual asks |
| **Database-per-tenant** | Physical | High (per-DB cost, backup/DR fan-out, migration orchestration) | Large Scale/enterprise tenants with strict compliance, blast-radius, or performance-isolation requirements; priced as a premium add-on |

The trigger to move a tenant up the ladder is contractual/regulatory (a data-isolation clause) or scale-driven (noisy-neighbor performance), not the default path. Cost implications are in [Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md).

---

## 3. Authentication & authorization (AuthN / AuthZ)

### 3.1 Authentication (Supabase Auth)

- **Supabase Auth (GoTrue)** is the identity provider: email/password + magic link, issuing short-lived JWT access tokens with rotating refresh tokens.
- **MFA:** TOTP-based MFA available to all users and **required for Owner/Manager roles by default**; enforceable per-tenant policy.
- **Password policy:** minimum length + breach-list check (HaveIBeenPwned-style), server-side rate limiting on login and password reset, lockout/backoff on repeated failures.
- **SSO (later):** SAML / OIDC SSO (Okta, Google Workspace, Microsoft Entra) offered to Scale/enterprise tenants in a later phase; not MVP scope.

### 3.2 Authorization — RBAC

Roles are scoped **within a tenant**; a user in Tenant A has no role in Tenant B.

| Role | Capabilities | Typical user |
|---|---|---|
| **Owner** | Full control: billing, connectors, user management, all data, delete tenant | Business owner |
| **Manager** | Configure connectors, view all dashboards/forecasts, manage alerts, invite Staff | GM / store manager |
| **Staff** | View assigned dashboards, acknowledge alerts, limited actions | Shift lead / employee |
| **Read-only** | View dashboards/reports only; no configuration, no exports of raw data | Accountant, advisor, investor |

- Authorization is enforced in the **BFF/API layer** (role checks per endpoint) **and** at the database (RLS + column/row policies) so a client-side bypass cannot reach data.
- Role changes and invitations are audited (§7). Principle of least privilege: Staff/Read-only cannot touch billing, connector secrets, or user management.

### 3.3 Session security

- Short-lived access tokens (minutes) + rotating refresh tokens; refresh-token reuse detection revokes the session family.
- Secure cookie handling (HttpOnly, Secure, SameSite) for the Next.js session; CSRF protection on state-changing routes.
- Idle + absolute session timeouts; "sign out everywhere"; device/session list for Owners.
- All auth flows are TLS-only (§4).

---

## 4. Data protection

| Layer | Control |
|---|---|
| **In transit** | TLS 1.2+ (prefer 1.3) everywhere — browser↔Vercel, BFF↔Supabase, FastAPI↔external APIs, service↔service. HSTS enabled. No plaintext internal hops. |
| **At rest** | Supabase Postgres, Storage, and object storage (S3/R2) encrypted at rest with AES-256 (provider-managed). Backups encrypted at rest. |
| **Field-level** | Connector OAuth tokens and third-party API credentials stored encrypted (application-level envelope encryption on top of at-rest), never in plaintext columns or logs. |
| **Secrets management** | No secrets in source or client bundles. Runtime secrets held in the platform secret stores (Vercel Environment Variables, Fly.io Secrets, Supabase Vault / cloud Secrets Manager), injected at runtime, scoped per environment (dev/stage/prod). |
| **Key management** | Provider-managed KMS for at-rest keys with automatic rotation; application envelope-encryption keys rotated on a schedule and on suspected compromise. Separate keys per environment. |
| **Secret hygiene** | Automated secret scanning in CI + pre-commit (see §7); leaked-credential rotation runbook; least-privilege, per-service API keys so one leaked key has a small blast radius. |

---

## 5. PII & payment data

**Data-minimization stance:** SAIL is an analytics layer over *business* metrics. It ingests aggregated/transaction-level **sales data**, not end-consumer identities.

- **No cardholder data is ever stored or processed by SAIL.** All subscription billing runs through **Stripe** using Stripe-hosted checkout/Elements; card numbers never touch SAIL servers. This keeps SAIL in **PCI-DSS SAQ-A scope** (the lightest self-assessment tier — merchant fully outsources card handling). See billing in [Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md).
- **POS ingestion** captures sales aggregates, line items, timestamps, and amounts. Where a POS feed *could* include end-customer identifiers (names, emails from loyalty/receipts), SAIL's ingestion **drops or hashes** those fields at the ETL boundary — they are not needed for forecasting and are excluded by default. ETL rules are in [Data Strategy & ETL](06_Data_Strategy_and_ETL.md) and [Appendix B — Data Sources & Integrations](appendix/B_Data_Sources_and_Integrations.md).

**Data classification**

| Class | Examples | Handling |
|---|---|---|
| **Restricted** | Tenant sales/revenue, margins, forecasts, connector OAuth tokens | RLS-isolated, encrypted, access-audited, least-privilege only |
| **Confidential** | Tenant account/user info (name, email, role) | RLS-isolated, encrypted, minimized |
| **Excluded (not stored)** | Cardholder data (PAN/CVV), raw end-consumer PII from POS | Never stored — Stripe for cards; dropped/hashed at ETL for consumer PII |
| **Public / low** | External signals (weather, holidays, public events) | Cached, not tenant-restricted |

---

## 6. Compliance roadmap

### 6.1 SOC 2 (Type I → Type II)

The primary trust artifact for US B2B SaaS buyers.

| Milestone | What's needed | Rough timeline |
|---|---|---|
| **Readiness** | Formal security policies, access reviews, onboarding/offboarding, vendor mgmt, risk register; ship a compliance-automation platform (Vanta/Drata-style) to collect evidence | Months 0–3 |
| **SOC 2 Type I** | Point-in-time attestation that controls are *designed* correctly | ~Month 3–4 (after ~1 month of evidence + audit) |
| **SOC 2 Type II** | Auditor tests that controls *operated effectively* over an observation window | Report ~Month 9–12 (requires 6-month min observation window) |

Trust Services Criteria in scope: **Security** (mandatory), plus **Availability** and **Confidentiality** given the financial-data workload.

### 6.2 Privacy — GDPR / CCPA / US state privacy

Even US-focused, SAIL adopts a privacy-by-design baseline that satisfies CCPA/CPRA and the growing set of US state laws, and is GDPR-ready for any EU exposure.

- **Data-subject rights:** access, correction, deletion/erasure, portability (export), and opt-out of "sale/share" (SAIL does not sell data). Self-service export + a documented deletion workflow that cascades across Postgres, object storage, backups (on rotation), and subprocessors.
- **DPA:** a **Data Processing Agreement** offered to tenants (SAIL as processor of tenant data), backed by signed DPAs with each subprocessor.
- **Subprocessors:** published, versioned subprocessor list (§10) with change notification.
- **Records & residency:** data-processing records; US data residency by default, with documented options for stronger isolation (§2.3).

### 6.3 Communications compliance

| Regime | Applies to | Control |
|---|---|---|
| **CAN-SPAM** | Marketing/transactional email via **Resend** | Accurate headers/sender, physical mailing address, one-click unsubscribe honored promptly; transactional vs. marketing separation |
| **TCPA** | SMS alerts via **Twilio** | **Express written consent captured and logged before any SMS**; clear opt-in at alert setup; STOP/HELP keyword handling; quiet-hours awareness; A2P 10DLC brand/campaign registration for US SMS deliverability |

TCPA is called out as a **material risk**: SMS alerting is a product feature, and non-consented SMS carries statutory per-message penalties. Consent state is stored per recipient and checked at send time.

---

## 7. Application security

**OWASP Top 10 coverage**

| Risk | Control in SAIL |
|---|---|
| **Broken access control** | RLS + BFF authz (§2, §3); no direct object references without tenant scoping; deny-by-default |
| **Cryptographic failures** | TLS everywhere, AES-256 at rest, no secrets in logs (§4) |
| **Injection** | Parameterized queries / ORM; strict input validation; dbt/GE guardrails on ingested data |
| **Insecure design** | Threat model (§1), isolation-as-invariant testing (§2) |
| **Security misconfiguration** | IaC-managed config, least-privilege IAM, hardened defaults, no public buckets |
| **Vulnerable components** | Dependency scanning (Dependabot/Renovate + `pip-audit`/`npm audit`) in CI |
| **AuthN failures** | Supabase Auth, MFA, session hardening (§3) |
| **Integrity failures** | Signed builds, pinned dependencies, CI provenance |
| **Logging/monitoring failures** | Audit log + Sentry + Better Stack alerting (§9) |
| **SSRF** | Allow-listed outbound calls from the ingestion/connector service; no user-supplied URLs fetched unvalidated |

**Additional controls**

- **Input validation** at the API boundary (schema validation on every request; strict typing via Pydantic/Zod).
- **Rate limiting & quotas** via Upstash Redis — per-tenant and per-endpoint limits protect against abuse and **LLM/cron cost-amplification**; WAF/DDoS protection at the edge (Vercel/Cloudflare).
- **Audit logging** — append-only record of auth events, role/permission changes, connector/secret changes, data exports, and admin actions; tenant-scoped and retained.
- **Dependency & secret scanning** — automated in CI and pre-commit; blocked merges on high-severity findings.
- **Penetration testing** — third-party pen test before GA and **annually** thereafter, plus after major architecture changes; findings tracked to remediation. Aligns with SOC 2 (§6.1).

---

## 8. ML / data privacy

SAIL trains per-tenant personalization on that tenant's own data, and improves shared models using **aggregated/anonymized** data only. The hard rule: **no raw tenant data ever leaks to another tenant, in a model or otherwise.**

- **Per-tenant models** (forecasts, ICP personalization) are trained and served scoped to a single `tenant_id`; their outputs are RLS-isolated like any other tenant data.
- **Cross-tenant learning** uses only **aggregated or anonymized** features (e.g., segment-level seasonality, weather-elasticity priors) — never row-level tenant records — and is used to warm-start cold-start tenants, not to expose one tenant's specifics to another.
- **Training-data consent:** contribution to shared/aggregate model improvement is governed by the DPA and tenant settings; a tenant can opt out of aggregate contribution while still receiving full per-tenant models.
- **No prompt leakage:** LLM insight generation (Claude Haiku / GPT-4o-mini) is grounded only on the requesting tenant's data; prompts are constructed per-tenant and never mix tenants in a single context; provider zero-retention/no-train settings are used where available.
- **Model isolation testing:** evaluation checks that a tenant's model/insights cannot surface another tenant's identifiable figures.

Full detail: [AI/ML Strategy](07_AI_ML_Strategy.md).

---

## 9. Backups, DR, RPO/RTO, incident response

**Backups & disaster recovery**

| Item | Target |
|---|---|
| **Postgres backups** | Automated daily backups + Point-in-Time Recovery (PITR); retained per policy; encrypted |
| **Object storage** | Versioned buckets; lifecycle policies; cross-region replication offered for Scale/DR-sensitive tenants |
| **RPO (Recovery Point Objective)** | ≤ 24h for standard tiers (daily backup); minutes with PITR enabled on Scale |
| **RTO (Recovery Time Objective)** | ≤ 4h for a full-region restore; degraded-read (cached dashboards/marts) available sooner |
| **Restore testing** | Backup restores are exercised on a scheduled basis — an untested backup is not a backup |

Because dashboards read pre-computed marts and cached briefs, a transient ETL/model-tier outage degrades *freshness*, not availability of the last good view.

**Incident response**

- Documented IR plan with severity levels, on-call rotation, and a defined breach-notification process (contractual + statutory timelines under applicable state privacy laws / GDPR where relevant).
- Detection via Sentry (errors), Better Stack (uptime/log alerting), and audit-log anomaly review; PostHog for behavioral anomalies.
- Post-incident: root-cause review, corrective actions tracked, tenant notification where required. Cross-tenant data exposure is automatically top-severity.

---

## 10. Subprocessor / vendor list

Published and version-controlled; each carries a signed DPA. Data classes reference §5.

| Subprocessor | Purpose | Data exposure | Region |
|---|---|---|---|
| **Vercel** | Web app / BFF hosting, edge/CDN | App traffic, session tokens (transit) | US |
| **Supabase** | Postgres, Auth, Storage (primary datastore) | Restricted + Confidential (tenant data at rest) | US |
| **Fly.io / AWS (Fargate)** | FastAPI ML/ETL compute | Restricted (in-process during jobs) | US |
| **Upstash** | Redis (cache, rate limiting, queues) | Ephemeral keys, cache, quotas | US |
| **AWS S3 / Cloudflare R2** | Object storage (landing vault, exports) | Restricted (raw payloads, files) | US |
| **Prefect Cloud** | Pipeline orchestration (control plane) | Metadata/run logs (not tenant rows) | US |
| **Anthropic (Claude Haiku)** | LLM insight generation | Per-tenant prompt context (no-train/zero-retention where available) | US |
| **OpenAI (GPT-4o-mini)** | LLM insight generation (alternate) | Per-tenant prompt context (no-train settings) | US |
| **Stripe** | Subscription billing & payments | Billing data; **cardholder data (SAIL never stores it)** | US |
| **Resend** | Transactional & notification email | Recipient email, message content | US |
| **Twilio** | SMS alerts | Recipient phone, message content, consent state | US |
| **Sentry** | Error monitoring | Stack traces, scrubbed context (PII-scrubbed) | US |
| **PostHog** | Product analytics | Usage events (pseudonymized) | US / EU option |
| **Better Stack** | Uptime & log management | Logs, alerts (secret-scrubbed) | US |
| **Visual Crossing / OpenWeather** | Weather signals | No tenant data sent (location params only) | US |
| **Nager.Date / Calendarific** | Holiday signals | No tenant data sent | US/EU |
| **Ticketmaster / SeatGeek / PredictHQ** | Event signals | No tenant data sent (location/date params) | US |
| **Google Places** | Location/venue enrichment | Location queries only | US |
| **Merge.dev / Rutter** *(optional)* | POS data aggregation | Restricted (tenant POS data in transit) | US |

Subprocessor changes are notified to tenants and reflected in this list and the DPA.

---

## Related documents

- [05 — System Architecture](05_System_Architecture.md) — how the isolated tiers fit together
- [06 — Data Strategy & ETL](06_Data_Strategy_and_ETL.md) — where PII is dropped/hashed at ingestion
- [07 — AI/ML Strategy](07_AI_ML_Strategy.md) — per-tenant vs. aggregate model boundaries
- [08 — Technology Stack](08_Technology_Stack.md) — the components referenced here
- [10 — Hosting & Infrastructure Costs](10_Hosting_and_Infrastructure_Costs.md) — cost of isolation/DR options
- [11 — Build Cost & Capital Plan](11_Build_Cost_and_Commercials.md) — Stripe billing & SOC 2 program cost
- [Appendix B — Data Sources & Integrations](appendix/B_Data_Sources_and_Integrations.md) — subprocessor data flows
- [Appendix C — Assumptions & Constants](appendix/C_Assumptions_and_Constants.md) — canonical numbers & names
