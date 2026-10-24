import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import StatsPanel from './components/StatsPanel.jsx'
import ProblemCard from './components/ProblemCard.jsx'
import { freshState } from './lib/storage.js'
import { reducer } from './lib/reducer.js'

describe('rendering smoke tests', () => {
  it('renders the homepage with selection cards and draw button', () => {
    const html = renderToString(<App />)
    for (const text of ['Random', 'Topic', 'New', 'Revise', 'Draw a question', 'Open stats', 'day streak', 'covered', 'Binary Search on Answer']) {
      expect(html).toContain(text)
    }
  })

  it('renders the stats panel with every section', () => {
    let s = reducer(freshState(), { type: 'log', slug: 'two-sum', result: 'solved', ts: Date.now() })
    s = reducer(s, { type: 'bookmark', slug: 'koko-eating-bananas' })
    const html = renderToString(<StatsPanel state={s} onClose={() => {}} onUndo={() => {}} onOpenBookmark={() => {}} />)
    for (const text of ['Unique solved', 'Solve sessions', 'Day streak', 'Revision queue', 'Topic mastery', 'Bookmarks', 'Activity history', 'Last 14 days', 'Koko Eating Bananas']) {
      expect(html).toContain(text)
    }
  })

  it('renders the problem card with direct LeetCode links', () => {
    const p = freshState().problems['koko-eating-bananas']
    const html = renderToString(
      <ProblemCard problem={p} bookmarked={false} onBookmark={() => {}} onLog={() => {}} onNext={() => {}} />
    )
    expect(html).toContain('https://leetcode.com/problems/koko-eating-bananas/')
    expect(html).toContain('I solved it')
  })
})
