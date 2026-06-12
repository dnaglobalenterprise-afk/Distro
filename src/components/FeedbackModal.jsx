import { useState } from 'react'

export default function FeedbackModal() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    console.log('[DistroOS Feedback]', text)
    setSubmitted(true)
    setTimeout(() => { setOpen(false); setSubmitted(false); setText('') }, 1500)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--grey2)',
          fontSize: '12px',
          padding: '8px 14px',
          cursor: 'pointer',
          letterSpacing: '1px',
          zIndex: 999,
        }}
      >
        💬 Feedback
      </button>

      {/* Modal */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }} onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="page-enter" style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderTop: '3px solid var(--orange)',
            borderRadius: '12px',
            padding: '32px',
            width: '540px',
            maxWidth: '95vw',
          }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: 'var(--grey1)' }}>
              What we want to know from you
            </h2>
            <p style={{ color: 'var(--grey3)', fontSize: '12px', marginBottom: '20px' }}>
              Hustle Van, LLC — DistroOS Demo Feedback
            </p>
            <ol style={{ color: 'var(--grey2)', fontSize: '13px', lineHeight: '2', paddingLeft: '20px', marginBottom: '20px' }}>
              <li>Is anything in this workflow different from how you actually operate?</li>
              <li>Is there anything you do today that you don't see here?</li>
              <li>Are there user types we haven't thought of?</li>
              <li>What would make you not want to use this?</li>
              <li>What would make you sign today?</li>
            </ol>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Your notes here..."
              style={{
                width: '100%', height: '100px',
                background: 'var(--card2)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--grey1)', fontSize: '13px',
                padding: '12px', resize: 'vertical', fontFamily: 'Arial, sans-serif',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={() => setOpen(false)} style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--grey2)', borderRadius: '6px', padding: '8px 20px', cursor: 'pointer',
              }}>
                Cancel
              </button>
              <button onClick={handleSubmit} style={{
                background: submitted ? 'var(--green)' : 'var(--orange)',
                border: 'none', color: '#fff', borderRadius: '6px',
                padding: '8px 24px', cursor: 'pointer', fontWeight: '700',
                transition: 'background 0.2s',
              }}>
                {submitted ? '✓ Sent' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
