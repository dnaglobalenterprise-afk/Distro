export default function KpiCard({ label, value, sub, accent }) {
  const accentMap = {
    orange: 'var(--orange)',
    teal:   'var(--teal)',
    lime:   'var(--lime)',
    red:    'var(--red)',
    green:  'var(--green)',
    amber:  'var(--amber)',
  }
  const color = accentMap[accent] ?? 'var(--orange)'

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderTop: `3px solid ${color}`,
      borderRadius: '8px',
      padding: '20px 24px',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: 'var(--grey3)',
        marginBottom: '10px',
        fontFamily: 'Arial, sans-serif',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '32px',
        fontFamily: "'Arial Black', Arial, sans-serif",
        color: color,
        letterSpacing: '-1px',
        marginBottom: '4px',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: 'var(--grey2)' }}>{sub}</div>
      )}
    </div>
  )
}
