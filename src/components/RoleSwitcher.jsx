import { useGlobalState, ROLES } from '../context/GlobalState.jsx'

const ROLE_CONFIG = [
  { role: ROLES.OWNER,      label: 'Owner' },
  { role: ROLES.WAREHOUSE,  label: 'Warehouse' },
  { role: ROLES.WHOLESALER, label: 'Wholesaler' },
  { role: ROLES.FIELD_REP,  label: 'Field Rep' },
  { role: ROLES.DR,         label: 'DR Production' },
]

export default function RoleSwitcher() {
  const { activeRole, setRole } = useGlobalState()

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      background: 'var(--surface)',
      padding: '4px',
      borderRadius: '8px',
      border: '1px solid var(--border)',
    }}>
      {ROLE_CONFIG.map(({ role, label }) => {
        const active = activeRole === role
        return (
          <button
            key={role}
            onClick={() => setRole(role)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              fontSize: '13px',
              fontWeight: active ? '700' : '400',
              letterSpacing: '0.5px',
              background: active ? 'var(--orange)' : 'transparent',
              color: active ? 'var(--white)' : 'var(--grey2)',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              if (!active) e.currentTarget.style.color = 'var(--grey1)'
            }}
            onMouseLeave={e => {
              if (!active) e.currentTarget.style.color = 'var(--grey2)'
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
