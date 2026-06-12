import { useState } from 'react'
import { useGlobalState } from '../context/GlobalState'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'

const CATEGORIES = ['All', ...new Set(PRODUCTS.map(p => p.category))]
const BRANDS = ['All Products', 'Fronto King', 'UP']

export default function WholesaleMarketplace({ onOrderSubmitted }) {
  const { liveProducts, submitOrder, addToast } = useGlobalState()
  const [brandFilter, setBrandFilter] = useState('All Products')
  const [catFilter, setCatFilter] = useState('All')
  const [cart, setCart] = useState({}) // productId → cases

  const filtered = liveProducts.filter(p => {
    const brandOk = brandFilter === 'All Products' || p.brand === brandFilter
    const catOk = catFilter === 'All' || p.category === catFilter
    return brandOk && catOk
  })

  function addToCart(productId, cases) {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] ?? 0) + cases }))
  }

  const cartItems = Object.entries(cart).filter(([, c]) => c > 0)
  const cartTotal = cartItems.reduce((sum, [id, cases]) => {
    const p = liveProducts.find(p => p.id === id)
    return sum + (p ? p.masterCasePrice * cases : 0)
  }, 0)

  function handleSubmit() {
    if (!cartItems.length) return
    const items = cartItems.map(([productId, cases]) => ({ productId, cases }))
    submitOrder('sw-0041', items)
    addToast('✓ Order submitted. Invoice generated. Miami warehouse notified.')
    setCart({})
    setTimeout(() => onOrderSubmitted && onOrderSubmitted(), 1500)
  }

  return (
    <div className="page-enter" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Account banner */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--lime)', color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Arial Black'", fontSize: '14px',
            }}>SW</div>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--grey1)', fontSize: '14px' }}>Swift Wholesale</div>
              <div style={{ fontSize: '12px', color: 'var(--grey2)' }}>Account #0041 · Charlotte, NC</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--grey2)' }}>
            Credit Limit: <span style={{ color: 'var(--lime)', fontFamily: 'Courier New' }}>$50,000</span>
          </div>
        </div>

        {/* Brand tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--card)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)', alignSelf: 'flex-start' }}>
          {BRANDS.map(b => (
            <button key={b} onClick={() => setBrandFilter(b)} style={{
              padding: '6px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: brandFilter === b ? 'var(--lime)' : 'transparent',
              color: brandFilter === b ? '#000' : 'var(--grey2)',
              fontSize: '13px', fontWeight: brandFilter === b ? '700' : '400',
              transition: 'all 0.15s',
            }}>{b}</button>
          ))}
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              padding: '4px 14px', borderRadius: '20px', border: '1px solid',
              borderColor: catFilter === c ? 'var(--lime)' : 'var(--border)',
              background: catFilter === c ? 'rgba(184,240,0,0.12)' : 'transparent',
              color: catFilter === c ? 'var(--lime)' : 'var(--grey3)',
              fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
            }}>{c}</button>
          ))}
        </div>

        {/* Product grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              cartQty={cart[p.id] ?? 0}
              onAdd={addToCart}
            />
          ))}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div style={{
        width: '300px',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '16px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--grey1)', letterSpacing: '1px' }}>
          ORDER SUMMARY
        </div>

        {cartItems.length === 0 ? (
          <div style={{ color: 'var(--grey3)', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
            Add products to build your order
          </div>
        ) : (
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cartItems.map(([id, cases]) => {
              const p = liveProducts.find(p => p.id === id)
              if (!p) return null
              return (
                <div key={id} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '6px', padding: '10px 12px',
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--grey1)', marginBottom: '4px', lineHeight: '1.3' }}>{p.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--grey3)' }}>{cases} case{cases > 1 ? 's' : ''}</span>
                    <span style={{ color: 'var(--lime)', fontFamily: 'Courier New' }}>${(p.masterCasePrice * cases).toFixed(2)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--grey2)', fontSize: '13px' }}>Order Total</span>
            <span style={{ color: 'var(--lime)', fontSize: '22px', fontFamily: "'Arial Black'", letterSpacing: '-1px' }}>
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--grey3)' }}>
            Payment: Visa ending 4141 (on file)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--grey3)' }}>
            Est. ship: Within 24 hours of confirmation
          </div>
          <button
            onClick={handleSubmit}
            disabled={!cartItems.length}
            style={{
              background: cartItems.length ? 'var(--lime)' : 'var(--border)',
              color: cartItems.length ? '#000' : 'var(--grey3)',
              border: 'none', borderRadius: '8px',
              padding: '14px', fontSize: '13px', fontWeight: '700',
              cursor: cartItems.length ? 'pointer' : 'not-allowed',
              letterSpacing: '0.5px',
              transition: 'background 0.15s',
            }}
          >
            Submit Order &amp; Generate Invoice
          </button>
        </div>
      </div>
    </div>
  )
}
