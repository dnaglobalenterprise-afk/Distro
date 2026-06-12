import { useEffect } from 'react'
import { useGlobalState } from '../context/GlobalState.jsx'

const VARIANT_STYLES = {
  success: { bg: 'var(--green)',  icon: '✓' },
  error:   { bg: 'var(--red)',    icon: '✕' },
  info:    { bg: 'var(--teal)',   icon: 'ℹ' },
}

function ToastItem({ toast }) {
  const { removeToast } = useGlobalState()
  const style = VARIANT_STYLES[toast.variant] ?? VARIANT_STYLES.success

  useEffect(() => {
    const t = setTimeout(() => removeToast(toast.id), 3000)
    return () => clearTimeout(t)
  }, [toast.id, removeToast])

  return (
    <div className="slide-in" style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderLeft: `4px solid ${style.bg}`,
      borderRadius: '8px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: '280px',
      maxWidth: '420px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}>
      <span style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: style.bg, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 'bold', flexShrink: 0,
      }}>
        {style.icon}
      </span>
      <span style={{ fontSize: '13px', color: 'var(--grey1)', flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        style={{ background: 'none', border: 'none', color: 'var(--grey3)', cursor: 'pointer', fontSize: '16px', padding: 0 }}
      >×</button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts } = useGlobalState()
  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 1000,
    }}>
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  )
}
