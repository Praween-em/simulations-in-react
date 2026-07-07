import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'

export default function Sim01Ladder() {
  const mountRef = useRef(null)
  const [angle, setAngle] = useState(10)
  const angleRef = useRef(10)

  function handleSlider(e) {
    const v = Number(e.target.value)
    setAngle(v)
    angleRef.current = v
  }

  useEffect(() => {
    const container = mountRef.current
    const W = window.innerWidth, H = window.innerHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f6f8)

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    container.appendChild(renderer.domElement)

    let theta = 0.6, phi = 0.4, radius = 16
    function updateCam() {
      phi = Math.max(0.05, Math.min(Math.PI / 2.1, phi))
      camera.position.set(
        radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.sin(phi) + 3,
        radius * Math.cos(phi) * Math.cos(theta)
      )
      camera.lookAt(0, 3.5, 0)
    }
    updateCam()

    let isDragging = false, prev = { x: 0, y: 0 }
    const el = renderer.domElement
    el.addEventListener('pointerdown', e => { if (e.target.tagName !== 'INPUT') { isDragging = true; prev = { x: e.clientX, y: e.clientY } } })
    el.addEventListener('pointermove', e => { if (!isDragging) return; theta -= (e.clientX - prev.x) * 0.007; phi += (e.clientY - prev.y) * 0.007; prev = { x: e.clientX, y: e.clientY }; updateCam() })
    el.addEventListener('pointerup', () => isDragging = false)
    el.addEventListener('wheel', e => { radius = Math.max(6, Math.min(35, radius + e.deltaY * 0.01)); updateCam() }, { passive: true })

    // Ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: 0xe8eaed }))
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
    const grid = new THREE.GridHelper(40, 20, 0x9ba3ae, 0xd0d7de)
    grid.position.y = 0.001
    scene.add(grid)

    // Wall
    const WALL_H = 12, WALL_D = 6
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.4, WALL_H, WALL_D), new THREE.MeshBasicMaterial({ color: 0xa8a8a8 }))
    wall.position.set(-0.1, WALL_H / 2, 0)
    scene.add(wall)
    const wallLine = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.4, WALL_H, WALL_D)), new THREE.LineBasicMaterial({ color: 0x000000 }))
    wallLine.position.copy(wall.position)
    scene.add(wallLine)

    // Ladder
    const LADDER_LEN = 9.5
    function makeLadder() {
      const g = new THREE.Group()
      const mat = new THREE.MeshBasicMaterial({ color: 0xe07d3c })
      for (const z of [-0.5, 0.5]) {
        const r = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, LADDER_LEN, 8), mat)
        r.position.z = z; g.add(r)
      }
      for (let i = 0; i <= 12; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 6), mat)
        rung.rotation.x = Math.PI / 2
        rung.position.y = (i / 12 - 0.5) * LADDER_LEN
        g.add(rung)
      }
      return g
    }
    const ladderGroup = new THREE.Group()
    const ladderMesh = makeLadder()
    ladderMesh.position.y = LADDER_LEN / 2
    ladderGroup.add(ladderMesh)
    scene.add(ladderGroup)

    // Arc
    const ARC_R = 1.5, ARC_SEGS = 32
    const arcGeo = new THREE.BufferGeometry().setFromPoints(Array.from({ length: ARC_SEGS + 1 }, () => new THREE.Vector3()))
    const arcLine = new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0xff00ff }))
    scene.add(arcLine)
    const arcDot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff00ff }))
    scene.add(arcDot)

    function updateScene() {
      const deg = angleRef.current
      const rad = deg * Math.PI / 180
      const footX = -(LADDER_LEN * Math.cos(rad))
      ladderGroup.position.set(footX, 0, 0)
      ladderGroup.rotation.z = rad - Math.PI / 2
      arcLine.position.set(footX, 0.01, 0)
      const pts = Array.from({ length: ARC_SEGS + 1 }, (_, i) => {
        const a = (i / ARC_SEGS) * rad
        return new THREE.Vector3(Math.cos(a) * ARC_R, Math.sin(a) * ARC_R, 0)
      })
      arcGeo.setFromPoints(pts)
      arcGeo.attributes.position.needsUpdate = true
      const mid = rad / 2
      arcDot.position.set(footX + Math.cos(mid) * ARC_R * 1.3, Math.sin(mid) * ARC_R * 1.3, 0)
    }
    updateScene()

    let rafId
    function animate() { rafId = requestAnimationFrame(animate); updateScene(); renderer.render(scene, camera) }
    animate()

    function onResize() {
      const w = window.innerWidth, h = window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  const rad = angle * Math.PI / 180
  const h = +(Math.sin(rad) * 5).toFixed(2), d = +(Math.cos(rad) * 5).toFixed(2)

  return (
    <div style={{ display:'flex', flexDirection:'column', width:'100vw', height:'100vh', background:'#f5f6f8', fontFamily:"'Segoe UI',system-ui,sans-serif", overflow:'hidden' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 16px', height:48, background:'#fff', borderBottom:'1px solid #d0d7de', flexShrink:0 }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', border:'1px solid #d0d7de', borderRadius:7, color:'#57606a', fontSize:'.72rem', fontWeight:500, textDecoration:'none', background:'#f6f8fa' }}>← Back</Link>
        <span style={{ fontSize:'.85rem', fontWeight:600, color:'#1c2128' }}>Ladder &amp; Wall — 3D Trigonometry</span>
      </div>

      {/* Main */}
      <div style={{ display:'flex', flex:1, padding:12, gap:11, overflow:'hidden', minHeight:0 }}>
        {/* Three.js canvas */}
        <div style={{ flex:1, background:'#fff', border:'1px solid #d0d7de', borderRadius:10, overflow:'hidden', position:'relative' }}>
          <div ref={mountRef} style={{ width:'100%', height:'100%' }} />
        </div>

        {/* Panel */}
        <aside style={{ width:208, flexShrink:0, background:'#fff', border:'1px solid #d0d7de', borderRadius:10, padding:'15px 13px', display:'flex', flexDirection:'column', gap:9 }}>
          <div style={{ fontSize:'.56rem', letterSpacing:'1.2px', textTransform:'uppercase', color:'#8c959f', fontWeight:600 }}>Ladder Angle</div>
          <div style={{ textAlign:'center', fontSize:'2rem', fontWeight:800, color:'#1a7f37' }}>{angle.toFixed(1)}°</div>
          <input type="range" min="10" max="80" value={angle} step="0.5" onChange={handleSlider}
            style={{ width:'100%', accentColor:'#1a7f37' }} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.67rem', color:'#8c959f' }}>
            <span>10° (resting)</span><span>80° (upright)</span>
          </div>
          <div style={{ height:1, background:'#eaeef2' }} />
          <div style={{ fontSize:'.56rem', letterSpacing:'1.2px', textTransform:'uppercase', color:'#8c959f', fontWeight:600 }}>Geometry</div>
          {[['Ladder length','5.00 m','#0969da'],['Height (h)',''+h+' m','#7c4dbd'],['Distance (d)',''+d+' m','#c4580d'],['Angle (θ)',''+angle.toFixed(1)+'°','#1a7f37']].map(([label,val,col])=>(
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'5px 8px', borderRadius:6, border:'1px solid #eaeef2', background:'#fafafa', fontSize:'.73rem' }}>
              <span style={{ color:'#57606a' }}>{label}</span>
              <span style={{ color:col, fontWeight:700 }}>{val}</span>
            </div>
          ))}
          <div style={{ height:1, background:'#eaeef2' }} />
          <div style={{ fontSize:'.68rem', color:'#57606a', lineHeight:1.6 }}>
            sin θ = h/5 = <strong style={{color:'#7c4dbd'}}>{(h/5).toFixed(3)}</strong><br/>
            cos θ = d/5 = <strong style={{color:'#c4580d'}}>{(d/5).toFixed(3)}</strong><br/>
            tan θ = h/d = <strong style={{color:'#1a7f37'}}>{d > 0 ? (h/d).toFixed(3) : '—'}</strong>
          </div>
        </aside>
      </div>

      <div style={{ textAlign:'center', padding:'5px', fontSize:'.67rem', color:'#8c959f', background:'#fff', borderTop:'1px solid #eaeef2', flexShrink:0 }}>
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  )
}
