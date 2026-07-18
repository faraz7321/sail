# Appendix D — Glossary

**Project:** SAIL · **Appendix:** D · **Date:** 2026-07-18 · **Status:** Draft v1.0

> **Purpose:** Plain-language definitions of the technical and business terms used across the SAIL business plan. Definitions are kept to one or two sentences and written to be understandable by an SMB owner wherever possible. Where a term has a canonical formula or value elsewhere, this glossary points to it rather than restating it — numeric constants live in [Appendix C](C_Assumptions_and_Constants.md).

---

| Term | Definition |
|------|------------|
| **ADR (Average Daily Rate)** | Average price achieved per occupied room in a lodging business: room revenue divided by rooms sold. See [Appendix A](A_KPI_and_Metrics_Catalog.md). |
| **AOV / ATV (Average Order / Ticket Value)** | The average amount spent per transaction: net revenue divided by number of transactions (in F&B, the "average check"). |
| **ARPU (Average Revenue Per User)** | Recurring revenue divided by the number of active accounts — here, average monthly revenue per SAIL tenant. |
| **ARR (Annual Recurring Revenue)** | The annualized value of subscription revenue, typically MRR × 12. |
| **Backtesting** | Testing a forecasting model on past data it has not "seen" to estimate how accurate it would have been, before trusting it on the future. |
| **CAC (Customer Acquisition Cost)** | The total sales and marketing spend required to win one new paying customer. |
| **CAN-SPAM** | US law governing commercial email; sets rules for accurate headers, honest subject lines, and a working unsubscribe mechanism. |
| **CCPA (California Consumer Privacy Act)** | California privacy law giving consumers rights to know, access, and delete personal data a business holds about them. |
| **Champion / challenger** | An MLOps practice of running the current production model (champion) alongside a candidate (challenger) and promoting the challenger only if it demonstrably performs better. |
| **Churn** | The rate at which customers cancel or stop paying over a period; the inverse of retention. |
| **COGS (Cost of Goods Sold)** | The direct cost of the products sold (e.g. food, ingredients, retail stock); subtracted from revenue to get gross margin. |
| **Cold-start** | The problem of producing useful forecasts or recommendations for a new tenant (or new item) that has little or no history yet. |
| **Cron job** | A task scheduled to run automatically at fixed times or intervals — SAIL uses daily cron jobs to refresh data, forecasts, and recommendations. |
| **Daypart** | A named time-of-day segment (e.g. morning, lunch, afternoon, evening) used to break sales into meaningful periods. |
| **Data warehouse** | A central database optimized for analytics that consolidates data from many sources so it can be queried and reported on together. |
| **dbt (data build tool)** | A tool for transforming data inside the warehouse using version-controlled SQL, with built-in testing and documentation. |
| **ELT / ETL** | Two patterns for moving data: **ETL** = Extract, Transform, then Load; **ELT** = Extract, Load into the warehouse, then Transform there. SAIL leans ELT (transform in-warehouse). |
| **Feature store** | A managed place to define, store, and serve the input variables ("features") a model uses, so training and live prediction stay consistent. |
| **GDPR (General Data Protection Regulation)** | The EU's comprehensive data-protection law governing how personal data is collected, processed, and stored. |
| **Gross margin** | The share of revenue kept after direct costs: (net revenue − COGS) ÷ net revenue. See [Appendix A](A_KPI_and_Metrics_Catalog.md). |
| **ICP (Ideal Customer Profile)** | A description of the customer a product serves best; SAIL uses per-tenant ICP context to personalize dashboards and recommendations. |
| **LightGBM** | A fast, efficient gradient-boosting machine-learning library, often used for demand forecasting with many features. |
| **LLM (Large Language Model)** | An AI model trained on large text corpora that can understand and generate natural language — used in SAIL to phrase recommendations and answer questions. |
| **LTV (Lifetime Value)** | The total revenue a customer is expected to generate over their entire relationship with the business. |
| **MAPE / WAPE / MASE** | Forecast-accuracy measures. **MAPE** = mean absolute percentage error; **WAPE** = weighted (volume-weighted) absolute percentage error, robust to low-volume items; **MASE** = mean absolute scaled error, comparing a model to a naive baseline. |
| **Medallion architecture** | A layered data-quality design — Bronze (raw), Silver (cleaned/conformed), Gold (business-ready) — that progressively refines data in the warehouse. |
| **Menu engineering** | Analyzing menu items by popularity and profit margin to decide what to promote, reprice, re-plate, or remove. See [Appendix A](A_KPI_and_Metrics_Catalog.md). |
| **MLflow** | An open-source platform for tracking machine-learning experiments, packaging models, and managing their versions and deployment. |
| **MLOps** | The discipline and tooling for deploying, monitoring, retraining, and governing machine-learning models reliably in production. |
| **MRR (Monthly Recurring Revenue)** | The predictable subscription revenue booked each month across all active accounts. |
| **Multi-tenant** | A single running application and database serving many customers ("tenants") at once, with each tenant's data logically isolated from the others. |
| **Nixtla StatsForecast** | An open-source Python library offering fast, classical statistical forecasting models (e.g. AutoARIMA, ETS) at scale. |
| **OAuth** | A standard that lets a user grant an app limited access to their account on another service (e.g. Square) without sharing their password. |
| **Occupancy %** | The share of available rooms that are sold: rooms sold ÷ rooms available. A core lodging KPI — see [Appendix A](A_KPI_and_Metrics_Catalog.md). |
| **Orchestration** | Coordinating and scheduling the steps of a data or ML pipeline — what runs, in what order, with retries and dependencies — so daily jobs complete reliably. |
| **PCI SAQ-A** | The lightest PCI-DSS Self-Assessment Questionnaire, applicable when a merchant fully outsources card handling to compliant third parties and never touches card data directly. |
| **Prescriptive vs. predictive vs. descriptive analytics** | Three levels of insight: **descriptive** = what happened; **predictive** = what is likely to happen; **prescriptive** = what to do about it. SAIL delivers all three. |
| **Prophet** | An open-source forecasting library (from Meta) designed for business time series with strong seasonal and holiday effects and minimal tuning. |
| **RAG (Retrieval-Augmented Generation)** | An LLM technique that fetches relevant facts (e.g. a tenant's own data) and feeds them into the model so answers are grounded rather than guessed. |
| **RevPAR (Revenue per Available Room)** | Lodging revenue efficiency: room revenue ÷ rooms available, equal to ADR × occupancy. See [Appendix A](A_KPI_and_Metrics_Catalog.md). |
| **Row-Level Security (RLS)** | A database feature that filters rows by policy so each tenant can only ever read or write its own data — a core multi-tenant isolation control. |
| **RPO / RTO** | Disaster-recovery targets. **RPO** (Recovery Point Objective) = maximum acceptable data loss (how far back a restore may go); **RTO** (Recovery Time Objective) = maximum acceptable downtime before service is restored. |
| **SaaS (Software as a Service)** | Software delivered over the web on a subscription, maintained centrally by the vendor rather than installed by the customer. |
| **SOC 2** | An independent audit report on how well a service organization controls security, availability, processing integrity, confidentiality, and privacy. |
| **Star schema** | A data-warehouse layout with a central fact table (e.g. sales) linked to surrounding dimension tables (e.g. date, item, location), optimized for analytics. |
| **Structured output** | Constraining an LLM to return data in a fixed machine-readable shape (e.g. JSON matching a schema) so its answers can be used programmatically. |
| **TCPA (Telephone Consumer Protection Act)** | US law restricting automated calls and texts and requiring prior consent — relevant to any SMS/voice outreach features. |
| **Tenant** | A single customer account within the multi-tenant SaaS; all of one tenant's users, data, and settings belong to that tenant. |
| **Webhook** | An automated HTTP callback: a source system (e.g. Square) pushes an event to SAIL the moment it happens, instead of SAIL repeatedly polling for changes. |
| **XGBoost** | A widely used, high-performance gradient-boosting machine-learning library well suited to tabular demand-forecasting problems. |

---

## Related documents

- [Appendix A — KPI & Metrics Catalog](A_KPI_and_Metrics_Catalog.md) — where ADR, AOV/ATV, RevPAR, occupancy, MAPE/WAPE, menu engineering, and daypart are used in context.
- [Appendix B — Data Sources & Integrations](B_Data_Sources_and_Integrations.md) — where OAuth, webhook, aggregator, and ELT/ETL appear in practice.
- [Appendix C — Assumptions & Constants](C_Assumptions_and_Constants.md) — canonical source for numbers referenced by these terms.
- [06 — Data Strategy & ETL](../06_Data_Strategy_and_ETL.md) — medallion architecture, dbt, warehouse, and star-schema usage.
- [07 — AI/ML Strategy](../07_AI_ML_Strategy.md) — Prophet, XGBoost, LightGBM, StatsForecast, MLOps, feature store, RAG, and forecast-accuracy metrics in context.
