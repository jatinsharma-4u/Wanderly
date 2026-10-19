import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatCompact, formatINR } from '../../utils/format'

// Lightweight SVG bar chart with hover tooltip, no chart library needed for this volume of data.
export function RevenueChart({ data }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(...data.map((d) => d.revenue)) * 1.15
  const W = 600
  const H = 220
  const pad = { t: 10, b: 28, l: 44, r: 8 }
  const bw = (W - pad.l - pad.r) / data.length
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max)

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly revenue chart">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeDasharray={t ? '3 4' : ''} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--color-faint)">
              {formatCompact(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.l + i * bw + bw * 0.22
          const w = bw * 0.56
          const top = y(d.revenue)
          const last = i === data.length - 1
          return (
            <g key={d.month} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
              <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
              <motion.rect
                x={x}
                width={w}
                rx="6"
                initial={{ y: H - pad.b, height: 0 }}
                animate={{ y: top, height: H - pad.b - top }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                fill={last ? 'var(--color-gold)' : hover === i ? 'var(--color-ink-2)' : 'var(--color-navy)'}
                opacity={hover === null || hover === i ? 1 : 0.55}
              />
              <text x={x + w / 2} y={H - 8} textAnchor="middle" fontSize="11.5" fill="var(--color-muted)">
                {d.month}
              </text>
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-[12px] text-white shadow-lg" style={{ left: `${((pad.l + hover * bw + bw / 2) / W) * 100}%`, top: 0 }}>
          <b>{formatINR(data[hover].revenue)}</b>
          <span className="block text-white/60">{data[hover].bookings} bookings</span>
        </div>
      )}
    </div>
  )
}

export function Donut({ segments, size = 140 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = 52
  const c = 2 * Math.PI * r
  let acc = 0
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Bookings by status">
      <circle cx="70" cy="70" r={r} fill="none" stroke="var(--color-line-2)" strokeWidth="16" />
      {segments.map((s) => {
        const len = (s.value / total) * c
        const el = (
          <motion.circle
            key={s.label}
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="16"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-acc}
            transform="rotate(-90 70 70)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )
        acc += len
        return el
      })}
      <text x="70" y="66" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--color-ink)">{total}</text>
      <text x="70" y="84" textAnchor="middle" fontSize="11" fill="var(--color-muted)">bookings</text>
    </svg>
  )
}
