import { useState } from 'react'
import SimLayout, { PanelSection, Divider, StepCard, ActionButton } from '../components/SimLayout'
import { HYP, OPP, ADJ, ANG, Vtx, AngleArc, RightAngle } from '../components/SvgTri'

// Isosceles right triangle: AB = BC = 100, AC = 100√2 ≈ 141
const A = { x: 95, y: 318 }, B = { x: 365, y: 318 }, C = { x: 365, y: 108 }

const steps = [
  { title: 'STEP 1', body: 'Draw right △ABC with ∠B = 90° and ∠A = ∠C = 45°.' },
  { title: 'STEP 2', body: <>Since ∠A = ∠C, sides opposite are equal: <strong style={{ color: OPP }}>AB = BC = a</strong></> },
  { title: 'STEP 3', body: <>Pythagoras: AC² = a² + a² = 2a²  ∴ <strong style={{ color: HYP }}>AC = a√2</strong></> },
  { title: 'STEP 4', body: <>sin 45° = <strong style={{ color: OPP }}>a</strong>/<strong style={{ color: HYP }}>a√2</strong> = <strong style={{ color: ANG }}>1/√2 ≈ 0.707</strong><br />cos 45° = 1/√2 ,  tan 45° = 1</> },
]

export default function Sim05_45Proof() {
  const [step, setStep] = useState(0)

  return (
    <SimLayout
      title="Trigonometric Ratios of 45° — Isosceles Right Triangle"
      hint="Click Next Step to reveal each part of the proof"
      panel={
        <>
          <PanelSection label="Step-by-Step Proof">
            {steps.map((s, i) => (
              <StepCard key={i} num={s.title} body={s.body}
                status={i > step ? 'idle' : i === step ? 'active' : 'done'} />
            ))}
          </PanelSection>
          <Divider />
          <ActionButton onClick={() => setStep(s => Math.min(s + 1, 3))} disabled={step >= 3}>
            {step >= 3 ? '✓ Complete' : 'Next Step →'}
          </ActionButton>
          <ActionButton secondary onClick={() => setStep(0)}>↺ Restart</ActionButton>
          {step >= 3 && (
            <>
              <Divider />
              <PanelSection label="Results">
                {[['sin 45°', '1/√2', '0.707', OPP], ['cos 45°', '1/√2', '0.707', HYP], ['tan 45°', '1', '1.000', ADJ]].map(([n, f, v, c]) => (
                  <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', borderRadius: 6, border: '1px solid #eaeef2', background: '#fafafa', fontSize: '.76rem' }}>
                    <span style={{ color: c, fontWeight: 600 }}>{n}</span>
                    <span style={{ color: '#8c959f' }}>{f}</span>
                    <span style={{ color: c, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </PanelSection>
            </>
          )}
        </>
      }
    >
      <svg viewBox="0 0 500 390" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        {/* Triangle fill — appears at step 0 */}
        <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="rgba(9,105,218,.04)" opacity={step >= 0 ? 1 : 0}
          style={{ transition: 'opacity .4s' }} />

        {/* Base triangle outline */}
        {step >= 0 && <>
          <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="rgba(0,0,0,.12)" strokeWidth={2.5} />
          <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="rgba(0,0,0,.12)" strokeWidth={2.5} />
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(0,0,0,.12)" strokeWidth={2.5} />
          <RightAngle p={B} sz={15} />
          <AngleArc vertex={A} p1={B} p2={C} color={ANG} label="45°" r={44} />
          <AngleArc vertex={C} p1={A} p2={B} color={ANG} label="45°" r={44} />
          <Vtx x={A.x} y={A.y} label="A" dx={-18} dy={12} />
          <Vtx x={B.x} y={B.y} label="B" dx={18} dy={14} />
          <Vtx x={C.x} y={C.y} label="C" dx={18} dy={-14} />
        </>}

        {/* Step 2: color AB and BC as equal sides */}
        {step >= 1 && <>
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={ADJ} strokeWidth={3.5} style={{ transition: 'all .4s' }} />
          <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={OPP} strokeWidth={3.5} style={{ transition: 'all .4s' }} />
          {/* tick marks showing equal lengths */}
          {[[0.5, 0.5, ADJ, 'a'], [0.5, 0.5, OPP, 'a']].map((_,i) => null)}
          <text x={(A.x+B.x)/2} y={B.y + 28} textAnchor="middle" fontSize={13} fontWeight="700" fill={ADJ} fontFamily="Segoe UI">a</text>
          <text x={B.x + 34} y={(B.y+C.y)/2} textAnchor="middle" fontSize={13} fontWeight="700" fill={OPP} fontFamily="Segoe UI">a</text>
        </>}

        {/* Step 3: highlight hypotenuse */}
        {step >= 2 && <>
          <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={HYP} strokeWidth={4} style={{ transition: 'all .4s' }} />
          <text x={(A.x+C.x)/2 - 58} y={(A.y+C.y)/2} textAnchor="middle" dominantBaseline="central"
            fontSize={13} fontWeight="700" fill={HYP} fontFamily="Segoe UI">a√2</text>
          {/* Pythagoras note */}
          <rect x={18} y={18} width={210} height={62} rx={8} fill="white" stroke="#eaeef2" />
          <text x={30} y={38} fontSize={11} fill="#57606a" fontFamily="Segoe UI">AC² = AB² + BC²</text>
          <text x={30} y={54} fontSize={11} fill="#57606a" fontFamily="Segoe UI">= a² + a² = 2a²</text>
          <text x={30} y={70} fontSize={11} fontWeight="700" fill={HYP} fontFamily="Segoe UI">∴ AC = a√2</text>
        </>}

        {/* Step 4: final ratios box */}
        {step >= 3 && <>
          <rect x={18} y={88} width={280} height={88} rx={8} fill="white" stroke="#d0d7de" />
          {[
            [OPP, 'sin 45° = a / a√2 = 1/√2 ≈ 0.707', 108],
            [HYP, 'cos 45° = a / a√2 = 1/√2 ≈ 0.707', 128],
            [ADJ, 'tan 45° = a / a = 1',                148],
            ['#8c959f', 'cosec 45° = √2,  sec 45° = √2,  cot 45° = 1', 166],
          ].map(([c, t, y]) => (
            <text key={y} x={30} y={y} fontSize={11} fontWeight="600" fill={c} fontFamily="Segoe UI">{t}</text>
          ))}
        </>}
      </svg>
    </SimLayout>
  )
}
