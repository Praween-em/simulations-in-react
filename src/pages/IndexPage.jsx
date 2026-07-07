import { Link } from 'react-router-dom'
import '../styles/global.css'

const sims = [
  { id:1, section:'11.1',   sectionLabel:'Introduction',   accent:'#0969da', icon:'🪜', tech:'Three.js 3D', title:'Ladder & Wall',             desc:'3D scene — drag the slider to raise or lower the ladder. Watch how angle θ, height, and base change in real time.', tags:['3D','Slider','Interactive'] },
  { id:2, section:'11.1.1', sectionLabel:'Naming Sides',   accent:'#0969da', icon:'📐', tech:'SVG + React', title:'Naming the Sides',          desc:'Click ∠A or ∠C to re-label all three sides. Color-coded to show how names depend on the chosen angle.',           tags:['Interactive','Color-coded'] },
  { id:3, section:'11.2',   sectionLabel:'Trig Ratios',    accent:'#7c4dbd', icon:'📏', tech:'SVG + Drag',  title:'Similar Triangles',         desc:'Drag the handle to scale four nested similar triangles. All ratios stay locked — that is the essence of trig.',     tags:['Drag','Live Ratios'] },
  { id:4, section:'11.2.1', sectionLabel:'Defining Ratios',accent:'#7c4dbd', icon:'📊', tech:'SVG + Drag',  title:'Live Ratio Dashboard',      desc:'Drag the vertex to change angle A. All 6 trig ratios — sin, cos, tan, cosec, sec, cot — update live.',             tags:['Drag','6 Ratios'] },
  { id:5, section:'11.3.1', sectionLabel:'Special Angles', accent:'#c4580d', icon:'🔺', tech:'SVG + Steps', title:'45° — Isosceles Proof',     desc:'Step-by-step proof. Each click reveals how AB = BC = a leads to AC = a√2 and sin 45° = 1/√2.',                    tags:['Step-by-step','Proof'] },
  { id:6, section:'11.3.2', sectionLabel:'30° & 60°',      accent:'#c4580d', icon:'⬡',  tech:'SVG + Steps', title:'30° & 60° Proof',           desc:'Equilateral triangle split by its altitude. Toggle 30°/60°, step through to show AD = a√3.',                      tags:['Toggle','Step-by-step'] },
  { id:7, section:'11.3.3', sectionLabel:'Limits',         accent:'#c4580d', icon:'↔',  tech:'SVG + Slider',title:'0° & 90° — Limiting Cases', desc:'Slide from 0° to 90°. Watch sides shrink. "Not Defined" values highlighted. Snap buttons jump to limits.',         tags:['Slider','Limits'] },
  { id:8, section:'11.3',   sectionLabel:'Values Table',   accent:'#c4580d', icon:'🗂', tech:'SVG + Table', title:'Interactive Values Table',  desc:'Full Table 11.1 — click any cell to see a geometric derivation with a labeled SVG triangle.',                      tags:['Clickable','Table 11.1'] },
  { id:9, section:'11.4',   sectionLabel:'Complementary',  accent:'#1a7f37', icon:'🪞', tech:'SVG + Slider',title:'Complementary Angle Mirror',desc:'Split-screen: angle A left, (90°−A) right. Drag the slider to see all 6 identity pairs update live.',               tags:['Split-screen','Slider'] },
  { id:10,section:'11.5',   sectionLabel:'Identities',     accent:'#7c4dbd', icon:'⭕', tech:'SVG + Unit ○',title:'Pythagorean Identities',    desc:'Unit circle with SVG triangle. sin²A and cos²A squares always sum to 1. Three identity tabs.',                    tags:['Unit Circle','Proof'] },
]

const sections = [
  { key:'11.1', label:'Introduction to Trigonometry', accent:'#0969da', ids:[1,2] },
  { key:'11.2', label:'Trigonometric Ratios',          accent:'#7c4dbd', ids:[3,4] },
  { key:'11.3', label:'Ratios of Specific Angles',     accent:'#c4580d', ids:[5,6,7,8] },
  { key:'11.4', label:'Complementary Angles',          accent:'#1a7f37', ids:[9] },
  { key:'11.5', label:'Trigonometric Identities',      accent:'#7c4dbd', ids:[10] },
]

export default function IndexPage() {
  return (
    <div style={{ minHeight:'100vh', background:'#f5f6f8', overflowY:'auto' }}>

      {/* Header */}
      <header style={{ background:'#fff', borderBottom:'1px solid #d0d7de', padding:'40px 24px 32px', textAlign:'center' }}>
        <div style={{ display:'inline-block', marginBottom:10, padding:'3px 12px', border:'1px solid #d0d7de', borderRadius:16, fontSize:'.65rem', letterSpacing:'1.2px', textTransform:'uppercase', color:'#57606a', background:'#f6f8fa' }}>
          Class X Mathematics · Chapter 11
        </div>
        <h1 style={{ fontSize:'clamp(1.4rem,3vw,2.1rem)', fontWeight:700, color:'#1c2128', letterSpacing:'-.3px', lineHeight:1.2, marginBottom:8 }}>
          Trigonometry Interactive Simulations
        </h1>
        <p style={{ fontSize:'clamp(.78rem,1.7vw,.92rem)', color:'#57606a', maxWidth:500, margin:'0 auto', lineHeight:1.65 }}>
          10 interactive simulations covering every concept in Chapter 11 — from naming sides to proving identities.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:36, marginTop:20, flexWrap:'wrap' }}>
          {[['10','Simulations'],['5','Sections'],['3D + 2D','Rendering'],['0','Install needed']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.3rem', fontWeight:700, color:'#0969da' }}>{n}</div>
              <div style={{ fontSize:'.63rem', color:'#8c959f', textTransform:'uppercase', letterSpacing:.8 }}>{l}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Sections + Cards */}
      <div style={{ maxWidth:1120, margin:'0 auto', padding:'0 20px 56px' }}>
        {sections.map(sec => (
          <div key={sec.key}>
            {/* Section title */}
            <div style={{ display:'flex', alignItems:'center', gap:10, margin:'32px 0 14px' }}>
              <span style={{ padding:'2px 11px', borderRadius:14, fontSize:'.62rem', letterSpacing:'1px', textTransform:'uppercase', fontWeight:600, border:`1px solid ${sec.accent}44`, color:sec.accent, background:`${sec.accent}0d` }}>
                § {sec.key}
              </span>
              <span style={{ fontSize:'.88rem', fontWeight:600, color:'#57606a' }}>{sec.label}</span>
              <div style={{ flex:1, height:1, background:'#d0d7de' }} />
            </div>

            {/* Cards grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(258px,1fr))', gap:10 }}>
              {sec.ids.map(id => {
                const s = sims.find(x => x.id === id)
                return (
                  <Link key={id} to={`/sim/${id}`} style={{ textDecoration:'none' }}>
                    <div
                      style={{ background:'#fff', border:'1px solid #d0d7de', borderRadius:10, padding:'16px 16px 13px', display:'flex', flexDirection:'column', gap:8, transition:'all .18s', cursor:'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=s.accent; e.currentTarget.style.boxShadow=`0 4px 16px -4px ${s.accent}44`; e.currentTarget.style.transform='translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='#d0d7de'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
                    >
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <span style={{ fontSize:'.6rem', letterSpacing:'1.2px', textTransform:'uppercase', color:'#8c959f', fontWeight:600 }}>SIM {String(id).padStart(2,'0')}</span>
                        <span style={{ padding:'2px 7px', borderRadius:6, fontSize:'.58rem', fontWeight:500, border:`1px solid ${s.accent}33`, color:s.accent, background:`${s.accent}0a` }}>{s.tech}</span>
                      </div>
                      <div style={{ fontSize:'1.4rem', lineHeight:1 }}>{s.icon}</div>
                      <div style={{ fontSize:'.9rem', fontWeight:600, color:'#1c2128', lineHeight:1.25 }}>{s.title}</div>
                      <div style={{ fontSize:'.72rem', color:'#6e7681', lineHeight:1.55, flex:1 }}>{s.desc}</div>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:2 }}>
                        {s.tags.map(t => (
                          <span key={t} style={{ padding:'2px 7px', borderRadius:5, fontSize:'.58rem', background:'#f6f8fa', color:'#6e7681', border:'1px solid #d0d7de' }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, borderTop:'1px solid #eaeef2', marginTop:'auto' }}>
                        <span style={{ fontSize:'.6rem', color:'#8c959f' }}>§ {s.section} {s.sectionLabel}</span>
                        <span style={{ fontSize:'.7rem', fontWeight:500, color:s.accent }}>Open →</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Color legend */}
        <div style={{ marginTop:40, background:'#fff', border:'1px solid #d0d7de', borderRadius:9, padding:'14px 18px' }}>
          <div style={{ fontSize:'.6rem', letterSpacing:'1px', textTransform:'uppercase', color:'#8c959f', marginBottom:9 }}>
            Consistent Color System across every simulation
          </div>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap', alignItems:'center' }}>
            {[['#0969da','Hypotenuse'],['#7c4dbd','Opposite Side'],['#c4580d','Adjacent Side'],['#1a7f37','Angle Arc']].map(([c,l]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:9, height:9, borderRadius:'50%', background:c }} />
                <span style={{ fontSize:'.74rem', color:'#57606a' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ textAlign:'center', padding:'18px', color:'#8c959f', borderTop:'1px solid #d0d7de', fontSize:'.67rem', background:'#fff' }}>
        Class X Mathematics · Chapter 11 · Trigonometry · SCERT Telangana
      </footer>
    </div>
  )
}
