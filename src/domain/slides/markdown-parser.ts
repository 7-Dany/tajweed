/**
 * Markdown → { meta, slides } parser (Issue 07, refactor-issues/07-markdown-parser.md).
 *
 * Public seam: `parseMarkdownLesson(markdown) => { meta: LessonMeta, slides: Slide[] }`.
 * Everything else in this file is private.
 *
 * Architecture (same pipeline shape as Mintlify's own MDX engine, minus the
 * JSX-compile step — we terminate in data, not components):
 *
 *   markdown string
 *     -> unified + remark-parse + remark-gfm   (mdast AST, one pass,
 *                                                battle-tested — we never
 *                                                hand-parse bold/italic/
 *                                                links/tables ourselves)
 *     -> tone plugin (mdast-util-find-and-replace over text nodes,
 *                     `[tone]...[/tone]` -> a custom `toneSpan` mdast node)
 *     -> our visitor: mdast -> { meta, slides }
 *
 * Authoring convention (v2 — fully yaml-driven metadata, see AUTHORING.md):
 *   - The file MUST open with a ```yaml fence, before anything else. This is
 *     the document's frontmatter: `lesson`, `language` (required), plus
 *     optional `title`/`style`. It is consumed once, up front.
 *   - After that, `---` (thematic break) means exactly one thing: the
 *     boundary between two slides. Nothing else in the file uses `---`.
 *   - Each slide opens with its own ```yaml fence carrying `kind`
 *     (cover|divider|content|table) plus that kind's metadata fields
 *     (eyebrow/title/subtitle/num/variant/chips/...). An optional bare
 *     `<!-- slide -->` HTML comment may precede it, purely as a visual
 *     anchor — it carries no information and is stripped unread.
 *   - Metadata (anything with no position in the deck) lives in yaml.
 *     Content (anything read in order — paragraphs, headings, alerts,
 *     specialized blocks) lives in the markdown body below the fence:
 *       ### heading          -> heading block
 *       paragraph            -> paragraph block
 *       > blockquote         -> alert block ("> [!WARNING]" => warning tone)
 *       ```<kind:variant>    -> a specialized Block, via BLOCK_PARSERS below
 *          yaml body```         (grid:letters, list:conditions, ...)
 *   - Fenced block languages are named `<schemaKind>:<variant>` (e.g.
 *     `grid:compare`, `list:overview`) so the fence name is guessable
 *     straight from schema.ts, and yaml keys inside them match the
 *     corresponding schema field names 1:1 — no silent renames.
 *   - Inline tone syntax: `[hamza]نص[/hamza]` -> a `Run` with that tone.
 *
 * Extending: to add a new fenced-block kind, add one entry to BLOCK_PARSERS.
 * Nothing else in this file (or its callers) needs to change.
 */

import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import { findAndReplace } from "mdast-util-find-and-replace"
import { parse as parseYaml } from "yaml"
import type { Root as MdastRoot, RootContent as MdastNode } from "mdast"

import type {
  Block,
  ContentSlide,
  CoverSlide,
  DividerSlide,
  LegendTone,
  LessonMeta,
  RichText,
  Run,
  Slide,
  TableCell,
  TableSlide,
  Tone,
} from "@/domain/slides/schema"

/** Loosely-typed node used only for inline traversal (PhrasingContent + our
 * synthetic toneSpan node) — base @types/mdast's PhrasingContent union is
 * narrower than what find-and-replace can hand back, so this stays duck-typed. */
type InlineNode = { type: string; value?: string; children?: InlineNode[] }

/* ───────────────────────── Public seam ───────────────────────── */

export type ParsedLesson = { meta: LessonMeta; slides: Slide[] }

/**
 * Parses a markdown lesson source into a document-level LessonMeta plus
 * renderable Slide[] data. Throws MarkdownParseError on malformed input
 * (missing/invalid frontmatter, unknown slide/block kind, invalid yaml,
 * missing required fields) — callers decide how to surface that (e.g. a
 * teacher-facing editor would catch this and show a lint error).
 */
export function parseMarkdownLesson(markdown: string): ParsedLesson {
  const { meta, rest } = extractDocumentFrontmatter(markdown)
  const sections = splitIntoSlideSections(rest)
  return { meta, slides: sections.map(parseSlideSection) }
}

export class MarkdownParseError extends Error {
  constructor(message: string) {
    super(`[markdown lesson] ${message}`)
    this.name = "MarkdownParseError"
  }
}

/* ───────────────────────── Document frontmatter ───────────────────────── */

/** The file's very first node must be a ```yaml fence — that's the frontmatter. */
function extractDocumentFrontmatter(markdown: string): { meta: LessonMeta; rest: string } {
  const tree = toMdast(markdown)
  const first = tree.children[0]
  if (first?.type !== "code" || first.lang !== "yaml") {
    throw new MarkdownParseError(
      "lesson file must start with a ```yaml frontmatter fence (lesson, language)"
    )
  }

  const data = (parseYaml(first.value) ?? {}) as Record<string, unknown>
  if (!data.lesson || !data.language) {
    throw new MarkdownParseError("frontmatter requires `lesson` and `language` fields")
  }

  const meta: LessonMeta = {
    lesson: String(data.lesson),
    language: String(data.language),
    title: data.title as string | undefined,
    style: data.style as string | undefined,
  }

  const rest = markdown.split("\n").slice(first.position?.end.line ?? 1).join("\n")
  return { meta, rest }
}

/* ───────────────────────── Slide-level split ───────────────────────── */

type SlideSection = { body: string }

/** Splits on top-level `---` thematic breaks. */
function splitIntoSlideSections(markdown: string): SlideSection[] {
  const tree = toMdast(markdown)
  const sections: SlideSection[] = []
  const sourceLines = markdown.split("\n")

  const boundaries: number[] = []
  for (const node of tree.children) {
    if (node.type === "thematicBreak" && node.position) {
      boundaries.push(node.position.start.line - 1)
    }
  }
  boundaries.push(sourceLines.length)

  let sliceStart = 0
  for (const boundary of boundaries) {
    const raw = sourceLines.slice(sliceStart, boundary).join("\n").trim()
    if (raw.length > 0) sections.push({ body: raw })
    sliceStart = boundary + 1
  }

  return sections
}

/** Strips a purely-cosmetic leading `<!-- slide -->` comment, if present. Carries no data. */
const SLIDE_COMMENT_RE = /^<!--\s*slide\s*(?::\s*\w+)?\s*-->\s*/

function stripSlideComment(body: string): string {
  return body.replace(SLIDE_COMMENT_RE, "")
}

/* ───────────────────────── Per-slide parse ───────────────────────── */

function parseSlideSection(section: SlideSection): Slide {
  const body = stripSlideComment(section.body)
  const { yaml, rest } = extractLeadingYamlFence(body)

  if (!yaml.kind) {
    throw new MarkdownParseError(
      "slide requires `kind` in its yaml fence (cover, divider, content, or table)"
    )
  }

  const tree = toMdast(rest)

  switch (yaml.kind) {
    case "cover":
      return parseCoverSlide(yaml)
    case "divider":
      return parseDividerSlide(yaml)
    case "table":
      return parseTableSlide(yaml, tree)
    case "content":
      return parseContentSlide(yaml, tree)
    default:
      throw new MarkdownParseError(
        `unknown slide kind "${yaml.kind}" (expected cover, divider, content, or table)`
      )
  }
}

/** Pulls a single leading ```yaml fence (if present) off the top of a slide body. */
function extractLeadingYamlFence(body: string): { yaml: Record<string, unknown>; rest: string } {
  const tree = toMdast(body)
  const first = tree.children[0]
  if (first?.type === "code" && first.lang === "yaml") {
    const yaml = (parseYaml(first.value) ?? {}) as Record<string, unknown>
    const afterFence = body.split("\n").slice((first.position?.end.line ?? 1)).join("\n")
    return { yaml, rest: afterFence }
  }
  return { yaml: {}, rest: body }
}

function parseCoverSlide(yaml: Record<string, unknown>): CoverSlide {
  if (!yaml.title) throw new MarkdownParseError("cover slide requires `title` in its yaml fence")

  return {
    kind: "cover",
    variant: (yaml.variant as CoverSlide["variant"]) ?? "opening",
    eyebrow: yaml.eyebrow as string | undefined,
    eyebrowIcon: yaml.eyebrowIcon as CoverSlide["eyebrowIcon"],
    title: String(yaml.title),
    subtitle: yaml.subtitle as string | undefined,
    chips: yaml.chips as CoverSlide["chips"],
    meta: yaml.meta as string | undefined,
  }
}

function parseDividerSlide(yaml: Record<string, unknown>): DividerSlide {
  if (!yaml.num || !yaml.eyebrow || !yaml.title) {
    throw new MarkdownParseError("divider slide requires `num`, `eyebrow`, and `title` in its yaml fence")
  }

  return {
    kind: "divider",
    num: String(yaml.num),
    eyebrow: String(yaml.eyebrow),
    title: String(yaml.title),
    desc: (yaml.desc as string | undefined) ?? "",
  }
}

function parseTableSlide(yaml: Record<string, unknown>, tree: MdastRoot): TableSlide {
  if (!yaml.eyebrow || !yaml.title) {
    throw new MarkdownParseError("table slide requires `eyebrow` and `title` in its yaml fence")
  }

  // remark-gfm's table/tableRow/tableCell nodes aren't part of base @types/mdast,
  // so this one function reads them structurally instead of via mdast's types.
  const tableNode = tree.children.find((n) => n.type === "table") as
    | { type: "table"; align?: (string | null)[]; children: { children: { children: MdastNode[] }[] }[] }
    | undefined
  if (!tableNode) throw new MarkdownParseError("table slide requires a markdown table")

  const [headerRow, ...bodyRows] = tableNode.children
  const headers = headerRow.children.map((cell, i) => ({
    text: mdastInlineToPlainText(cell.children),
    align: tableNode.align?.[i] === "center" ? ("center" as const) : undefined,
  }))
  const rows: TableCell[][] = bodyRows.map((row) =>
    row.children.map((cell, i) => {
      // A cell may open with `{slide}` or `{accent}` to set TableCell.badge —
      // same "strip a recognized prefix, keep the rest as RichText" technique
      // used for blockquote admonitions (ADMONITION_RE) below.
      const raw = mdastInlineToPlainText(cell.children)
      const match = raw.match(CELL_BADGE_RE)
      const badge = match?.[1] as TableCell["badge"]
      return {
        text: inlineChildrenToRichText(cell.children, match ? match[0].length : 0),
        badge,
        align: tableNode.align?.[i] === "center" ? ("center" as const) : undefined,
      }
    })
  )

  const blockquote = tree.children.find(
    (n): n is Extract<MdastNode, { type: "blockquote" }> => n.type === "blockquote"
  )
  const note = blockquote ? blockquoteToAlertFields(blockquote) : undefined

  return {
    kind: "table",
    eyebrow: String(yaml.eyebrow),
    title: String(yaml.title),
    headers,
    rows,
    note,
  }
}

function parseContentSlide(yaml: Record<string, unknown>, tree: MdastRoot): ContentSlide {
  if (!yaml.eyebrow || !yaml.title) {
    throw new MarkdownParseError("content slide requires `eyebrow` and `title` in its yaml fence")
  }

  const blocks: Block[] = []
  for (const node of tree.children) {
    const block = nodeToBlock(node)
    if (block) blocks.push(block)
  }

  return { kind: "content", eyebrow: String(yaml.eyebrow), title: String(yaml.title), blocks }
}

/* ───────────────────────── Content-slide block parsing ─────────────────────────
 *
 * Ordered, private list of (match, parse) pairs. Adding a new fenced-block
 * kind is a one-line addition here — nothing else in the module changes.
 * Fence names are `<schemaKind>:<variant>`, and yaml keys inside them match
 * the corresponding schema field names 1:1 — guessable straight from
 * schema.ts, no silent renames.
 * ───────────────────────────────────────────────────────────────────── */

type BlockParser = {
  lang: string
  toBlock: (data: unknown) => Block
}

const BLOCK_PARSERS: BlockParser[] = [
  {
    lang: "grid:letters",
    toBlock: (data) => ({
      kind: "grid",
      variant: "letters",
      items: (data as { glyph: string; label: string; hint?: string }[]).map((item) => ({
        glyph: item.glyph,
        label: item.label,
        hint: item.hint,
      })),
    }),
  },
  {
    lang: "grid:causes",
    toBlock: (data) => ({
      kind: "grid",
      variant: "causes",
      items: (data as { glyph: string; label: string }[]).map((item) => ({
        glyph: item.glyph,
        label: item.label,
      })),
    }),
  },
  {
    lang: "grid:examples",
    toBlock: (data) => ({
      kind: "grid",
      variant: "examples",
      items: (data as string[]).map((example) => ({ example: parseInlineTonesFromString(example) })),
    }),
  },
  {
    lang: "grid:examples-single",
    toBlock: (data) => ({
      kind: "grid",
      variant: "examples-single",
      items: (data as string[]).map((example) => ({ example: parseInlineTonesFromString(example) })),
    }),
  },
  {
    lang: "grid:words",
    toBlock: (data) => ({
      kind: "grid",
      variant: "words",
      items: (data as string[]).map((example) => ({ example: parseInlineTonesFromString(example) })),
    }),
  },
  {
    lang: "grid:compare",
    toBlock: (data) => ({
      kind: "grid",
      variant: "compare",
      items: (
        data as { emphasis?: "default" | "accent"; badge: string; title: string; desc: string; example: string }[]
      ).map((item) => ({
        emphasis: item.emphasis,
        badge: item.badge,
        title: item.title,
        desc: parseInlineTonesFromString(item.desc),
        example: parseInlineTonesFromString(item.example),
      })),
    }),
  },
  {
    lang: "grid:pairs",
    toBlock: (data) => ({
      kind: "grid",
      variant: "pairs",
      items: (data as { title: string; desc: string; example: string }[]).map((item) => ({
        title: item.title,
        desc: parseInlineTonesFromString(item.desc),
        example: parseInlineTonesFromString(item.example),
      })),
    }),
  },
  {
    lang: "list:conditions",
    toBlock: (data) => ({
      kind: "list",
      variant: "conditions",
      items: (data as { glyph: string; desc: string }[]).map((item) => ({
        glyph: item.glyph,
        desc: parseInlineTonesFromString(item.desc),
      })),
    }),
  },
  {
    lang: "list:overview",
    toBlock: (data) => ({
      kind: "list",
      variant: "overview",
      items: (data as { title: string; meta: string; desc: string }[]).map((item) => ({
        title: item.title,
        meta: item.meta,
        desc: parseInlineTonesFromString(item.desc),
      })),
    }),
  },
  {
    lang: "legend",
    toBlock: (data) => ({
      kind: "legend",
      items: (data as { tone: LegendTone; label: string }[]).map((item) => ({
        tone: item.tone,
        label: item.label,
      })),
    }),
  },
  {
    lang: "symbol",
    toBlock: (data) => ({ kind: "symbol", ...(data as { glyph: string; caption: string }) }),
  },
]

function nodeToBlock(node: MdastNode): Block | null {
  switch (node.type) {
    case "paragraph":
      return { kind: "paragraph", text: inlineChildrenToRichText(node.children) }
    case "heading":
      if (node.depth === 3) return { kind: "heading", text: mdastInlineToPlainText(node.children) }
      return null
    case "blockquote": {
      const { tone, text } = blockquoteToAlertFields(node)
      return { kind: "alert", tone, text }
    }
    case "code": {
      const parser = BLOCK_PARSERS.find((p) => p.lang === node.lang)
      if (!parser) {
        throw new MarkdownParseError(
          `unknown block kind "${node.lang}" in a fenced code block (expected one of: ${BLOCK_PARSERS.map((p) => p.lang).join(", ")})`
        )
      }
      return parser.toBlock(parseYaml(node.value))
    }
    default:
      return null
  }
}

/** A table body cell may open with `{slide}` or `{accent}` to set TableCell.badge. */
const CELL_BADGE_RE = /^\{(slide|accent)\}\s*/

const ADMONITION_RE = /^\[!(\w+)\]\s*/

function blockquoteToAlertFields(node: Extract<MdastNode, { type: "blockquote" }>): {
  tone: "info" | "warning"
  text: RichText
} {
  const firstParagraph = node.children.find((c): c is Extract<MdastNode, { type: "paragraph" }> => c.type === "paragraph")
  const raw = firstParagraph ? mdastInlineToPlainText(firstParagraph.children) : ""
  const match = raw.match(ADMONITION_RE)
  const tone = match?.[1].toLowerCase() === "warning" ? "warning" : "info"
  const text = firstParagraph
    ? inlineChildrenToRichText(firstParagraph.children, match ? match[0].length : 0)
    : []
  return { tone, text }
}

/* ───────────────────────── Inline tones (RichText) ─────────────────────────
 *
 * `[tone]text[/tone]` -> a custom `toneSpan` mdast node carrying `data.tone`,
 * via the same find-and-replace extension mechanism remark plugins use.
 * ───────────────────────────────────────────────────────────────────── */

const TONES: readonly Tone[] = ["em", "madd", "hamza", "haa", "khaa"]
const TONE_SPAN_RE = new RegExp(`\\[(${TONES.join("|")})\\]([\\s\\S]*?)\\[/\\1\\]`, "g")

type ToneSpanNode = { type: "toneSpan"; tone: Tone; value: string }

function remarkToneSpans() {
  return (tree: MdastRoot) => {
    findAndReplace(tree, [
      [
        TONE_SPAN_RE,
        (_match: string, tone: string, text: string) => {
          const node: ToneSpanNode = { type: "toneSpan", tone: tone as Tone, value: text }
          // mdast-util-find-and-replace's Replace type only knows base mdast's
          // PhrasingContent union; `toneSpan` is our own synthetic node type,
          // consumed only by inlineChildrenToRichText below (duck-typed via
          // InlineNode), so this single cast is the seam between the two.
          return node as unknown as import("mdast").PhrasingContent
        },
      ],
    ])
  }
}

function inlineChildrenToRichText(children: InlineNode[], skipChars = 0): RichText {
  const runs: Run[] = []
  let skipped = 0
  for (const child of children) {
    if (child.type === "text") {
      let text = child.value ?? ""
      if (skipped < skipChars) {
        const remove = Math.min(skipChars - skipped, text.length)
        text = text.slice(remove)
        skipped += remove
      }
      if (text) runs.push({ text })
    } else if (child.type === "toneSpan") {
      runs.push({ text: child.value ?? "", tone: (child as unknown as ToneSpanNode).tone })
    } else if (child.children) {
      runs.push(...inlineChildrenToRichText(child.children))
    }
  }
  return runs
}

function mdastInlineToPlainText(children: InlineNode[]): string {
  return inlineChildrenToRichText(children)
    .map((r) => r.text)
    .join("")
}

/** Used inside YAML block bodies (e.g. `desc: "...[em]نص[/em]..."`) — same tone syntax, no mdast involved. */
function parseInlineTonesFromString(input: string): RichText {
  const runs: Run[] = []
  let lastIndex = 0
  TONE_SPAN_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = TONE_SPAN_RE.exec(input))) {
    if (match.index > lastIndex) runs.push({ text: input.slice(lastIndex, match.index) })
    runs.push({ text: match[2], tone: match[1] as Tone })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < input.length) runs.push({ text: input.slice(lastIndex) })
  return runs
}

/* ───────────────────────── mdast plumbing ───────────────────────── */

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkToneSpans)

function toMdast(markdown: string): MdastRoot {
  return processor.runSync(processor.parse(markdown)) as MdastRoot
}
