import { useState } from 'react'
import SimLayout, { PanelSection, Divider } from '../components/SimLayout'
import { HYP, OPP, ADJ, ANG, Vtx, AngleArc, RightAngle } from '../components/SvgTri'

/**
 * Computes the three squares drawn on each side of a right triangle.
 * The triangle is placed with:
 *   O  at (ox, oy)          — left vertex (the angle we care about)
 *   B  at (ox+adj, oy)      — right-angle vertex
 *   C  at (ox+adj, oy-opp)  — top vertex
 *
 * The hypotenuse square is drawn OUTWARD from OC (away from B).
 * The adj-side square is drawn DOWNWARD from OB.
 * The opp-side square is drawn RIGHTWARD from BC.
 */
function buildSquares(ox, oy, adj, opp, hyp) {
  const O = { x: ox,       y: oy       }
  const B = { x: ox + adj, y: oy       }
  const C = { x: ox + adj, y: oy - opp }

  // Adj square (below OB, side = adj)
  const adjSq = [
    { x: O.x,       y: O.y },
    { x: B.x,       y: B.y },
    { x: B.x,       y: B.y + adj },
    { x: O.x,       y: O.y + adj },
  ]

  // Opp square (right of BC, side = opp)
  const oppSq = [
    { x: B.x,       y: B.y },
    { x: C.x,       y: C.y },
    { x: C.x + opp, y: C.y },
    { x: B.x + opp, y: B.y },
  ]

  // Hyp square (outward from OC)
  // OC unit vector: u = (adj/hyp, -opp/hyp)
  // Outward perp (CW rotation of u): (uy, -ux) ... wait we need away from B
  // CW rotation of u: (uy, -ux) = (-opp/hyp, -adj/hyp)
  const px = -opp / hyp, py = -adj / hyp   // outward unit perpendicular
  const hypSq = [
    { x: O.x,                    y: O.y },
    { x: C.x,                    y: C.y },
    { x: C.x + hyp * px,         y: C.y + hyp * py },
    { x: O.x + hyp * px,         y: O.y + hyp * py },
  ]

  return { O, B, C, adjSq, oppSq, hypSq }
}

function pts(arr) { return arr.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') }
function cen(arr) {
  const x = arr.reduce((s, p) => s + p.x, 0) / arr.length
  const y = arr.reduce((s, p) => s + p.y, 0) / arr.length
  return { x, y }
}

function fmt3(v) { return !isFinite(v) || Math.abs(v) > 99 ? '—' : v.toFixed(3) }
function fmt4(v) { return !isFinite(v) || Math.abs(v) > 99 ? '—' : v.toFixed(4) }

const TABS = [
  { id: 1, label: 'sin²+cos²', eq: 'sin²A + cos²A = 1',   color: OPP  },
  { id: 2, label: '1+tan²',   eq: '1 + tan²A = sec²A',   color: ADJ  },
  { id: 3, label: 'cot²+1',   eq: 'cot²A + 1 = cosec²A', color: '#c084a0' },
]

export default function Sim10Identities() {
  const [deg, setDeg]   = useState(40)
  const [tab, setTab]   = useState(1)

  // Effective angle — clamp per identity to avoid extreme values
  const effectiveDeg = tab === 2
    ? Math.min(deg, 72)
    : tab === 3
    ? Math.max(deg, 18)
    : deg
  const a = effectiveDeg * Math.PI / 180

  const sinA = Math.sin(a), cosA = Math.cos(a), tanA = Math.tan(a)
  const cotA = cosA / sinA, secA = 1 / cosA, cscA = 1 / sinA

  // Choose triangle normalization per identity
  const S = 95  // base scale in SVG units
  let adj, opp, hyp, adjArea, oppArea, hypArea
  let adjColor, oppColor, hypColor, adjAreaStr, oppAreaStr, hypAreaStr

  if (tab === 1) {
    // Normalize by hyp = S: adj=S·cosA, opp=S·sinA, hyp=S
    adj = S * cosA; opp = S * sinA; hyp = S
    adjColor = HYP;    oppColor = OPP;       hypColor = ANG
    adjAreaStr = `cos²A = ${fmt3(cosA*cosA)}`
    oppAreaStr  = `sin²A = ${fmt3(sinA*sinA)}`
    hypAreaStr  = `1²  =  1`
    adjArea = cosA*cosA; oppArea = sinA*sinA; hypArea = 1
  } else if (tab === 2) {
    // Normalize by adj = S: adj=S, opp=S·tanA, hyp=S·secA
    adj = S; opp = S * tanA; hyp = S * secA
    adjColor = HYP;    oppColor = ADJ;       hypColor = '#79afd4'
    adjAreaStr = `1²  =  1`
    oppAreaStr  = `tan²A = ${fmt3(tanA*tanA)}`
    hypAreaStr  = `sec²A = ${fmt3(secA*secA)}`
    adjArea = 1; oppArea = tanA*tanA; hypArea = secA*secA
  } else {
    // Normalize by opp = S: adj=S·cotA, opp=S, hyp=S·cscA
    adj = S * cotA; opp = S; hyp = S * cscA
    adjColor = '#c4922a'; oppColor = OPP; hypColor = '#c084a0'
    adjAreaStr = `cot²A = ${fmt3(cotA*cotA)}`
    oppAreaStr  = `1²  =  1`
    hypAreaStr  = `cosec²A = ${fmt3(cscA*cscA)}`
    adjArea = cotA*cotA; oppArea = 1; hypArea = cscA*cscA
  }

  // Place triangle: O at (ox, oy), leaving room for all squares
  const ox = 110, oy = 240
  const sq = buildSquares(ox, oy, adj, opp, hyp)

  // Sum verification
  const sumVerify = (adjArea + oppArea).toFixed(4)
  const hypVerify = hypArea.toFixed(4)

  // Equation
  const equations = {
    1: `${fmt3(sinA*sinA)} + ${fmt3(cosA*cosA)} = ${(sinA*sinA + cosA*cosA).toFixed(4)}`,
    2: `1 + ${fmt3(tanA*tanA)} = ${fmt3(secA*secA)}`,
    3: `${fmt3(cotA*cotA)} + 1 = ${fmt3(cscA*cscA)}`,
  }

  return (
    <SimLayout
      title="Pythagorean Identities — Squares on Triangle Sides"
      hint="Pythagoras' theorem on a unit triangle proves all three identities — the two small squares always equal the large square"
      panel={
        <>
          <PanelSection label="Angle A">
            <div style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: ANG }}>
              {effectiveDeg.toFixed(1)}°
            </div>
            <input type="range" min="5" max="85" step="0.5" value={deg}
              onChange={e => setDeg(+e.target.value)}
              style={{ width: '100%', accentColor: ANG }} />
          </PanelSection>
          <Divider />
          <PanelSection label="Identity">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                width: '100%', padding: '7px 0', borderRadius: 7,
                border: `1.5px solid ${tab === t.id ? t.color : '#eaeef2'}`,
                background: tab === t.id ? `${t.color}12` : '#fafafa',
                color: tab === t.id ? t.color : '#57606a',
                fontSize: '.74rem', fontWeight: tab === t.id ? 700 : 400,
                cursor: 'pointer', transition: 'all .22s', textAlign: 'left', paddingLeft: 10,
              }}>{t.eq}</button>
            ))}
          </PanelSection>
          <Divider />
          <PanelSection label="Square Areas">
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 6, background: '#fafafa', border: '1px solid #eaeef2' }}>
              <div style={{ width: 10, height: 10, background: adjColor, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: '.68rem', color: adjColor, fontWeight: 600 }}>{adjAreaStr}</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '.72rem', color: '#8c959f' }}>+</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 6, background: '#fafafa', border: '1px solid #eaeef2' }}>
              <div style={{ width: 10, height: 10, background: oppColor, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: '.68rem', color: oppColor, fontWeight: 600 }}>{oppAreaStr}</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '.72rem', fontWeight: 700, color: ANG }}>= {sumVerify}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 6, background: `${hypColor}10`, border: `1px solid ${hypColor}40` }}>
              <div style={{ width: 10, height: 10, background: hypColor, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: '.68rem', color: hypColor, fontWeight: 700 }}>{hypAreaStr}</span>
            </div>
          </PanelSection>
          <Divider />
          <div style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(26,127,55,.06)', border: '1px solid rgba(26,127,55,.22)', fontSize: '.73rem', fontWeight: 600, color: ANG, textAlign: 'center', lineHeight: 1.6 }}>
            {equations[tab]}
          </div>
        </>
      }
    >
      <svg viewBox="0 0 500 380" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">

        {/* ── ADJ square (below base OB) ── */}
        <polygon points={pts(sq.adjSq)} fill={adjColor} fillOpacity={0.12} stroke={adjColor} strokeWidth={1.8} />
        {(() => {
          const c = cen(sq.adjSq)
          return (
            <g>
              <text x={c.x} y={c.y - 8} textAnchor="middle" fontSize={10} fontWeight="700" fill={adjColor} fontFamily="Segoe UI">adj²</text>
              <text x={c.x} y={c.y + 7} textAnchor="middle" fontSize={9} fill={adjColor} fontFamily="Segoe UI">{fmt3(adjArea)}</text>
            </g>
          )
        })()}

        {/* ── OPP square (right of BC) ── */}
        <polygon points={pts(sq.oppSq)} fill={oppColor} fillOpacity={0.12} stroke={oppColor} strokeWidth={1.8} />
        {(() => {
          const c = cen(sq.oppSq)
          return (
            <g>
              <text x={c.x} y={c.y - 8} textAnchor="middle" fontSize={10} fontWeight="700" fill={oppColor} fontFamily="Segoe UI">opp²</text>
              <text x={c.x} y={c.y + 7} textAnchor="middle" fontSize={9} fill={oppColor} fontFamily="Segoe UI">{fmt3(oppArea)}</text>
            </g>
          )
        })()}

        {/* ── HYP square (tilted, outward from OC) ── */}
        <polygon points={pts(sq.hypSq)} fill={hypColor} fillOpacity={0.12} stroke={hypColor} strokeWidth={2.2} />
        {(() => {
          const c = cen(sq.hypSq)
          return (
            <g>
              <text x={c.x} y={c.y - 8} textAnchor="middle" fontSize={11} fontWeight="700" fill={hypColor} fontFamily="Segoe UI">hyp²</text>
              <text x={c.x} y={c.y + 8} textAnchor="middle" fontSize={9.5} fontWeight="700" fill={hypColor} fontFamily="Segoe UI">{fmt3(hypArea)}</text>
            </g>
          )
        })()}

        {/* ── Triangle (drawn on top) ── */}
        <polygon points={`${sq.O.x},${sq.O.y} ${sq.B.x},${sq.B.y} ${sq.C.x},${sq.C.y}`}
          fill="rgba(9,105,218,.05)" />
        <line x1={sq.O.x} y1={sq.O.y} x2={sq.C.x} y2={sq.C.y} stroke={hypColor} strokeWidth={3.5} />
        <line x1={sq.B.x} y1={sq.B.y} x2={sq.C.x} y2={sq.C.y} stroke={oppColor} strokeWidth={3.5} />
        <line x1={sq.O.x} y1={sq.O.y} x2={sq.B.x} y2={sq.B.y} stroke={adjColor} strokeWidth={3.5} />
        <RightAngle p={sq.B} sz={13} />
        <AngleArc vertex={sq.O} p1={sq.B} p2={sq.C} color={ANG} label={`${effectiveDeg.toFixed(0)}°`} r={34} />

        {/* Side length labels */}
        <text x={(sq.O.x + sq.B.x)/2} y={sq.O.y - 7} textAnchor="middle" fontSize={10} fontWeight="700" fill={adjColor} fontFamily="Segoe UI">adj</text>
        <text x={sq.B.x + 16} y={(sq.B.y + sq.C.y)/2} textAnchor="middle" fontSize={10} fontWeight="700" fill={oppColor} fontFamily="Segoe UI">opp</text>
        <text x={(sq.O.x + sq.C.x)/2 - 22} y={(sq.O.y + sq.C.y)/2 - 6} textAnchor="middle" fontSize={10} fontWeight="700" fill={hypColor} fontFamily="Segoe UI">hyp</text>

        {/* Vertices */}
        <Vtx x={sq.O.x} y={sq.O.y} label="A" dx={-15} dy={0} />
        <Vtx x={sq.B.x} y={sq.B.y} label="B" dx={15} dy={13} />
        <Vtx x={sq.C.x} y={sq.C.y} label="C" dx={15} dy={-13} />

        {/* Identity proof caption */}
        <rect x={275} y={300} width={218} height={68} rx={8} fill="white" stroke="#eaeef2" strokeWidth={1} />
        <text x={384} y={318} textAnchor="middle" fontSize={10} fill="#8c959f" fontFamily="Segoe UI">Pythagorean Theorem:</text>
        <text x={384} y={334} textAnchor="middle" fontSize={11} fontWeight="700" fill="#1c2128" fontFamily="Segoe UI">adj² + opp² = hyp²</text>
        <line x1={284} y1={342} x2={484} y2={342} stroke="#eaeef2" />
        <text x={384} y={358} textAnchor="middle" fontSize={10.5} fontWeight="700" fill={ANG} fontFamily="Segoe UI">
          {TABS.find(t => t.id === tab)?.eq}
        </text>

        {/* "Not available" note for extreme angles */}
        {tab === 2 && deg > 72 && (
          <text x={250} y={30} textAnchor="middle" fontSize={10} fill="#d95f56" fontFamily="Segoe UI">
            Clamped to 72° (tan becomes very large beyond this)
          </text>
        )}
        {tab === 3 && deg < 18 && (
          <text x={250} y={30} textAnchor="middle" fontSize={10} fill="#d95f56" fontFamily="Segoe UI">
            Clamped to 18° (cot becomes very large below this)
          </text>
        )}
      </svg>
    </SimLayout>
  )
}
