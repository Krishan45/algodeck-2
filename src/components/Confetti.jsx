import { useEffect, useMemo } from 'react'

const COLORS = ['#7d9a7b', '#a7c4a3', '#d9b45f', '#c9826b', '#e8dfc6']
const COUNT = 32

export default function Confetti({ burst, onDone }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const angle = (Math.PI * 2 * i) / COUNT + Math.random() * 0.4
        const dist = 70 + Math.random() * 120
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 70,
          rot: Math.random() * 720 - 360,
          delay: Math.random() * 70,
          w: 6 + Math.random() * 6,
          h: 4 + Math.random() * 5,
          color: COLORS[i % COLORS.length],
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burst.id]
  )

  useEffect(() => {
    const t = setTimeout(onDone, 1500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burst.id])

  return (
    <div className="confetti" style={{ left: burst.x, top: burst.y }} aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          style={{
            width: p.w,
            height: p.h,
            background: p.color,
            animationDelay: `${p.delay}ms`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--rot': `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  )
}
