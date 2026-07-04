/**
 * Slide content schema — DATA, not components.
 *
 * See refactor-issues/01-slide-schema.md for original rationale, and
 * refactor-issues/09-generic-block-schema.md for the block-kind collapse
 * (12 narrow kinds -> 7 generic ones) recorded here.
 *
 * Every lesson, whichever source it comes from (a hand-written static deck
 * today, a parsed markdown file later), resolves to `Slide[]`. Nothing here
 * imports React — this is pure data so it can be produced by a markdown
 * parser, stored in a database, and serialized over JSON without any
 * component references.
 *
 * <SlideRenderer /> (components/slides/slide-renderer.tsx) is the only place
 * that turns this data back into JSX, using the existing slide primitives.
 */

/* ───────────────────────── Rich text ───────────────────────── */

/** A tone maps 1:1 to the existing colored-span helpers in helpers.tsx. */
export type Tone = "em" | "madd" | "hamza" | "haa" | "khaa"

export type Run = { text: string; tone?: Tone }

/** Replaces ad-hoc JSX children (e.g. `<>...<Em>..</Em>..</>`) with data. */
export type RichText = Run[]

/** Convenience for plain, tone-less text. */
export function plain(text: string): RichText {
  return [{ text }]
}

/* ───────────────────────── Blocks (used inside "content" slides) ─────────────────────────
 *
 * A small set of GENERIC primitives, composed, rather than one named kind
 * per visual shape a deck happens to need (see refactor-issues/09). Most of
 * what used to be distinct kinds (letterGrid, examplesGrid, wordsGrid,
 * compareGrid, causesRow, pairCards) are really the same thing — a grid of
 * cards — differing only in which optional CardItem fields are populated.
 * ───────────────────────────────────────────────────────────────────── */

export type ParagraphBlock = {
  kind: "paragraph"
  text: RichText
}

export type HeadingBlock = {
  kind: "heading"
  text: string
}

/** Info/warning callout, matching the existing <Alert> component. */
export type AlertBlock = {
  kind: "alert"
  tone?: "info" | "warning"
  text: RichText
}

/**
 * One item in a `grid` block. Every field is optional — a given grid
 * `variant` uses only the subset it needs:
 *   - "letters"  / "causes"          -> glyph, label(, hint)
 *   - "examples" / "examples-single" / "words" -> example only
 *   - "compare"                      -> emphasis, badge, title, desc, example
 *   - "pairs"                        -> title, desc, example
 */
export type CardItem = {
  glyph?: string
  label?: string
  hint?: string
  badge?: string
  title?: string
  desc?: RichText
  example?: RichText
  /** Visual weight for "compare" cards only — unrelated to the `Tone` union
   * (no hamza/madd/etc. semantics), so it gets its own name. */
  emphasis?: "default" | "accent"
}

export type GridVariant =
  | "letters"
  | "examples"
  | "examples-single"
  | "words"
  | "compare"
  | "causes"
  | "pairs"

export type GridBlock = {
  kind: "grid"
  variant: GridVariant
  items: CardItem[]
}

/** One item in a `list` block — "conditions" uses glyph+desc, "overview" uses title+meta+desc. */
export type ListItem = {
  glyph?: string
  title?: string
  meta?: string
  desc?: RichText
}

export type ListBlock = {
  kind: "list"
  variant: "conditions" | "overview"
  items: ListItem[]
}

/** Legend chips only ever use the four letter/mark colors — never the plain "em" emphasis tone. */
export type LegendTone = Exclude<Tone, "em">

export type LegendBlock = {
  kind: "legend"
  items: { tone: LegendTone; label: string }[]
}

/** A single big centered glyph + caption. No sibling shape — kept separate rather than forced into `grid`. */
export type SymbolBlock = {
  kind: "symbol"
  glyph: string
  caption: string
}

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | AlertBlock
  | GridBlock
  | ListBlock
  | LegendBlock
  | SymbolBlock

/* ───────────────────────── Slides ───────────────────────── */

export type CoverSlide = {
  kind: "cover"
  /** "closing" renders the same shell without eyebrow/chips (deck's final slide). */
  variant?: "opening" | "closing"
  eyebrow?: string
  eyebrowIcon?: "book"
  title: string
  subtitle?: string
  /** Same tone vocabulary as the `legend` block, plus "primary" for the
   * chip that isn't tied to a specific letter/mark color. */
  chips?: { tone?: LegendTone | "primary"; label: string }[]
  meta?: string
}

export type DividerSlide = {
  kind: "divider"
  num: string
  eyebrow: string
  title: string
  desc: string
}

export type ContentSlide = {
  kind: "content"
  eyebrow: string
  title: string
  blocks: Block[]
}

export type TableCell = {
  text: RichText
  badge?: "slide" | "accent"
  align?: "start" | "center"
}

export type TableSlide = {
  kind: "table"
  eyebrow: string
  title: string
  headers: { text: string; align?: "start" | "center" }[]
  rows: TableCell[][]
  /** Optional trailing info/warning callout below the table. */
  note?: { tone?: "info" | "warning"; text: RichText }
}

export type Slide = CoverSlide | DividerSlide | ContentSlide | TableSlide

/* ───────────────────────── Lesson-level metadata ───────────────────────── */

/**
 * Document frontmatter for a markdown-authored lesson — the leading ```yaml
 * fence that must open every lesson.md file (see markdown-parser.ts).
 * `lesson` mirrors the existing deckKey used in source.ts's DECKS_BY_LOCALE,
 * so a lesson written as markdown can key into the same lookup shape as a
 * static deck. `language` mirrors the app's Locale ("ar" | "en") but is kept
 * as a plain string here to avoid this schema module importing from
 * @/translations/provider — callers narrow/validate it against Locale.
 */
export type LessonMeta = {
  lesson: string
  language: string
  title?: string
  style?: string
}
