import { Link } from 'react-router-dom'

/**
 * SimLayout — standard two-column simulation page:
 *   Header bar (back + title)
 *   Left:  drawing area (SVG fills this)
 *   Right: side panel (controls, values, steps)
 *   Footer: hint text
 */
export default function SimLayout({ title, hint, children, panel }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100vw', height: '100vh',
      background: '#f5f6f8', fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflow: 'hidden',
    }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 48, flexShrink: 0,
        background: '#fff', borderBottom: '1px solid #d0d7de',
      }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', border: '1px solid #d0d7de', borderRadius: 7,
          color: '#57606a', fontSize: '.72rem', fontWeight: 500,
          textDecoration: 'none', background: '#f6f8fa', flexShrink: 0,
          transition: 'border-color .18s',
        }}>← Back</Link>
        <span style={{
          fontSize: '.85rem', fontWeight: 600, color: '#1c2128',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</span>
      </div>

      {/* ── Main ── */}
      <div style={{ display: 'flex', flex: 1, padding: 12, gap: 11, overflow: 'hidden', minHeight: 0 }}>

        {/* Drawing pane */}
        <div style={{
          flex: 1, minWidth: 0, background: '#fff',
          border: '1px solid #d0d7de', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {children}
        </div>

        {/* Side panel */}
        <aside style={{
          width: 208, flexShrink: 0,
          background: '#fff', border: '1px solid #d0d7de', borderRadius: 10,
          padding: '14px 13px', display: 'flex', flexDirection: 'column',
          gap: 9, overflowY: 'auto',
        }}>
          {panel}
        </aside>
      </div>

      {/* ── Hint ── */}
      {hint && (
        <div style={{
          textAlign: 'center', padding: '5px 16px 7px',
          fontSize: '.67rem', color: '#8c959f', flexShrink: 0,
          background: '#fff', borderTop: '1px solid #eaeef2',
        }}>{hint}</div>
      )}
    </div>
  )
}

/* ── Reusable panel pieces ── */

export function PanelSection({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <div style={{ fontSize: '.56rem', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#8c959f', fontWeight: 600 }}>{label}</div>}
      {children}
    </div>
  )
}

export function Divider() {
  return <div style={{ height: 1, background: '#eaeef2', flexShrink: 0 }} />
}

export function RatioRow({ name, frac, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '5px 8px', borderRadius: 6, border: '1px solid #eaeef2',
      background: '#fafafa', gap: 4,
    }}>
      <span style={{ fontSize: '.72rem', color, fontWeight: 600, minWidth: 56 }}>{name}</span>
      {frac && <span style={{ fontSize: '.62rem', color: '#8c959f', flex: 1, textAlign: 'center' }}>{frac}</span>}
      <span style={{ fontSize: '.85rem', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', minWidth: 54, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export function StepCard({ num, title, body, status }) {
  const s = {
    idle:   { bg: '#fafafa', border: '#eaeef2', titleC: '#8c959f', bodyC: '#8c959f' },
    done:   { bg: 'rgba(9,105,218,.04)', border: 'rgba(9,105,218,.2)', titleC: '#0969da', bodyC: '#57606a' },
    active: { bg: 'rgba(26,127,55,.05)', border: '#1a7f37', titleC: '#1a7f37', bodyC: '#1c2128' },
  }[status] || {}
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 8,
      border: `1px solid ${s.border}`, background: s.bg,
      transition: 'all .25s',
    }}>
      <div style={{ fontSize: '.57rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: s.titleC, marginBottom: 3 }}>{num}</div>
      <div style={{ fontSize: '.72rem', color: s.bodyC, lineHeight: 1.55 }}>{body}</div>
    </div>
  )
}

export function ToggleButtons({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
          border: `1.5px solid ${value === o.value ? o.color || '#0969da' : '#d0d7de'}`,
          background: value === o.value ? `${o.color || '#0969da'}14` : '#fafafa',
          color: value === o.value ? (o.color || '#0969da') : '#57606a',
          fontWeight: 700, fontSize: '.85rem', transition: 'all .2s',
        }}>{o.label}</button>
      ))}
    </div>
  )
}

export function ActionButton({ onClick, children, disabled, secondary }) {
  if (secondary) return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '7px 0', width: '100%', borderRadius: 7,
      border: '1px solid #d0d7de', background: '#f6f8fa',
      color: '#57606a', fontSize: '.73rem', cursor: 'pointer',
      transition: 'all .18s', fontFamily: 'inherit',
    }}>{children}</button>
  )
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '9px 0', width: '100%', borderRadius: 8,
      border: '1.5px solid rgba(9,105,218,.4)', background: 'rgba(9,105,218,.09)',
      color: '#0969da', fontSize: '.83rem', fontWeight: 600, cursor: 'pointer',
      transition: 'all .18s', fontFamily: 'inherit',
      opacity: disabled ? 0.35 : 1,
    }}>{children}</button>
  )
}
