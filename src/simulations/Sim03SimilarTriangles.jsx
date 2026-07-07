import { useState, useRef } from 'react'
import SimLayout, { PanelSection, Divider, RatioRow } from '../components/SimLayout'
import { HYP, OPP, ADJ, ANG, Vtx, SideLbl, AngleArc } from '../components/SvgTri'

const FIXED_RATIO = 4 / 5   // opp/hyp in each nested triangle
const AX = 68, AY = 330     // fixed vertex A (all triangles share this)
const STEP = 55              // base unit per "level"

// Build the 4 nested triangle sets for a given scale
function buildTris(scale) {
  const levels = [1, 2, 3, 4]
  return levels.map(k => {
    const base = STEP * k * scale
    const h = base * FIXED_RATIO / Math.sqrt(1 - FIXED_RATIO * FIXED_RATIO)  // adj from ratio 4/5: adj = base * 3/5, opp = base * 4/5
    const adjLen = base * 3 / 5
    const oppLen = base * 4 / 5
    return {
      A: { x: AX, y: AY },
      B: { x: AX + adjLen, y: AY },
      C: { x: AX + adjLen, y: AY - oppLen },
      adj: adjLen, opp: oppLen,
      hyp: base,
      ratio: (oppLen / base).toFixed(3),
      labels: [['B','P','C','Q','D','R','E','S'][k * 2 - 2], ['B','P','C','Q','D','R','E','S'][k * 2 - 1]],
    }
  })
}

export default function Sim03SimilarTriangles() {
  const [scale, setScale] = useState(1.0)
  const svgRef = useRef(null)
  const dragging = useRef(false)

  const tris = buildTris(scale)
  const handlePos = tris[3].C  // drag handle at tip of largest triangle

  function toSVG(e) {
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    return pt.matrixTransform(svg.getScreenCTM().inverse())
  }

  function onDown(e) { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId) }
  function onMove(e) {
    if (!dragging.current) return
    const pt = toSVG(e)
    // Scale = dist along base from A / (STEP * 4 * adj_ratio)
    const newAdj = Math.max(50, Math.min(pt.x - AX, 200))
    setScale(newAdj / (STEP * 4 * 3 / 5))
  }
  function onUp() { dragging.current = false }

  const fillAlphas = [0.18, 0.12, 0.07, 0.04]
  const ratioVal = tris[0].ratio

  return (
    <SimLayout
      title="Similar Triangles — Trigonometric Ratios Stay Constant"
      hint="Drag the handle — all triangles share the same angle A, so their ratios are always equal"
      panel={
        <>
          <PanelSection label="opp ÷ hyp per triangle">
            {tris.map((t, i) => (
              <RatioRow key={i}
                name={`T${i + 1}: ${t.labels[0]}${t.labels[1]}/A${t.labels[0]}`}
                value={t.ratio}
                color={OPP}
              />
            ))}
          </PanelSection>
          <Divider />
          <div style={{ fontSize: '.72rem', color: '#57606a', lineHeight: 1.65 }}>
            All 4 ratios = <strong style={{ color: OPP }}>{ratioVal}</strong><br />
            = <strong style={{ color: '#1a7f37' }}>sin θ</strong> = constant<br />
            regardless of triangle size.
          </div>
          <Divider />
          <RatioRow name="sin θ" value={ratioVal} color={OPP} />
          <RatioRow name="cos θ" value={(tris[0].adj / tris[0].hyp).toFixed(3)} color={HYP} />
          <Divider />
          <div style={{ fontSize: '.65rem', color: '#8c959f', textAlign: 'center' }}>
            Drag the ● handle to<br />resize all triangles at once
          </div>
        </>
      }
    >
      <svg ref={svgRef} viewBox="0 0 500 380" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet"
        onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>

        {/* Baseline */}
        <line x1={AX - 10} y1={AY} x2={AX + 230} y2={AY} stroke="#e0e4ea" strokeWidth={1.5} />

        {/* Hypotenuse ray */}
        <line x1={AX} y1={AY} x2={tris[3].C.x + 10} y2={tris[3].C.y - 5}
          stroke={HYP} strokeWidth={2} strokeDasharray="5,4" />

        {/* Nested triangles (back to front) */}
        {[...tris].reverse().map((t, ri) => {
          const i = 3 - ri
          return (
            <g key={i}>
              <polygon points={`${t.A.x},${t.A.y} ${t.B.x},${t.B.y} ${t.C.x},${t.C.y}`}
                fill={HYP} fillOpacity={fillAlphas[i]} />
              <line x1={t.A.x} y1={t.A.y} x2={t.C.x} y2={t.C.y}
                stroke={HYP} strokeWidth={i === 3 ? 2.5 : 1.8} />
              <line x1={t.B.x} y1={t.B.y} x2={t.C.x} y2={t.C.y}
                stroke={OPP} strokeWidth={1.8} />
              <line x1={t.A.x} y1={t.A.y} x2={t.B.x} y2={t.B.y}
                stroke={ADJ} strokeWidth={1.5} />
              {/* right angle */}
              <path d={`M ${t.B.x - 9} ${t.B.y} L ${t.B.x - 9} ${t.B.y - 9} L ${t.B.x} ${t.B.y - 9}`}
                fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={1.2} />
              {/* Labels at tips */}
              <text x={t.B.x + 9} y={t.B.y + 12} fontSize={9.5} fill={ADJ} fontFamily="Segoe UI">{t.labels[0]}</text>
              <text x={t.C.x + 9} y={t.C.y - 4} fontSize={9.5} fill={OPP} fontFamily="Segoe UI">{t.labels[1]}</text>
            </g>
          )
        })}

        {/* Angle arc at A */}
        <AngleArc vertex={tris[0].A} p1={tris[0].B} p2={tris[0].C} color={ANG} label="θ" r={38} />

        {/* Vertex A */}
        <Vtx x={AX} y={AY} label="A" dx={-16} dy={10} />

        {/* Drag handle */}
        <circle cx={handlePos.x} cy={handlePos.y} r={11}
          fill={OPP} fillOpacity={0.85} stroke="#fff" strokeWidth={2}
          style={{ cursor: 'grab' }}
          onPointerDown={onDown}
        />
        <text x={handlePos.x} y={handlePos.y} textAnchor="middle" dominantBaseline="central"
          fontSize={9} fill="#fff" fontFamily="Segoe UI" style={{ pointerEvents: 'none' }}>⟺</text>
      </svg>
    </SimLayout>
  )
}
