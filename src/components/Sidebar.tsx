const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',           icon: '⬛' },
  { id: 'marketplace',  label: 'Wholesale Marketplace', icon: '🛒' },
  { id: 'warehouse',    label: 'Warehouse Portal',    icon: '📦' },
  { id: 'events',       label: 'Events & Sales',      icon: '⚡' },
  { id: 'dr',           label: 'DR Production',       icon: '🏭' },
  { id: 'analytics',    label: 'Analytics',           icon: '📊', disabled: true },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <div style={{
      width: '220px',
      minWidth: '220px',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      padding: '16px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => !item.disabled && onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              border: 'none',
              background: isActive ? 'rgba(240,106,40,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--orange)' : '3px solid transparent',
              color: item.disabled ? 'var(--grey3)' : isActive ? 'var(--orange)' : 'var(--grey2)',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: isActive ? '700' : '400',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (!isActive && !item.disabled) e.currentTarget.style.color = 'var(--grey1)'
            }}
            onMouseLeave={e => {
              if (!isActive && !item.disabled) e.currentTarget.style.color = 'var(--grey2)'
            }}
          >
            <span style={{ fontSize: '14px' }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.disabled && (
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--grey3)', letterSpacing: '1px' }}>
                SOON
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
