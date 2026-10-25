import { useState } from 'react'
import { BookmarkIcon, ExternalIcon } from './Icons.jsx'
import { problemUrl, solutionsUrl, discussUrl, timeAgo, topicIcon } from '../lib/logic.js'

export default function ProblemCard({ problem, bookmarked, lastSolved, onBookmark, onLog, onNext, justLogged }) {
  const [pop, setPop] = useState(0)

  return (
    <article className={`card problem accent-${problem.difficulty.toLowerCase()}`} aria-live="polite">
      <header className="problem-head">
        <div className="problem-title">
          <span className="topic-emoji" aria-hidden="true">{topicIcon(problem.topic)}</span>
          <div>
            <div className="chips">
              <span className={`chip diff-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
              <span className="chip">{problem.topic}</span>
              <span className="chip chip-muted">{problem.status === 'revise' ? 'Revise' : 'New'}</span>
            </div>
            <h2>{problem.title}</h2>
            <p className="muted small">
              {problem.status === 'revise' ? `Last solved ${timeAgo(lastSolved)}` : 'Not solved yet. Fresh territory.'}
            </p>
          </div>
        </div>
        <button
          key={pop}
          className={`icon-btn ${bookmarked ? 'on pop' : ''}`}
          onClick={() => {
            setPop((n) => n + 1)
            onBookmark()
          }}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark problem'}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <BookmarkIcon filled={bookmarked} />
        </button>
      </header>

      <div className="links">
        <a className="btn btn-primary" href={problemUrl(problem.slug)} target="_blank" rel="noreferrer">
          Open on LeetCode <ExternalIcon />
        </a>
        <a className="btn btn-ghost" href={solutionsUrl(problem.slug)} target="_blank" rel="noreferrer">
          Solutions <ExternalIcon />
        </a>
        <a className="btn btn-ghost" href={discussUrl(problem.slug)} target="_blank" rel="noreferrer">
          Discuss <ExternalIcon />
        </a>
      </div>

      <div className="log-row">
        <button className="btn btn-sage" onClick={(e) => onLog('solved', e)}>
          ✓ I solved it
        </button>
        <button className="btn btn-ghost" onClick={(e) => onLog('attempted', e)}>
          ~ Attempted
        </button>
        <button className="btn btn-ghost push" onClick={onNext}>
          Draw another
        </button>
      </div>
      {justLogged && <p className="toast" role="status">{justLogged}</p>}
    </article>
  )
}
