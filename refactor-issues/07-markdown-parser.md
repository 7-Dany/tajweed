# Issue 07 — Markdown → Slide[] parser

**Status:** ✅ Implemented.

## Interface decision

Design "A" from the interface discussion (single deep function, everything
else private) — matches the seam shape `resolveLessonSlides` already uses:

```ts
export function parseMarkdownLesson(markdown: string): Slide[]
export class MarkdownParseError extends Error {}
```

No public AST access (design B) and no public block-parser registry
(design C) — both were speculative seams with no second caller today.
Extendability for new block kinds is handled **privately**, as an ordered
`BLOCK_PARSERS` list inside the module (see below) — that's where the
codebase's own history (Issue 05 added `rulesOverview`/`pairCards`) shows
extension actually happens.

## Architecture

Same pipeline shape as Mintlify's own MDX engine, minus the JSX-compile step
(we terminate in `Slide[]` data, not components):

```
markdown string
  → unified + remark-parse + remark-gfm     (mdast AST, one pass — bold/
                                              italic/links/tables come from
                                              a battle-tested parser, not
                                              hand-rolled regex)
  → remarkToneSpans plugin                  (mdast-util-find-and-replace;
                                              `[tone]...[/tone]` → a
                                              synthetic `toneSpan` node)
  → our visitor: mdast → Slide[]            (domain/slides/markdown-parser.ts)
```

## Authoring convention

- `---` (thematic break) separates slides.
- `<!-- slide: cover|divider|content|table -->` names a slide's kind.
  Omitted → `content` (the common case).
- A slide may open with a fenced ` ```yaml ` block for fields that don't map
  to prose: cover's `chips`/`meta`/`eyebrowIcon`, divider's `num`/`eyebrow`.
- Inside a `content` slide:
  - `## ...` → eyebrow (first h2), `# ...` → title (first h1)
  - `### ...` → `miniHeading` block
  - a paragraph → `paragraph` block
  - `> [!WARNING] ...` / `> ...` → `alert` block (warning/info tone)
  - a fenced code block whose lang matches an entry in `BLOCK_PARSERS`
    (`letterGrid`, `conditionList`, `examplesGrid`, `wordsGrid`,
    `compareGrid`, `causesRow`, `legendRow`, `symbolDisplay`,
    `rulesOverview`, `pairCards`) → that specialized `Block`, body is YAML
- A `table` slide: `## eyebrow` + `# title` + a GFM markdown table (+
  optional trailing `>` blockquote → `note`).
- Inline tone syntax: `[hamza]نص[/hamza]` → a `Run` with that tone — works
  both in prose and inside YAML string fields (e.g. an `example:` value).

## Files

- `src/domain/slides/markdown-parser.ts` — the parser (new).
- `src/domain/slides/markdown-parser.test.ts` — fixture-based unit tests,
  no React/DOM, `bun test` runner (new `test` script in `package.json`).
- `src/domain/slides/source.ts` — the `"markdown"` case of
  `resolveLessonSlides` now calls `parseMarkdownLesson` instead of throwing.
- New deps: `unified`, `remark-parse`, `remark-gfm`,
  `mdast-util-find-and-replace`, `yaml`, `@types/mdast` (dev).

## Acceptance criteria
- [x] Pure function, fully unit tested against fixtures — no React, no DOM.
- [x] Wired into `resolveLessonSlides` as the `"markdown"` case.
- [x] Covers every block kind used across the 6 migrated decks.
- [ ] Run `bun install && bun run typecheck && bun test` — not yet verified
      in this environment (file-system access only, no shell on your
      machine). Please run these before relying on this in production.
- [ ] No teacher-facing authoring UI/validation surface yet — errors
      currently surface as a thrown `MarkdownParseError`; wiring that into
      an editor (e.g. inline lint messages) is follow-up work, not scoped
      here.
