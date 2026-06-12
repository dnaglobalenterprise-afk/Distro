import { useState } from 'react'
import { useGlobalState } from '../context/GlobalState.jsx'
import KpiCard from '../components/KpiCard.jsx'
import ChainVisualization from '../components/ChainVisualization.jsx'
import { PRODUCTS } from '../data/products.js'

const DEMAND_30DAY = {
  'fk-single-nat':         576,
  'fk-5pk-banana':         288,
  'fk-5pk-natural':        432,
  'fk-5pk-rumcream':       288,
  'fk-5pk-sweet':          144,
  'fk-darkcrush-6gpkg':    288,
  'fk-darkcrush-6gbottle': 288,
  'fk-darkcrush-12gbottle':144,
  'fk-wl-natural':         288,
  'fk-wl-honey':           432,
  'fk-wl-grape':           288,
  'fk-wl-mango':           144,
  'fk-wl-strawberry':      288,
  'fk-wl-vanilla':         144,
  'fk-wl-icymint':         144,
  'fk-wl-banana':          288,
  'fk-hr-double':          144,
  'fk-hr-single':          144,
  'fk-hr-mini':            144,
  'fk-hr-wizzla':          144,
  'fk-minileaf-nat':       144,
  'fk-8wraps-nat':         144,
  'up-fronto-wl':          144,
  'up-grabba-wl':          288,
  'up-grabba-minileaf':    144,
  'up-grabba-sngl':        576,
  'up-grabba-6gbottle':    288,
  'up-grabba-12gpkg':      144,
  'up-redrose-6gbottle':   288,
  'up-redrose-12gbottle':  144,
  'up-grabba-wraps-2pk':   288,
  'up-8wraps-handcut':     144,
}

// Pre-fill recommended shipment quantities based on reorder status
const RECOMMENDED_QTY = {
  'fk-5pk-natural':        576,
  'fk-wl-grape':           432,
  'fk-darkcrush-12gbottle':576,
}

export default function DrProductionPortal() {
  const { liveProducts, totalInventoryUnits, alerts, receiveShipment, addToast } = useGlobalState()
  const [departDate, setDepartDate] = useState('2026-07-02')
  const [arrivalDate, setArrivalDate] = useState('2026-07-08')
  const [shipQtys, setShipQtys] = useState(RECOMMENDED_QTY)
  const [submitted, setSubmitted] = useState(false)

  const alertProducts = liveProducts.filter(p => alerts.reorder_items.includes(p.id))

  function daysOfSupply(productId, stock) {
    const demand30 = DEMAND_30DAY[productId] ?? 144
    const dailyDemand = demand30 / 30
    return dailyDemand > 0 ? Math.floor(stock / dailyDemand) : 999
  }

  function handleSubmit() {
    const items = Object.entries(shipQtys)
      .filter(([, qty]) => qty > 0)
      .map(([productId, qty]) => ({ productId, qty: parseInt(qty) }))
    if (!items.length) return
    receiveShipment(items, `DR-${Date.now()}`)
    addToast('✓ Shipment scheduled. Miami warehouse notified. No phone call needed.')
    setSubmitted(true)
  }

  // Show top 8 products in demand table
  const demandRows = liveProducts.slice(0, 8)

  return (
    <div className="page-enter" style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Alert Banner */}
      {alertProducts.length > 0 && (
        <div style={{
          background: 'rgba(224,48,64,0.12)', border: '1px solid var(--red)',
          borderRadius: '8px', padding: '14px 20px', color: 'var(--red)', fontSize: '13px',
        }}>
          <strong>REORDER ALERT</strong> — {alertProducts.map(p => p.name).join(' & ')} below reorder threshold.
          Schedule next production run and shipment to Miami by July 8.
        </div>
      )}

      {/* KPI Strip */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <KpiCard label="In Production"      value="12,400 units"  sub="Current run"        accent="orange" />
        <KpiCard label="Ready to Ship"      value="8,200 units"   sub="Staged in Santo Domingo" accent="green" />
        <KpiCard label="In Transit → Miami" value="3,600 units"   sub="ETA July 3"         accent="teal" />
        <KpiCard
          label="Miami On Hand"
          value={`${totalInventoryUnits.toLocaleString()} units`}
          sub={alerts.reorder_items.length > 0 ? `${alerts.reorder_items.length} SKU below threshold` : 'All levels OK'}
          accent={alerts.reorder_items.length > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* Main two-column */}
      <div style={{ display: 'flex', gap: '20px' }}>

        {/* Demand Signal Table */}
        <div style={{
          flex: 1.2, background: 'var(--card)', border: '1px solid var(--border)',
          borderTop: '3px solid var(--teal)', borderRadius: '8px', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
              DEMAND SIGNAL TABLE
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Product', 'Miami Stock', '30-Day Demand', 'Days of Supply', 'Alert'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--grey3)', fontWeight: '400', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demandRows.map((p, i) => {
                const dos = daysOfSupply(p.id, p.stock)
                const isAlert = alerts.reorder_items.includes(p.id)
                return (
                  <tr key={p.id} style={{ borderBottom: i < demandRows.length - 1 ? '1px solid var(--border)' : 'none', background: isAlert ? 'rgba(224,48,64,0.05)' : 'transparent' }}>
                    <td style={{ padding: '10px 14px', color: 'var(--grey1)', fontWeight: '600', fontSize: '11px' }}>{p.name}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'Courier New', color: isAlert ? 'var(--red)' : 'var(--grey1)' }}>{p.stock.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'Courier New', color: 'var(--grey2)' }}>{(DEMAND_30DAY[p.id] ?? 144).toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'Courier New', color: dos < 14 ? 'var(--red)' : dos < 30 ? 'var(--amber)' : 'var(--green)' }}>
                      {dos > 300 ? '∞' : `${dos}d`}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        background: isAlert ? 'rgba(224,48,64,0.15)' : 'rgba(30,199,96,0.15)',
                        color: isAlert ? 'var(--red)' : 'var(--green)',
                        borderRadius: '4px', padding: '2px 8px',
                        fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
                      }}>
                        {isAlert ? 'REORDER NOW' : 'OK'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Schedule Shipment Form */}
        <div style={{
          flex: 1, background: 'var(--card)', border: '1px solid var(--border)',
          borderTop: '3px solid var(--orange)', borderRadius: '8px',
          padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
            SCHEDULE NEXT SHIPMENT
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Departure Date</label>
              <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)}
                style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--grey1)', fontSize: '13px', padding: '8px 10px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Arrival Miami</label>
              <input type="date" value={arrivalDate} onChange={e => setArrivalDate(e.target.value)}
                style={{ width: '100%', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--grey1)', fontSize: '13px', padding: '8px 10px' }}
              />
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--grey3)', marginBottom: '4px' }}>Recommended quantities (edit as needed):</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflow: 'auto' }}>
            {Object.entries(RECOMMENDED_QTY).map(([id, defaultQty]) => {
              const p = PRODUCTS.find(p => p.id === id)
              if (!p) return null
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, fontSize: '11px', color: 'var(--grey2)', lineHeight: '1.3' }}>{p.name}</div>
                  <input
                    type="number"
                    min="0"
                    value={shipQtys[id] ?? defaultQty}
                    onChange={e => setShipQtys(prev => ({ ...prev, [id]: parseInt(e.target.value) || 0 }))}
                    style={{
                      width: '80px', background: 'var(--card2)', border: '1px solid var(--border)',
                      borderRadius: '6px', color: 'var(--grey1)', fontSize: '13px',
                      padding: '6px', fontFamily: 'Courier New', textAlign: 'right',
                    }}
                  />
                </div>
              )
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitted}
            style={{
              background: submitted ? 'var(--green)' : 'var(--orange)',
              color: '#fff', border: 'none', borderRadius: '8px',
              padding: '14px', fontSize: '13px', fontWeight: '700',
              cursor: submitted ? 'default' : 'pointer', transition: 'background 0.2s',
            }}
          >
            {submitted ? '✓ Shipment Scheduled — Miami Notified' : 'Submit Shipment Manifest → Miami Notified'}
          </button>
        </div>
      </div>

      {/* Chain visualization */}
      <ChainVisualization />
    </div>
  )
}
