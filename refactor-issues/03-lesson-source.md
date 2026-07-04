# Issue 03 — LessonSource union + resolveLessonSlides()

**Status:** ✅ Implemented in this pass (additive).

## Problem
`getDeck(contentKey, locale)` is a **compile-time** registry: `data/decks/index.ts`
hardcodes imports and a `Record<string, SlideDefinition[]>` map. A lesson
authored in a database at runtime (markdown, saved by a teacher) has no way
to register itself here — the map only knows about lessons that existed at
build time.

## Change
- `src/lib/slides/source.ts` (new): `LessonSource` discriminated union —
  `{ type: "static-deck"; deckKey: string }` (today's decks, unchanged) or
  `{ type: "markdown"; markdown: string }` (future).
- `resolveLessonSlides(source, locale): Slide[] | null` — the *only* place
  that knows how to turn a source into slide data. Today it just wraps the
  legacy `getDeck()` + a not-yet-written `deckToSlides()` adapter (Issue 05);
  once the markdown parser (Issue 07) exists, it's one more `case` in the
  same switch.
- `lib/courses.ts` types gain an optional `source: LessonSource` field
  (falls back to `{ type: "static-deck", deckKey: contentKey }` when absent,
  so `courses.json` doesn't need to change yet — fully backwards compatible).

## Why this matters for "teachers create courses"
This is the seam that makes multi-source lessons possible without
`LessonPlayer` or `SlideDeck` ever knowing a lesson's origin. A teacher's
markdown lesson and a hardcoded deck lesson are indistinguishable past this
function.

## Acceptance criteria
- [x] `courses.json` unchanged, still loads correctly.
- [x] `lib/courses.ts` public function signatures unchanged (per its own
      doc comment promise: "swap for Prisma queries — types/signatures stay
      the same").
- [x] New code does not yet replace `LessonPlayer`'s use of `getDeck` — that
      cutover happens in Issue 05 once decks are migrated (avoids a
      half-migrated state where some lessons render, others don't).
