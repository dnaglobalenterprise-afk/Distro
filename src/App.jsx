import { useState } from 'react'
import { useGlobalState, ROLES } from './context/GlobalState.jsx'
import Topbar from './components/Topbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import ToastContainer from './components/Toast.jsx'
import FeedbackModal from './components/FeedbackModal.jsx'

import Opening from './screens/Opening.jsx'
import OwnerDashboard from './screens/OwnerDashboard.jsx'
import WholesaleMarketplace from './screens/WholesaleMarketplace.jsx'
import OrderConfirmation from './screens/OrderConfirmation.jsx'
import WarehousePortal from './screens/WarehousePortal.jsx'
import WarehouseSaleEvent from './screens/WarehouseSaleEvent.jsx'
import DrProductionPortal from './screens/DrProductionPortal.jsx'
import FieldRepPortal from './screens/FieldRepPortal.jsx'

// Default screen per role
const ROLE_DEFAULT_SCREEN = {
  [ROLES.OWNER]:      'dashboard',
  [ROLES.WAREHOUSE]:  'warehouse',
  [ROLES.WHOLESALER]: 'marketplace',
  [ROLES.FIELD_REP]:  'fieldrep',
  [ROLES.DR]:         'dr',
}

export default function App() {
  const { activeRole, setRole } = useGlobalState()
  const [screen, setScreen] = useState('opening')
  const [postOrder, setPostOrder] = useState(false)

  function navigate(s) {
    setScreen(s)
    setPostOrder(false)
  }

  function handleRoleSwitch(role) {
    setRole(role)
    navigate(ROLE_DEFAULT_SCREEN[role] ?? 'dashboard')
  }

  // Override RoleSwitcher setRole to also navigate
  // We pass handleRoleSwitch via context indirection: Topbar reads activeRole and calls setRole directly,
  // so we hook navigation at the Sidebar level + role switch.
  // Simpler: wrap role switch at the app level by monkey-patching via a bridge component.

  if (screen === 'opening') {
    return (
      <>
        <Opening onEnter={() => navigate('dashboard')} />
        <ToastContainer />
      </>
    )
  }

  if (screen === 'order-confirmation') {
    return (
      <AppShell screen={screen} onNavigate={navigate} onRoleSwitch={handleRoleSwitch}>
        <OrderConfirmation onTrack={() => navigate('warehouse')} />
      </AppShell>
    )
  }

  return (
    <AppShell screen={screen} onNavigate={navigate} onRoleSwitch={handleRoleSwitch}>
      {screen === 'dashboard'   && <OwnerDashboard />}
      {screen === 'marketplace' && <WholesaleMarketplace onOrderSubmitted={() => navigate('order-confirmation')} />}
      {screen === 'warehouse'   && <WarehousePortal />}
      {screen === 'events'      && <WarehouseSaleEvent />}
      {screen === 'dr'          && <DrProductionPortal />}
      {screen === 'fieldrep'    && <FieldRepPortal />}
    </AppShell>
  )
}

function AppShell({ children, screen, onNavigate, onRoleSwitch }) {
  const { activeRole } = useGlobalState()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <RoleSwitchingTopbar onRoleSwitch={onRoleSwitch} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar active={screen} onNavigate={onNavigate} />
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>
      <ToastContainer />
      <FeedbackModal />
    </div>
  )
}

// Topbar that intercepts role switches to also trigger navigation
function RoleSwitchingTopbar({ onRoleSwitch }) {
  const { activeRole } = useGlobalState()
  const { setRole } = useGlobalState()

  const ROLE_CONFIG = [
    { role: ROLES.OWNER,      label: 'Owner' },
    { role: ROLES.WAREHOUSE,  label: 'Warehouse' },
    { role: ROLES.WHOLESALER, label: 'Wholesaler' },
    { role: ROLES.FIELD_REP,  label: 'Field Rep' },
    { role: ROLES.DR,         label: 'DR Production' },
  ]

  return (
    <div style={{
      height: '56px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontSize: '16px',
        letterSpacing: '2px',
        color: 'var(--orange)',
      }}>
        DISTRO<span style={{ color: 'var(--grey2)' }}>OS</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--green)', display: 'inline-block',
          boxShadow: '0 0 6px var(--green)',
        }} />
        <span style={{ fontSize: '13px', color: 'var(--grey2)' }}>Live · Updated just now</span>
      </div>

      <div style={{
        display: 'flex', gap: '4px',
        background: 'var(--card)', padding: '4px',
        borderRadius: '8px', border: '1px solid var(--border)',
      }}>
        {ROLE_CONFIG.map(({ role, label }) => {
          const active = activeRole === role
          return (
            <button
              key={role}
              onClick={() => onRoleSwitch(role)}
              style={{
                padding: '6px 14px', borderRadius: '6px', border: 'none',
                cursor: 'pointer', fontSize: '13px',
                fontWeight: active ? '700' : '400',
                background: active ? 'var(--orange)' : 'transparent',
                color: active ? 'var(--white)' : 'var(--grey2)',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
