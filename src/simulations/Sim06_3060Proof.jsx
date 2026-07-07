import { useState } from 'react'
import SimLayout, { PanelSection, Divider, StepCard, ActionButton, ToggleButtons } from '../components/SimLayout'
import { HYP, OPP, ADJ, ANG, Vtx, AngleArc } from '../components/SvgTri'

// Equilateral triangle (side = 2a = 240), split by altitude AD
const A2 = { x: 250, y: 55 }  // apex
const BL = { x: 105, y: 330 } // bottom-left
const BR = { x: 395, y: 330 } // bottom-right
const D  = { x: 250, y: 330 } // midpoint of BC (foot of altitude)

const steps30 = [
  { title: 'STEP 1', body: 'Equilateral △ABC: all sides = 2a, all angles = 60°.' },
  { title: 'STEP 2', body: <>Draw altitude AD from A ⊥ BC.<br/>BD = DC = <strong style={{ color: ADJ }}>a</strong> (midpoint)</> },
  { title: 'STEP 3', body: <>Pythagoras in △ABD:<br/>AD² = 4a² − a² = 3a²<br/><strong style={{ color: HYP }}>AD = a√3</strong></> },
  { title: 'STEP 4', body: 'In △ABD: ∠ABD = 60°, ∠ADB = 90°, so ∠BAD = 30°.' },
]

export default function Sim06_3060Proof() {
  const [step, setStep] = useState(0)
  const [ang, setAng]   = useState(30)

  const is30 = ang === 30

  return (
    <SimLayout
      title="Trigonometric Ratios of 30° and 60° — Equilateral Triangle"
      hint="Toggle between 30° and 60°, then step through the proof"
      panel={
        <>
          <PanelSection label="View Angle">
            <ToggleButtons
              options={[{ value: 30, label: '30°', color: ANG }, { value: 60, label: '60°', color: HYP }]}
              value={ang} onChange={v => { setAng(v); setStep(0) }}
            />
          </PanelSection>
          <Divider />
          <PanelSection label="Proof Steps">
            {steps30.map((s, i) => (
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
              {(is30
                ? [['sin 30°','1/2','0.500',OPP],['cos 30°','√3/2','0.866',HYP],['tan 30°','1/√3','0.577',ADJ]]
                : [['sin 60°','√3/2','0.866',OPP],['cos 60°','1/2','0.500',HYP],['tan 60°','√3','1.732',ADJ]]
              ).map(([n,f,v,c]) => (
                <div key={n} style={{ display:'flex', justifyContent:'space-between', padding:'4px 8px', borderRadius:6, border:'1px solid #eaeef2', background:'#fafafa', fontSize:'.75rem' }}>
                  <span style={{color:c,fontWeight:600}}>{n}</span><span style={{color:'#8c959f'}}>{f}</span><span style={{color:c,fontWeight:700}}>{v}</span>
                </div>
              ))}
            </>
          )}
        </>
      }
    >
      <svg viewBox="0 0 500 390" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
        {/* Step 0: Equilateral triangle */}
        {step >= 0 && <>
          <polygon points={`${A2.x},${A2.y} ${BL.x},${BL.y} ${BR.x},${BR.y}`}
            fill="rgba(9,105,218,.04)" stroke="#c8cdd5" strokeWidth={2} />
          <Vtx x={A2.x} y={A2.y} label="A" dx={0} dy={-16} />
          <Vtx x={BL.x} y={BL.y} label="B" dx={-17} dy={13} />
          <Vtx x={BR.x} y={BR.y} label="C" dx={17} dy={13} />
          <text x={(A2.x+BL.x)/2 - 16} y={(A2.y+BL.y)/2} fontSize={11} fill="#8c959f" fontFamily="Segoe UI">2a</text>
          <text x={(A2.x+BR.x)/2 + 16} y={(A2.y+BR.y)/2} fontSize={11} fill="#8c959f" fontFamily="Segoe UI">2a</text>
          <text x={(BL.x+BR.x)/2} y={BL.y + 22} textAnchor="middle" fontSize={11} fill="#8c959f" fontFamily="Segoe UI">2a</text>
          <text x={A2.x} y={A2.y + 20} textAnchor="middle" fontSize={10} fill={ANG} fontFamily="Segoe UI">60°</text>
          <text x={BL.x + 22} y={BL.y - 6} fontSize={10} fill={ANG} fontFamily="Segoe UI">60°</text>
          <text x={BR.x - 28} y={BR.y - 6} fontSize={10} fill={ANG} fontFamily="Segoe UI">60°</text>
        </>}

        {/* Step 1: Altitude AD */}
        {step >= 1 && <>
          <line x1={A2.x} y1={A2.y} x2={D.x} y2={D.y} stroke={ANG} strokeWidth={2.5} strokeDasharray="6,3" />
          <Vtx x={D.x} y={D.y} label="D" dx={0} dy={16} />
          <path d={`M ${D.x-12} ${D.y} L ${D.x-12} ${D.y-12} L ${D.x} ${D.y-12}`} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth={1.5} />
          <text x={(BL.x+D.x)/2} y={BL.y+18} textAnchor="middle" fontSize={11} fontWeight="700" fill={ADJ} fontFamily="Segoe UI">a</text>
          <text x={(D.x+BR.x)/2} y={BL.y+18} textAnchor="middle" fontSize={11} fontWeight="700" fill={ADJ} fontFamily="Segoe UI">a</text>
        </>}

        {/* Step 2: Highlight AD = a√3 */}
        {step >= 2 && <>
          <line x1={A2.x} y1={A2.y} x2={D.x} y2={D.y} stroke={HYP} strokeWidth={4} />
          <text x={D.x + 22} y={(A2.y+D.y)/2} fontSize={12} fontWeight="700" fill={HYP} fontFamily="Segoe UI">a√3</text>
          <rect x={18} y={20} width={200} height={60} rx={7} fill="white" stroke="#eaeef2" />
          <text x={28} y={40} fontSize={10.5} fill="#57606a" fontFamily="Segoe UI">AD² = AB² − BD²</text>
          <text x={28} y={56} fontSize={10.5} fill="#57606a" fontFamily="Segoe UI">= 4a² − a² = 3a²</text>
          <text x={28} y={72} fontSize={11} fontWeight="700" fill={HYP} fontFamily="Segoe UI">∴ AD = a√3</text>
        </>}

        {/* Step 3: Highlight the working triangle and ratios */}
        {step >= 3 && <>
          {/* Highlight triangle ABD */}
          <polygon points={`${A2.x},${A2.y} ${BL.x},${BL.y} ${D.x},${D.y}`}
            fill="rgba(26,127,55,.07)" />
          {is30 ? <>
            <line x1={A2.x} y1={A2.y} x2={BL.x} y2={BL.y} stroke={HYP} strokeWidth={4} />
            <line x1={BL.x} y1={BL.y} x2={D.x}  y2={D.y}  stroke={OPP} strokeWidth={4} />
            <line x1={A2.x} y1={A2.y} x2={D.x}  y2={D.y}  stroke={ADJ} strokeWidth={4} />
            <text x={(A2.x+BL.x)/2-18} y={(A2.y+BL.y)/2} fontSize={11} fontWeight="700" fill={HYP} fontFamily="Segoe UI">2a (hyp)</text>
            <text x={BL.x-48} y={(BL.y+D.y)/2} fontSize={11} fontWeight="700" fill={OPP} fontFamily="Segoe UI">a (opp)</text>
            <text x={D.x+16} y={(A2.y+D.y)/2} fontSize={11} fontWeight="700" fill={ADJ} fontFamily="Segoe UI">a√3 (adj)</text>
            <AngleArc vertex={BL} p1={D} p2={A2} color={ANG} label="30°" r={40} />
          </> : <>
            <line x1={A2.x} y1={A2.y} x2={BL.x} y2={BL.y} stroke={HYP} strokeWidth={4} />
            <line x1={A2.x} y1={A2.y} x2={D.x}  y2={D.y}  stroke={OPP} strokeWidth={4} />
            <line x1={BL.x} y1={BL.y} x2={D.x}  y2={D.y}  stroke={ADJ} strokeWidth={4} />
            <text x={(A2.x+BL.x)/2-18} y={(A2.y+BL.y)/2} fontSize={11} fontWeight="700" fill={HYP} fontFamily="Segoe UI">2a (hyp)</text>
            <text x={D.x+16} y={(A2.y+D.y)/2} fontSize={11} fontWeight="700" fill={OPP} fontFamily="Segoe UI">a√3 (opp)</text>
            <text x={BL.x-48} y={(BL.y+D.y)/2} fontSize={11} fontWeight="700" fill={ADJ} fontFamily="Segoe UI">a (adj)</text>
            <AngleArc vertex={A2} p1={D} p2={BL} color={ANG} label="60°" r={40} />
          </>}

          {/* Results box */}
          <rect x={18} y={86} width={265} height={is30?68:68} rx={7} fill="white" stroke="#d0d7de" />
          {(is30
            ? [[OPP,'sin 30° = a/2a = 1/2 = 0.500',106],[HYP,'cos 30° = a√3/2a = √3/2 ≈ 0.866',124],[ADJ,'tan 30° = a/a√3 = 1/√3 ≈ 0.577',142]]
            : [[OPP,'sin 60° = a√3/2a = √3/2 ≈ 0.866',106],[HYP,'cos 60° = a/2a = 1/2 = 0.500',124],[ADJ,'tan 60° = a√3/a = √3 ≈ 1.732',142]]
          ).map(([c,t,y]) => (
            <text key={y} x={28} y={y} fontSize={11} fontWeight="600" fill={c} fontFamily="Segoe UI">{t}</text>
          ))}
        </>}
      </svg>
    </SimLayout>
  )
}
