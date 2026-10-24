export default function Ring({ value, total, size = 92, label, display }) {
  const stroke = 8
  const r = size / 2 - stroke
  const c = 2 * Math.PI * r
  const pct = total > 0 ? Math.min(value / total, 1) : 0
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value} of ${total}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="ring-bg" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" />
        <circle
          className="ring-fg"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ '--c': c, strokeDashoffset: c * (1 - pct) }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-center">
        <strong>{display ?? value}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}
