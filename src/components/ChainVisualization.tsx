import { useGlobalState } from '../context/GlobalState'

const NODES = [
  { id: 'dr',          label: 'DR Production',      sublabel: 'Santo Domingo',  color: 'var(--orange)', units: 12400 },
  { id: 'transit',     label: 'In Transit',          sublabel: 'ETA July 8',     color: 'var(--teal)',   units: 3600  },
  { id: 'miami',       label: 'Miami Warehouse',     sublabel: 'Live',           color: 'var(--teal)',   units: null  }, // live
  { id: 'wholesalers', label: 'Wholesalers',         sublabel: '15 accounts',    color: 'var(--lime)',   units: null  }, // derived
  { id: 'shops',       label: 'Tobacco Shops',       sublabel: 'End market',     color: 'var(--grey2)', units: null  },
]

export default function ChainVisualization() {
  const { totalInventoryUnits, wholesalers } = useGlobalState()
  const activeWholesalers = wholesalers.filter(w => w.status === 'active').length

  const unitMap = {
    miami:       totalInventoryUnits,
    wholesalers: activeWholesalers,
  }

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderTop: '3px solid var(--orange)', borderRadius: '8px',
      padding: '24px',
    }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px', marginBottom: '24px' }}>
        FULL CHAIN VISUALIZATION
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        {NODES.map((node, i) => {
          const displayUnits = unitMap[node.id] ?? node.units
          return (
            <div key={node.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {/* Node */}
              <div style={{
                flex: 1, background: 'var(--card2)', border: `1px solid ${node.color}`,
                borderRadius: '8px', padding: '16px 12px', textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '20px', fontFamily: "'Courier New'", color: node.color,
                  fontWeight: 'bold', marginBottom: '4px',
                }}>
                  {node.id === 'wholesalers'
                    ? `${displayUnits} active`
                    : displayUnits != null
                      ? displayUnits.toLocaleString()
                      : '—'
                  }
                </div>
                <div style={{ fontSize: '12px', color: 'var(--grey1)', fontWeight: '700', marginBottom: '2px' }}>{node.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--grey3)' }}>{node.sublabel}</div>
              </div>
              {/* Arrow */}
              {i < NODES.length - 1 && (
                <div style={{ color: 'var(--grey3)', fontSize: '20px', padding: '0 8px', flexShrink: 0 }}>→</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
