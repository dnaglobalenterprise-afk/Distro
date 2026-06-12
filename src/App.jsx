import { useGlobalState } from './context/GlobalState.jsx'

export default function App() {
  const { liveProducts, totalInventoryUnits, openOrderCount } = useGlobalState()

  return (
    <div style={{ padding: '2rem', color: 'var(--grey1)' }}>
      <h1 style={{ color: 'var(--orange)', fontSize: '1.5rem' }}>DistroOS — GlobalState verified ✓</h1>
      <p>Total inventory units: <strong>{totalInventoryUnits.toLocaleString()}</strong></p>
      <p>Products loaded: <strong>{liveProducts.length}</strong></p>
      <p>Open orders: <strong>{openOrderCount}</strong></p>
      <p style={{ color: 'var(--grey2)', marginTop: '1rem' }}>GlobalState complete. Ready to build screens.</p>
    </div>
  )
}
