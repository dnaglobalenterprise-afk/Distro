import { useGlobalState } from '../context/GlobalState.jsx'
import OrderCard from '../components/OrderCard.jsx'

const PIPELINE_STAGES = [
  { id: 'received',  label: 'Order Received' },
  { id: 'in_pick',   label: 'In Pick' },
  { id: 'staged',    label: 'Staged' },
  { id: 'shipped',   label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
]

export default function WarehousePortal() {
  const { orders, liveProducts, reservedInventory } = useGlobalState()

  const stageCounts = PIPELINE_STAGES.reduce((acc, s) => {
    acc[s.id] = orders.filter(o => o.status === s.id).length
    return acc
  }, {})

  const activeStage = orders.length > 0
    ? PIPELINE_STAGES.find(s => stageCounts[s.id] > 0)?.id ?? 'received'
    : 'received'

  return (
    <div className="page-enter" style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Pipeline header */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderTop: '3px solid var(--teal)', borderRadius: '8px',
        padding: '16px 24px', display: 'flex', gap: '0', overflow: 'hidden',
      }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const count = stageCounts[stage.id]
          const isActive = stage.id === activeStage
          return (
            <div key={stage.id} style={{
              flex: 1, textAlign: 'center', padding: '8px 12px',
              borderRight: i < PIPELINE_STAGES.length - 1 ? '1px solid var(--border)' : 'none',
              background: isActive ? 'rgba(10,171,184,0.1)' : 'transparent',
            }}>
              <div style={{
                fontSize: '22px', fontFamily: "'Arial Black'",
                color: isActive ? 'var(--teal)' : count > 0 ? 'var(--grey1)' : 'var(--grey3)',
                marginBottom: '4px',
              }}>{count}</div>
              <div style={{
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px',
                color: isActive ? 'var(--teal)' : 'var(--grey3)',
              }}>{stage.label}</div>
            </div>
          )
        })}
      </div>

      {/* Order Queue */}
      <div>
        <div style={{ fontSize: '11px', letterSpacing: '2px', color: 'var(--grey3)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Order Queue — {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
        {orders.length === 0 ? (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px',
            padding: '48px', textAlign: 'center', color: 'var(--grey3)', fontSize: '14px',
          }}>
            No orders in queue. New orders from wholesalers appear here instantly.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </div>

      {/* Live Inventory Table */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderTop: '3px solid var(--teal)', borderRadius: '8px', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
            LIVE INVENTORY
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Product', 'In Stock', 'Reserved', 'Available', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    color: 'var(--grey3)', fontWeight: '400',
                    fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {liveProducts.map((p, i) => {
                const reserved = reservedInventory[p.id] ?? 0
                const available = Math.max(0, p.stock - reserved)
                const statusColor = p.status === 'in_stock' ? 'var(--green)' : p.status === 'low_stock' ? 'var(--amber)' : 'var(--red)'
                return (
                  <tr key={p.id} style={{ borderBottom: i < liveProducts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ color: 'var(--grey1)', fontWeight: '600', marginBottom: '2px' }}>{p.name}</div>
                      <div style={{ fontFamily: 'Courier New', fontSize: '10px', color: 'var(--grey3)' }}>{p.sku}</div>
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'Courier New', color: 'var(--grey1)' }}>{p.stock.toLocaleString()}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'Courier New', color: reserved > 0 ? 'var(--amber)' : 'var(--grey3)' }}>
                      {reserved > 0 ? reserved.toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'Courier New', color: 'var(--grey1)', fontWeight: '600' }}>
                      {available.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{
                        background: `${statusColor}22`, color: statusColor,
                        borderRadius: '4px', padding: '2px 8px',
                        fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
                      }}>
                        {p.status === 'in_stock' ? 'IN STOCK' : p.status === 'low_stock' ? 'LOW' : 'OUT'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
