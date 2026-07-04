# Issue 05 — Migrate remaining 5 decks

**Status:** ✅ Implemented.

## Scope
For each of: `madd-rules.en`, `letter-practice` (ar/en), `nun-sakinah` (ar/en):

1. Created `src/content/lessons/<name>.slides.ts` exporting `Slide[]`.
2. `src/domain/slides/source.ts` rewritten as a locale-aware `DECKS_BY_LOCALE`
   map (mirrors the old `registry.ts` shape) — no more `MIGRATED_DECKS` gate,
   no more legacy fallback branch.
3. `letter-practice`'s Arabic word lists were pulled into a shared
   `letter-practice.words.ts` (ar and en decks use identical Arabic-script
   practice words — the old component decks duplicated this list verbatim).
4. Two new `Block` kinds were needed and added to the schema/renderer that
   Issue 01 hadn't anticipated: `rulesOverview` (the four-rule summary grid
   in `nun-sakinah`) and `pairCards` (the idghām-with/without-nasalization
   two-up cards). Both are pure data, same pattern as every other block.

## Once all 6 are migrated
- ✅ Legacy `SlideDefinition`/`Component` path removed from
  `components/slides/helpers.tsx`.
- ✅ `content/lessons/registry.ts` (`getDeck`) and all 6 legacy component
  decks moved to `refactor-issues/_archive-legacy-decks/` (kept for
  reference, not part of the build).
- ✅ `resolveLessonSlides()` now always returns plain `Slide[] | null` —
  `ResolvedSlide`'s `{ data } | { legacy }` union is gone, and so is
  `LessonPlayer`'s branch on it.

## Acceptance criteria
- [x] All 6 decks render from `Slide[]` data.
- [x] `getDeck()` / `SlideDefinition` (component-based) fully removed.
- [ ] No visual regressions across any lesson, either locale — **needs a
      human click-through**; the content was migrated 1:1 by hand but hasn't
      been visually diffed against the original render yet. Do this before
      relying on it in production.
