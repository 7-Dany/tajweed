# Issue 02 — Generic SlideRenderer over existing primitives

**Status:** ✅ Implemented in this pass.

## Problem
Even with a data schema (Issue 01), something has to turn `Slide` data back
into JSX using the existing, already-good `components/slides/*` primitives
(`SlideShell`, `LetterCard`, `CompareCard`, `Table`, etc). Without this, the
schema is inert.

## Change
New file: `src/components/slides/slide-renderer.tsx`

- `<SlideRenderer slide={slide} />` — one component, switches on `slide.kind`,
  delegates to the existing primitives. Nothing in `cards.tsx`, `cover.tsx`,
  `display.tsx`, `divider.tsx`, `table.tsx`, or `slide.tsx` changes — this is a
  new consumer of them, not a replacement.
- `<Rich runs={...} />` — renders a `RichText` array as spans, mapping
  `tone` → the existing `Em`/`Madd`/`Hamza`/`Haa`/`Khaa` wrapper components
  from `helpers.tsx`.
- `slideToClassName(slide)` — small helper returning the per-slide-kind
  className (mirrors what each deck currently passes as `SlideDefinition.className`,
  e.g. `"cover"`, `"divider"`), so `LessonPlayer`'s `slideClasses` prop keeps
  working unchanged.

## Why this is the right seam
`LessonPlayer` and `SlideDeck` (the navigation engine) don't change at all —
they already just take `children` + `slideClasses`. Only what *produces* the
children changes: instead of `deck.map(({ Component }) => <Component />)`,
it becomes `deck.map((slide) => <SlideRenderer slide={slide} />)`.

## Acceptance criteria
- [x] Renders visually identical output to the hand-written `madd-rules` deck
      (verified via Issue 04's migration, same classNames/primitives reused).
- [x] Zero changes to `components/slides/{cards,cover,display,divider,table,slide}.tsx`.
