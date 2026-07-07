import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HYP, OPP, ADJ, ANG, Vtx, AngleArc, RightAngle } from '../components/SvgTri'

const ANGLES = [0, 30, 45, 60, 90]
const RATIO_COLORS = { sin: OPP, cos: HYP, tan: ADJ, cot: '#c4922a', sec: '#79afd4', cosec: '#c084a0' }
const TABLE = {
  sin:  ['0', '1/2', '1/√2', '√3/2', '1'],
  cos:  ['1', '√3/2', '1/√2', '1/2', '0'],
  tan:  ['0', '1/√3', '1', '√3', '—'],
  cot:  ['—', '√3', '1', '1/√3', '0'],
  sec:  ['1', '2/√3', '√2', '2', '—'],
  cosec:['—', '2', '√2', '2/√3', '1'],
}

// Mini SVG derivation panel
function DerivSvg({ deg }) {
  const a = Math.max(0.5, Math.min(89.5, deg)) * Math.PI / 180
  const H = 120, base = H * Math.cos(a), opp = H * Math.sin(a)
  const cx = 170, cy = 120
  const A = { x: cx - base / 2, y: cy + opp / 2 }
  const B = { x: cx + base / 2, y: cy + opp / 2 }
  const C = { x: cx + base / 2, y: cy - opp / 2 }
  return (
    <svg viewBox="0 0 340 220" style={{ width: '100%', maxHeight: 200 }}>
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(9,105,218,.05)" />
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={HYP} strokeWidth={3} />
      {deg > 1  && <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={OPP} strokeWidth={3} />}
      {deg < 89 && <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={ADJ} strokeWidth={3} />}
      {deg > 2 && deg < 88 && (
        <path d={`M ${B.x-9} ${B.y} L ${B.x-9} ${B.y-9} L ${B.x} ${B.y-9}`} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth={1.5} />
      )}
      {deg > 1 && deg < 89 && (
        <AngleArc vertex={A} p1={B} p2={C} color={ANG} label={`${deg}°`} r={28} />
      )}
      <Vtx x={A.x} y={A.y} label="A" dx={-13} dy={10} />
      <Vtx x={B.x} y={B.y} label="B" dx={12} dy={11} />
      <Vtx x={C.x} y={C.y} label="C" dx={12} dy={-11} />
    </svg>
  )
}

const DERIVS = {
  'sin-0':   { text: 'sin 0° = BC/AC = 0/r = 0  (BC collapses to zero)' },
  'sin-30':  { text: 'In 30-60-90 △: opp = a, hyp = 2a\nsin 30° = a/2a = 1/2 = 0.500' },
  'sin-45':  { text: 'Isosceles △: AB = BC = a, AC = a√2\nsin 45° = a/a√2 = 1/√2 ≈ 0.707' },
  'sin-60':  { text: '30-60-90 △: opp = a√3, hyp = 2a\nsin 60° = a√3/2a = √3/2 ≈ 0.866' },
  'sin-90':  { text: 'sin 90° = BC/AC = r/r = 1  (BC = AC at 90°)' },
  'cos-0':   { text: 'cos 0° = AB/AC = r/r = 1  (AB = AC at 0°)' },
  'cos-30':  { text: '30-60-90 △: adj = a√3, hyp = 2a\ncos 30° = a√3/2a = √3/2 ≈ 0.866' },
  'cos-45':  { text: 'Isosceles △: AB = a, AC = a√2\ncos 45° = a/a√2 = 1/√2 ≈ 0.707' },
  'cos-60':  { text: '30-60-90 △: adj = a, hyp = 2a\ncos 60° = a/2a = 1/2 = 0.500' },
  'cos-90':  { text: 'cos 90° = AB/AC = 0/r = 0  (AB collapses to zero)' },
  'tan-0':   { text: 'tan 0° = sin 0°/cos 0° = 0/1 = 0' },
  'tan-30':  { text: 'tan 30° = opp/adj = a/a√3 = 1/√3 ≈ 0.577' },
  'tan-45':  { text: 'tan 45° = opp/adj = a/a = 1' },
  'tan-60':  { text: 'tan 60° = opp/adj = a√3/a = √3 ≈ 1.732' },
  'tan-90':  { text: 'tan 90° = sin 90°/cos 90° = 1/0\n⟹ Not Defined (division by zero)' },
  'cot-0':   { text: 'cot 0° = cos 0°/sin 0° = 1/0\n⟹ Not Defined (division by zero)' },
  'cot-30':  { text: 'cot 30° = adj/opp = a√3/a = √3 ≈ 1.732' },
  'cot-45':  { text: 'cot 45° = adj/opp = a/a = 1' },
  'cot-60':  { text: 'cot 60° = adj/opp = a/a√3 = 1/√3 ≈ 0.577' },
  'cot-90':  { text: 'cot 90° = cos 90°/sin 90° = 0/1 = 0' },
  'sec-0':   { text: 'sec 0° = 1/cos 0° = 1/1 = 1' },
  'sec-30':  { text: 'sec 30° = 1/cos 30° = 1/(√3/2) = 2/√3 ≈ 1.155' },
  'sec-45':  { text: 'sec 45° = 1/cos 45° = 1/(1/√2) = √2 ≈ 1.414' },
  'sec-60':  { text: 'sec 60° = 1/cos 60° = 1/(1/2) = 2' },
  'sec-90':  { text: 'sec 90° = 1/cos 90° = 1/0\n⟹ Not Defined (division by zero)' },
  'cosec-0': { text: 'cosec 0° = 1/sin 0° = 1/0\n⟹ Not Defined (division by zero)' },
  'cosec-30':{ text: 'cosec 30° = 1/sin 30° = 1/(1/2) = 2' },
  'cosec-45':{ text: 'cosec 45° = 1/sin 45° = 1/(1/√2) = √2 ≈ 1.414' },
  'cosec-60':{ text: 'cosec 60° = 1/sin 60° = 2/√3 ≈ 1.155' },
  'cosec-90':{ text: 'cosec 90° = 1/sin 90° = 1/1 = 1' },
}

export default function Sim08ValuesTable() {
  const [active, setActive] = useState(null)
  const [ratio, angle] = active ? active.split('-') : ['', '']
  const deriv = active ? DERIVS[active] : null

  return (
    <div style={{ display:'flex', flexDirection:'column', width:'100vw', height:'100vh', background:'#f5f6f8', fontFamily:"'Segoe UI',system-ui,sans-serif", overflow:'hidden' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 16px', height:48, background:'#fff', borderBottom:'1px solid #d0d7de', flexShrink:0 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', border:'1px solid #d0d7de', borderRadius:7, color:'#57606a', fontSize:'.72rem', fontWeight:500, textDecoration:'none', background:'#f6f8fa' }}>← Back</Link>
        <span style={{ fontSize:'.85rem', fontWeight:600, color:'#1c2128' }}>Table 11.1 — Trigonometric Values  (click any cell)</span>
      </div>

      {/* Content */}
      <div style={{ display:'flex', flex:1, padding:12, gap:11, overflow:'hidden', minHeight:0 }}>
        {/* Table */}
        <div style={{ background:'#fff', border:'1px solid #d0d7de', borderRadius:10, padding:'14px 12px', overflowX:'auto', display:'flex', alignItems:'flex-start' }}>
          <table style={{ borderCollapse:'separate', borderSpacing:3, fontSize:'.8rem' }}>
            <thead>
              <tr>
                <th style={thHd()}>∠ A</th>
                {ANGLES.map(a => <th key={a} style={thHd()}>{a}°</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.keys(TABLE).map(r => (
                <tr key={r}>
                  <th style={{ ...thHd(), color: RATIO_COLORS[r] }}>{r} A</th>
                  {ANGLES.map((a, i) => {
                    const key = `${r}-${a}`
                    const val = TABLE[r][i]
                    const undef = val === '—'
                    const isAct = active === key
                    return (
                      <td key={a} onClick={() => setActive(key)} style={{
                        padding:'10px 14px', textAlign:'center', borderRadius:7, cursor:'pointer',
                        fontWeight:700, border:`1px solid ${isAct ? ANG : undef ? 'rgba(217,95,86,.3)' : '#eaeef2'}`,
                        background: isAct ? 'rgba(26,127,55,.07)' : undef ? 'rgba(217,95,86,.05)' : '#fafafa',
                        color: undef ? '#d95f56' : RATIO_COLORS[r],
                        transition:'all .18s', fontVariantNumeric:'tabular-nums',
                      }}>
                        {val}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail pane */}
        <div style={{ flex:1, background:'#fff', border:'1px solid #d0d7de', borderRadius:10, padding:'18px 16px', display:'flex', flexDirection:'column', gap:12, minWidth:0, overflowY:'auto' }}>
          {deriv ? (
            <>
              <div style={{ fontSize:'1rem', fontWeight:700, color: RATIO_COLORS[ratio] }}>
                {ratio} {angle}° = {TABLE[ratio]?.[ANGLES.indexOf(+angle)]}
              </div>
              <DerivSvg deg={+angle} />
              <div style={{ background:'#f6f8fa', border:'1px solid #eaeef2', borderRadius:8, padding:'12px 14px', fontSize:'.8rem', lineHeight:1.75, color:'#57606a', whiteSpace:'pre-line' }}>
                {deriv.text}
              </div>
            </>
          ) : (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, color:'#8c959f', textAlign:'center' }}>
              <div style={{ fontSize:'2rem' }}>👆</div>
              <div style={{ fontSize:'.88rem' }}>Click any cell to see the geometric derivation</div>
              <div style={{ fontSize:'.73rem' }}>"—" cells are Not Defined (division by zero)</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign:'center', padding:'5px', fontSize:'.67rem', color:'#8c959f', background:'#fff', borderTop:'1px solid #eaeef2', flexShrink:0 }}>
        Click any cell to see derivation · "—" = Not Defined
      </div>
    </div>
  )
}

function thHd() {
  return {
    background: '#f6f8fa', border: '1px solid #d0d7de',
    padding: '8px 12px', fontSize: '.75rem', letterSpacing: '.5px',
    color: '#57606a', textAlign: 'center', borderRadius: 6, whiteSpace: 'nowrap', fontWeight: 600,
  }
}
