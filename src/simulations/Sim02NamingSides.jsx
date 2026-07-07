import { useState } from 'react'
import SimLayout, { PanelSection, Divider, ToggleButtons } from '../components/SimLayout'
import { HYP, OPP, ADJ, ANG, Vtx, SideLbl, AngleArc, RightAngle } from '../components/SvgTri'

// Fixed triangle vertices — the colors change, the geometry stays
const A = { x: 88, y: 318 }
const B = { x: 408, y: 318 }
const C = { x: 408, y: 110 }

const roleMap = {
  A: { AC: { col: HYP, role: 'Hypotenuse' }, BC: { col: OPP, role: 'Opposite' }, AB: { col: ADJ, role: 'Adjacent' } },
  C: { AC: { col: HYP, role: 'Hypotenuse' }, BC: { col: ADJ, role: 'Adjacent' }, AB: { col: OPP, role: 'Opposite' } },
}

export default function Sim02NamingSides() {
  const [sel, setSel] = useState('A')
  const m = roleMap[sel]

  return (
    <SimLayout
      title="Naming the Sides of a Right Triangle"
      hint="Hypotenuse never changes — Opposite and Adjacent swap depending on which angle you pick"
      panel={
        <>
          <PanelSection label="Choose Angle">
            <ToggleButtons
              options={[{ value: 'A', label: '∠ A', color: ANG }, { value: 'C', label: '∠ C', color: ANG }]}
              value={sel} onChange={setSel}
            />
          </PanelSection>
          <Divider />
          <PanelSection label="Side Labels">
            {[['AC', m.AC], ['BC', m.BC], ['AB', m.AB]].map(([side, { col, role }]) => (
              <div key={side} style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px',
                borderRadius: 7, border: '1px solid #eaeef2', background: '#fafafa',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#1c2128' }}>{side}</div>
                  <div style={{ fontSize: '.62rem', color: '#8c959f' }}>{role}</div>
                </div>
              </div>
            ))}
          </PanelSection>
          <Divider />
          <PanelSection>
            {[
              [HYP, 'Hypotenuse', 'Longest side, opposite the right angle'],
              [OPP, 'Opposite', 'Directly across from the chosen angle'],
              [ADJ, 'Adjacent', 'Beside the chosen angle (not hypotenuse)'],
            ].map(([c, n, d]) => (
              <div key={n} style={{ fontSize: '.69rem', lineHeight: 1.5, color: '#57606a' }}>
                <span style={{ color: c, fontWeight: 700 }}>{n}</span> — {d}
              </div>
            ))}
          </PanelSection>
        </>
      }
    >
      <svg viewBox="0 0 500 390" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        {/* Triangle fill */}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(9,105,218,.04)" />

        {/* Sides — color changes with CSS transition */}
        {[
          [A, C, m.AC.col, m.AC.role, { ox: -56, oy: 0 }],
          [B, C, m.BC.col, m.BC.role, { ox: 28, oy: 0 }],
          [A, B, m.AB.col, m.AB.role, { ox: 0, oy: 22 }],
        ].map(([p1, p2, col, role, off]) => (
          <g key={role}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={col} strokeWidth={3.5} style={{ transition: 'stroke .35s' }} />
            <SideLbl p1={p1} p2={p2} text={role} color={col} ox={off.ox} oy={off.oy} />
          </g>
        ))}

        {/* Right angle at B */}
        <RightAngle p={B} sz={15} />

        {/* Angle arc */}
        {sel === 'A'
          ? <AngleArc vertex={A} p1={B} p2={C} color={ANG} label="A" r={46} />
          : <AngleArc vertex={C} p1={A} p2={B} color={ANG} label="C" r={46} />
        }

        {/* Vertices */}
        <Vtx x={A.x} y={A.y} label="A" dx={-18} dy={12} />
        <Vtx x={B.x} y={B.y} label="B" dx={18} dy={14} />
        <Vtx x={C.x} y={C.y} label="C" dx={18} dy={-14} />
      </svg>
    </SimLayout>
  )
}
