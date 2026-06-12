export const WHOLESALERS = [
  { id: 'sw-0041', name: 'Swift Wholesale',        territory: 'NC', city: 'Charlotte',     status: 'active', balance: 0,    lastOrder: '2026-06-11', creditLimit: 50000 },
  { id: 'sw-0022', name: 'Star Wholesale',          territory: 'GA', city: 'Atlanta',       status: 'active', balance: 4200, lastOrder: '2026-06-09', creditLimit: 40000 },
  { id: 'sw-0038', name: 'Sunrise Cash & Carry',    territory: 'NC', city: 'Raleigh',       status: 'active', balance: 0,    lastOrder: '2026-06-08', creditLimit: 25000 },
  { id: 'sw-0051', name: 'A2Z Cash & Carry',        territory: 'NC', city: 'Durham',        status: 'active', balance: 2100, lastOrder: '2026-06-07', creditLimit: 20000 },
  { id: 'sw-0019', name: 'ABC Discount',            territory: 'NC', city: 'Greensboro',    status: 'hold',   balance: 8100, lastOrder: '2026-05-28', creditLimit: 30000 },
  { id: 'sw-0044', name: 'Ja Imports',              territory: 'FL', city: 'Miami',         status: 'active', balance: 0,    lastOrder: '2026-06-06', creditLimit: 35000 },
  { id: 'sw-0031', name: 'Rush NC Distributors',    territory: 'NC', city: 'Winston-Salem', status: 'active', balance: 1500, lastOrder: '2026-06-05', creditLimit: 20000 },
  { id: 'sw-0027', name: 'MCT Wholesale',           territory: 'NC', city: 'Fayetteville',  status: 'active', balance: 0,    lastOrder: '2026-06-03', creditLimit: 25000 },
  { id: 'sw-0055', name: 'NC Distro NC',            territory: 'NC', city: 'Wilmington',    status: 'active', balance: 0,    lastOrder: '2026-05-28', creditLimit: 30000 },
  { id: 'sw-0062', name: 'South Carolina Distro',   territory: 'SC', city: 'Columbia',      status: 'dark',   balance: 0,    lastOrder: '2026-05-10', creditLimit: 20000 },
  { id: 'sw-0071', name: 'Texas Gulf Wholesale',    territory: 'TX', city: 'Houston',       status: 'active', balance: 3200, lastOrder: '2026-06-08', creditLimit: 45000 },
  { id: 'sw-0078', name: 'Lone Star Distro',        territory: 'TX', city: 'Dallas',        status: 'active', balance: 0,    lastOrder: '2026-06-10', creditLimit: 35000 },
  { id: 'sw-0083', name: 'SoCal Imports',           territory: 'CA', city: 'Los Angeles',   status: 'active', balance: 0,    lastOrder: '2026-06-09', creditLimit: 60000 },
  { id: 'sw-0089', name: 'Bay Area Smoke',          territory: 'CA', city: 'San Francisco', status: 'active', balance: 1800, lastOrder: '2026-06-07', creditLimit: 40000 },
  { id: 'sw-0094', name: 'Peach State Wholesale',   territory: 'GA', city: 'Savannah',      status: 'active', balance: 0,    lastOrder: '2026-06-06', creditLimit: 25000 },
];

// The demo wholesaler — logged in as Wholesaler role
export const DEMO_WHOLESALER = WHOLESALERS.find(w => w.id === 'sw-0041');
