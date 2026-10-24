export function reducer(state, action) {
  switch (action.type) {
    case 'draw':
      return { ...state, lastDrawn: action.slug }
    case 'bookmark': {
      const has = state.bookmarks.includes(action.slug)
      return {
        ...state,
        bookmarks: has ? state.bookmarks.filter((s) => s !== action.slug) : [...state.bookmarks, action.slug],
      }
    }
    case 'log': {
      const p = state.problems[action.slug]
      if (!p) return state
      const entry = {
        id: `${action.ts}-${state.logs.length}`,
        slug: action.slug,
        ts: action.ts,
        result: action.result,
      }
      return {
        ...state,
        logs: [...state.logs, entry],
        problems:
          action.result === 'solved'
            ? { ...state.problems, [action.slug]: { ...p, status: 'revise' } }
            : state.problems,
      }
    }
    case 'undoLog': {
      const logs = state.logs.filter((l) => l.id !== action.id)
      const log = state.logs.find((l) => l.id === action.id)
      if (!log) return state
      // If that was the only solve, send the problem back to "new" unless seeded as revise.
      const stillSolved = logs.some((l) => l.slug === log.slug && l.result === 'solved')
      const p = state.problems[log.slug]
      const problems =
        log.result === 'solved' && !stillSolved && p && action.seedStatus?.[log.slug] !== 'revise'
          ? { ...state.problems, [log.slug]: { ...p, status: 'new' } }
          : state.problems
      return { ...state, logs, problems }
    }
    case 'theme':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'replace':
      return action.state
    default:
      return state
  }
}
