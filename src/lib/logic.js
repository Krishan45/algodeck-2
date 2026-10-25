
export const DAY_MS = 86400000

export function dayKey(ts) {
  const d = new Date(ts)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function problemUrl(slug) {
  return `https://leetcode.com/problems/${slug}/`
}
export function solutionsUrl(slug) {
  return `https://leetcode.com/problems/${slug}/solutions/`
}
export function discussUrl(slug) {
  return `https://leetcode.com/problems/${slug}/discuss/`
}

/** slug -> timestamp of most recent solved log */
export function lastSolvedMap(logs) {
  const map = {}
  for (const l of logs) {
    if (l.result !== 'solved') continue
    if (!map[l.slug] || l.ts > map[l.slug]) map[l.slug] = l.ts
  }
  return map
}

/** Consecutive days (ending today, or yesterday if nothing today yet) with any log. */
export function computeStreak(logs, now = Date.now()) {
  const days = new Set(logs.map((l) => dayKey(l.ts)))
  if (days.size === 0) return 0
  const cursor = new Date(now)
  if (!days.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (days.has(dayKey(cursor.getTime()))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function computeStats(state, now = Date.now()) {
  const { problems, logs } = state
  const all = Object.values(problems)
  const solvedLogs = logs.filter((l) => l.result === 'solved')
  const uniqueSolved = new Set(solvedLogs.map((l) => l.slug))
  const last = lastSolvedMap(logs)

  const revisionQueue = all
    .filter((p) => p.status === 'revise')
    .map((p) => ({ ...p, lastSolved: last[p.slug] || null }))
    .sort((a, b) => (a.lastSolved ?? 0) - (b.lastSolved ?? 0))

  const topics = {}
  for (const p of all) {
    const t = (topics[p.topic] ||= { topic: p.topic, total: 0, solved: 0, revise: 0 })
    t.total++
    if (p.status === 'revise') t.revise++
    if (uniqueSolved.has(p.slug) || p.status === 'revise') t.solved++
  }
  const topicMastery = Object.values(topics)
    .map((t) => ({ ...t, pct: t.total ? Math.round((t.solved / t.total) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct || a.topic.localeCompare(b.topic))

  return {
    poolSize: all.length,
    uniqueSolved: uniqueSolved.size,
    solveSessions: solvedLogs.length,
    attempts: logs.length - solvedLogs.length,
    streak: computeStreak(logs, now),
    revisionQueue,
    topicMastery,
    history: [...logs].sort((a, b) => b.ts - a.ts),
  }
}

/**
 * Pick a problem.
 * opts: { mode: 'random' | 'topic', topic?: string, kind: 'new' | 'revise' }
 * Random draws are equal-probability for new problems; revise favours the
 * problems untouched the longest. Avoids repeating the last drawn problem.
 */
export function drawQuestion(state, opts, rng = Math.random, now = Date.now()) {
  const { problems, logs, lastDrawn } = state
  const last = lastSolvedMap(logs)
  let pool = Object.values(problems).filter((p) => p.status === opts.kind)
  if (opts.mode === 'topic' && opts.topic) pool = pool.filter((p) => p.topic === opts.topic)
  if (pool.length === 0) return null
  if (pool.length > 1 && lastDrawn) pool = pool.filter((p) => p.slug !== lastDrawn)

  const weights = pool.map((p) => {
    let w = 1
    if (opts.kind === 'revise') {
      const days = last[p.slug] ? (now - last[p.slug]) / DAY_MS : 30
      w += Math.min(days, 60) / 7
    }
    return w
  })
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i]
    if (r < 0) return pool[i]
  }
  return pool[pool.length - 1]
}

/** Oldest -> newest list of the last `days` days with solved/attempted counts. */
export function activityByDay(logs, days = 14, now = Date.now()) {
  const byKey = {}
  for (const l of logs) {
    const k = dayKey(l.ts)
    const e = (byKey[k] ||= { solved: 0, attempted: 0 })
    e[l.result]++
  }
  const out = []
  const cursor = new Date(now)
  cursor.setDate(cursor.getDate() - (days - 1))
  for (let i = 0; i < days; i++) {
    const key = dayKey(cursor.getTime())
    const e = byKey[key] || { solved: 0, attempted: 0 }
    out.push({
      key,
      label: cursor.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      solved: e.solved,
      attempted: e.attempted,
      total: e.solved + e.attempted,
    })
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}

export function todaySolved(logs, now = Date.now()) {
  const k = dayKey(now)
  return logs.filter((l) => l.result === 'solved' && dayKey(l.ts) === k).length
}

export function greeting(now = Date.now()) {
  const h = new Date(now).getHours()
  if (h < 5) return 'Burning the midnight oil'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 22) return 'Good evening'
  return 'Late night grind'
}

const QUOTES = [
  'One problem a day beats ten on Sunday.',
  'Read it twice. Code it once.',
  'Brute force first, then make it elegant.',
  'Stuck? Say the problem out loud.',
  'Revision is where the patterns stick.',
  'Edge cases are where interviews are won.',
  'Small streaks become big offers.',
]
export function quoteOfTheDay(now = Date.now()) {
  return QUOTES[Math.floor(now / DAY_MS) % QUOTES.length]
}

const TOPIC_ICONS = {
  'Binary Search on Answer': '🎯',
  'Binary Search': '🔍',
  'Arrays & Hashing': '🧮',
  'Two Pointers': '👉',
  'Sliding Window': '🪟',
  Stack: '🥞',
  'Linked List': '🔗',
  Trees: '🌳',
  Graphs: '🕸️',
  Tries: '🔤',
  'Advanced Graphs': '🗺️',
  '1-D DP': '🧩',
  '2-D DP': '🧱',
  Backtracking: '↩️',
  Heap: '⛰️',
  Greedy: '🧲',
  Intervals: '📅',
  'Math & Geometry': '📐',
  'Bit Manipulation': '🔢',
}
export function topicIcon(topic) {
  return TOPIC_ICONS[topic] ?? '📌'
}

export function timeAgo(ts, now = Date.now()) {
  if (!ts) return 'never'
  const days = Math.floor((now - ts) / DAY_MS)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}
