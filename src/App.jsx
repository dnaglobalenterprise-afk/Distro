import { useGlobalState } from './context/GlobalState.jsx'
import RoleSwitcher from './components/RoleSwitcher.jsx'

export default function App() {
  const { activeRole, liveProducts, totalInventoryUnits, openOrderCount } = useGlobalState()

  return (
    <div style={{ padding: '2rem', color: 'var(--grey1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--orange)', fontSize: '1.5rem', margin: 0 }}>DistroOS</h1>
        <RoleSwitcher />
      </div>
      <p>Active role: <strong style={{ color: 'var(--lime)' }}>{activeRole}</strong></p>
      <p>Total inventory units: <strong>{totalInventoryUnits.toLocaleString()}</strong></p>
      <p>Products loaded: <strong>{liveProducts.length}</strong></p>
      <p>Open orders: <strong>{openOrderCount}</strong></p>
      <p style={{ color: 'var(--grey2)', marginTop: '1rem' }}>GlobalState + RoleSwitcher complete. Ready to build screens.</p>
    </div>
  )
}
