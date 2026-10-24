import { describe, it, expect } from 'vitest'
import { computeStats, computeStreak, drawQuestion, dayKey, DAY_MS, activityByDay, todaySolved, greeting, quoteOfTheDay, topicIcon } from './logic.js'
import { reducer } from './reducer.js'
import { freshState, normalizeState, exportJSON, loadState, saveState, STORAGE_KEY } from './storage.js'
import { POOL, PRIORITY_TOPIC } from '../data/seed.js'

const NOW = new Date(2026, 9, 21, 12, 0, 0).getTime()
const seeded = (rngValue) => () => rngValue

describe('seed', () => {
  it('has exactly 150 problems with valid fields', () => {
    expect(POOL).toHaveLength(150)
    for (const [slug, title, diff, topic] of POOL) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(title.length).toBeGreaterThan(2)
      expect(['Easy', 'Medium', 'Hard']).toContain(diff)
      expect(topic.length).toBeGreaterThan(0)
    }
  })
  it('has every topic icon defined', () => {
    for (const topic of new Set(POOL.map((r) => r[3]))) {
      expect(topicIcon(topic)).not.toBe('📌')
    }
  })
  it('has unique slugs and a priority topic', () => {
    const slugs = POOL.map((r) => r[0])
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(POOL.some((r) => r[3] === PRIORITY_TOPIC)).toBe(true)
  })
  it('starts every problem as new when SOLVED_SLUGS is empty', () => {
    const s = freshState()
    expect(Object.values(s.problems).every((p) => p.status === 'new')).toBe(true)
  })
})

describe('draw', () => {
  it('only returns problems of the requested kind', () => {
    const s = freshState()
    expect(drawQuestion(s, { mode: 'random', kind: 'revise' }, Math.random, NOW)).toBeNull()
    const p = drawQuestion(s, { mode: 'random', kind: 'new' }, Math.random, NOW)
    expect(p.status).toBe('new')
  })
  it('respects topic mode', () => {
    const s = freshState()
    for (let i = 0; i < 30; i++) {
      expect(drawQuestion(s, { mode: 'topic', topic: 'Stack', kind: 'new' }).topic).toBe('Stack')
    }
  })
  it('boosts the priority topic in random mode', () => {
    const s = freshState()
    let hits = 0
    const N = 4000
    for (let i = 0; i < N; i++) {
      if (drawQuestion(s, { mode: 'random', kind: 'new' }).topic === PRIORITY_TOPIC) hits++
    }
    const share = Object.values(s.problems).filter((p) => p.topic === PRIORITY_TOPIC).length / Object.keys(s.problems).length
    expect(hits / N).toBeGreaterThan(share * 1.5)
  })
  it('does not repeat the last drawn problem back to back', () => {
    const s = { ...freshState(), lastDrawn: 'two-sum' }
    for (let i = 0; i < 200; i++) {
      expect(drawQuestion(s, { mode: 'topic', topic: 'Arrays & Hashing', kind: 'new' }).slug).not.toBe('two-sum')
    }
  })
})

describe('reducer + stats', () => {
  it('solving moves a problem to revise and updates stats', () => {
    let s = freshState()
    s = reducer(s, { type: 'log', slug: 'two-sum', result: 'solved', ts: NOW })
    s = reducer(s, { type: 'log', slug: 'two-sum', result: 'solved', ts: NOW + 1000 })
    s = reducer(s, { type: 'log', slug: 'binary-search', result: 'attempted', ts: NOW })
    expect(s.problems['two-sum'].status).toBe('revise')
    expect(s.problems['binary-search'].status).toBe('new')
    const st = computeStats(s, NOW)
    expect(st.uniqueSolved).toBe(1)
    expect(st.solveSessions).toBe(2)
    expect(st.attempts).toBe(1)
    expect(st.revisionQueue.map((p) => p.slug)).toEqual(['two-sum'])
    expect(st.topicMastery.find((t) => t.topic === 'Arrays & Hashing').solved).toBe(1)
    expect(st.topicMastery[0].topic).toBe(PRIORITY_TOPIC)
  })
  it('undo of the only solve returns the problem to new', () => {
    let s = reducer(freshState(), { type: 'log', slug: 'two-sum', result: 'solved', ts: NOW })
    s = reducer(s, { type: 'undoLog', id: s.logs[0].id, seedStatus: {} })
    expect(s.logs).toHaveLength(0)
    expect(s.problems['two-sum'].status).toBe('new')
  })
  it('bookmark toggles', () => {
    let s = reducer(freshState(), { type: 'bookmark', slug: 'two-sum' })
    expect(s.bookmarks).toEqual(['two-sum'])
    s = reducer(s, { type: 'bookmark', slug: 'two-sum' })
    expect(s.bookmarks).toEqual([])
  })
  it('revise draws favour the stalest problem', () => {
    let s = freshState()
    s = reducer(s, { type: 'log', slug: 'two-sum', result: 'solved', ts: NOW - 60 * DAY_MS })
    s = reducer(s, { type: 'log', slug: 'binary-search', result: 'solved', ts: NOW - 1 * DAY_MS })
    let stale = 0
    for (let i = 0; i < 2000; i++) {
      if (drawQuestion(s, { mode: 'random', kind: 'revise' }, Math.random, NOW).slug === 'two-sum') stale++
    }
    expect(stale / 2000).toBeGreaterThan(0.6)
  })
})

describe('streak', () => {
  const at = (daysAgo) => ({ ts: NOW - daysAgo * DAY_MS })
  it('counts consecutive days including today', () => {
    expect(computeStreak([at(0), at(1), at(2), at(4)], NOW)).toBe(3)
  })
  it('keeps the streak alive if today has no activity yet', () => {
    expect(computeStreak([at(1), at(2)], NOW)).toBe(2)
  })
  it('is zero after a gap of two or more days', () => {
    expect(computeStreak([at(2), at(3)], NOW)).toBe(0)
    expect(computeStreak([], NOW)).toBe(0)
  })
  it('dayKey is local YYYY-MM-DD', () => {
    expect(dayKey(NOW)).toBe('2026-10-21')
  })
})

describe('activity + flavour helpers', () => {
  it('builds a 14-day series ending today with correct counts', () => {
    const logs = [
      { slug: 'a', ts: NOW, result: 'solved' },
      { slug: 'b', ts: NOW + 1000, result: 'attempted' },
      { slug: 'c', ts: NOW - 3 * DAY_MS, result: 'solved' },
      { slug: 'd', ts: NOW - 30 * DAY_MS, result: 'solved' },
    ]
    const days = activityByDay(logs, 14, NOW)
    expect(days).toHaveLength(14)
    expect(days[13].key).toBe(dayKey(NOW))
    expect(days[13]).toMatchObject({ solved: 1, attempted: 1, total: 2 })
    expect(days[10].solved).toBe(1)
    expect(days.reduce((n, d) => n + d.total, 0)).toBe(3)
  })
  it('counts only solves made today', () => {
    const logs = [
      { slug: 'a', ts: NOW, result: 'solved' },
      { slug: 'b', ts: NOW, result: 'attempted' },
      { slug: 'c', ts: NOW - DAY_MS, result: 'solved' },
    ]
    expect(todaySolved(logs, NOW)).toBe(1)
  })
  it('greeting, quote and icons always return something', () => {
    for (let h = 0; h < 24; h++) expect(greeting(new Date(2026, 9, 21, h).getTime()).length).toBeGreaterThan(0)
    expect(quoteOfTheDay(NOW).length).toBeGreaterThan(0)
    expect(topicIcon(PRIORITY_TOPIC)).toBe('🎯')
    expect(topicIcon('Unknown topic')).toBe('📌')
  })
})

describe('storage', () => {
  const memory = () => {
    const m = new Map()
    return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }
  }
  it('round-trips through localStorage', () => {
    const store = memory()
    let s = reducer(freshState(), { type: 'log', slug: 'two-sum', result: 'solved', ts: NOW })
    s = reducer(s, { type: 'bookmark', slug: 'two-sum' })
    saveState(s, store)
    expect(store.getItem(STORAGE_KEY)).toBeTruthy()
    expect(loadState(store)).toEqual(s)
  })
  it('exports and re-imports', () => {
    const s = reducer(freshState(), { type: 'log', slug: 'two-sum', result: 'solved', ts: NOW })
    const back = normalizeState(JSON.parse(exportJSON(s)))
    expect(back.logs).toHaveLength(1)
    expect(back.problems['two-sum'].status).toBe('revise')
  })
  it('rejects bad imports and falls back on corrupt storage', () => {
    expect(() => normalizeState({})).toThrow()
    expect(() => normalizeState({ problems: {}, logs: 'x' })).toThrow()
    const store = { getItem: () => '{not json', setItem() {} }
    expect(Object.keys(loadState(store).problems).length).toBe(POOL.length)
  })
  it('imported custom problems are kept alongside the seed', () => {
    const s = normalizeState({
      problems: { 'my-problem': { title: 'Mine', difficulty: 'Hard', topic: 'Custom', status: 'revise' } },
      logs: [],
    })
    expect(s.problems['my-problem'].status).toBe('revise')
    expect(s.problems['two-sum']).toBeTruthy()
  })
})
