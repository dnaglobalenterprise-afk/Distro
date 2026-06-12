import { useEffect, useRef, useState } from 'react'

export default function InventoryCounter({ value, size = 'large', label }) {
  const [display, setDisplay] = useState(value)
  const [flashing, setFlashing] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (value === prevRef.current) return
    const diff = prevRef.current - value
    if (diff <= 0) { prevRef.current = value; setDisplay(value); return }

    // Animate count down
    const steps = Math.min(diff, 20)
    const step = diff / steps
    let current = prevRef.current
    let i = 0
    setFlashing(true)

    const interval = setInterval(() => {
      current -= step
      i++
      setDisplay(Math.round(current))
      if (i >= steps) {
        clearInterval(interval)
        setDisplay(value)
        setTimeout(() => setFlashing(false), 400)
      }
    }, 400 / steps)

    prevRef.current = value
    return () => clearInterval(interval)
  }, [value])

  const fontSize = size === 'large' ? '72px' : size === 'medium' ? '32px' : '20px'

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className={flashing ? 'flash-decrement' : ''}
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize,
          fontWeight: 'bold',
          color: value <= 500 ? 'var(--red)' : value <= 2000 ? 'var(--amber)' : 'var(--green)',
          letterSpacing: '-2px',
          lineHeight: 1,
          transition: 'color 0.4s',
        }}
      >
        {display.toLocaleString()}
      </div>
      {label && (
        <div style={{ fontSize: '11px', color: 'var(--grey3)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '8px' }}>
          {label}
        </div>
      )}
    </div>
  )
}
