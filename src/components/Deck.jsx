export default function Deck({ shuffling, onDraw, label }) {
  return (
    <button
      type="button"
      className={`deck ${shuffling ? 'shuffling' : ''}`}
      onClick={onDraw}
      aria-label="Draw a question from the deck"
      disabled={shuffling}
    >
      <span className="deck-card c3" />
      <span className="deck-card c2" />
      <span className="deck-card c1">
        <span className="deck-mark">A</span>
        <span className="deck-label">{label}</span>
      </span>
    </button>
  )
}
