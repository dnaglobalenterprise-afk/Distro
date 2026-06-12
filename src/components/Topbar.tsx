import RoleSwitcher from './RoleSwitcher'

export default function Topbar({ title, subtitle }) {
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
      {/* Left — logo */}
      <div style={{
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontSize: '16px',
        letterSpacing: '2px',
        color: 'var(--orange)',
      }}>
        DISTRO<span style={{ color: 'var(--grey2)' }}>OS</span>
      </div>

      {/* Center — live pulse */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: 'var(--green)',
          display: 'inline-block',
          boxShadow: '0 0 6px var(--green)',
          animation: 'glowPulse 2s ease-in-out infinite',
        }} />
        <span style={{ fontSize: '13px', color: 'var(--grey2)' }}>
          Live · Updated just now
        </span>
        {title && (
          <span style={{ fontSize: '13px', color: 'var(--grey3)', marginLeft: '16px' }}>
            {title}{subtitle && <> · <span style={{ color: 'var(--grey2)' }}>{subtitle}</span></>}
          </span>
        )}
      </div>

      {/* Right — role switcher */}
      <RoleSwitcher />
    </div>
  )
}
