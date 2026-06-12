import { useGlobalState, ROLES } from '../context/GlobalState'

const COST_CARDS = [
  {
    value: '$252,000',
    label: 'Annual Order Gap',
    desc: '$21K monthly × 12 — orders not reaching fulfillment',
    color: 'var(--red)',
  },
  {
    value: '$180,000',
    label: 'SC Territory Dark',
    desc: '$15K/month active potential, $0 since May 10',
    color: 'var(--red)',
  },
  {
    value: '$32,500',
    label: 'Manual Labor Cost',
    desc: '25hrs/week × $25/hr — warehouse manual processing',
    color: 'var(--amber)',
  },
  {
    value: '$26,640',
    label: 'Software Waste',
    desc: 'Zoho + Badger — tools that don\'t solve the real problem',
    color: 'var(--amber)',
  },
]

export default function Opening({ onEnter }) {
  const { setRole } = useGlobalState()

  function handleEnter() {
    setRole(ROLES.OWNER)
    onEnter()
  }

  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 32px',
      gap: '40px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '11px',
          letterSpacing: '3px',
          color: 'var(--grey3)',
          textTransform: 'uppercase',
          marginBottom: '12px',
          fontFamily: 'Arial, sans-serif',
        }}>
          Hustle Van, LLC — Fronto King &amp; UP Brands
        </div>
        <h1 style={{
          fontSize: '36px',
          color: 'var(--grey1)',
          margin: '0 0 8px',
          letterSpacing: '2px',
        }}>
          What Your Current System
        </h1>
        <h1 style={{
          fontSize: '36px',
          color: 'var(--red)',
          margin: 0,
          letterSpacing: '2px',
        }}>
          Costs You Every Year
        </h1>
      </div>

      {/* Cost Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        width: '100%',
        maxWidth: '860px',
      }}>
        {COST_CARDS.map((card, i) => (
          <div key={i} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderTop: `3px solid ${card.color}`,
            borderRadius: '8px',
            padding: '28px 32px',
          }}>
            <div style={{
              fontSize: '42px',
              fontFamily: "'Arial Black', Arial, sans-serif",
              color: card.color,
              letterSpacing: '-1px',
              marginBottom: '6px',
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--grey1)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              {card.label}
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--grey2)',
              lineHeight: '1.5',
            }}>
              {card.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Total Bar */}
      <div style={{
        width: '100%',
        maxWidth: '860px',
        background: 'var(--red)',
        borderRadius: '8px',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: '700',
        }}>
          Total Annual Cost of Inaction
        </div>
        <div style={{
          fontSize: '52px',
          fontFamily: "'Arial Black', Arial, sans-serif",
          color: '#fff',
          letterSpacing: '-2px',
        }}>
          $541,140
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleEnter}
        style={{
          background: 'var(--orange)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '16px 48px',
          fontSize: '16px',
          fontFamily: "'Arial Black', Arial, sans-serif",
          letterSpacing: '1px',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--orange-d)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--orange)'}
      >
        See DistroOS →
      </button>
    </div>
  )
}
