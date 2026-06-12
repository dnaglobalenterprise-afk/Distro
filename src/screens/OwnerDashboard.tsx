import { useGlobalState } from '../context/GlobalState'
import KpiCard from '../components/KpiCard'
import TerritoryTile from '../components/TerritoryTile'

const PORTAL_COLOR = {
  marketplace: 'var(--lime)',
  warehouse:   'var(--teal)',
  dr:          'var(--orange)',
  system:      'var(--red)',
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function OwnerDashboard() {
  const {
    territories, activityFeed, wholesalers, alerts,
    totalInventoryUnits, skusBelowThreshold, openOrderCount,
    dismissScAlert, addToast,
  } = useGlobalState()

  const tableRows = wholesalers.filter(w =>
    ['sw-0041','sw-0022','sw-0038','sw-0055','sw-0062','sw-0019'].includes(w.id)
  )

  const statusStyle = {
    active:  { color: 'var(--green)',  label: 'Active' },
    hold:    { color: 'var(--amber)',  label: 'Hold' },
    dark:    { color: 'var(--red)',    label: 'Dark' },
  }

  return (
    <div className="page-enter" style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* SC Alert Banner */}
      {alerts.sc_dark && (
        <div style={{
          background: 'rgba(224,48,64,0.12)',
          border: '1px solid var(--red)',
          borderRadius: '8px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--red)', fontSize: '16px' }}>⚠</span>
            <span style={{ fontSize: '13px', color: 'var(--grey1)' }}>
              <strong>South Carolina</strong> — 31 days, $0 in orders. Territory has been dark since May 10. Automated alert triggered.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => { addToast('Alert sent to SC territory manager.', 'info') }}
              style={{
                background: 'var(--red)', border: 'none', color: '#fff',
                borderRadius: '6px', padding: '6px 16px', cursor: 'pointer',
                fontSize: '12px', fontWeight: '700',
              }}
            >
              Escalate
            </button>
            <button
              onClick={dismissScAlert}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--grey3)', borderRadius: '6px', padding: '6px 12px',
                cursor: 'pointer', fontSize: '12px',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* KPI Strip */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <KpiCard label="June Revenue MTD"  value="$94,210"                       sub="On pace vs May"               accent="lime"   />
        <KpiCard label="Miami Inventory"   value={`${totalInventoryUnits.toLocaleString()} units`} sub={`${skusBelowThreshold} SKU${skusBelowThreshold !== 1 ? 's' : ''} below threshold`} accent="teal" />
        <KpiCard label="Open Orders"       value={String(openOrderCount)}         sub="3 shipped today"              accent="orange" />
        <KpiCard label="Fulfillment Lag"   value="3.2 days"                       sub="Target: 1.0 day"              accent="red"    />
      </div>

      {/* Territory Map */}
      <div>
        <div style={{ fontSize: '11px', letterSpacing: '2px', color: 'var(--grey3)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Territory Revenue — MTD
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {Object.entries(territories).map(([abbr, data]) => (
            <TerritoryTile key={abbr} state={abbr} data={data} />
          ))}
        </div>
      </div>

      {/* Bottom row: table + feed */}
      <div style={{ display: 'flex', gap: '20px', flex: 1 }}>

        {/* Wholesaler Status Table */}
        <div style={{
          flex: '1.4',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderTop: '3px solid var(--orange)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
              WHOLESALER STATUS
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Account', 'Territory', 'Last Order', 'Balance', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--grey3)', fontWeight: '400', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((w, i) => {
                const st = statusStyle[w.status] ?? statusStyle.active
                return (
                  <tr key={w.id} style={{
                    borderBottom: i < tableRows.length - 1 ? '1px solid var(--border)' : 'none',
                    background: w.status === 'dark' ? 'rgba(224,48,64,0.06)' : 'transparent',
                  }}>
                    <td style={{ padding: '12px 16px', color: 'var(--grey1)', fontWeight: '600' }}>{w.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--grey2)' }}>{w.territory}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--grey2)', fontFamily: 'Courier New' }}>{w.lastOrder}</td>
                    <td style={{ padding: '12px 16px', color: w.balance > 0 ? 'var(--amber)' : 'var(--green)', fontFamily: 'Courier New' }}>
                      {w.balance > 0 ? `$${w.balance.toLocaleString()}` : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: `${st.color}22`,
                        color: st.color,
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '1px',
                      }}>
                        {st.label.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Live Activity Feed */}
        <div style={{
          flex: '1',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderTop: '3px solid var(--teal)',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
              LIVE ACTIVITY
            </span>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
            {activityFeed.slice(0, 12).map((item, i) => {
              const color = PORTAL_COLOR[item.portal] ?? 'var(--grey2)'
              return (
                <div key={item.id} className={i === 0 && activityFeed.length > 4 ? 'slide-in' : ''} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: color, flexShrink: 0, marginTop: '4px',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: 'var(--grey1)', lineHeight: '1.4', marginBottom: '3px' }}>
                      {item.message}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--grey3)' }}>
                      {timeAgo(item.timestamp)}
                      {item.amount && <span style={{ marginLeft: '8px', color: color }}>${item.amount.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
