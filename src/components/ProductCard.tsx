import { useState } from 'react'

const STATUS_COLOR = {
  in_stock:     'var(--green)',
  low_stock:    'var(--amber)',
  out_of_stock: 'var(--red)',
}
const STATUS_LABEL = {
  in_stock:     'In Stock',
  low_stock:    'Low Stock',
  out_of_stock: 'Out of Stock',
}

export default function ProductCard({ product, cartQty, onAdd }) {
  const [qty, setQty] = useState(1)
  const isOut = product.status === 'out_of_stock'
  const isLow = product.status === 'low_stock'
  const statusColor = STATUS_COLOR[product.status]
  const maxCases = Math.floor(product.stock / product.masterCaseQty)
  const stockPct = Math.min(100, (product.stock / (product.reorderThreshold * 4)) * 100)

  function handleAdd() {
    if (isOut) return
    if (isLow) {
      const ok = window.confirm(`Low stock warning: only ${product.stock} units available. Add ${qty} case(s)?`)
      if (!ok) return
    }
    onAdd(product.id, qty)
    setQty(1)
  }

  return (
    <div style={{
      background: isOut ? 'var(--card2)' : 'var(--card)',
      border: '1px solid var(--border)',
      borderTop: `3px solid ${statusColor}`,
      borderRadius: '8px',
      padding: '18px',
      opacity: isOut ? 0.6 : 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {/* Name + SKU */}
      <div>
        <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--grey1)', lineHeight: '1.3', marginBottom: '4px' }}>
          {product.name}
        </div>
        <div style={{ fontFamily: 'Courier New', fontSize: '11px', color: 'var(--grey3)' }}>{product.sku}</div>
      </div>

      {/* Status badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        background: `${statusColor}22`, color: statusColor,
        borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '700',
        letterSpacing: '1px', alignSelf: 'flex-start',
      }}>
        {STATUS_LABEL[product.status].toUpperCase()}
      </div>

      {/* Stock bar */}
      <div>
        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${stockPct}%`,
            background: statusColor,
            borderRadius: '2px',
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--grey3)', marginTop: '4px' }}>
          {product.stock.toLocaleString()} units available
          {isOut && <span style={{ color: 'var(--grey3)', marginLeft: '8px' }}>Next shipment ETA: July 8</span>}
        </div>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: '24px', fontFamily: "'Arial Black'", color: 'var(--lime)', letterSpacing: '-1px' }}>
          ${product.masterCasePrice.toFixed(2)}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--grey3)' }}>
          {product.masterCaseQty} units/case
        </div>
      </div>

      {/* Add to order */}
      {!isOut && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            min="1"
            max={maxCases || 1}
            value={qty}
            onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              width: '60px', background: 'var(--card2)', border: '1px solid var(--border)',
              borderRadius: '6px', color: 'var(--grey1)', fontSize: '13px',
              padding: '8px', textAlign: 'center', fontFamily: 'Courier New',
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              flex: 1, background: cartQty > 0 ? 'rgba(184,240,0,0.15)' : 'var(--lime)',
              border: cartQty > 0 ? '1px solid var(--lime)' : 'none',
              color: cartQty > 0 ? 'var(--lime)' : '#000',
              borderRadius: '6px', fontSize: '12px', fontWeight: '700',
              cursor: 'pointer', padding: '8px',
            }}
          >
            {cartQty > 0 ? `✓ ${cartQty} case${cartQty > 1 ? 's' : ''} added` : 'Add to Order'}
          </button>
        </div>
      )}
    </div>
  )
}
