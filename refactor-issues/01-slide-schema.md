# Issue 01 — Slide content schema (data, not components)

**Status:** ✅ Implemented in this pass.

## Problem
`SlideDefinition = { Component: ComponentType, className?: string }`. A slide
*is* a React component. That's fine for hand-written TSX decks, but a markdown
parser can't "emit a component" — it can only emit data. Content and rendering
are fused, so there's no way for two different sources (static deck, parsed
markdown) to produce interchangeable output.

## Change
New file: `src/lib/slides/schema.ts`

Defines `Slide` as a discriminated union on `kind`, one variant per slide type
that already exists in your decks (inferred from `helpers.tsx` + the 5
primitive files):

- `cover` — title slide (eyebrow, title, subtitle, meta chips)
- `divider` — section break (num, eyebrow, title, desc)
- `content` — generic body slide (eyebrow, title + a list of `Block`s)
- `table` — summary table (headers, rows)

`Block` (used inside `content` slides) covers the recurring shapes:
`paragraph`, `letterGrid`, `conditionList`, `examplesGrid`, `wordsGrid`,
`compareGrid`, `causesRow`, `legendRow`, `symbolDisplay`. Inline colored text
(`Em`/`Madd`/`Hamza`/`Haa`/`Khaa`) becomes a `RichText` type: an array of
`{ text, tone? }` runs instead of JSX spans — this is the part a markdown
parser can realistically produce (e.g. `**[hamza]نص**`-style syntax later).

This is additive — nothing existing imports it yet.

## Acceptance criteria
- [x] `Slide` and `Block` types cover every visual pattern used across the
      6 existing decks (verified against cards.tsx/cover.tsx/display.tsx/
      divider.tsx/table.tsx).
- [x] No existing file modified.
- [x] Exported `RichText` / `Run` types replace ad-hoc JSX children for text
      that needs colored spans.
