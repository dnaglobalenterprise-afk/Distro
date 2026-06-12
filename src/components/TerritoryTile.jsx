import { useState } from 'react'

const STATUS_COLOR = {
  active:  'var(--green)',
  growing: 'var(--amber)',
  dark:    'var(--red)',
}

export default function TerritoryTile({ state: abbr, data }) {
  const [showTip, setShowTip] = useState(false)
  const color = STATUS_COLOR[data.status] ?? 'var(--grey2)'

  return (
    <div
      style={{ position: 'relative', flex: 1, minWidth: 0 }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <div style={{
        background: 'var(--card)',
        border: `1px solid ${data.status === 'dark' ? 'var(--red)' : 'var(--border)'}`,
        borderTop: `3px solid ${color}`,
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}>
        <div style={{
          fontSize: '22px',
          fontFamily: "'Arial Black', Arial, sans-serif",
          color: 'var(--grey1)',
          marginBottom: '4px',
        }}>
          {abbr}
        </div>
        <div style={{
          fontSize: '18px',
          fontFamily: "'Courier New', monospace",
          color: color,
          marginBottom: '4px',
        }}>
          {data.revenue === 0 ? '$0' : `$${(data.revenue / 1000).toFixed(0)}K`}
        </div>
        <div style={{
          fontSize: '11px',
          color: data.status === 'dark' ? 'var(--red)' : 'var(--grey3)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {data.status === 'dark' ? '⚠ Dark — 31 days' : data.status === 'growing' ? 'Growing' : 'Active'}
        </div>
      </div>

      {/* Tooltip */}
      {showTip && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--card2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px 16px',
          whiteSpace: 'nowrap',
          zIndex: 100,
          fontSize: '12px',
          color: 'var(--grey1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <div style={{ marginBottom: '4px' }}><strong>{data.accounts}</strong> accounts</div>
          {data.daysDark
            ? <div style={{ color: 'var(--red)' }}>Dark for <strong>{data.daysDark} days</strong></div>
            : <div style={{ color: 'var(--grey2)' }}>Revenue MTD: <strong>${data.revenue.toLocaleString()}</strong></div>
          }
        </div>
      )}
    </div>
  )
}
