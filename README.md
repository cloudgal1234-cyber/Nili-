# התשחצנילי (HaTashvatznili)

A mobile Hebrew crossword ("Tashvatz" — תשבץ) app: clues live inside the
grid in dedicated black cells with directional arrows, rather than in a
separate numbered list. Built with **Expo / React Native + TypeScript**.

Everything in this repo runs and is tested: `npm test` passes 25 unit
tests covering the generation/validation engine, and `npm run typecheck`
is clean across the whole app (engine + UI).

## Why React Native / Expo

- One TypeScript codebase for iOS + Android, with OTA updates via Expo.
- `react-native-gesture-handler` + `react-native-reanimated` give native-thread
  pinch/pan for the grid — needed for a crossword to feel smooth when zoomed.
- Flutter was the other realistic option; RN wins here mainly because the
  crossword engine (the hard part) is plain TypeScript and can be shared
  byte-for-byte between the app, a future admin/authoring tool, and a
  Node-based offline puzzle-generation pipeline.

## Folder structure

```
.
├── App.tsx                      # RTL setup + navigation root
├── index.ts                     # Expo entry point
├── app.json / babel.config.js / tsconfig*.json / jest.config.js
└── src/
    ├── types/                   # Pure data model (no logic)
    │   ├── grid.ts               # Cell/ClueCell/LetterCell/WordSlot/PuzzleBoard
    │   ├── dictionary.ts         # DictionaryEntry
    │   └── progress.ts           # Persisted per-puzzle player state
    │
    ├── engine/                  # Generation & validation — zero RN deps, unit-tested in Node
    │   ├── types.ts              # Template model + deriveWordSlots()
    │   ├── csp.ts                # Generic backtracking CSP core (enumerateSolutions)
    │   ├── dictionaryIndex.ts    # Dictionary -> lookup tables
    │   ├── generator.ts          # generateBoard / generateUniqueBoard
    │   ├── solver.ts             # countSolutions / isBoardUniquelySolvable
    │   ├── validator.ts          # validateGeneratedBoard / checkBoardCompletion
    │   ├── index.ts              # Public barrel export
    │   └── __tests__/            # csp / generator / validator tests
    │
    ├── utils/
    │   ├── hebrew.ts             # normalizeHebrewWord, final-letter handling, alphabet
    │   ├── hebrew.test.ts
    │   ├── random.ts             # seeded PRNG (reproducible generation)
    │   └── rtl.ts                # I18nManager RTL bootstrap
    │
    ├── state/
    │   └── gameStore.ts          # zustand store: the ONLY place isComplete is set
    │
    ├── components/
    │   ├── CrosswordGrid.tsx     # pinch/pan grid (reanimated + gesture-handler)
    │   ├── GridCell.tsx          # white letter cell
    │   ├── ClueCell.tsx          # black clue cell with arrow(s)
    │   └── HebrewKeyboard.tsx    # docked custom keyboard (never overlaps the grid)
    │
    ├── screens/
    │   ├── HomeScreen.tsx
    │   ├── GameScreen.tsx        # grid + keyboard + "you're done" modal
    │   └── AnswersScreen.tsx     # strict gate lives here (see below)
    │
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   └── types.ts
    │
    └── data/
        ├── sampleTemplate.ts     # 5x4 demo template (across len 3 / down len 4)
        ├── sampleDictionary.ts   # ~13-word demo dictionary
        └── samplePuzzle.ts       # generateUniqueBoard() called at module load
```

## 1. Data model & dictionary

`src/types/grid.ts` models a board as a `rows x cols` matrix of `Cell`,
where each cell is one of:

- **`LetterCell`** — a white input cell: `{ solution, wordIds }`. `wordIds`
  holds 1 or 2 ids (an across word, a down word, or both when the cell is
  a crossing point).
- **`ClueCell`** — a black cell carrying 1–2 `ClueArrow`s
  (`{ direction: 'across' | 'down', text, wordId }`), rendered with an
  arrow glyph (← for across, ↓ for down) pointing at the word it clues —
  this is the in-grid-clue layout real Tashvatzim use, as opposed to a
  numbered clue list.
- **`BlockCell`** — unused filler.

A `WordSlot` (`src/types/grid.ts`) is the "answer key" for one word:
its cells, its clue-cell location, its direction, and its `answer`.
A `PuzzleBoard` bundles `cells` (the full solved grid) with `words`
(`Record<slotId, WordSlot>`) — this is the ground-truth solution.

Player progress (`src/types/progress.ts` / `gameStore.userValues`) is a
*separate*, much simpler `string[][]` of the same dimensions — this
separation is what makes `checkBoardCompletion(userGrid, solutionBoard)`
a pure, trivially-testable function.

The dictionary (`src/types/dictionary.ts`) is just
`{ id, word, length, clues[], tags? }[]` — `clues` is an array so the
generator can pick a random phrasing per puzzle, and `tags` is there for
future themed-puzzle generation. Ship a real dictionary as a bundled JSON
file (or fetch remotely); the engine only cares about the shape, not the
size.

## 2. Generation & validation engine (`src/engine/`)

The generator turns a **template** — a grid skeleton of `letter` / `block`
/ `clue` cells, hand-authored or produced by a separate layout tool — into
a filled `PuzzleBoard`. It's a classic word-square constraint-satisfaction
problem, solved with backtracking (`src/engine/csp.ts`):

- **Variables** = word slots (derived from the template by
  `deriveWordSlots`, which scans for runs of `letter` cells ≥ length 2 and
  resolves each run's clue cell by following the template's arrows —
  throwing at build time if a word has no clue pointing at it).
- **Domains** = dictionary words of the right length, filtered against
  whatever letters are already placed at crossing cells.
- **Ordering** = most-constrained-variable heuristic (slots with the most
  crossings, then longest, are filled first) so bad guesses fail fast near
  the root of the search tree.
- **Backtracking** = on a dead end, undo the last assignment and try the
  next candidate; `enumerateSolutions` is a generator function, so callers
  can pull just the first solution (the generator) or keep pulling to
  count how many exist (the solver).

**Solvability, precisely defined:** `generateBoard()` finds *a* valid
fill, but a word-square CSP can have more than one valid fill — a player
could then type an equally-correct-but-different word and never match the
stored solution. `isBoardUniquelySolvable()` (`solver.ts`) re-runs the
same CSP over the board's own words and counts solutions, capped at 2 —
"more than one" is all that matters. `generateUniqueBoard()`
(`generator.ts`) wraps this in a generate-verify-retry loop and throws a
descriptive error if no attempt within `maxAttempts` produces a unique
board, rather than silently shipping an ambiguous puzzle. This
generate-then-verify split is deliberate: proving uniqueness is a
different, more expensive check than finding *a* solution, and keeping it
separate makes both pieces independently testable (see
`engine/__tests__/generator.test.ts`, which includes a worked example of
a template that is *never* uniquely solvable — two equal-length crossing
words with no other distinguishing constraint can always be swapped —
and confirms `isBoardUniquelySolvable` correctly rejects it).

`validateGeneratedBoard()` is a separate, cheaper structural/lexical pass:
every answer is a real dictionary word made only of Hebrew letters, no
word is reused, no letter cell is orphaned, and every crossing cell agrees
between the words sharing it.

**Known limitation:** the CSP engine fills a *given* template; it does not
design the black-square layout itself (that's a separate, symmetric-grid
generation problem). For anything past a small demo grid, curate a
library of templates (or build a template generator) and keep puzzle
generation as an offline/CI step (`generateUniqueBoard` can take many
backtracking attempts on a dense 15x15 grid) — ship the resulting JSON,
don't run the CSP on-device.

## 3. State management & completion logic (`src/state/gameStore.ts`)

A single zustand store holds the active `board`, the player's
`userValues` grid, the active cell/direction, and `isComplete`.
**`isComplete` is set in exactly one place**: at the bottom of
`inputLetter`, as `checkBoardCompletion(nextGrid, board)` — there is no
"mark as solved" action, no client-settable flag, and no other code path
that can make it `true`.

```ts
export function checkBoardCompletion(userGrid: string[][], board: PuzzleBoard): boolean {
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const cell = board.cells[r][c];
      if (cell.type !== 'letter') continue;
      const userLetter = normalizeHebrewWord(userGrid[r]?.[c] ?? '');
      const solutionLetter = normalizeHebrewWord(cell.solution);
      if (!userLetter || userLetter !== solutionLetter) return false;
    }
  }
  return true;
}
```

Letters are compared through `normalizeHebrewWord`, which strips
nikud/cantillation marks and unifies final letter forms (ם/מ, ן/נ, ך/כ,
ף/פ, ץ/צ) — so the check is verifying *spelling*, not punishing a player
for typing a regular form where the stored solution used a final form (or
the keyboard's auto-final-form substitution) or vice-versa.

**Answers-page gating is enforced twice, on purpose (defense in depth):**

1. `GameScreen.tsx` only offers a route to `Answers` inside a `<Modal
   visible={isComplete}>` — there's no other button/link to it.
2. `AnswersScreen.tsx` itself reads `isComplete` from the store on mount
   and immediately `navigation.replace('Game', …)`s back out if it's
   false — so even a restored navigation state, a deep link, or a future
   bug elsewhere that pushes the route directly still can't render the
   answers.

Progress persists across app restarts via `zustand/middleware persist` +
`AsyncStorage` (`gameStore.ts`); on rehydration, `isComplete` is
**re-derived** from `checkBoardCompletion` rather than trusted from the
cache, so a corrupted or hand-edited local cache can't unlock the page on
its own.

## 4. Frontend architecture

- **`CrosswordGrid.tsx`** — pinch-to-zoom + pan via
  `react-native-gesture-handler` `Gesture.Simultaneous(pinch, pan)` driving
  `react-native-reanimated` shared values, so gestures run on the UI
  thread. Rows use `flexDirection: 'row-reverse'` so array column 0 renders
  as the rightmost visual column, matching Hebrew reading direction
  without needing to reverse the underlying cell data.
- **`GridCell.tsx`** — a `Pressable`, not a `TextInput`: there is no native
  keyboard involved, so nothing can float over the grid.
- **`ClueCell.tsx`** — renders 1–2 arrows (← across / ↓ down) with the
  clue text, `writingDirection: 'rtl'`, `textAlign: 'right'`.
- **`HebrewKeyboard.tsx`** — a plain docked `View` below the grid (not an
  overlay/floating keyboard), so it structurally cannot overlap grid
  content. Includes a direction-toggle key for crossing cells that belong
  to both an across and a down word, and auto-formats the alphabetical
  Hebrew layout — final letter forms are applied automatically by
  `letterFormForPosition` rather than requiring the player to hunt for
  ך/ם/ן/ף/ץ keys.

RTL is applied at two levels: `ensureRTLLayout()` (`utils/rtl.ts`) flips
`I18nManager` app-wide at startup (native platforms need a reload the
first time this changes — call `Updates.reloadAsync()` from
`expo-updates`, or prompt on first run), and every Hebrew-bearing `Text`
style sets `writingDirection: 'rtl'` explicitly so text shaping is correct
even before/without the global flip.

## Running it

```bash
npm install
npm start          # Expo dev server — press i / a / w, or scan the QR code
npm test            # engine unit tests (Node, no simulator needed)
npm run typecheck   # whole app
npm run typecheck:engine  # just src/engine + src/utils + src/types + src/data
```

The home screen loads `src/data/samplePuzzle.ts` — a tiny, uniquely-solvable
demo board — so the app is playable immediately with no backend.

## Growing the dictionary

Replace `src/data/sampleDictionary.ts` with a real word list (a bundled
JSON asset is simplest to start: same `DictionaryEntry[]` shape). Curate
multiple clue phrasings per word for variety, and consider `tags` for
themed puzzles. Because `generateUniqueBoard` retries with fresh
randomness on ambiguity, a richer dictionary generally makes it *easier*
to find a uniquely-solvable fill for a given template, not harder — the
ambiguity risk in this repo's tiny demo dictionary is a small-sample
artifact.

## Suggested next steps for production

- **Template library**: author (or generate) a set of symmetric 13x13 /
  15x15 grid skeletons; run `generateUniqueBoard` for each offline/in CI
  and ship the resulting JSON boards, rather than generating on-device.
- **Persistence/sync**: the `persist` middleware already handles
  restart-survival locally; add a backend if you want progress to sync
  across devices.
- **Testing UI**: add `@testing-library/react-native` + the `jest-expo`
  preset for component tests (kept separate from `jest.config.js` here,
  which intentionally only runs the RN-free engine tests under plain
  `ts-jest`).
- **Accessibility**: VoiceOver/TalkBack labels for grid cells
  (`accessibilityLabel` combining row/col/current letter/clue) and a
  larger-text mode for the keyboard.
- **Analytics/telemetry** on solve time and dead-end detection, if you
  want to track puzzle difficulty empirically instead of only via
  `difficulty` metadata.
