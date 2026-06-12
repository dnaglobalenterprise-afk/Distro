import { useState } from 'react'
import { useGlobalState } from '../context/GlobalState.jsx'
import InventoryCounter from '../components/InventoryCounter.jsx'

function timeStr(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function WarehouseSaleEvent() {
  const { liveProducts, totalInventoryUnits, eventSales, recordEventSale, addToast } = useGlobalState()
  const [selectedId, setSelectedId] = useState('')
  const [qty, setQty] = useState('')
  const [buyer, setBuyer] = useState('')
  const [error, setError] = useState('')

  const selectedProduct = liveProducts.find(p => p.id === selectedId)

  function handleRecord() {
    const qtyNum = parseInt(qty)
    if (!selectedId) { setError('Select a product.'); return }
    if (!qtyNum || qtyNum < 1) { setError('Enter a valid quantity.'); return }
    if (!buyer.trim()) { setError('Enter buyer name.'); return }
    if (selectedProduct && qtyNum > selectedProduct.stock) {
      setError(`Only ${selectedProduct.stock.toLocaleString()} units available.`)
      return
    }
    setError('')
    recordEventSale(selectedId, qtyNum, buyer.trim())
    addToast(`✓ Sale recorded — ${qtyNum} units to ${buyer.trim()}. Inventory updated.`)
    setQty('')
    setBuyer('')
    setSelectedId('')
  }

  return (
    <div className="page-enter" style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Alert banner */}
      <div style={{
        background: 'rgba(10,171,184,0.1)', border: '1px solid var(--teal)',
        borderRadius: '8px', padding: '14px 20px', fontSize: '13px', color: 'var(--teal)',
        lineHeight: '1.5',
      }}>
        <strong>Event Mode Active.</strong> Every sale recorded here instantly updates live inventory.
        Wholesalers see accurate stock in real time. No paper purchase orders required after this event.
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1 }}>

        {/* Left — POS */}
        <div style={{
          flex: 1, background: 'var(--card)', border: '1px solid var(--border)',
          borderTop: '3px solid var(--teal)', borderRadius: '8px', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
            EVENT POS — RECORD RETAIL SALE
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Product
              </label>
              <select
                value={selectedId}
                onChange={e => { setSelectedId(e.target.value); setError('') }}
                style={{
                  width: '100%', background: 'var(--card2)', border: '1px solid var(--border)',
                  borderRadius: '6px', color: 'var(--grey1)', fontSize: '13px',
                  padding: '10px 12px', fontFamily: 'Arial, sans-serif',
                }}
              >
                <option value="">— Select product —</option>
                {liveProducts.filter(p => p.stock > 0).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.stock.toLocaleString()} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Quantity Sold (units)
              </label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={e => { setQty(e.target.value); setError('') }}
                placeholder="0"
                style={{
                  width: '100%', background: 'var(--card2)', border: '1px solid var(--border)',
                  borderRadius: '6px', color: 'var(--grey1)', fontSize: '20px',
                  padding: '10px 12px', fontFamily: 'Courier New',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Buyer Name / Business
              </label>
              <input
                type="text"
                value={buyer}
                onChange={e => { setBuyer(e.target.value); setError('') }}
                placeholder="e.g. Kings Mountain Tobacco"
                style={{
                  width: '100%', background: 'var(--card2)', border: '1px solid var(--border)',
                  borderRadius: '6px', color: 'var(--grey1)', fontSize: '13px',
                  padding: '10px 12px', fontFamily: 'Arial, sans-serif',
                }}
              />
            </div>

            {error && (
              <div style={{ color: 'var(--red)', fontSize: '12px', padding: '8px 12px', background: 'rgba(224,48,64,0.1)', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleRecord}
              style={{
                background: 'var(--teal)', color: '#000', border: 'none',
                borderRadius: '8px', padding: '14px', fontSize: '13px',
                fontWeight: '700', cursor: 'pointer', letterSpacing: '0.5px',
                marginTop: '4px',
              }}
            >
              Record Sale &amp; Update Inventory →
            </button>
          </div>
        </div>

        {/* Right — Live Counter */}
        <div style={{
          flex: 1, background: 'var(--card)', border: '1px solid var(--border)',
          borderTop: '3px solid var(--orange)', borderRadius: '8px', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
            LIVE INVENTORY COUNTER
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <InventoryCounter value={totalInventoryUnits} size="large" label="Total Units — Miami Warehouse" />
          </div>

          {/* Per-product counters for selected + nearby */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflow: 'auto' }}>
            {liveProducts.slice(0, 10).map(p => {
              const pct = Math.min(100, (p.stock / (p.reorderThreshold * 4)) * 100)
              const barColor = p.stock <= 0 ? 'var(--red)' : p.stock <= p.reorderThreshold ? 'var(--amber)' : 'var(--green)'
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: 'var(--grey2)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '2px', transition: 'width 0.4s, background 0.4s' }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Courier New', fontSize: '12px', color: barColor, width: '60px', textAlign: 'right' }}>
                    {p.stock.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Event Sales Log */}
      {eventSales.length > 0 && (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderTop: '3px solid var(--amber)', borderRadius: '8px', overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
              EVENT SALES LOG
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Buyer', 'Product', 'Qty', 'Time'].map(h => (
                  <th key={h} style={{ padding: '8px 16px', textAlign: 'left', color: 'var(--grey3)', fontWeight: '400', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {eventSales.map((s, i) => (
                <tr key={s.id} className={i === 0 ? 'slide-in' : ''} style={{ borderBottom: i < eventSales.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '10px 16px', color: 'var(--grey1)', fontWeight: '600' }}>{s.buyerName}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--grey2)' }}>{s.productName}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Courier New', color: 'var(--amber)' }}>{s.qty.toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--grey3)', fontFamily: 'Courier New' }}>{timeStr(s.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Before/After callout */}
      <div style={{
        background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '8px',
        padding: '20px', fontSize: '13px', color: 'var(--grey2)', lineHeight: '1.6',
      }}>
        <strong style={{ color: 'var(--grey1)' }}>Before DistroOS:</strong> After this event, warehouse staff would spend 3+ hours
        walking the floor with paper purchase orders to figure out what was left.{' '}
        <strong style={{ color: 'var(--teal)' }}>Right now that count is already done — automatically.</strong>
      </div>
    </div>
  )
}
