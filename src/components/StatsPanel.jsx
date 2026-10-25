import { useMemo } from 'react'
import { CloseIcon, FlameIcon } from './Icons.jsx'
import Ring from './Ring.jsx'
import { computeStats, activityByDay, problemUrl, timeAgo, topicIcon } from '../lib/logic.js'

function Stat({ label, value, icon }) {
  return (
    <div className="stat">
      <div className="stat-value">
        {icon}
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function StatsPanel({ state, onClose, onUndo, onOpenBookmark }) {
  const stats = useMemo(() => computeStats(state), [state])
  const days = useMemo(() => activityByDay(state.logs, 14), [state.logs])
  const maxDay = Math.max(1, ...days.map((d) => d.total))
  const titleOf = (slug) => state.problems[slug]?.title ?? slug
  const covered = stats.revisionQueue.length

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="panel" role="dialog" aria-label="Statistics">
        <header className="panel-head">
          <h2>Your progress</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close stats">
            <CloseIcon />
          </button>
        </header>

        <div className="panel-top">
          <Ring value={covered} total={stats.poolSize} label="covered" size={104} />
          <div className="stat-grid">
            <Stat label="Unique solved" value={stats.uniqueSolved} />
            <Stat label="Solve sessions" value={stats.solveSessions} />
            <Stat label="Day streak" value={stats.streak} icon={<FlameIcon />} />
            <Stat label="Revision queue" value={stats.revisionQueue.length} />
          </div>
        </div>
        <p className="muted small">
          {stats.poolSize} problems in your pool · {stats.attempts} attempt{stats.attempts === 1 ? '' : 's'} logged
        </p>

        <section>
          <h3>Last 14 days</h3>
          <div className="activity" role="img" aria-label="Activity over the last 14 days">
            {days.map((d, i) => (
              <div className="activity-col" key={d.key} title={`${d.label}: ${d.solved} solved, ${d.attempted} attempted`}>
                <div className="activity-bar-wrap">
                  <div
                    className={`activity-bar ${d.total === 0 ? 'empty' : ''}`}
                    style={{ height: `${d.total === 0 ? 6 : 10 + (d.total / maxDay) * 90}%`, animationDelay: `${i * 30}ms` }}
                  />
                </div>
                <span className="activity-day">{d.label.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>Topic mastery</h3>
          <ul className="mastery">
            {stats.topicMastery.map((t, i) => (
              <li key={t.topic}>
                <div className="mastery-top">
                  <span>
                    <span aria-hidden="true">{topicIcon(t.topic)} </span>
                    {t.topic}
                  </span>
                  <span className="muted small">
                    {t.solved}/{t.total}
                  </span>
                </div>
                <div className="bar" role="progressbar" aria-valuenow={t.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${t.topic} mastery`}>
                  <div className="bar-fill" style={{ width: `${t.pct}%`, animationDelay: `${i * 40}ms` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Revision queue</h3>
          {stats.revisionQueue.length === 0 ? (
            <p className="muted small">Nothing to revise yet. Solve a problem and it lands here.</p>
          ) : (
            <ul className="list">
              {stats.revisionQueue.slice(0, 12).map((p) => (
                <li key={p.slug}>
                  <a href={problemUrl(p.slug)} target="_blank" rel="noreferrer">
                    {p.title}
                  </a>
                  <span className="muted small">{p.lastSolved ? timeAgo(p.lastSolved) : 'not logged'}</span>
                </li>
              ))}
              {stats.revisionQueue.length > 12 && (
                <li className="muted small">+ {stats.revisionQueue.length - 12} more</li>
              )}
            </ul>
          )}
        </section>

        <section>
          <h3>Bookmarks</h3>
          {state.bookmarks.length === 0 ? (
            <p className="muted small">No bookmarks yet.</p>
          ) : (
            <ul className="list">
              {state.bookmarks.map((slug) => (
                <li key={slug}>
                  <button className="link-btn" onClick={() => onOpenBookmark(slug)}>
                    {titleOf(slug)}
                  </button>
                  <a className="muted small" href={problemUrl(slug)} target="_blank" rel="noreferrer">
                    LeetCode ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3>Activity history</h3>
          {stats.history.length === 0 ? (
            <p className="muted small">No activity logged yet.</p>
          ) : (
            <ul className="list history">
              {stats.history.slice(0, 40).map((l) => (
                <li key={l.id}>
                  <span>
                    <span className={`dot ${l.result}`} aria-hidden="true" />
                    {titleOf(l.slug)}
                    <span className="muted small"> · {l.result}</span>
                  </span>
                  <span className="muted small">
                    {new Date(l.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    <button className="link-btn undo" onClick={() => onUndo(l.id)} aria-label="Delete this entry" title="Delete entry">
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </>
  )
}
