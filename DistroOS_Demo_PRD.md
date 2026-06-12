# DistroOS — Interactive Demo PRD
**Client:** Hustle Van, LLC — Fronto King & UP Brands  
**Purpose:** Working demo to show decision maker, collect feedback, close deal  
**Demo deadline:** This weekend  
**Built by:** Claude Code + Cursor  

---

## 1. PROBLEM STATEMENT

Hustle Van, LLC is a $50M/year tobacco distribution company (Fronto King and UP brands) operating across NC, GA, FL, TX, and CA with production in the Dominican Republic. Their entire operation runs on WhatsApp messages, paper order sheets, manual Zoho invoice creation, and physical warehouse counts. Wholesalers order blind with no inventory visibility. The warehouse processes orders manually with no queue system. DR ships to Miami based on guesswork. When inventory events happen — like a warehouse sale at a trade show — nobody in the chain knows until someone physically walks the floor with paper purchase orders after the fact.

The demo must show the decision maker his exact operation — solved — in a working, clickable application using his real products, his real brand names, and his real workflow. The goal of the demo is not to be a finished product. It is to be real enough that he can interact with it, feel what it solves, and tell us what we're missing.

---

## 2. DEMO GOALS

- Decision maker can log in as three different user types and experience each portal
- Placing a wholesale order updates inventory in real time across all views
- A warehouse sale event decrements the same inventory wholesalers see
- DR production portal shows live Miami stock levels and fires a reorder alert
- The owner command dashboard shows the full chain in one view
- Demo runs in a browser with no installation, no backend dependency, no login credentials required beyond clicking a role selector

---

## 3. NON-GOALS FOR THIS DEMO

- Real payment processing — Stripe is simulated, not live
- Real authentication — roles are switched by clicking, not actual login
- Real database — all data is in-memory JavaScript state
- Mobile optimization — desktop browser only for the demo
- DR production portal in Spanish — English only for now
- Actual Zoho integration — Zoho is referenced but not connected
- All 40+ SKUs in the catalog — we use a representative set of 12 products across all categories

---

## 4. USER PERSONAS & ROLES

The demo has five switchable roles. A role selector bar at the top of the app lets the presenter switch between views during the demo with one click.

### Role 1 — Owner (Hustle Van Management)
Sees the full command dashboard. All territories, all orders, all inventory, all alerts. This is the "god view."

### Role 2 — Miami Warehouse Team
Sees the order queue, inventory management, receive shipments, and warehouse sale event mode.

### Role 3 — Wholesaler (Swift Wholesale — Account #0041)
Sees the wholesale marketplace, can browse products, place orders, view invoices, track shipments.

### Role 4 — Field Rep (working for a wholesaler)
Sees accounts they cover, can log a visit, check inventory availability, submit a reorder request.

### Role 5 — DR Production Team
Sees Miami inventory levels, reorder alerts, can submit a shipment manifest.

---

## 5. TECH STACK

- **Framework:** React (Next.js or Vite — whichever Claude Code defaults to)
- **Styling:** Tailwind CSS
- **State management:** React useState / useContext — no backend, no database
- **Data:** All hardcoded as JavaScript objects, structured to be easily swapped for real API data later
- **Routing:** React Router for screen navigation
- **Charts:** Recharts for any data visualizations
- **No external API calls** except optionally a weather/date API for the dashboard timestamp

---

## 6. DESIGN SYSTEM

### Color Palette
```
--bg:        #080C10   (page background)
--surface:   #0F1520   (sidebar, topbar)
--card:      #141E2C   (card backgrounds)
--card2:     #1A2535   (nested card backgrounds)
--border:    #1E2D40   (all borders)
--orange:    #F06A28   (primary brand color — CTAs, highlights)
--orange-d:  #C85420   (orange hover state)
--teal:      #0AABB8   (warehouse/operations color)
--lime:      #B8F000   (marketplace/wholesaler color)
--white:     #FFFFFF
--grey1:     #E8EDF2   (primary text)
--grey2:     #8FA3B1   (secondary text, labels)
--grey3:     #4A6274   (muted text)
--red:       #E03040   (alerts, danger, SC dark territory)
--green:     #1EC760   (success, active, good stock)
--amber:     #F5A623   (warnings, low stock)
```

### Typography
- Display/headers: Arial Black, letter-spacing 1-2px
- Body: Arial
- Data/numbers: Courier New monospace

### Component Standards
- Border radius: 4px small, 8px standard, 12px large
- All cards have a 3px top accent color bar indicating which portal they belong to
- Orange = owner/management
- Teal = warehouse
- Lime = wholesaler marketplace
- Amber = alerts

### Signature Element
The live inventory counter — a number that visibly decrements in real time when an order is placed or a sale is recorded. This is the moment the demo lands. Every other portal should show the same number changing. The user must feel the chain is connected.

---

## 7. APPLICATION STRUCTURE

```
App
├── RoleSwitcher (persistent top bar)
├── Screen: Opening / Cost Slide
├── Screen: Owner Dashboard
│   ├── KPI Strip (4 cards)
│   ├── Territory Map (5 states)
│   ├── Wholesaler Status Table
│   └── Live Activity Feed
├── Screen: Wholesale Marketplace
│   ├── Product Catalog (by category)
│   ├── Cart / Order Builder
│   └── Order Confirmation
├── Screen: Warehouse Portal
│   ├── Order Queue (pipeline view)
│   ├── Live Inventory Table
│   ├── Pick & Ship Actions
│   └── Receive Shipment
├── Screen: Warehouse Sale Event
│   ├── Event POS (record retail sale)
│   ├── Live Inventory Counter
│   └── Event Sales Log
├── Screen: DR Production Portal
│   ├── Miami Stock Visibility
│   ├── Reorder Alerts
│   ├── Schedule Shipment Form
│   └── Full Chain Visualization
└── Screen: Field Rep Portal
    ├── My Accounts
    ├── Log Visit Form
    └── Reorder Request
```

---

## 8. PRODUCT CATALOG DATA

Use this exact data structure. All prices are per master case. SKU format: brand-category-flavor.

```javascript
const PRODUCTS = [
  // ── FRONTO KING — SINGLE CIGARILLOS ──────────────────
  {
    id: 'fk-single-nat',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Single Cigarillos',
    name: 'FK Single Cigarillo — Natural',
    sku: 'FK-SNGL-NAT',
    masterCaseQty: 576,
    masterCasePrice: 288.00,
    unitPrice: 0.50,
    stock: 2304,        // 4 master cases
    reorderThreshold: 576,
    status: 'in_stock',
  },

  // ── FRONTO KING — 5PK CIGARILLOS ─────────────────────
  {
    id: 'fk-5pk-banana',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: '5PK Cigarillos',
    name: 'FK 5PK Cigarillos — Banana',
    sku: 'FK-5PK-BAN',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 576,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-5pk-natural',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: '5PK Cigarillos',
    name: 'FK 5PK Cigarillos — Natural',
    sku: 'FK-5PK-NAT',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 288,
    reorderThreshold: 144,
    status: 'low_stock',
  },
  {
    id: 'fk-5pk-rumcream',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: '5PK Cigarillos',
    name: 'FK 5PK Cigarillos — Rum Cream',
    sku: 'FK-5PK-RUM',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 432,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-5pk-sweet',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: '5PK Cigarillos',
    name: 'FK 5PK Cigarillos — Sweet',
    sku: 'FK-5PK-SWT',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 0,
    reorderThreshold: 144,
    status: 'out_of_stock',
  },

  // ── FRONTO KING — DARK CRUSH ──────────────────────────
  {
    id: 'fk-darkcrush-6gpkg',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Dark Crush',
    name: 'FK 6G Dark Crush Package — Natural',
    sku: 'FK-DC-6GPKG',
    masterCaseQty: 288,
    masterCasePrice: 288.00,
    unitPrice: 1.00,
    stock: 864,
    reorderThreshold: 288,
    status: 'in_stock',
  },
  {
    id: 'fk-darkcrush-6gbottle',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Dark Crush',
    name: 'FK 6G Dark Crush Bottle — Natural',
    sku: 'FK-DC-6GBOT',
    masterCaseQty: 288,
    masterCasePrice: 288.00,
    unitPrice: 1.00,
    stock: 576,
    reorderThreshold: 288,
    status: 'in_stock',
  },
  {
    id: 'fk-darkcrush-12gbottle',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Dark Crush',
    name: 'FK 12G Dark Crush Bottle — Natural',
    sku: 'FK-DC-12GBOT',
    masterCaseQty: 288,
    masterCasePrice: 432.00,
    unitPrice: 1.50,
    stock: 288,
    reorderThreshold: 288,
    status: 'low_stock',
  },

  // ── FRONTO KING — WHOLE LEAF ──────────────────────────
  {
    id: 'fk-wl-natural',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Whole Leaf',
    name: 'FK Whole Leaf — Natural (Original)',
    sku: 'FK-WL-NAT',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 720,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-wl-honey',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Whole Leaf',
    name: 'FK Whole Leaf — Honey',
    sku: 'FK-WL-HON',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 432,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-wl-grape',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Whole Leaf',
    name: 'FK Whole Leaf — Grape',
    sku: 'FK-WL-GRP',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 144,
    reorderThreshold: 144,
    status: 'low_stock',
  },
  {
    id: 'fk-wl-mango',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Whole Leaf',
    name: 'FK Whole Leaf — Mango',
    sku: 'FK-WL-MNG',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 288,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-wl-strawberry',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Whole Leaf',
    name: 'FK Whole Leaf — Strawberry',
    sku: 'FK-WL-STR',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 576,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-wl-vanilla',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Whole Leaf',
    name: 'FK Whole Leaf — Vanilla',
    sku: 'FK-WL-VAN',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 0,
    reorderThreshold: 144,
    status: 'out_of_stock',
  },
  {
    id: 'fk-wl-icymint',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Whole Leaf',
    name: 'FK Whole Leaf — Icy Mint',
    sku: 'FK-WL-ICY',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 288,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-wl-banana',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Whole Leaf',
    name: 'FK Whole Leaf — Banana',
    sku: 'FK-WL-BAN',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 432,
    reorderThreshold: 144,
    status: 'in_stock',
  },

  // ── FRONTO KING — HAND ROLLED CIGARS ─────────────────
  {
    id: 'fk-hr-double',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Hand Rolled Cigars',
    name: 'FK Hand Rolled — Double Cigar',
    sku: 'FK-HR-DBL',
    masterCaseQty: 144,
    masterCasePrice: 576.00,
    unitPrice: 4.00,
    stock: 288,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-hr-single',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Hand Rolled Cigars',
    name: 'FK Hand Rolled — Single Cigar',
    sku: 'FK-HR-SNGL',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 432,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-hr-mini',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Hand Rolled Cigars',
    name: 'FK Hand Rolled — Mini Cigar',
    sku: 'FK-HR-MINI',
    masterCaseQty: 144,
    masterCasePrice: 180.00,
    unitPrice: 1.25,
    stock: 288,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'fk-hr-wizzla',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Hand Rolled Cigars',
    name: 'FK Hand Rolled — Wizzla Cigar',
    sku: 'FK-HR-WIZ',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 144,
    reorderThreshold: 144,
    status: 'low_stock',
  },

  // ── FRONTO KING — MINI LEAF ───────────────────────────
  {
    id: 'fk-minileaf-nat',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Mini Leaf',
    name: 'FK Mini Leaf — Natural',
    sku: 'FK-ML-NAT',
    masterCaseQty: 144,
    masterCasePrice: 180.00,
    unitPrice: 1.25,
    stock: 576,
    reorderThreshold: 144,
    status: 'in_stock',
  },

  // ── FRONTO KING — HAND CUT WRAPS ─────────────────────
  {
    id: 'fk-8wraps-nat',
    brand: 'Fronto King',
    brandCode: 'FK',
    category: 'Wraps',
    name: 'FK 8 Hand-Cut Wraps — Natural',
    sku: 'FK-8W-NAT',
    masterCaseQty: 144,
    masterCasePrice: 576.00,
    unitPrice: 4.00,
    stock: 288,
    reorderThreshold: 144,
    status: 'in_stock',
  },

  // ── UP BRAND — WHOLE LEAF ─────────────────────────────
  {
    id: 'up-fronto-wl',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Whole Leaf',
    name: 'UP Fronto Whole Leaf',
    sku: 'UP-WL-FRNT',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 432,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'up-grabba-wl',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Whole Leaf',
    name: 'UP Grabba Whole Leaf',
    sku: 'UP-WL-GRAB',
    masterCaseQty: 144,
    masterCasePrice: 324.00,
    unitPrice: 2.25,
    stock: 576,
    reorderThreshold: 144,
    status: 'in_stock',
  },
  {
    id: 'up-grabba-minileaf',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Mini Leaf',
    name: 'UP Grabba Mini Leaf — Natural',
    sku: 'UP-ML-GRAB',
    masterCaseQty: 144,
    masterCasePrice: 180.00,
    unitPrice: 1.25,
    stock: 288,
    reorderThreshold: 144,
    status: 'in_stock',
  },

  // ── UP BRAND — SINGLE CIGARILLOS ─────────────────────
  {
    id: 'up-grabba-sngl',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Single Cigarillos',
    name: 'UP Grabba Single Cigarillo — Natural',
    sku: 'UP-SNGL-GRAB',
    masterCaseQty: 576,
    masterCasePrice: 288.00,
    unitPrice: 0.50,
    stock: 1152,
    reorderThreshold: 576,
    status: 'in_stock',
  },

  // ── UP BRAND — GRABBA BLEND ───────────────────────────
  {
    id: 'up-grabba-6gbottle',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Grabba Blend',
    name: 'UP Grabba Blend — 6G Bottle Natural',
    sku: 'UP-GB-6GBOT',
    masterCaseQty: 288,
    masterCasePrice: 288.00,
    unitPrice: 1.00,
    stock: 576,
    reorderThreshold: 288,
    status: 'in_stock',
  },
  {
    id: 'up-grabba-12gpkg',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Grabba Blend',
    name: 'UP Grabba Blend — 12G PKG Natural',
    sku: 'UP-GB-12GPKG',
    masterCaseQty: 288,
    masterCasePrice: 360.00,
    unitPrice: 1.25,
    stock: 0,
    reorderThreshold: 288,
    status: 'out_of_stock',
  },

  // ── UP BRAND — REDROSE BLEND ──────────────────────────
  {
    id: 'up-redrose-6gbottle',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Redrose Blend',
    name: 'UP Redrose Blend — 6G Bottle',
    sku: 'UP-RR-6GBOT',
    masterCaseQty: 288,
    masterCasePrice: 288.00,
    unitPrice: 1.00,
    stock: 864,
    reorderThreshold: 288,
    status: 'in_stock',
  },
  {
    id: 'up-redrose-12gbottle',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Redrose Blend',
    name: 'UP Redrose Blend — 12G Bottle',
    sku: 'UP-RR-12GBOT',
    masterCaseQty: 288,
    masterCasePrice: 432.00,
    unitPrice: 1.50,
    stock: 576,
    reorderThreshold: 288,
    status: 'in_stock',
  },

  // ── UP BRAND — WRAPS ──────────────────────────────────
  {
    id: 'up-grabba-wraps-2pk',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Wraps',
    name: 'UP Grabba Wraps — 2PK',
    sku: 'UP-WRP-2PK',
    masterCaseQty: 288,
    masterCasePrice: 216.00,
    unitPrice: 0.75,
    stock: 864,
    reorderThreshold: 288,
    status: 'in_stock',
  },
  {
    id: 'up-8wraps-handcut',
    brand: 'UP',
    brandCode: 'UP',
    category: 'Wraps',
    name: 'UP 8 Wraps Hand-Cut',
    sku: 'UP-8W-HCUT',
    masterCaseQty: 144,
    masterCasePrice: 576.00,
    unitPrice: 4.00,
    stock: 288,
    reorderThreshold: 144,
    status: 'in_stock',
  },
];
```

---

## 9. WHOLESALER ACCOUNTS DATA

```javascript
const WHOLESALERS = [
  { id: 'sw-0041', name: 'Swift Wholesale', territory: 'NC', city: 'Charlotte', status: 'active', balance: 0, lastOrder: '2026-06-11', creditLimit: 50000 },
  { id: 'sw-0022', name: 'Star Wholesale', territory: 'GA', city: 'Atlanta', status: 'active', balance: 4200, lastOrder: '2026-06-09', creditLimit: 40000 },
  { id: 'sw-0038', name: 'Sunrise Cash & Carry', territory: 'NC', city: 'Raleigh', status: 'active', balance: 0, lastOrder: '2026-06-08', creditLimit: 25000 },
  { id: 'sw-0051', name: 'A2Z Cash & Carry', territory: 'NC', city: 'Durham', status: 'active', balance: 2100, lastOrder: '2026-06-07', creditLimit: 20000 },
  { id: 'sw-0019', name: 'ABC Discount', territory: 'NC', city: 'Greensboro', status: 'hold', balance: 8100, lastOrder: '2026-05-28', creditLimit: 30000 },
  { id: 'sw-0044', name: 'Ja Imports', territory: 'FL', city: 'Miami', status: 'active', balance: 0, lastOrder: '2026-06-06', creditLimit: 35000 },
  { id: 'sw-0031', name: 'Rush NC Distributors', territory: 'NC', city: 'Winston-Salem', status: 'active', balance: 1500, lastOrder: '2026-06-05', creditLimit: 20000 },
  { id: 'sw-0027', name: 'MCT Wholesale', territory: 'NC', city: 'Fayetteville', status: 'active', balance: 0, lastOrder: '2026-06-03', creditLimit: 25000 },
  { id: 'sw-0055', name: 'NC Distro NC', territory: 'NC', city: 'Wilmington', status: 'active', balance: 0, lastOrder: '2026-05-28', creditLimit: 30000 },
  { id: 'sw-0062', name: 'South Carolina Distro', territory: 'SC', city: 'Columbia', status: 'dark', balance: 0, lastOrder: '2026-05-10', creditLimit: 20000 },
  { id: 'sw-0071', name: 'Texas Gulf Wholesale', territory: 'TX', city: 'Houston', status: 'active', balance: 3200, lastOrder: '2026-06-08', creditLimit: 45000 },
  { id: 'sw-0078', name: 'Lone Star Distro', territory: 'TX', city: 'Dallas', status: 'active', balance: 0, lastOrder: '2026-06-10', creditLimit: 35000 },
  { id: 'sw-0083', name: 'SoCal Imports', territory: 'CA', city: 'Los Angeles', status: 'active', balance: 0, lastOrder: '2026-06-09', creditLimit: 60000 },
  { id: 'sw-0089', name: 'Bay Area Smoke', territory: 'CA', city: 'San Francisco', status: 'active', balance: 1800, lastOrder: '2026-06-07', creditLimit: 40000 },
  { id: 'sw-0094', name: 'Peach State Wholesale', territory: 'GA', city: 'Savannah', status: 'active', balance: 0, lastOrder: '2026-06-06', creditLimit: 25000 },
];
```

---

## 10. SCREEN-BY-SCREEN REQUIREMENTS

---

### SCREEN 0 — OPENING / COST OF INACTION

**Purpose:** Show the decision maker what running the current system costs before showing the solution.

**Layout:**
- Full screen, dark background
- Company-addressed — "Hustle Van, LLC" in the headline
- Four cost cards in a 2×2 grid or horizontal row
- One total cost bar at the bottom
- Single CTA button: "See DistroOS →" which transitions to the Owner Dashboard

**Cost Cards (exact numbers):**

| Card | Value | Label | Description |
|---|---|---|---|
| 1 | $252,000 | Annual Order Gap | $21K monthly × 12 — orders not reaching fulfillment |
| 2 | $180,000 | SC Territory Dark | $15K/month active potential, $0 since May 10 |
| 3 | $32,500 | Manual Labor Cost | 25hrs/week × $25/hr — warehouse manual processing |
| 4 | $26,640 | Software Waste | Zoho + Badger — tools that don't solve the real problem |

**Total bar:** $541,140 / year — red background, large number

**Acceptance Criteria:**
- [ ] All four cost numbers visible simultaneously
- [ ] Total is visually dominant
- [ ] CTA button transitions to Owner Dashboard with fade animation
- [ ] No scrolling required — entire slide fits viewport

---

### SCREEN 1 — OWNER COMMAND DASHBOARD

**Purpose:** Give the owner/management view of the entire business in one screen.

**Topbar:**
- DistroOS logo left
- Live pulse dot + "Live · Updated just now" center
- Role switcher right

**Sidebar Navigation:**
- Dashboard (active)
- Wholesale Marketplace
- Warehouse Portal
- Events & Sales
- DR Production
- Analytics (disabled/coming soon)

**KPI Strip — 4 cards:**
1. June Revenue MTD — `$94,210` — lime — "On pace vs May"
2. Miami Inventory — `17,540 units` — teal — "2 SKUs below threshold"
3. Open Orders — `12` — orange — "3 shipped today"
4. Fulfillment Lag — `3.2 days` — red — "Target: 1.0 day"

**Territory Map — 5 state tiles, horizontal row:**

| State | Amount | Status | Color |
|---|---|---|---|
| NC | $70,038 | Active | Green |
| GA | $40,528 | Active | Green |
| SC | $0 | ⚠ Dark — 31 days | Red |
| FL | $22,100 | Growing | Amber |
| TX | $31,400 | Active | Green |

Clicking any tile shows a tooltip with account count and last order date.

**Alert Banner — persistent at top:**
"South Carolina — 31 days, $0 in orders. Territory has been dark since May 10. Automated alert triggered."
With an Escalate button that fires a toast: "Alert sent to SC territory manager."

**Wholesaler Status Table — 6 rows visible:**
Columns: Account Name | Territory | Last Order | Balance | Status
Show: Swift, Star, Sunrise, NC Distro, South Carolina Distro (red/dark), ABC Discount (hold)
Clicking any row navigates to that wholesaler's account detail (can be a modal for demo).

**Live Activity Feed — right column:**
4 pre-populated timeline items showing recent activity. When orders are placed in the marketplace, a new item animates in at the top of the feed.

**Acceptance Criteria:**
- [ ] SC territory tile is red and visibly different from active territories
- [ ] Alert banner is dismissable but returns on page reload
- [ ] Clicking territory tile shows tooltip with details
- [ ] Live activity feed updates in real time when orders are placed in other screens
- [ ] KPI inventory number decrements when orders are placed

---

### SCREEN 2 — WHOLESALE MARKETPLACE

**Purpose:** Show what a wholesaler sees when they log in to place an order. The DoorDash moment.

**Role context:** Logged in as Swift Wholesale — Account #0041 — Charlotte, NC

**Topbar shows:** "Swift Wholesale · Account #0041" with wholesaler avatar

**Sidebar:**
- Order Now (active)
- My Orders
- Invoices
- Track Shipments
- Payment Methods

**Brand Filter Tabs above product grid:**
- All Products
- Fronto King
- UP Brand

**Category Filter — horizontal pill buttons:**
All | Single Cigarillos | 5PK Cigarillos | Whole Leaf | Dark Crush | Hand Rolled | Mini Leaf | Wraps | Grabba Blend | Redrose Blend

**Product Grid — 3 columns:**

Each product card contains:
- Product name (bold)
- SKU (monospace, muted)
- Stock status badge (In Stock green / Low Stock amber / Out of Stock red)
- Master case price (large, lime colored)
- Master case quantity (e.g. "144 units per case")
- Stock bar showing inventory level visually
- Available units count
- Quantity input field (number input, increments by 1 case)
- "Add to Order" button (disabled if out of stock)

Out of stock cards are grayed out with "Next shipment ETA" shown.

**Order Summary Sidebar (sticky right):**
- Lists each item added with case quantity and total
- Running total in lime color
- Payment method: "Visa ending 4141 (on file)"
- Estimated ship: "Within 24 hours of confirmation"
- "Submit Order & Generate Invoice" button — lime, full width

**On Submit Order:**
1. Toast appears: "✓ Order submitted. Invoice generated. Miami warehouse notified."
2. Order appears in warehouse queue screen (shared state)
3. Activity feed on owner dashboard updates
4. Inventory numbers decrement across all screens
5. Auto-navigate to order confirmation screen after 1.5 seconds

**Order Confirmation Screen (post-submit):**
- Order number: SO-[random 4 digit]
- Items ordered with quantities and prices
- Total amount
- Status: "Invoice Generated — Payment Processing"
- "Track This Order →" button

**Acceptance Criteria:**
- [ ] Brand and category filters work independently and together
- [ ] Stock bar visually reflects inventory level (low = amber bar, out = empty)
- [ ] Quantity input only accepts whole numbers (no partial cases)
- [ ] Order total calculates correctly as quantities change
- [ ] Submit triggers inventory decrement visible on warehouse and dashboard screens
- [ ] Out of stock products cannot be added to order
- [ ] Low stock products show warning before adding

---

### SCREEN 3 — WAREHOUSE PORTAL

**Purpose:** Show what Miami warehouse team sees. Orders appear the moment wholesalers submit. No emails, no calls.

**Role context:** Miami Warehouse Team

**Pipeline Header — 5 stages:**
Field Visit → Order Received → In Pick → Staged → Shipped → Delivered
Each stage shows count of orders in that stage. Active stage highlighted orange.

**Order Queue — card list:**

Each order card contains:
- Left color indicator bar (orange = new/urgent, teal = in pick, green = staged)
- Wholesaler name + order number
- Timestamp (e.g. "Received 2 minutes ago")
- Territory badge
- Product summary (e.g. "FK Whole Leaf Natural × 5 cases · FK 5PK Banana × 3 cases")
- Order total
- Status badge
- Action buttons based on status:
  - New: "Start Pick" + "View Details"
  - In Pick: "Print Pick List" + "Mark Staged"
  - Staged: "Mark Shipped & Send Tracking"

**When a new order arrives (from marketplace screen):**
- New card animates in at the top of the queue
- Card has orange border and glow effect
- "⚡ Just In" badge
- Warehouse counter increments

**Start Pick action:**
- Card status changes from New → In Pick
- Card color changes from orange to teal
- Toast: "Pick list generated for [wholesaler name]"

**Mark Shipped action:**
- Card collapses to a compact shipped row
- Toast: "Tracking info sent to [wholesaler] automatically"
- Activity feed on dashboard updates

**Live Inventory Table — below queue:**
Columns: Product | In Stock | Reserved | Available | Status
Shows all products with real-time decrements as orders are picked.
Reserved column shows units committed to open orders not yet shipped.

**Acceptance Criteria:**
- [ ] New orders from marketplace appear without page refresh
- [ ] Order cards show correct product details from the submitted order
- [ ] Pick → Staged → Shipped flow works sequentially
- [ ] Shipped action fires toast confirming tracking sent
- [ ] Inventory table updates in real time as picks are confirmed
- [ ] Reserved column accurately reflects outstanding orders

---

### SCREEN 4 — WAREHOUSE SALE EVENT

**Purpose:** Solve the trade show problem Dee witnessed. Retail sales at events update the same inventory wholesalers see. No paper counts after.

**Role context:** Miami Warehouse Team — Event Mode

**Alert banner at top:**
"Event Mode Active. Every sale recorded here instantly updates live inventory. Wholesalers see accurate stock in real time. No paper purchase orders required after this event."

**Left Panel — Event POS:**
- Product dropdown (all products)
- Shows current available stock next to each product in dropdown
- Quantity sold input
- Buyer name / business name input
- "Record Sale & Update Inventory →" button

**Right Panel — Live Inventory Counter:**
- Large animated total units number (ticks down with each sale)
- Below: per-product breakdown with individual counters
- Each counter animates and flashes red when decremented
- Color coding: green → amber → red as stock depletes

**Below — Event Sales Log:**
Columns: Buyer | Product | Qty | Time
Each new sale animates in at the top of the log.

**At the bottom — Before/After Callout:**
"Before DistroOS: After this event, warehouse staff would spend 3+ hours walking the floor with paper purchase orders to figure out what was left. Right now that count is already done — automatically."

**Acceptance Criteria:**
- [ ] Product dropdown shows current stock level for each item
- [ ] Recording a sale immediately decrements the live counter
- [ ] Per-product breakdown updates in real time
- [ ] Sales log entries animate in
- [ ] If quantity entered exceeds available stock, show error: "Only [X] units available"
- [ ] Total inventory counter color shifts from green → amber → red as stock depletes
- [ ] Same inventory numbers are visible on warehouse portal and owner dashboard

---

### SCREEN 5 — DR PRODUCTION PORTAL

**Purpose:** Show that DR can see Miami's real inventory and know exactly what to produce and ship without a phone call.

**Role context:** DR Production Team — Santo Domingo

**Alert Banner — Red (critical):**
"REORDER ALERT — FK 5PK Cigarillos Natural & FK Whole Leaf Grape below reorder threshold. Schedule next production run and shipment to Miami by July 8."

**KPI Strip — 4 cards:**
1. In Production — 12,400 units — orange
2. Ready to Ship — 8,200 units — green
3. In Transit → Miami — 3,600 units — teal — "ETA July 3"
4. Miami On Hand — shows live number from shared state — amber if any item below threshold

**Demand Signal Table (left panel):**
Columns: Product | Miami Stock | 30-Day Demand | Days of Supply | Alert
- Pulls from the same inventory state — when marketplace orders are placed, Miami stock column decrements here too
- Days of Supply calculated as: Miami Stock ÷ (30-Day Demand ÷ 30)
- Alert column: "Reorder Now" (red) if below threshold, "OK" (green) if sufficient

**Schedule Next Shipment Form (right panel):**
- Departure date input (pre-filled: July 2, 2026)
- Estimated arrival Miami input (pre-filled: July 8, 2026)
- Per-product quantity inputs (pre-filled with recommended amounts based on demand signal)
- "Submit Shipment Manifest → Miami Notified" button
- On submit: toast "✓ Shipment scheduled. Miami warehouse notified. No phone call needed."

**Full Chain Visualization — bottom:**
Horizontal flow: DR Production → In Transit → Miami Warehouse → Wholesalers → Tobacco Shops
Each node shows live unit counts from shared state.
Arrows connect each node.

**Acceptance Criteria:**
- [ ] Miami stock column reflects real-time changes from orders placed in marketplace
- [ ] Days of Supply calculates correctly
- [ ] Items below reorder threshold show red alert badge
- [ ] Shipment manifest form pre-fills recommended quantities
- [ ] Submit fires toast and would (in real system) notify Miami
- [ ] Chain visualization shows correct counts across all nodes

---

### SCREEN 6 — FIELD REP PORTAL

**Purpose:** Show what a field rep sees when visiting tobacco shop accounts on behalf of their wholesaler.

**Role context:** Field Rep — working for Swift Wholesale — NC Territory

**My Accounts List:**
- Charlotte Smoke Shop — Charlotte NC — Last visit: 3 days ago
- Uptown Tobacco — Charlotte NC — Last visit: 1 week ago
- Monroe Smoke & Vape — Monroe NC — Last visit: 2 weeks ago — ⚠ Low reorder signal
- Kings Mountain Tobacco — Kings Mountain NC — Never visited

**Clicking an account opens Account Detail:**
- Account name, address, contact
- Last order date and amount
- Products they carry (from their order history)
- Current stock estimate (entered by rep on last visit)
- Visit history

**Log Visit Form:**
- Account (pre-selected from list)
- Visit type: Visit / Call / Sample Drop / Inventory Check / Reorder
- Products low or out (multi-select from catalog)
- Notes text area
- Reorder request toggle — if on, shows quantity input per product
- "Submit & Sync" button

**On Submit:**
- Toast: "✓ Visit logged. Reorder request sent to Swift Wholesale."
- Activity feed on dashboard updates (rep activity visible to owner)

**Acceptance Criteria:**
- [ ] Account list shows visit recency visually (color coded)
- [ ] Log visit form captures all required fields
- [ ] Reorder request flows up to wholesaler account (shown as pending order in marketplace)
- [ ] Activity shows in owner dashboard feed

---

## 11. SHARED STATE REQUIREMENTS

This is the most important technical requirement. All screens share the same inventory state. When inventory changes on any screen, it changes on all screens simultaneously.

**Shared state object:**
```javascript
const GlobalState = {
  inventory: {},          // productId → units available
  orders: [],             // submitted orders
  eventSales: [],         // warehouse event sales
  activityFeed: [],       // cross-portal activity
  alerts: {
    sc_dark: true,
    reorder_items: ['fk-5pk-natural', 'fk-wl-grape', 'fk-darkcrush-12gbottle'],
  },
  territories: {
    NC: { revenue: 70038, status: 'active', accounts: 8 },
    GA: { revenue: 40528, status: 'active', accounts: 5 },
    SC: { revenue: 0, status: 'dark', accounts: 2, daysDark: 31 },
    FL: { revenue: 22100, status: 'growing', accounts: 3 },
    TX: { revenue: 31400, status: 'active', accounts: 4 },
  },
};
```

**State update rules:**
- When a wholesaler submits an order: decrement inventory for each ordered product by (cases × masterCaseQty), add order to orders array, add event to activityFeed
- When a warehouse event sale is recorded: decrement the same inventory, add to eventSales, add to activityFeed
- When a shipment is received from DR: increment inventory, add to activityFeed
- Any component subscribed to inventory must re-render when it changes

---

## 12. ROLE SWITCHER COMPONENT

Persistent across all screens. Allows demo presenter to switch between roles without breaking state.

**Design:**
- Horizontal pill group in the top-right of every screen
- 5 pills: Owner | Warehouse | Wholesaler | Field Rep | DR Production
- Active pill: orange background
- Inactive pills: ghost style

**On role switch:**
- Navigate to the default screen for that role
- Update the topbar user context
- Do not reset state — inventory numbers persist across role switches

---

## 13. DEMO FLOW (the exact path for the meeting)

Build the app so this exact sequence works smoothly:

1. Open to Opening screen → decision maker reads the $541,140 number
2. Click "See DistroOS →" → Owner Dashboard
3. Point to SC territory (red) → click it → tooltip shows 31 days dark
4. Switch role to Wholesaler → Marketplace
5. Filter by Fronto King → find FK Single Cigarillo Natural → add 4 cases to order
6. Add FK Whole Leaf Natural → 2 cases
7. Submit Order
8. Switch role to Warehouse → order appears in queue with orange glow
9. Click Start Pick → status changes
10. Switch role to Owner → activity feed shows the order, inventory KPI decremented
11. Switch role to Warehouse → click Events & Sales tab
12. Record a retail sale of 100 units FK Whole Leaf Honey
13. Watch inventory counter tick down
14. Switch role to Owner → inventory number on dashboard has changed
15. Switch role to DR Production → demand signal table shows Miami stock
16. One item shows reorder alert → fill in shipment manifest → submit
17. Toast confirms Miami notified

That sequence must work without any breaks, loading states longer than 0.5 seconds, or errors.

---

## 14. PERFORMANCE REQUIREMENTS

- All state changes must render in under 200ms
- No loading spinners for in-memory operations
- Page transitions: fade in 350ms
- Inventory counter decrements: animate over 400ms with color flash
- Toast notifications: appear in 300ms, dismiss after 3 seconds

---

## 15. OPEN QUESTIONS FOR CLIENT FEEDBACK

Build a visible "Feedback" button in the bottom right corner of every screen. Clicking it opens a modal with these questions pre-filled:

```
What we want to know from you:
1. Is anything in this workflow different from how you actually operate?
2. Is there anything you do today that you don't see here?
3. Are there user types we haven't thought of?
4. What would make you not want to use this?
5. What would make you sign today?
```

Free text area below. Submit button logs to console (no backend needed). This is how we collect feedback during the demo.

---

## 16. WHAT CLAUDE CODE SHOULD BUILD FIRST

In this order:

1. Set up React app with Tailwind
2. Create GlobalState context with all product and wholesaler data
3. Build RoleSwitcher component
4. Build Opening screen (static)
5. Build Owner Dashboard (reads from GlobalState)
6. Build Wholesale Marketplace (writes to GlobalState)
7. Wire state so order submission updates dashboard
8. Build Warehouse Portal (reads from GlobalState, writes on pick/ship)
9. Build Warehouse Sale Event (writes to GlobalState)
10. Build DR Production Portal (reads Miami inventory from GlobalState)
11. Build Field Rep Portal
12. Polish: animations, transitions, toasts, feedback button
13. Final pass: run through the demo flow — fix any breaks

---

## 17. FILES CLAUDE CODE SHOULD CREATE

```
/src
  /context
    GlobalState.jsx       ← all shared state, all update functions
  /data
    products.js           ← PRODUCTS array from Section 8
    wholesalers.js        ← WHOLESALERS array from Section 9
    activityFeed.js       ← initial feed items
  /components
    RoleSwitcher.jsx
    Topbar.jsx
    Sidebar.jsx
    KpiCard.jsx
    Badge.jsx
    Button.jsx
    Toast.jsx
    FeedbackModal.jsx
    ProductCard.jsx
    OrderCard.jsx
    TerritoryTile.jsx
    InventoryCounter.jsx  ← the animated number component
    ChainVisualization.jsx
    PipelineSteps.jsx
  /screens
    Opening.jsx
    OwnerDashboard.jsx
    WholesaleMarketplace.jsx
    OrderConfirmation.jsx
    WarehousePortal.jsx
    WarehouseSaleEvent.jsx
    DrProductionPortal.jsx
    FieldRepPortal.jsx
  App.jsx
  index.jsx
  index.css              ← CSS variables from design system
```

---

*End of PRD. Hand this document to Claude Code in Cursor. Start with GlobalState.jsx and work through the file list in order. Do not skip steps. Every screen must connect to shared state before moving to the next screen.*
