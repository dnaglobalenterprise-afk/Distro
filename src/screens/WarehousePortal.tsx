import { useState, useEffect, useRef } from 'react'
import { useGlobalState } from '../context/GlobalState'
import OrderCard from '../components/OrderCard'

const PIPELINE_STAGES = [
  { id: 'received',  label: 'Order Received' },
  { id: 'in_pick',   label: 'In Pick' },
  { id: 'staged',    label: 'Staged' },
  { id: 'shipped',   label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
]

export default function WarehousePortal() {
  const { orders, liveProducts, reservedInventory, totalInventoryUnits } = useGlobalState()
  const [search, setSearch] = useState('')
  const prevTotal = useRef(totalInventoryUnits)
  const [flashTotal, setFlashTotal] = useState(false)

  useEffect(() => {
    if (prevTotal.current !== totalInventoryUnits) {
      setFlashTotal(true)
      prevTotal.current = totalInventoryUnits
      const t = setTimeout(() => setFlashTotal(false), 800)
      return () => clearTimeout(t)
    }
  }, [totalInventoryUnits])

  const stageCounts = PIPELINE_STAGES.reduce((acc, s) => {
    acc[s.id] = orders.filter(o => o.status === s.id).length
    return acc
  }, {} as Record<string, number>)

  const activeStage = orders.length > 0
    ? PIPELINE_STAGES.find(s => stageCounts[s.id] > 0)?.id ?? 'received'
    : 'received'

  const filteredProducts = search.trim()
    ? liveProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : liveProducts

  // Sort: rows with reserved units bubble to top so user sees affected SKUs immediately
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const ra = reservedInventory[a.id] ?? 0
    const rb = reservedInventory[b.id] ?? 0
    return rb - ra
  })

  return (
    <div className="page-enter" style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Total units banner */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderTop: '3px solid var(--teal)', borderRadius: '8px',
        padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '32px',
      }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--grey3)', marginBottom: '4px' }}>
            Total Units On Hand
          </div>
          <div
            className={flashTotal ? 'flash-decrement' : ''}
            style={{ fontSize: '28px', fontFamily: "'Arial Black'", color: 'var(--teal)', letterSpacing: '1px' }}
          >
            {totalInventoryUnits.toLocaleString()}
          </div>
        </div>
        <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch' }} />
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--grey3)', marginBottom: '4px' }}>
            SKUs In Catalog
          </div>
          <div style={{ fontSize: '28px', fontFamily: "'Arial Black'", color: 'var(--grey1)' }}>{liveProducts.length}</div>
        </div>
        <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch' }} />
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--grey3)', marginBottom: '4px' }}>
            Open Orders
          </div>
          <div style={{ fontSize: '28px', fontFamily: "'Arial Black'", color: orders.filter(o => !['delivered'].includes(o.status)).length > 0 ? 'var(--amber)' : 'var(--grey1)' }}>
            {orders.filter(o => !['delivered'].includes(o.status)).length}
          </div>
        </div>
      </div>

      {/* Pipeline header */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '16px 24px', display: 'flex', gap: '0', overflow: 'hidden',
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
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
            LIVE INVENTORY
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by product or SKU…"
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '6px 12px', color: 'var(--grey1)',
              fontSize: '12px', outline: 'none', width: '220px',
            }}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Product', 'In Stock', 'Pending Orders', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    color: 'var(--grey3)', fontWeight: '400',
                    fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p, i) => {
                const reserved = reservedInventory[p.id] ?? 0
                const statusColor = p.status === 'in_stock' ? 'var(--green)' : p.status === 'low_stock' ? 'var(--amber)' : 'var(--red)'
                const hasReserved = reserved > 0
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: i < sortedProducts.length - 1 ? '1px solid var(--border)' : 'none',
                      background: hasReserved ? 'rgba(245,166,35,0.06)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ color: 'var(--grey1)', fontWeight: '600', marginBottom: '2px' }}>{p.name}</div>
                      <div style={{ fontFamily: 'Courier New', fontSize: '10px', color: 'var(--grey3)' }}>{p.sku}</div>
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'Courier New', fontWeight: '700', color: hasReserved ? 'var(--amber)' : 'var(--grey1)', fontSize: '13px' }}>
                      {p.stock.toLocaleString()}
                      {hasReserved && (
                        <span style={{ marginLeft: '6px', fontSize: '10px', color: 'var(--grey3)', fontWeight: '400' }}>
                          ({reserved.toLocaleString()} picked)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'Courier New', color: hasReserved ? 'var(--amber)' : 'var(--grey3)' }}>
                      {hasReserved ? (
                        <span style={{
                          background: 'rgba(245,166,35,0.15)', color: 'var(--amber)',
                          borderRadius: '4px', padding: '2px 8px',
                          fontSize: '11px', fontWeight: '700',
                        }}>
                          {reserved.toLocaleString()} units
                        </span>
                      ) : '—'}
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
