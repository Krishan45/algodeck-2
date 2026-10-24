import { buildSeedProblems } from '../data/seed.js'

export const STORAGE_KEY = 'algodeck:v1'
const VERSION = 1

export function freshState() {
  return {
    version: VERSION,
    problems: buildSeedProblems(),
    bookmarks: [],
    logs: [],
    theme: 'light',
    lastDrawn: null,
  }
}

/** Validate + normalise arbitrary data into a usable state (used for load and import). */
export function normalizeState(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('File is not an AlgoDeck export.')
  if (!raw.problems || typeof raw.problems !== 'object' || Array.isArray(raw.problems)) {
    throw new Error('Missing "problems" object.')
  }
  if (!Array.isArray(raw.logs)) throw new Error('Missing "logs" array.')

  const base = freshState()
  const problems = { ...base.problems }
  for (const [slug, p] of Object.entries(raw.problems)) {
    if (!p || typeof p !== 'object') continue
    problems[slug] = {
      slug,
      title: String(p.title ?? slug),
      difficulty: ['Easy', 'Medium', 'Hard'].includes(p.difficulty) ? p.difficulty : 'Medium',
      topic: String(p.topic ?? 'Misc'),
      status: p.status === 'revise' ? 'revise' : 'new',
    }
  }
  const logs = raw.logs
    .filter((l) => l && typeof l.slug === 'string' && typeof l.ts === 'number' && (l.result === 'solved' || l.result === 'attempted'))
    .map((l, i) => ({ id: l.id ?? `${l.ts}-${i}`, slug: l.slug, ts: l.ts, result: l.result }))

  return {
    version: VERSION,
    problems,
    bookmarks: Array.isArray(raw.bookmarks) ? raw.bookmarks.filter((s) => typeof s === 'string') : [],
    logs,
    theme: raw.theme === 'dark' ? 'dark' : 'light',
    lastDrawn: typeof raw.lastDrawn === 'string' ? raw.lastDrawn : null,
  }
}

export function loadState(storage = globalThis.localStorage) {
  try {
    const text = storage?.getItem(STORAGE_KEY)
    if (!text) return freshState()
    return normalizeState(JSON.parse(text))
  } catch {
    return freshState()
  }
}

export function saveState(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage full or blocked: ignore */
  }
}

export function exportJSON(state) {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)
}
