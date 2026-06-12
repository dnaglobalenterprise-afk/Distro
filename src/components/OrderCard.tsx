import { useGlobalState } from '../context/GlobalState'
import { PRODUCTS } from '../data/products'

const STATUS_NEXT = {
  received: 'in_pick',
  in_pick:  'staged',
  staged:   'shipped',
}
const STATUS_ACTION = {
  received: 'Start Pick',
  in_pick:  'Mark Staged',
  staged:   'Mark Shipped & Send Tracking',
}
const STATUS_COLOR = {
  received: 'var(--orange)',
  in_pick:  'var(--teal)',
  staged:   'var(--lime)',
  shipped:  'var(--green)',
  delivered:'var(--green)',
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  return `${Math.floor(diff / 3600)} hours ago`
}

export default function OrderCard({ order }) {
  const { advanceOrder, addToast } = useGlobalState()
  const isShipped = ['shipped', 'delivered'].includes(order.status)
  const color = STATUS_COLOR[order.status] ?? 'var(--grey2)'

  function handleAction() {
    const next = STATUS_NEXT[order.status]
    if (!next) return
    advanceOrder(order.id, next)
    if (next === 'in_pick') addToast(`Pick list generated for ${order.wholesalerName}`)
    if (next === 'shipped') addToast(`Tracking info sent to ${order.wholesalerName} automatically`)
  }

  const summary = order.items.map(({ productId, cases }) => {
    const p = PRODUCTS.find(p => p.id === productId)
    return p ? `${p.name} × ${cases} case${cases > 1 ? 's' : ''}` : productId
  }).join(' · ')

  if (isShipped) {
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderLeft: `4px solid ${color}`, borderRadius: '8px',
        padding: '10px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px', opacity: 0.7,
      }}>
        <div style={{ fontSize: '12px', color: 'var(--grey2)' }}>
          <span style={{ color: 'var(--green)', marginRight: '8px' }}>✓ Shipped</span>
          {order.wholesalerName} · {order.id}
        </div>
        <div style={{ fontFamily: 'Courier New', fontSize: '12px', color: 'var(--grey3)' }}>
          ${order.total.toFixed(2)}
        </div>
      </div>
    )
  }

  return (
    <div
      className={order.isNew ? 'slide-in' : ''}
      style={{
        background: 'var(--card)',
        border: `1px solid ${order.isNew ? 'var(--orange)' : 'var(--border)'}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: order.isNew ? '0 0 16px rgba(240,106,40,0.3)' : 'none',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {order.isNew && (
            <span style={{
              background: 'var(--orange)', color: '#fff',
              borderRadius: '4px', padding: '2px 8px',
              fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
            }}>⚡ JUST IN</span>
          )}
          <span style={{ fontWeight: '700', color: 'var(--grey1)', fontSize: '14px' }}>{order.wholesalerName}</span>
          <span style={{ fontFamily: 'Courier New', fontSize: '12px', color: 'var(--grey3)' }}>{order.id}</span>
          <span style={{
            background: `${color}22`, color,
            borderRadius: '4px', padding: '2px 8px',
            fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
          }}>
            {order.territory}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--grey3)' }}>
          Received {timeAgo(order.createdAt)}
        </div>
      </div>

      {/* Products */}
      <div style={{ fontSize: '12px', color: 'var(--grey2)', lineHeight: '1.5' }}>{summary}</div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Courier New', fontSize: '16px', color: 'var(--lime)' }}>
          ${order.total.toFixed(2)}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--grey2)', borderRadius: '6px', padding: '6px 14px',
            fontSize: '12px', cursor: 'pointer',
          }}>
            View Details
          </button>
          {STATUS_NEXT[order.status] && (
            <button
              onClick={handleAction}
              style={{
                background: color, border: 'none',
                color: order.status === 'staged' ? '#000' : '#fff',
                borderRadius: '6px', padding: '6px 14px',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer',
              }}
            >
              {STATUS_ACTION[order.status]}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
