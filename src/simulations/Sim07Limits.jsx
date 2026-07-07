import { useState } from 'react'
import SimLayout, { PanelSection, Divider } from '../components/SimLayout'
import { HYP, OPP, ADJ, ANG, makeTri, Vtx, AngleArc, SideLbl, RightAngle } from '../components/SvgTri'

/* ── Exact symbolic values at the 5 standard angles ── */
const STD = [0, 30, 45, 60, 90]
const EXACT = {
  0:  { sin: '0',     cos: '1',     tan: '0',     cosec: '—',    sec: '1',     cot: '—'    },
  30: { sin: '1/2',   cos: '√3/2',  tan: '1/√3',  cosec: '2',    sec: '2/√3',  cot: '√3'   },
  45: { sin: '1/√2',  cos: '1/√2',  tan: '1',     cosec: '√2',   sec: '√2',    cot: '1'    },
  60: { sin: '√3/2',  cos: '1/2',   tan: '√3',    cosec: '2/√3', sec: '2',     cot: '1/√3' },
  90: { sin: '1',     cos: '0',     tan: '—',     cosec: '1',    sec: '—',     cot: '0'    },
}

const SNAP_TOL = 1.8  // degrees — within this range, snap to exact values

function nearStd(deg) {
  return STD.find(s => Math.abs(deg - s) <= SNAP_TOL)
}

function displayVal(key, deg, numeric) {
  const snap = nearStd(deg)
  if (snap !== undefined) return EXACT[snap][key]
  if (!isFinite(numeric) || Math.abs(numeric) > 999) return '∞'
  return numeric.toFixed(4)
}

function isUndef(key, deg) {
  const snap = nearStd(deg)
  if (snap !== undefined) return EXACT[snap][key] === '—'
  return (key === 'cosec' && deg < 0.5) || (key === 'cot' && deg < 0.5) ||
         (key === 'tan' && deg > 89.5) || (key === 'sec' && deg > 89.5)
}

const RATIO_COLORS = { sin: OPP, cos: HYP, tan: ADJ, cosec: '#c084a0', sec: '#79afd4', cot: '#c4922a' }

export default function Sim07Limits() {
  const [deg, setDeg] = useState(45)

  const t = makeTri(deg, 240, 195, 210)
  const { A, B, C, sinA, cosA, tanA } = t
  const snap = nearStd(deg)
  const isStd = snap !== undefined

  const rows = [
    { id: 'sin',   name: 'sin A',   numeric: sinA },
    { id: 'cos',   name: 'cos A',   numeric: cosA },
    { id: 'tan',   name: 'tan A',   numeric: tanA },
    { id: 'cosec', name: 'cosec A', numeric: 1/sinA },
    { id: 'sec',   name: 'sec A',   numeric: 1/cosA },
    { id: 'cot',   name: 'cot A',   numeric: cosA/sinA },
  ]

  return (
    <SimLayout
      title="Trigonometric Ratios — Exact Values at Standard Angles"
      hint="Slide to any angle · Standard angles (0°, 30°, 45°, 60°, 90°) show exact symbolic values"
      panel={
        <>
          <PanelSection label="Angle A">
            <div style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, color: ANG }}>{deg.toFixed(1)}°</div>

            {/* Tick-marked slider */}
            <input type="range" min="0" max="90" step="0.5" value={deg}
              onChange={e => setDeg(+e.target.value)}
              style={{ width: '100%', accentColor: ANG }} />

            {/* Standard angle jump buttons */}
            <div style={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
              {STD.map(v => (
                <button key={v} onClick={() => setDeg(v)} style={{
                  padding: '4px 0', width: 36, borderRadius: 6,
                  border: `1.5px solid ${isStd && snap === v ? ANG : '#d0d7de'}`,
                  background: isStd && snap === v ? 'rgba(26,127,55,.1)' : '#f6f8fa',
                  color: isStd && snap === v ? ANG : '#57606a',
                  fontSize: '.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all .2s',
                }}>{v}°</button>
              ))}
            </div>

            {isStd && (
              <div style={{ padding: '5px 8px', borderRadius: 7, background: 'rgba(26,127,55,.07)', border: '1px solid rgba(26,127,55,.25)', fontSize: '.65rem', color: '#1a7f37', textAlign: 'center', fontWeight: 600 }}>
                Showing exact values for {snap}°
              </div>
            )}
          </PanelSection>

          <Divider />

          <PanelSection label="Trigonometric Ratios">
            {rows.map(r => {
              const undef = isUndef(r.id, deg)
              const val = displayVal(r.id, deg, r.numeric)
              const col = RATIO_COLORS[r.id]
              return (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 9px', borderRadius: 7,
                  border: `1px solid ${isStd ? 'rgba(26,127,55,.2)' : '#eaeef2'}`,
                  background: isStd ? 'rgba(26,127,55,.03)' : '#fafafa',
                  transition: 'all .3s',
                }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 600, color: col, minWidth: 60 }}>{r.name}</span>
                  <span style={{
                    fontSize: isStd ? '.92rem' : '.82rem',
                    fontWeight: 700,
                    color: undef ? '#d95f56' : col,
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'font-size .2s',
                    minWidth: 70, textAlign: 'right',
                  }}>{val}</span>
                </div>
              )
            })}
          </PanelSection>

          {(deg < 2 || deg > 88) && (
            <>
              <Divider />
              <div style={{ padding: '7px 9px', borderRadius: 7, background: 'rgba(217,95,86,.06)', border: '1px solid rgba(217,95,86,.25)', fontSize: '.67rem', color: '#d95f56', lineHeight: 1.6 }}>
                <strong>Not Defined (—)</strong> means division by zero occurs at this angle.
              </div>
            </>
          )}
        </>
      }
    >
      <svg viewBox="0 0 500 380" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        {/* Triangle fill */}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="rgba(9,105,218,.04)" />

        {/* Sides */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={HYP} strokeWidth={3.5} />
        {deg > 1  && <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={OPP} strokeWidth={3.5} />}
        {deg < 89 && <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={ADJ} strokeWidth={3.5} />}

        {/* Right angle */}
        {deg > 2 && deg < 88 && <RightAngle p={B} sz={14} />}

        {/* Angle arc */}
        {deg > 1 && deg < 89 && (
          <AngleArc vertex={A} p1={B} p2={C} color={ANG} label={`${deg.toFixed(1)}°`} r={44} />
        )}

        {/* Dynamic side labels */}
        <SideLbl p1={A} p2={C} text="hyp" color={HYP} ox={-38} oy={0} />
        {deg > 2  && <SideLbl p1={B} p2={C} text="opp" color={OPP} ox={32} oy={0} />}
        {deg < 88 && <SideLbl p1={A} p2={B} text="adj" color={ADJ} ox={0} oy={22} />}

        {/* Vertices */}
        <Vtx x={A.x} y={A.y} label="A" dx={-18} dy={12} />
        <Vtx x={B.x} y={B.y} label="B" dx={18} dy={14} />
        <Vtx x={C.x} y={C.y} label="C" dx={18} dy={-14} />

        {/* Big exact value display when on a standard angle */}
        {isStd && (() => {
          const ex = EXACT[snap]
          const pairs = [['sin', ex.sin, OPP], ['cos', ex.cos, HYP], ['tan', ex.tan, ADJ]]
          return (
            <g>
              <rect x={16} y={16} width={270} height={78} rx={9}
                fill="white" stroke="rgba(26,127,55,.3)" strokeWidth={1.5} />
              <text x={26} y={34} fontSize={11} fontWeight={600} fill={ANG} fontFamily="Segoe UI">
                Exact values at {snap}°
              </text>
              {pairs.map(([n, v, c], i) => (
                <text key={n} x={26 + i * 88} y={62} fontSize={13} fontWeight={800} fill={c} fontFamily="Segoe UI">
                  {n}={v}
                </text>
              ))}
              {/* Extra ratios row */}
              {[['cosec', ex.cosec, '#c084a0'], ['sec', ex.sec, '#79afd4'], ['cot', ex.cot, '#c4922a']].map(([n,v,c],i) => (
                <text key={n} x={26 + i * 88} y={84} fontSize={11} fontWeight={700} fill={c} fontFamily="Segoe UI">
                  {n}={v}
                </text>
              ))}
            </g>
          )
        })()}

        {/* Limiting case messages */}
        {deg < 2 && (
          <g>
            <rect x={130} y={160} width={240} height={46} rx={7} fill="white" stroke="#eaeef2" />
            <text x={250} y={178} textAnchor="middle" fontSize={11} fill="#57606a" fontFamily="Segoe UI">As A → 0°: BC → 0,  sin 0° = 0</text>
            <text x={250} y={196} textAnchor="middle" fontSize={11} fill="#57606a" fontFamily="Segoe UI">AB → AC,  cos 0° = 1</text>
          </g>
        )}
        {deg > 88 && (
          <g>
            <rect x={130} y={160} width={240} height={46} rx={7} fill="white" stroke="#eaeef2" />
            <text x={250} y={178} textAnchor="middle" fontSize={11} fill="#57606a" fontFamily="Segoe UI">As A → 90°: AB → 0,  cos 90° = 0</text>
            <text x={250} y={196} textAnchor="middle" fontSize={11} fill="#57606a" fontFamily="Segoe UI">BC → AC,  sin 90° = 1</text>
          </g>
        )}
      </svg>
    </SimLayout>
  )
}
