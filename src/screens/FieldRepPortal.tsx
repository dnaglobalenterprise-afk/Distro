import { useState } from 'react'
import { useGlobalState } from '../context/GlobalState'
import { PRODUCTS } from '../data/products'

const ACCOUNTS = [
  { id: 'acc-1', name: 'Charlotte Smoke Shop',   city: 'Charlotte, NC',    lastVisit: 3,   lastVisitUnit: 'days',  status: 'ok',   lastOrderAmt: 1240 },
  { id: 'acc-2', name: 'Uptown Tobacco',          city: 'Charlotte, NC',    lastVisit: 1,   lastVisitUnit: 'week',  status: 'ok',   lastOrderAmt: 890 },
  { id: 'acc-3', name: 'Monroe Smoke & Vape',     city: 'Monroe, NC',       lastVisit: 2,   lastVisitUnit: 'weeks', status: 'low',  lastOrderAmt: 540 },
  { id: 'acc-4', name: 'Kings Mountain Tobacco',  city: 'Kings Mountain, NC', lastVisit: null, lastVisitUnit: null, status: 'new',  lastOrderAmt: 0 },
]

const VISIT_TYPES = ['Visit', 'Call', 'Sample Drop', 'Inventory Check', 'Reorder']

const VISIT_RECENCY_COLOR = {
  ok:  'var(--green)',
  low: 'var(--amber)',
  new: 'var(--grey3)',
}

export default function FieldRepPortal() {
  const { addToast } = useGlobalState()
  const [selectedAcc, setSelectedAcc] = useState(null)
  const [visitType, setVisitType] = useState('Visit')
  const [lowProducts, setLowProducts] = useState([])
  const [notes, setNotes] = useState('')
  const [reorderOn, setReorderOn] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function toggleProduct(id) {
    setLowProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  function handleSubmit() {
    if (!selectedAcc) return
    addToast(`✓ Visit logged. Reorder request sent to Swift Wholesale.`)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setSelectedAcc(null)
      setNotes('')
      setLowProducts([])
      setReorderOn(false)
      setVisitType('Visit')
    }, 2000)
  }

  return (
    <div className="page-enter" style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', gap: '20px' }}>

      {/* Account List */}
      <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '2px', color: 'var(--grey3)', textTransform: 'uppercase', marginBottom: '4px' }}>
          My Accounts — NC Territory
        </div>
        {ACCOUNTS.map(acc => {
          const color = VISIT_RECENCY_COLOR[acc.status]
          const isSelected = selectedAcc?.id === acc.id
          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAcc(acc)}
              style={{
                background: isSelected ? 'rgba(240,106,40,0.1)' : 'var(--card)',
                border: `1px solid ${isSelected ? 'var(--orange)' : 'var(--border)'}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: '8px', padding: '14px 16px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ fontWeight: '700', color: 'var(--grey1)', fontSize: '13px', marginBottom: '3px' }}>{acc.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--grey3)', marginBottom: '6px' }}>{acc.city}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color }}>
                  {acc.lastVisit == null
                    ? '⚑ Never visited'
                    : acc.status === 'low'
                      ? `⚠ ${acc.lastVisit} ${acc.lastVisitUnit} ago`
                      : `${acc.lastVisit} ${acc.lastVisitUnit} ago`
                  }
                </span>
                {acc.lastOrderAmt > 0 && (
                  <span style={{ color: 'var(--grey3)', fontFamily: 'Courier New' }}>
                    Last: ${acc.lastOrderAmt.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Log Visit Form */}
      <div style={{ flex: 1 }}>
        {!selectedAcc ? (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px',
            padding: '48px', textAlign: 'center', color: 'var(--grey3)', fontSize: '14px',
          }}>
            Select an account to log a visit
          </div>
        ) : (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderTop: '3px solid var(--orange)', borderRadius: '8px',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px',
          }}>
            <div>
              <h3 style={{ margin: '0 0 4px', color: 'var(--grey1)', fontSize: '16px' }}>{selectedAcc.name}</h3>
              <div style={{ fontSize: '12px', color: 'var(--grey3)' }}>{selectedAcc.city}</div>
            </div>

            {/* Visit type */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Visit Type</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {VISIT_TYPES.map(t => (
                  <button key={t} onClick={() => setVisitType(t)} style={{
                    padding: '5px 12px', borderRadius: '20px', border: '1px solid',
                    borderColor: visitType === t ? 'var(--orange)' : 'var(--border)',
                    background: visitType === t ? 'rgba(240,106,40,0.12)' : 'transparent',
                    color: visitType === t ? 'var(--orange)' : 'var(--grey3)',
                    fontSize: '12px', cursor: 'pointer',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Products low */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Products Low or Out</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {PRODUCTS.slice(0, 12).map(p => (
                  <button key={p.id} onClick={() => toggleProduct(p.id)} style={{
                    padding: '4px 10px', borderRadius: '4px', border: '1px solid',
                    borderColor: lowProducts.includes(p.id) ? 'var(--amber)' : 'var(--border)',
                    background: lowProducts.includes(p.id) ? 'rgba(245,166,35,0.12)' : 'transparent',
                    color: lowProducts.includes(p.id) ? 'var(--amber)' : 'var(--grey3)',
                    fontSize: '11px', cursor: 'pointer',
                  }}>{p.name.replace('Fronto King', 'FK').replace('Hand Rolled', 'HR')}</button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Observations, requests, next steps..."
                style={{
                  width: '100%', height: '80px', background: 'var(--card2)',
                  border: '1px solid var(--border)', borderRadius: '6px',
                  color: 'var(--grey1)', fontSize: '13px', padding: '10px',
                  resize: 'vertical', fontFamily: 'Arial, sans-serif',
                }}
              />
            </div>

            {/* Reorder toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setReorderOn(v => !v)}
                style={{
                  width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                  background: reorderOn ? 'var(--orange)' : 'var(--border)',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: '3px',
                  left: reorderOn ? '23px' : '3px', transition: 'left 0.2s',
                }} />
              </button>
              <span style={{ fontSize: '13px', color: reorderOn ? 'var(--orange)' : 'var(--grey2)' }}>
                Include reorder request
              </span>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                background: submitted ? 'var(--green)' : 'var(--orange)',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '14px', fontSize: '13px', fontWeight: '700',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              {submitted ? '✓ Visit Logged' : 'Submit & Sync'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
