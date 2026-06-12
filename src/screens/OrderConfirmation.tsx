import { useGlobalState } from '../context/GlobalState'
import { PRODUCTS } from '../data/products'

export default function OrderConfirmation({ onTrack }) {
  const { orders } = useGlobalState()
  const order = orders[0] // most recent

  if (!order) return (
    <div className="page-enter" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--grey3)' }}>
      No order found.
    </div>
  )

  return (
    <div className="page-enter" style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px',
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderTop: '3px solid var(--lime)', borderRadius: '12px',
        padding: '40px', width: '520px', maxWidth: '100%',
        display: 'flex', flexDirection: 'column', gap: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>✓</div>
          <h2 style={{ fontSize: '24px', color: 'var(--lime)', margin: '0 0 4px' }}>Order Confirmed</h2>
          <div style={{ fontFamily: 'Courier New', fontSize: '16px', color: 'var(--grey2)' }}>{order.id}</div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {order.items.map(({ productId, cases }) => {
            const p = PRODUCTS.find(p => p.id === productId)
            if (!p) return null
            return (
              <div key={productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--grey1)' }}>{p.name} × {cases} case{cases > 1 ? 's' : ''}</span>
                <span style={{ color: 'var(--lime)', fontFamily: 'Courier New' }}>${(p.masterCasePrice * cases).toFixed(2)}</span>
              </div>
            )
          })}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: 'var(--grey2)' }}>Total</span>
          <span style={{ fontSize: '28px', color: 'var(--lime)', fontFamily: "'Arial Black'", letterSpacing: '-1px' }}>
            ${order.total.toFixed(2)}
          </span>
        </div>

        <div style={{
          background: 'rgba(184,240,0,0.08)', border: '1px solid rgba(184,240,0,0.2)',
          borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: 'var(--lime)',
        }}>
          Status: Invoice Generated — Payment Processing
        </div>

        <button
          onClick={onTrack}
          style={{
            background: 'var(--lime)', color: '#000', border: 'none',
            borderRadius: '8px', padding: '14px', fontSize: '13px',
            fontWeight: '700', cursor: 'pointer',
          }}
        >
          Track This Order →
        </button>
      </div>
    </div>
  )
}
