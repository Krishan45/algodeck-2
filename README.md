# AlgoDeck

A minimal cream/sage DSA practice deck. Pick how you want to draw, hit **Draw a question**, solve it on LeetCode, log the result. Everything is stored in your browser (`localStorage`); there is no backend.

Built with React 18 + Vite and plain CSS (no Tailwind, so there is no extra setup).

## Run it

Requires Node 18+.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm test           # 24 tests: draw logic, stats, streak, activity, storage, import/export, rendering
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Features

- **Home selection cards:** Random or Topic, and New or Revise.
- **Draw a question:** weighted pick. In Random mode `Binary Search on Answer` is 4x as likely. Revise favours the problems you have not touched the longest. It never repeats the previous draw back to back.
- **Problem card:** difficulty, topic, status, links to the problem, its solutions and discussion pages, a bookmark toggle, and **I solved it** / **Attempted** logging. Solving a new problem moves it to Revise.
- **Stats panel (chart icon):** unique problems solved, solve sessions, day streak, revision queue, topic mastery bars, bookmarks, and activity history (with delete).
- **Life and motion:** a card deck that shuffles when you draw, a flip reveal for the problem card, confetti when you log a solve, a progress ring and streak/today pills on the home screen, topic icons, a 14-day activity chart in the stats panel, and slow background glow. Press **D** anywhere to draw. All motion is disabled automatically if your system is set to "reduce motion".
- **Theme toggle:** cream (light) and sage-dark.
- **Menu:** export your data as JSON, import it back, or reset to the seed pool.

## Your problem pool (important)

The seed pool in `src/data/seed.js` has **150 frequently asked problems in 19 topics** (see `QUESTIONS.md` for the full list with links). It is drawn from NeetCode 150, LeetCode's Top Interview 150 and well-known binary-search-on-answer lists, with Binary Search on Answer (16 problems) prioritised. Premium-only problems are excluded. To customise it:

1. Open `src/data/seed.js`.
2. Edit `POOL`. Each row is `[leetcode-slug, title, difficulty, topic]`. The slug is the part after `/problems/` in the LeetCode URL.
3. Put the slugs you have already solved into `SOLVED_SLUGS`. They start as **Revise**; everything else starts as **New**.
4. In the app choose Menu, Reset to seed (or clear the `algodeck:v1` key in DevTools) so the new pool loads.

To change the prioritised topic, edit `PRIORITY_TOPIC` in the same file.

## Data and backup

- Storage key: `algodeck:v1`.
- Export writes a single JSON file with `problems`, `logs`, `bookmarks`, `theme` and `lastDrawn`. Import validates the file and replaces your current data after a confirmation.
- Imported files may contain extra problems of your own; they are kept alongside the seed pool.
- Data lives per browser and per origin. Use export/import to move between devices.

## Project layout

```
src/
  App.jsx                 home screen, draw flow, menu, import/export
  components/
    ProblemCard.jsx       drawn problem, links, bookmark, logging
    StatsPanel.jsx        slide-over stats
    Deck.jsx              animated draw deck
    Ring.jsx              progress ring
    Confetti.jsx          solve celebration
    Icons.jsx
  lib/
    logic.js              draw weighting, stats, streak
    reducer.js            state transitions
    storage.js            localStorage, validation, export
    logic.test.js         unit tests
  data/seed.js            problem pool and solved list
  styles.css              cream/sage theme tokens
```

## Notes

- Streak counts consecutive days with any logged activity (solved or attempted). It stays alive until the end of the next day, so a missing entry for today does not reset it yet.
- Topic mastery counts a problem as covered if it is in Revise or has a solved log.
- LeetCode links point at leetcode.com. Some problems are premium there; this app does not check.
