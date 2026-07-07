import { useState } from 'react'
import SimLayout, { PanelSection, Divider, RatioRow } from '../components/SimLayout'
import { HYP, OPP, ADJ, ANG, makeTri, Vtx, SideLbl, AngleArc, RightAngle } from '../components/SvgTri'

function safeVal(v, d = 4) {
  if (!isFinite(v) || Math.abs(v) > 99) return '—'
  return v.toFixed(d)
}

export default function Sim04RatioDashboard() {
  const [deg, setDeg] = useState(42)

  const { A, B, C, adj, opp, hyp, sinA, cosA, tanA } = makeTri(deg, 235, 195, 210)
  const cscA = 1 / sinA, secA = 1 / cosA, cotA = cosA / sinA

  const rows = [
    { name: 'sin A', frac: `opp/hyp`, value: safeVal(sinA), color: OPP },
    { name: 'cos A', frac: `adj/hyp`, value: safeVal(cosA), color: HYP },
    { name: 'tan A', frac: `opp/adj`, value: safeVal(tanA), color: ADJ },
    { name: 'cosec A', frac: `hyp/opp`, value: safeVal(cscA), color: '#c084a0' },
    { name: 'sec A',   frac: `hyp/adj`, value: safeVal(secA), color: '#79afd4' },
    { name: 'cot A',   frac: `adj/opp`, value: safeVal(cotA), color: '#c4922a' },
  ]

  return (
    <SimLayout
      title="All 6 Trigonometric Ratios — Live Dashboard"
      hint="Use the slider to change angle A — all 6 ratios update instantly"
      panel={
        <>
          <PanelSection label="Angle A">
            <div style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, color: ANG, letterSpacing: 1 }}>
              {deg.toFixed(1)}°
            </div>
            <input type="range" min="3" max="87" step="0.5" value={deg}
              onChange={e => setDeg(+e.target.value)}
              style={{ width: '100%', accentColor: ANG }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.65rem', color: '#8c959f' }}>
              <span>3°</span><span>87°</span>
            </div>
            {/* Quick-set buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginTop: 2 }}>
              {[30, 45, 60].map(v => (
                <button key={v} onClick={() => setDeg(v)} style={{
                  padding: '4px 0', borderRadius: 6, border: '1px solid #d0d7de',
                  background: Math.abs(deg - v) < 0.3 ? 'rgba(26,127,55,.1)' : '#f6f8fa',
                  color: Math.abs(deg - v) < 0.3 ? ANG : '#57606a',
                  fontSize: '.72rem', fontWeight: 600, cursor: 'pointer',
                }}>{v}°</button>
              ))}
            </div>
          </PanelSection>
          <Divider />
          <PanelSection label="Side Lengths">
            {[['adj', adj.toFixed(1), HYP], ['opp', opp.toFixed(1), OPP], ['hyp', hyp.toFixed(1), ADJ]].map(([n, v, c]) => (
              <div key={n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', padding: '3px 8px', borderRadius: 5, background: '#fafafa', border: '1px solid #eaeef2' }}>
                <span style={{ color: c, fontWeight: 600 }}>{n}</span>
                <span style={{ color: '#1c2128', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
              </div>
            ))}
          </PanelSection>
          <Divider />
          <PanelSection label="6 Ratios">
            {rows.map(r => <RatioRow key={r.name} {...r} />)}
          </PanelSection>
        </>
      }
    >
      <svg viewBox="0 0 500 380" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        {/* Triangle fill */}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(9,105,218,.04)" />

        {/* Sides */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={HYP} strokeWidth={3.5} />
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={OPP} strokeWidth={3.5} />
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={ADJ} strokeWidth={3.5} />

        {/* Right angle */}
        <RightAngle p={B} sz={14} />

        {/* Angle arc */}
        <AngleArc vertex={A} p1={B} p2={C} color={ANG} label={`${deg.toFixed(1)}°`} r={44} />

        {/* Side labels with measured values */}
        <SideLbl p1={A} p2={C} text={`hyp = ${hyp.toFixed(1)}`} color={HYP} ox={-54} oy={0} />
        <SideLbl p1={B} p2={C} text={`opp = ${opp.toFixed(1)}`} color={OPP} ox={36} oy={0} />
        <SideLbl p1={A} p2={B} text={`adj = ${adj.toFixed(1)}`} color={ADJ} ox={0} oy={22} />

        {/* Vertices */}
        <Vtx x={A.x} y={A.y} label="A" dx={-18} dy={12} />
        <Vtx x={B.x} y={B.y} label="B" dx={18} dy={14} />
        <Vtx x={C.x} y={C.y} label="C" dx={18} dy={-14} />
      </svg>
    </SimLayout>
  )
}
