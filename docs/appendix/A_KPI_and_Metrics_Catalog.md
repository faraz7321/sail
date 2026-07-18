# Appendix A — KPI & Metrics Catalog

**Project:** SAIL · **Appendix:** A · **Date:** 2026-07-18 · **Status:** Draft v1.0

> **Purpose:** This is the reference catalog of every KPI and metric SAIL computes and surfaces. It defines each metric, its formula (where a standard one exists), why it matters to an SMB owner, which business segment it applies to, and the minimum subscription tier at which it is available. Pricing and numeric assumptions are the responsibility of [Appendix C](C_Assumptions_and_Constants.md); this document does not restate them.

---

## How to read this catalog

- **Definition / Formula** — plain-language meaning plus the standard formula when one is widely accepted in hospitality/retail analytics.
- **Why it matters** — the owner-level decision the metric drives ("so what?").
- **Segment** — which end customers the KPI is relevant for: **All**, **F&B** (cafés, coffee shops, restaurants, ice-cream, QSR), **Lodging** (hotels, motels, B&Bs), or **Retail** (small retail/service).
- **Min. tier** — the lowest SaaS tier where the KPI is exposed. Tiers, in ascending order, are **Lite → Starter → Growth → Scale** (pricing in [Appendix C](C_Assumptions_and_Constants.md)). A KPI available at a lower tier is also available at every higher tier.

Predictive and prescriptive KPIs (Section 4) are produced by the modelling pipeline described in [AI/ML Strategy](../07_AI_ML_Strategy.md); the dashboard surfaces and interaction requirements for every KPI below are specified in [Functional Requirements](../03_Functional_Requirements.md).

---

## 1. Universal business KPIs

Applicable to essentially every tenant regardless of segment. These form the default dashboard for a new account and are intentionally weighted toward the entry (Lite) tier so that even the smallest customer sees immediate value.

| KPI | Definition / Formula | Why it matters | Segment | Min. tier |
|-----|----------------------|----------------|---------|-----------|
| **Total revenue (net sales)** | Sum of sales over a period, net of discounts, refunds, and comps. `Net revenue = Gross sales − discounts − refunds − comps` | The single headline number; anchors every other ratio and the growth trend. | All | Lite |
| **Transactions / covers** | Count of completed sales (tickets/orders). In F&B, **covers** = number of guests served. | Volume signal independent of price; separates "more customers" from "bigger baskets". | All | Lite |
| **Average order / ticket value (AOV / ATV)** | `AOV = Net revenue ÷ number of transactions`. In F&B often called average check or **spend per head** (`Net revenue ÷ covers`). | Shows whether upsell, bundling, or menu/price changes are landing. | All | Lite |
| **Gross margin** | `Gross margin % = (Net revenue − COGS) ÷ Net revenue × 100` | Turns top-line into "money actually kept"; flags pricing or cost drift. | All | Starter |
| **Revenue growth (WoW / YoY)** | `Growth % = (Current period − Prior period) ÷ Prior period × 100`, computed week-over-week and year-over-year. YoY controls for seasonality; WoW catches momentum. | Tells the owner if the business is trending up or down, seasonally adjusted. | All | Lite |
| **Sales by daypart** | Revenue and transactions bucketed into dayparts (e.g. morning / lunch / afternoon / evening / late). | Reveals peak vs. dead hours to guide staffing, promos, and hours of operation. | All | Starter |
| **Sales by channel** | Revenue split by channel: in-store/POS, online/e-commerce, delivery marketplace, phone, etc. | Shows channel mix and which channels are growing or bleeding margin. | All | Starter |
| **Top / bottom products** | Ranked list of SKUs/menu items by revenue, units, and margin; highlights best and worst performers. | Directs menu/assortment decisions: promote winners, cut or fix laggards. | All | Lite |
| **Labor cost %** | `Labor cost % = Total labor cost ÷ Net revenue × 100` | Largest controllable cost for most SMBs; the core lever on profitability. | All | Growth |
| **Sales per labor hour (SPLH)** | `SPLH = Net revenue ÷ total labor hours worked` | Productivity per scheduled hour; ties staffing directly to revenue efficiency. | All | Growth |

---

## 2. Food & beverage specific

For cafés, coffee shops, restaurants, ice-cream shops, and QSR. These lean on menu/recipe data and, where available, inventory; some require the owner to supply recipe costs or an inventory feed (see [Data Strategy & ETL](../06_Data_Strategy_and_ETL.md)).

| KPI | Definition / Formula | Why it matters | Segment | Min. tier |
|-----|----------------------|----------------|---------|-----------|
| **Food cost %** | `Food cost % = Cost of food sold ÷ Food revenue × 100` | The defining margin metric in F&B; small drifts erase profit fast. | F&B | Growth |
| **Waste / spoilage %** | `Waste % = Cost of wasted or spoiled inventory ÷ Cost of food purchased × 100` | Perishable-inventory leakage; directly attacks the biggest hidden loss. | F&B | Growth |
| **Menu mix / menu engineering** | Classifies items by popularity vs. contribution margin into Stars (high/high), Plowhorses (popular/low margin), Puzzles (unpopular/high margin), Dogs (low/low). | Turns the menu into a profit lever: reprice, re-plate, promote, or remove. | F&B | Growth |
| **Prep-to-sales ratio** | `Prep-to-sales = Quantity prepped ÷ quantity sold` for prepped items. | Balances "run out" against "throw out"; feeds prep recommendations. | F&B | Growth |
| **Table turns** | `Table turns = Number of parties seated ÷ number of tables`, per daypart/day. | Measures seating throughput; drives layout, reservation, and staffing choices. | F&B | Growth |
| **Comps / voids %** | `Comps & voids % = (Value of comped + voided items) ÷ Gross sales × 100` | Flags operational errors, over-comping, and potential loss/theft. | F&B | Growth |

---

## 3. Lodging specific

For hotels, motels, and B&Bs. Standard hospitality revenue-management metrics; SAIL computes these from PMS/POS room-night data (or manual/CSV entry for the smallest operators).

| KPI | Definition / Formula | Why it matters | Segment | Min. tier |
|-----|----------------------|----------------|---------|-----------|
| **Occupancy %** | `Occupancy % = Rooms sold ÷ rooms available × 100` | Core utilization metric; the "how full are we" number. | Lodging | Starter |
| **ADR (Average Daily Rate)** | `ADR = Room revenue ÷ rooms sold` | Average price achieved per occupied room; the pricing lever. | Lodging | Starter |
| **RevPAR (Revenue per Available Room)** | `RevPAR = Room revenue ÷ rooms available` (equivalently `ADR × Occupancy %`) | Blends rate and occupancy into one health metric — the industry north star. | Lodging | Starter |
| **Booking pace / lead time** | Cumulative bookings on the books for a future date vs. time before arrival; **lead time** = days between booking and stay. | Shows how demand is building for upcoming dates so pricing can react early. | Lodging | Growth |
| **Average length of stay (ALOS)** | `ALOS = Total room-nights ÷ number of bookings` | Longer stays cut turnover cost per night; informs min-stay and package rules. | Lodging | Growth |
| **Cancellation rate** | `Cancellation rate = Cancelled bookings ÷ total bookings × 100` | Signals overbooking risk and the reliability of the forward book. | Lodging | Growth |
| **RevPAR index (RGI)** | `RGI = Property RevPAR ÷ competitive-set RevPAR × 100`; 100 = fair share. Requires a comp-set benchmark feed. | Answers "are we winning or losing share vs. our market", not just vs. ourselves. | Lodging | Scale |

---

## 4. Predictive / forecast KPIs

Produced daily by the forecasting and recommendation pipeline (see [AI/ML Strategy](../07_AI_ML_Strategy.md)). These fuse the tenant's historical transaction data with external signals — weather, holidays, and local events — and are the prescriptive layer that differentiates SAIL from a plain dashboard. Availability skews to higher tiers because they carry the model-compute cost.

| KPI | Definition / Formula | Why it matters | Segment | Min. tier |
|-----|----------------------|----------------|---------|-----------|
| **Forecasted demand by item** | Model-predicted units/covers/room-nights per item (or category) for the next N days, with a confidence band. | The base signal for every downstream action: what to buy, prep, and staff for. | All | Growth |
| **Forecast accuracy (MAPE / WAPE)** | `MAPE = mean(|actual − forecast| ÷ actual) × 100`; `WAPE = Σ|actual − forecast| ÷ Σ actual × 100` (volume-weighted, robust to low-volume items). | Builds trust: the owner sees how reliable the forecast has been before acting on it. | All | Growth |
| **Stockout risk score** | Probability that projected demand exceeds available/on-hand quantity before the next replenishment, expressed 0–100. | Prevents lost sales by flagging items likely to run out at current stock levels. | F&B / Retail | Growth |
| **Recommended prep / order quantity** | Prescriptive quantity to prep or order = forecasted demand adjusted for on-hand stock, safety buffer, and shelf life / spoilage. | Converts a forecast into a concrete "buy/prep this much" instruction — the core action. | F&B / Retail | Growth |
| **Recommended staffing hours** | Prescriptive labor hours by daypart derived from forecasted demand and a target sales-per-labor-hour ratio. | Right-sizes the schedule to demand, protecting both service level and labor cost %. | All | Scale |
| **Projected revenue for holiday / event** | Expected revenue uplift (or dip) for an upcoming holiday, local event, or weather scenario vs. a normal baseline day. | Lets the owner plan inventory, staffing, and promos around known demand spikes. | All | Growth |

---

## Notes on segmentation and tiering

- **Segment gating is by relevance, not restriction.** A lodging tenant simply never sees food cost %; a café never sees ADR. The catalog above is the full superset.
- **Tier gating is cumulative.** Lite delivers the universal "what happened" descriptive layer; Starter/Growth add operational depth (dayparts, channels, F&B and lodging operations); Growth/Scale unlock the predictive and prescriptive layer that requires per-tenant model compute.
- **Formulas are canonical here.** Where any other plan document references a KPI formula, this appendix is the source; numeric constants (tier prices, cost bases) live in [Appendix C](C_Assumptions_and_Constants.md).

---

## Related documents

- [03 — Functional Requirements](../03_Functional_Requirements.md) — dashboard surfaces, drill-downs, and interaction requirements for every KPI in this catalog.
- [07 — AI/ML Strategy](../07_AI_ML_Strategy.md) — the modelling pipeline that produces the predictive and prescriptive KPIs in Section 4.
- [06 — Data Strategy & ETL](../06_Data_Strategy_and_ETL.md) — how the raw inputs behind these KPIs are ingested, cleaned, and modelled.
- [Appendix B — Data Sources & Integrations](B_Data_Sources_and_Integrations.md) — the sources feeding these metrics.
- [Appendix C — Assumptions & Constants](C_Assumptions_and_Constants.md) — canonical source for all numbers, tiers, and named constants.
- [Appendix D — Glossary](D_Glossary.md) — definitions of AOV, ADR, RevPAR, MAPE/WAPE, daypart, menu engineering, and other terms used above.
