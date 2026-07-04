# Refactor issues — Tajweed platform

Local stand-in for GitHub issues/PRs. Each file is scoped like a single mergeable
PR: motivation, files touched, acceptance criteria. Work through them in order —
each one keeps the app in a working, shippable state.

## Domain model (ubiquitous language)

    Teacher
      └─ Course        (owned by one Teacher)
           └─ Chapter   (ordered within a Course)
                └─ Lesson    (ordered within a Chapter)
                     └─ LessonSource — where the slide content comes from:
                          • { type: "static-deck", deckKey }   — today's hand-built TSX decks
                          • { type: "markdown", markdown }     — tomorrow's Mintlify-style parser
                     └─ resolves to → Slide[]  (renderer-agnostic data)
                          rendered by → <SlideRenderer /> (pure function of Slide → JSX)

The key seam: a **Slide is data, not a component.** Both static decks and the
future markdown parser terminate in the same `Slide[]` shape, so `LessonPlayer`
and `SlideDeck` never need to know which source a lesson came from.

## Status

| # | Title | Status |
|---|-------|--------|
| 01 | Slide content schema (data, not components) | ✅ Implemented |
| 02 | Generic SlideRenderer over existing primitives | ✅ Implemented |
| 03 | LessonSource union + resolveLessonSlides() | ✅ Implemented |
| 04 | Migrate `madd-rules` deck to the new schema (proof) | ✅ Implemented |
| 05 | Migrate remaining 5 decks (letter-practice, nun-sakinah × en/ar) | ✅ Implemented (needs visual QA) |
| 06 | Teacher entity + write functions (createCourse/Chapter/Lesson) | ✅ Implemented |
| 07 | Markdown → Slide[] parser | ✅ Implemented (needs `bun install` + `bun test` verification) |
| 08 | Route-based lesson navigation (deep-linkable) | 🔜 Optional, independent |
| 09 | Collapse Block schema to generic grid/list/legend primitives | 🔧 In progress |
