/**
 * Shared SVG geometry helpers for trigonometry simulations.
 * All simulations use viewBox "0 0 500 380" unless noted.
 */

export const HYP = '#0969da'
export const OPP = '#7c4dbd'
export const ADJ = '#c4580d'
export const ANG = '#1a7f37'
export const GRAY = '#57606a'
export const TEXT = '#1c2128'

/** Clamp angle to [minDeg, maxDeg] */
export function clampDeg(d, lo = 3, hi = 87) { return Math.min(hi, Math.max(lo, d)) }

/**
 * Compute right-triangle vertices centered at (cx, cy).
 * Right angle is at B (bottom-right). Angle A is at bottom-left.
 * Fixed hypotenuse = hyp (default 210).
 */
export function makeTri(angleDeg, cx = 240, cy = 195, hyp = 210) {
  const a = clampDeg(angleDeg) * Math.PI / 180
  const adj = hyp * Math.cos(a)
  const opp = hyp * Math.sin(a)
  const A = { x: cx - adj / 2, y: cy + opp / 2 }
  const B = { x: cx + adj / 2, y: cy + opp / 2 }
  const C = { x: cx + adj / 2, y: cy - opp / 2 }
  return { A, B, C, adj, opp, hyp, sinA: Math.sin(a), cosA: Math.cos(a), tanA: Math.tan(a), deg: angleDeg }
}

/**
 * SVG arc path from angle a1 to a2 (radians) around center (cx,cy) radius r.
 * Automatically chooses correct sweep/large-arc for the shorter arc.
 */
export function arcPath(cx, cy, r, a1, a2) {
  let diff = a2 - a1
  while (diff >  Math.PI) diff -= 2 * Math.PI
  while (diff < -Math.PI) diff += 2 * Math.PI
  const sweep = diff > 0 ? 1 : 0
  const large  = Math.abs(diff) > Math.PI ? 1 : 0
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
  const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2)
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`
}

/** Mid-angle between a1 and a2 (radians), used for label placement */
export function midAng(a1, a2) {
  let diff = a2 - a1
  while (diff >  Math.PI) diff -= 2 * Math.PI
  while (diff < -Math.PI) diff += 2 * Math.PI
  return a1 + diff / 2
}

/** SVG path for a right-angle square at corner p, going in dx/dy directions */
export function rightAnglePath(p, sz = 13) {
  return `M ${p.x - sz} ${p.y} L ${p.x - sz} ${p.y - sz} L ${p.x} ${p.y - sz}`
}

/** Rounded rect SVG path */
export function rrect(x, y, w, h, r = 4) {
  return `M${x+r},${y} h${w-2*r} a${r},${r} 0 0 1 ${r},${r} v${h-2*r} a${r},${r} 0 0 1 ${-r},${r} h${-w+2*r} a${r},${r} 0 0 1 ${-r},${-r} v${-h+2*r} a${r},${r} 0 0 1 ${r},${-r} z`
}

/* ── SVG Component Helpers ── */

/** Vertex circle with letter label */
export function Vtx({ x, y, label, dx = 0, dy = 0 }) {
  return (
    <g>
      <circle cx={x + dx} cy={y + dy} r={13} fill="#fff" stroke="#d0d7de" strokeWidth={1.5} />
      <text x={x + dx} y={y + dy} textAnchor="middle" dominantBaseline="central"
        fontSize={12} fontWeight="700" fill={TEXT} fontFamily="'Segoe UI',system-ui">
        {label}
      </text>
    </g>
  )
}

/** Label box floating near a midpoint */
export function SideLbl({ p1, p2, text, color, ox = 0, oy = 0, small }) {
  const mx = (p1.x + p2.x) / 2 + ox, my = (p1.y + p2.y) / 2 + oy
  const fs = small ? 9.5 : 11
  const tw = text.length * (fs * 0.6) + 12
  return (
    <g>
      <rect x={mx - tw / 2} y={my - 10} width={tw} height={20} rx={4}
        fill="#fff" stroke={color} strokeWidth={0.6} strokeOpacity={0.5} />
      <text x={mx} y={my} textAnchor="middle" dominantBaseline="central"
        fontSize={fs} fontWeight="600" fill={color} fontFamily="'Segoe UI',system-ui">
        {text}
      </text>
    </g>
  )
}

/** Angle arc + degree label at a vertex */
export function AngleArc({ vertex, p1, p2, r = 40, color, label }) {
  const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x)
  const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x)
  const path = arcPath(vertex.x, vertex.y, r, a1, a2)
  const mid = midAng(a1, a2)
  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth={1.8} />
      <text
        x={vertex.x + (r + 17) * Math.cos(mid)}
        y={vertex.y + (r + 17) * Math.sin(mid)}
        textAnchor="middle" dominantBaseline="central"
        fontSize={13} fontWeight="700" fill={color} fontFamily="'Segoe UI',system-ui">
        {label}
      </text>
    </g>
  )
}

/** Right-angle square marker */
export function RightAngle({ p, sz = 13 }) {
  return (
    <path d={rightAnglePath(p, sz)} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth={1.5} />
  )
}

/** fmt number to 4 decimal places, or "Undef" */
export function fmt(v, digits = 4) {
  if (!isFinite(v) || Math.abs(v) > 9999) return '—'
  return v.toFixed(digits)
}
