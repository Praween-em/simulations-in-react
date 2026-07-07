import { useRef, useEffect, useCallback } from 'react'

/**
 * CanvasBase — full-viewport canvas with automatic resize handling.
 * Passes { canvas, ctx, W, H } to the draw callback via a ref so the
 * callback is always fresh without re-running the effect.
 *
 * Usage:
 *   <CanvasBase onInit={(canvas, ctx) => { ... return () => cleanup() }} />
 *
 * The onInit callback receives the canvas and ctx, starts any animation
 * loop it needs, and returns an optional cleanup function.
 */
export default function CanvasBase({ onInit, style }) {
  const canvasRef = useRef(null)
  const onInitRef = useRef(onInit)
  onInitRef.current = onInit

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function setSize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()

    const cleanup = onInitRef.current(canvas, ctx)

    const ro = new ResizeObserver(setSize)
    ro.observe(document.documentElement)

    return () => {
      ro.disconnect()
      if (typeof cleanup === 'function') cleanup()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0, ...style }}
    />
  )
}
