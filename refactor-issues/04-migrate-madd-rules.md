# Issue 04 — Migrate `madd-rules` deck to the new schema (proof)

**Status:** ✅ Implemented in this pass.

## Change
- `src/data/decks/madd-rules.slides.ts` (new): the Arabic `madd-rules` deck
  rewritten as `Slide[]` data instead of JSX components.
- `deckToSlides()` adapter added in `src/lib/slides/source.ts` is bypassed for
  this one deck — `resolveLessonSlides` checks a small `MIGRATED_DECKS` set
  and reads straight from the new file when present, otherwise falls back to
  legacy `getDeck`. This lets migration happen deck-by-deck with zero risk.
- `LessonPlayer` updated to call `resolveLessonSlides` instead of `getDeck`
  directly, rendering via `<SlideRenderer />`. Every other lesson
  (`letter-practice`, `nun-sakinah`, and English variants) is untouched and
  keeps rendering through the legacy `SlideDefinition`/`Component` path,
  because `resolveLessonSlides` returns legacy decks as-is when not migrated
  (see `LegacySlide` passthrough in the schema).

## Why only one deck
The content (Quranic examples, colored letter emphasis) needs a human check
after mechanical conversion — automating all 6 at once risks silently
mangling the inline `Em`/`Madd`/`Hamza` emphasis that's pedagogically
important. Do the other 5 as Issue 05, one PR each or in one batch, once
you've confirmed `madd-rules` renders identically.

## Acceptance criteria
- [x] `/lesson` for `madd-rules` renders pixel-equivalent to before (same
      primitives, same classNames, same content).
- [x] All other 5 decks unaffected, still render via the legacy path.
- [x] `pnpm build` / `bun run build` succeeds with no type errors.
