import { createContext, useContext, useReducer, useCallback } from 'react';
import { PRODUCTS } from '../data/products';
import { WHOLESALERS } from '../data/wholesalers';
import { INITIAL_ACTIVITY } from '../data/activityFeed';

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = {
  OWNER:       'owner',
  WAREHOUSE:   'warehouse',
  WHOLESALER:  'wholesaler',
  FIELD_REP:   'field_rep',
  DR:          'dr',
};

// ─── Build initial inventory map from PRODUCTS ───────────────────────────────
function buildInitialInventory() {
  return Object.fromEntries(PRODUCTS.map(p => [p.id, p.stock]));
}

// ─── Compute per-product status from stock level ─────────────────────────────
function computeStatus(stock, threshold) {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= threshold) return 'low_stock';
  return 'in_stock';
}

// ─── Initial state ────────────────────────────────────────────────────────────
const initialState = {
  // Current role shown in the app
  activeRole: ROLES.OWNER,

  // productId → units available (live, mutated by all portals)
  inventory: buildInitialInventory(),

  // Orders submitted from the marketplace
  orders: [],

  // Warehouse event (trade show) retail sales
  eventSales: [],

  // Cross-portal timeline — new items prepended
  activityFeed: INITIAL_ACTIVITY,

  // Alerts
  alerts: {
    sc_dark: true,
    reorder_items: ['fk-5pk-natural', 'fk-wl-grape', 'fk-darkcrush-12gbottle'],
  },

  // Territory revenue + status
  territories: {
    NC: { revenue: 70038, status: 'active',  accounts: 8 },
    GA: { revenue: 40528, status: 'active',  accounts: 5 },
    SC: { revenue: 0,     status: 'dark',    accounts: 2, daysDark: 31 },
    FL: { revenue: 22100, status: 'growing', accounts: 3 },
    TX: { revenue: 31400, status: 'active',  accounts: 4 },
  },

  // Static wholesaler list — balance can update if order submitted
  wholesalers: WHOLESALERS,

  // Toast notifications queue
  toasts: [],
};

// ─── Action types ─────────────────────────────────────────────────────────────
const A = {
  SET_ROLE:            'SET_ROLE',
  SUBMIT_ORDER:        'SUBMIT_ORDER',
  ADVANCE_ORDER:       'ADVANCE_ORDER',    // warehouse pick/stage/ship
  RECORD_EVENT_SALE:   'RECORD_EVENT_SALE',
  RECEIVE_SHIPMENT:    'RECEIVE_SHIPMENT', // DR shipment received in Miami
  DISMISS_SC_ALERT:    'DISMISS_SC_ALERT',
  ADD_TOAST:           'ADD_TOAST',
  REMOVE_TOAST:        'REMOVE_TOAST',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function newActivityId() {
  return `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function newOrderId() {
  return `SO-${String(Math.floor(8900 + Math.random() * 999)).padStart(4, '0')}`;
}

// Rebuild reorder alert list after any inventory change
function refreshReorderItems(inventory) {
  return PRODUCTS
    .filter(p => inventory[p.id] <= p.reorderThreshold)
    .map(p => p.id);
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case A.SET_ROLE:
      return { ...state, activeRole: action.role };

    case A.SUBMIT_ORDER: {
      const { wholesalerId, items } = action;
      // items: [{ productId, cases }]

      const wholesaler = state.wholesalers.find(w => w.id === wholesalerId);
      const orderId = newOrderId();
      const now = new Date().toISOString();

      // Decrement inventory
      const newInventory = { ...state.inventory };
      items.forEach(({ productId, cases }) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) {
          newInventory[productId] = Math.max(0, (newInventory[productId] ?? 0) - cases * product.masterCaseQty);
        }
      });

      // Build order record
      const orderTotal = items.reduce((sum, { productId, cases }) => {
        const product = PRODUCTS.find(p => p.id === productId);
        return sum + (product ? product.masterCasePrice * cases : 0);
      }, 0);

      const order = {
        id: orderId,
        wholesalerId,
        wholesalerName: wholesaler?.name ?? wholesalerId,
        territory: wholesaler?.territory ?? '—',
        items,
        total: orderTotal,
        status: 'received',       // received → in_pick → staged → shipped → delivered
        createdAt: now,
        updatedAt: now,
        isNew: true,
      };

      // Build product summary string for feed
      const summary = items.map(({ productId, cases }) => {
        const p = PRODUCTS.find(p => p.id === productId);
        return p ? `${p.name} × ${cases} case${cases > 1 ? 's' : ''}` : productId;
      }).join(', ');

      const feedItem = {
        id: newActivityId(),
        type: 'order_placed',
        timestamp: now,
        actor: wholesaler?.name ?? wholesalerId,
        actorId: wholesalerId,
        message: `${wholesaler?.name ?? wholesalerId} placed order ${orderId} — ${summary}`,
        amount: orderTotal,
        portal: 'marketplace',
      };

      return {
        ...state,
        inventory: newInventory,
        orders: [order, ...state.orders],
        activityFeed: [feedItem, ...state.activityFeed],
        alerts: {
          ...state.alerts,
          reorder_items: refreshReorderItems(newInventory),
        },
      };
    }

    case A.ADVANCE_ORDER: {
      const { orderId, nextStatus } = action;
      const now = new Date().toISOString();

      const updatedOrders = state.orders.map(o =>
        o.id === orderId
          ? { ...o, status: nextStatus, isNew: false, updatedAt: now }
          : o
      );

      const order = state.orders.find(o => o.id === orderId);
      let feedItem = null;

      if (nextStatus === 'shipped' && order) {
        feedItem = {
          id: newActivityId(),
          type: 'order_shipped',
          timestamp: now,
          actor: 'Miami Warehouse',
          actorId: 'warehouse',
          message: `Order ${orderId} shipped to ${order.wholesalerName} — Tracking sent automatically`,
          amount: null,
          portal: 'warehouse',
        };
      }

      return {
        ...state,
        orders: updatedOrders,
        activityFeed: feedItem ? [feedItem, ...state.activityFeed] : state.activityFeed,
      };
    }

    case A.RECORD_EVENT_SALE: {
      const { productId, qty, buyerName } = action;
      const product = PRODUCTS.find(p => p.id === productId);
      const now = new Date().toISOString();

      if (!product) return state;

      const newInventory = {
        ...state.inventory,
        [productId]: Math.max(0, (state.inventory[productId] ?? 0) - qty),
      };

      const sale = {
        id: `evt-${Date.now()}`,
        productId,
        productName: product.name,
        qty,
        buyerName,
        timestamp: now,
      };

      const feedItem = {
        id: newActivityId(),
        type: 'event_sale',
        timestamp: now,
        actor: 'Warehouse Event',
        actorId: 'warehouse',
        message: `Event sale recorded — ${product.name} × ${qty} units to ${buyerName}`,
        amount: product.unitPrice * qty,
        portal: 'warehouse',
      };

      return {
        ...state,
        inventory: newInventory,
        eventSales: [sale, ...state.eventSales],
        activityFeed: [feedItem, ...state.activityFeed],
        alerts: {
          ...state.alerts,
          reorder_items: refreshReorderItems(newInventory),
        },
      };
    }

    case A.RECEIVE_SHIPMENT: {
      // items: [{ productId, qty }]
      const { items, manifestId } = action;
      const now = new Date().toISOString();

      const newInventory = { ...state.inventory };
      items.forEach(({ productId, qty }) => {
        newInventory[productId] = (newInventory[productId] ?? 0) + qty;
      });

      const feedItem = {
        id: newActivityId(),
        type: 'shipment_received',
        timestamp: now,
        actor: 'DR Production',
        actorId: 'dr',
        message: `Shipment manifest ${manifestId ?? 'DR-MANIFEST'} received in Miami — ${items.length} SKU${items.length > 1 ? 's' : ''} restocked`,
        amount: null,
        portal: 'dr',
      };

      return {
        ...state,
        inventory: newInventory,
        activityFeed: [feedItem, ...state.activityFeed],
        alerts: {
          ...state.alerts,
          reorder_items: refreshReorderItems(newInventory),
        },
      };
    }

    case A.DISMISS_SC_ALERT:
      return {
        ...state,
        alerts: { ...state.alerts, sc_dark: false },
      };

    case A.ADD_TOAST: {
      const toast = {
        id: `toast-${Date.now()}`,
        message: action.message,
        variant: action.variant ?? 'success', // success | error | info
      };
      return { ...state, toasts: [...state.toasts, toast] };
    }

    case A.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.id),
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const GlobalContext = createContext(null);

export function GlobalStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Action creators ──────────────────────────────────────────────────────
  const setRole = useCallback((role) => {
    dispatch({ type: A.SET_ROLE, role });
  }, []);

  const submitOrder = useCallback((wholesalerId, items) => {
    dispatch({ type: A.SUBMIT_ORDER, wholesalerId, items });
  }, []);

  const advanceOrder = useCallback((orderId, nextStatus) => {
    dispatch({ type: A.ADVANCE_ORDER, orderId, nextStatus });
  }, []);

  const recordEventSale = useCallback((productId, qty, buyerName) => {
    dispatch({ type: A.RECORD_EVENT_SALE, productId, qty, buyerName });
  }, []);

  const receiveShipment = useCallback((items, manifestId) => {
    dispatch({ type: A.RECEIVE_SHIPMENT, items, manifestId });
  }, []);

  const dismissScAlert = useCallback(() => {
    dispatch({ type: A.DISMISS_SC_ALERT });
  }, []);

  const addToast = useCallback((message, variant = 'success') => {
    const id = `toast-${Date.now()}`;
    dispatch({ type: A.ADD_TOAST, message, variant });
    // Auto-dismiss after 3 seconds
    setTimeout(() => dispatch({ type: A.REMOVE_TOAST, id }), 3000);
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: A.REMOVE_TOAST, id });
  }, []);

  // ── Derived selectors ────────────────────────────────────────────────────

  // Total live units across all products
  const totalInventoryUnits = Object.values(state.inventory).reduce((s, v) => s + v, 0);

  // Enrich products with live stock from state
  const liveProducts = PRODUCTS.map(p => ({
    ...p,
    stock: state.inventory[p.id] ?? 0,
    status: computeStatus(state.inventory[p.id] ?? 0, p.reorderThreshold),
  }));

  // How many SKUs are below reorder threshold
  const skusBelowThreshold = state.alerts.reorder_items.length;

  // Count of open orders (not delivered)
  const openOrderCount = state.orders.filter(o => o.status !== 'delivered').length;

  // Reserved units per product — committed in open orders not yet shipped
  const reservedInventory = state.orders
    .filter(o => !['shipped', 'delivered'].includes(o.status))
    .flatMap(o => o.items)
    .reduce((acc, { productId, cases }) => {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return acc;
      acc[productId] = (acc[productId] ?? 0) + cases * product.masterCaseQty;
      return acc;
    }, {});

  const value = {
    // State
    ...state,
    // Derived
    totalInventoryUnits,
    liveProducts,
    skusBelowThreshold,
    openOrderCount,
    reservedInventory,
    // Actions
    setRole,
    submitOrder,
    advanceOrder,
    recordEventSale,
    receiveShipment,
    dismissScAlert,
    addToast,
    removeToast,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useGlobalState() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('useGlobalState must be used within GlobalStateProvider');
  return ctx;
}
