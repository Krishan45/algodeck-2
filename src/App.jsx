import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { reducer } from './lib/reducer.js'
import { loadState, saveState, exportJSON, normalizeState, freshState } from './lib/storage.js'
import { drawQuestion, lastSolvedMap, computeStats, todaySolved, greeting, quoteOfTheDay, topicIcon } from './lib/logic.js'
import { buildSeedProblems, PRIORITY_TOPIC } from './data/seed.js'
import ProblemCard from './components/ProblemCard.jsx'
import StatsPanel from './components/StatsPanel.jsx'
import Ring from './components/Ring.jsx'
import Deck from './components/Deck.jsx'
import Confetti from './components/Confetti.jsx'
import { ChartIcon, FlameIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from './components/Icons.jsx'

const DEAL_MS = 750

function Choice({ legend, options, value, onChange }) {
  return (
    <fieldset className="choice">
      <legend>{legend}</legend>
      <div className="choice-grid">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`card select-card ${value === o.value ? 'selected' : ''}`}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            <span className="select-icon" aria-hidden="true">{o.icon}</span>
            <span className="select-text">
              <strong>{o.label}</strong>
              <span className="muted small">{o.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [mode, setMode] = useState('random')
  const [kind, setKind] = useState('new')
  const [topic, setTopic] = useState(PRIORITY_TOPIC)
  const [currentSlug, setCurrentSlug] = useState(null)
  const [emptyMsg, setEmptyMsg] = useState('')
  const [justLogged, setJustLogged] = useState('')
  const [showStats, setShowStats] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const [dealing, setDealing] = useState(false)
  const [burst, setBurst] = useState(null)
  const [search, setSearch] = useState('')
  const fileRef = useRef(null)
  const searchRef = useRef(null)
  const timer = useRef(null)
  const drawRef = useRef(() => {})

  useEffect(() => saveState(state), [state])
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
  }, [state.theme])
  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return
      e.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const topics = useMemo(() => {
    const counts = {}
    for (const p of Object.values(state.problems)) {
      const c = (counts[p.topic] ||= { new: 0, revise: 0 })
      c[p.status]++
    }
    return Object.keys(counts)
      .sort((a, b) => (a === PRIORITY_TOPIC ? -1 : b === PRIORITY_TOPIC ? 1 : a.localeCompare(b)))
      .map((t) => ({ topic: t, ...counts[t] }))
  }, [state.problems])

  const stats = useMemo(() => computeStats(state), [state])
  const solvedToday = useMemo(() => todaySolved(state.logs), [state.logs])
  const lastSolved = useMemo(() => lastSolvedMap(state.logs), [state.logs])
  const current = currentSlug ? state.problems[currentSlug] : null
  const priorityLeft = topics.find((t) => t.topic === PRIORITY_TOPIC)?.new ?? 0
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return Object.values(state.problems)
      .filter((p) => `${p.title} ${p.topic} ${p.slug}`.toLowerCase().includes(query))
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 8)
  }, [search, state.problems])

  function finishDraw() {
    const picked = drawQuestion(state, { mode, topic, kind })
    if (!picked) {
      const where = mode === 'topic' ? ` in ${topic}` : ''
      setEmptyMsg(
        kind === 'revise'
          ? `Nothing to revise${where} yet. Solve something first, or try New.`
          : `No new problems left${where}. Try Revise or another topic.`
      )
      return
    }
    setCurrentSlug(picked.slug)
    dispatch({ type: 'draw', slug: picked.slug })
  }

  function draw() {
    if (dealing) return
    setJustLogged('')
    setEmptyMsg('')
    setCurrentSlug(null)
    setDealing(true)
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    timer.current = setTimeout(
      () => {
        finishDraw()
        setDealing(false)
      },
      reduce ? 0 : DEAL_MS
    )
  }
  drawRef.current = draw

  // Press "D" anywhere (outside inputs) to draw.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() !== 'd' || e.metaKey || e.ctrlKey || e.altKey) return
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return
      drawRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function log(result, e) {
    if (result === 'solved' && e?.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect()
      setBurst({ id: Date.now(), x: r.left + r.width / 2, y: r.top + r.height / 2 })
    }
    dispatch({ type: 'log', slug: current.slug, result, ts: Date.now() })
    setJustLogged(
      result === 'solved' ? 'Nice one! Logged as solved and added to your revision queue.' : 'Attempt logged. Come back to it, that is how it sticks.'
    )
  }

  function markSolved(slug) {
    dispatch({ type: 'log', slug, result: 'solved', ts: Date.now() })
    setNotice(`${state.problems[slug].title} is marked done and added to your revision queue.`)
  }

  function openSearchResult(slug) {
    setCurrentSlug(slug)
    setSearch('')
    setEmptyMsg('')
    setJustLogged('')
    requestAnimationFrame(() => document.querySelector('.problem')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  function onUndo(id) {
    const seed = buildSeedProblems()
    const seedStatus = Object.fromEntries(Object.entries(seed).map(([k, v]) => [k, v.status]))
    dispatch({ type: 'undoLog', id, seedStatus })
  }

  function doExport() {
    const blob = new Blob([exportJSON(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `algodeck-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowMenu(false)
  }

  async function doImport(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const next = normalizeState(JSON.parse(await file.text()))
      if (!window.confirm('Importing replaces your current data. Continue?')) return
      dispatch({ type: 'replace', state: next })
      setCurrentSlug(null)
      setNotice(`Imported ${Object.keys(next.problems).length} problems and ${next.logs.length} log entries.`)
    } catch (err) {
      setNotice(`Import failed: ${err.message}`)
    }
    setShowMenu(false)
  }

  function doReset() {
    if (!window.confirm('Reset everything to the seed pool? This deletes all logs and bookmarks.')) return
    dispatch({ type: 'replace', state: { ...freshState(), theme: state.theme } })
    setCurrentSlug(null)
    setShowMenu(false)
  }

  function focusPriority() {
    setMode('topic')
    setTopic(PRIORITY_TOPIC)
    setKind('new')
  }

  const topicInfo = topics.find((t) => t.topic === topic)
  const deckLabel = `${mode === 'topic' ? topic : 'Random'} · ${kind === 'new' ? 'New' : 'Revise'}`

  return (
    <div className="app">
      <div className="glow glow-a" aria-hidden="true" />
      <div className="glow glow-b" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden="true">A</span>
          <span>AlgoDeck</span>
        </div>
        <div className="actions">
          <button className="icon-btn" onClick={() => setShowStats(true)} aria-label="Open stats" title="Stats">
            <ChartIcon />
          </button>
          <button
            className="icon-btn"
            onClick={() => dispatch({ type: 'theme' })}
            aria-label={state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title="Toggle theme"
          >
            {state.theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <div className="menu-wrap">
            <button className="icon-btn" onClick={() => setShowMenu((v) => !v)} aria-label="Menu" aria-expanded={showMenu}>
              <MenuIcon />
            </button>
            {showMenu && (
              <div className="menu card" role="menu">
                <button role="menuitem" onClick={doExport}>Export JSON</button>
                <button role="menuitem" onClick={() => fileRef.current?.click()}>Import JSON</button>
                <button role="menuitem" className="danger" onClick={doReset}>Reset to seed</button>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={doImport} />
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-text">
            <p className="eyebrow">{greeting()}</p>
            <h1>What are we solving?</h1>
            <p className="muted quote">{quoteOfTheDay()}</p>
          </div>
          <Ring value={stats.revisionQueue.length} total={stats.poolSize} label="covered" size={96} />
        </section>

        <div className="pills">
          <span className={`pill ${stats.streak > 0 ? 'pill-hot' : ''}`} title="Consecutive days with activity">
            <FlameIcon /> {stats.streak} day streak
          </span>
          <span className="pill" title="Problems solved today">✅ {solvedToday} today</span>
          <button className="pill pill-btn" onClick={focusPriority} title="Jump to the priority topic">
            {topicIcon(PRIORITY_TOPIC)} {priorityLeft} {PRIORITY_TOPIC} left
          </button>
        </div>

        {notice && (
          <p className="notice" role="status">
            {notice} <button className="link-btn" onClick={() => setNotice('')}>dismiss</button>
          </p>
        )}

        <section className="search card" aria-label="Search problems">
          <SearchIcon />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any problem or topic…"
            aria-label="Search problems"
          />
          {search && <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
          <span className="search-shortcut" aria-hidden="true">/</span>
          {search && (
            <div className="search-results">
              {searchResults.length ? searchResults.map((p) => {
                const done = p.status === 'revise'
                return <div className="search-result" key={p.slug}>
                  <button className="search-open" onClick={() => openSearchResult(p.slug)}>
                    <span>{topicIcon(p.topic)}</span><span><strong>{p.title}</strong><small>{p.topic} · {p.difficulty}</small></span>
                  </button>
                  <button className={`search-done ${done ? 'complete' : ''}`} onClick={() => !done && markSolved(p.slug)} disabled={done}>
                    {done ? '✓ Done' : 'Mark done'}
                  </button>
                </div>
              }) : <p className="search-empty">No matching problems in your deck.</p>}
            </div>
          )}
        </section>

        <Choice
          legend="Draw by"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'random', icon: '🎲', label: 'Random', hint: `Pick from the full deck'` },
            { value: 'topic', icon: '🗂️', label: 'Topic', hint: 'Stay inside one topic' },
          ]}
        />

        {mode === 'topic' && (
          <label className="topic-select">
            <span className="muted small">Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics.map((t) => (
                <option key={t.topic} value={t.topic}>
                  {topicIcon(t.topic)} {t.topic} ({t.new} new · {t.revise} revise)
                </option>
              ))}
            </select>
          </label>
        )}

        <Choice
          legend="Problem type"
          value={kind}
          onChange={setKind}
          options={[
            { value: 'new', icon: '✨', label: 'New', hint: 'Not solved yet' },
            { value: 'revise', icon: '🔁', label: 'Revise', hint: 'Solved before, stalest first' },
          ]}
        />

        <section className="deck-zone">
          <Deck shuffling={dealing} onDraw={draw} label={deckLabel} />
          <button className="btn btn-primary draw" onClick={draw} disabled={dealing}>
            {dealing ? 'Shuffling…' : 'Draw a question'}
          </button>
          <p className="muted small center">
            {mode === 'topic' && topicInfo ? `${kind === 'new' ? topicInfo.new : topicInfo.revise} available in ${topic} · ` : ''}
            press <kbd>D</kbd> to draw
          </p>
        </section>

        {emptyMsg && <p className="empty card">{emptyMsg}</p>}

        {current && (
          <ProblemCard
            key={current.slug + state.lastDrawn}
            problem={current}
            bookmarked={state.bookmarks.includes(current.slug)}
            lastSolved={lastSolved[current.slug]}
            justLogged={justLogged}
            onBookmark={() => dispatch({ type: 'bookmark', slug: current.slug })}
            onLog={log}
            onNext={draw}
          />
        )}
      </main>

      {burst && <Confetti burst={burst} onDone={() => setBurst(null)} />}

      {showStats && (
        <StatsPanel
          state={state}
          onClose={() => setShowStats(false)}
          onUndo={onUndo}
          onOpenBookmark={(slug) => {
            setCurrentSlug(slug)
            setEmptyMsg('')
            setJustLogged('')
            setShowStats(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
    </div>
  )
}
