import { useState } from 'react'
import SimLayout, { PanelSection, Divider } from '../components/SimLayout'
import { HYP, OPP, ADJ, ANG, Vtx, AngleArc, RightAngle } from '../components/SvgTri'

const COMP_COLOR = '#c4580d'

function TriPanel({ cx, cy, deg, isComp, label }) {
  const a = Math.max(1, Math.min(89, deg)) * Math.PI / 180
  const H = 115, adj = H * Math.cos(a), opp = H * Math.sin(a)
  const A = { x: cx - adj / 2, y: cy + opp / 2 }
  const B = { x: cx + adj / 2, y: cy + opp / 2 }
  const C = { x: cx + adj / 2, y: cy - opp / 2 }

  // For complementary: swap opp/adj colors
  const oppC = isComp ? ADJ : OPP
  const adjC = isComp ? OPP : ADJ

  return (
    <g>
      {/* Fill */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
        fill={isComp ? 'rgba(196,88,13,.04)' : 'rgba(9,105,218,.04)'} />

      {/* Sides */}
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={HYP} strokeWidth={3} />
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={oppC} strokeWidth={3} />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={adjC} strokeWidth={3} />

      {/* Right angle */}
      <RightAngle p={B} sz={12} />

      {/* Angle arc */}
      <AngleArc vertex={A} p1={B} p2={C}
        color={isComp ? COMP_COLOR : ANG}
        label={`${deg.toFixed(0)}°`} r={34} />

      {/* Vertices */}
      <Vtx x={A.x} y={A.y} label={isComp ? "A'" : 'A'} dx={-14} dy={9} />
      <Vtx x={B.x} y={B.y} label={isComp ? "B'" : 'B'} dx={13} dy={12} />
      <Vtx x={C.x} y={C.y} label={isComp ? "C'" : 'C'} dx={13} dy={-12} />

      {/* Title */}
      <text x={cx} y={cy - H / 2 - 30} textAnchor="middle" fontSize={12} fontWeight="700"
        fill={isComp ? COMP_COLOR : ANG} fontFamily="Segoe UI">
        {label}
      </text>
    </g>
  )
}

export default function Sim09Complementary() {
  const [deg, setDeg] = useState(40)
  const comp = 90 - deg

  const identityPairs = [
    ['sin', 'cos'], ['cos', 'sin'], ['tan', 'cot'],
    ['cot', 'tan'], ['sec', 'cosec'], ['cosec', 'sec'],
  ]

  return (
    <SimLayout
      title="Complementary Angles — sin(90°−A) = cos A"
      hint="Slide angle A — the two triangles are identical, just viewed from different angles"
      panel={
        <>
          <PanelSection label="Angle A">
            <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, color: ANG }}>{deg}°</div>
            <input type="range" min="1" max="89" step="1" value={deg}
              onChange={e => setDeg(+e.target.value)}
              style={{ width: '100%', accentColor: ANG }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: '#8c959f' }}>
              <span style={{ color: ANG, fontWeight: 600 }}>∠A = {deg}°</span>
              <span style={{ color: COMP_COLOR, fontWeight: 600 }}>∠(90−A) = {comp}°</span>
            </div>
          </PanelSection>
          <Divider />
          <PanelSection label="Identity Pairs">
            {identityPairs.map(([lhs, rhs]) => (
              <div key={lhs} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 7px', borderRadius: 6, border: '1px solid #eaeef2', background: '#fafafa', fontSize: '.71rem' }}>
                <span style={{ color: ANG, fontWeight: 600, minWidth: 50 }}>{lhs} {deg}°</span>
                <span style={{ color: '#8c959f' }}>=</span>
                <span style={{ color: COMP_COLOR, fontWeight: 600, minWidth: 56 }}>{rhs} {comp}°</span>
              </div>
            ))}
          </PanelSection>
          <Divider />
          <div style={{ fontSize: '.67rem', color: '#57606a', lineHeight: 1.6 }}>
            The two triangles are <strong>congruent</strong> — same shape, same angles, same ratios — only the labelling changes.
          </div>
        </>
      }
    >
      <svg viewBox="0 0 500 370" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        {/* Divider */}
        <line x1={250} y1={30} x2={250} y2={340} stroke="#eaeef2" strokeWidth={1.5} strokeDasharray="5,5" />
        <text x={250} y={22} textAnchor="middle" fontSize={10} fill="#8c959f" fontFamily="Segoe UI">mirror axis</text>

        {/* Left triangle: angle A */}
        <TriPanel cx={128} cy={185} deg={deg} isComp={false} label={`Angle A = ${deg}°`} />

        {/* Right triangle: angle (90−A) */}
        <TriPanel cx={372} cy={185} deg={comp} isComp={true} label={`Angle (90°−A) = ${comp}°`} />

        {/* Dashed connectors showing equal ratios */}
        <text x={250} y={355} textAnchor="middle" fontSize={10.5} fontWeight="600" fill={ANG} fontFamily="Segoe UI">
          sin(90°−A) = cos A  ·  cos(90°−A) = sin A
        </text>
      </svg>
    </SimLayout>
  )
}
