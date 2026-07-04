/**
 * Tests for parseMarkdownLesson (refactor-issues/07-markdown-parser.md).
 *
 * Fixture-based: each fixture is a markdown lesson source paired with the
 * { meta, slides } it should produce. Pure function, no React/DOM — matches
 * the "no renderer needed" acceptance criterion in the issue doc.
 *
 * v2 format: every fixture must open with a document ```yaml frontmatter
 * fence (lesson, language), and every slide's own yaml fence carries `kind`
 * plus that kind's metadata (eyebrow/title/subtitle/...) directly — no more
 * heading-position inference. See markdown-parser.ts's module doc comment.
 */

import { describe, expect, test } from "bun:test"

import { MarkdownParseError, parseMarkdownLesson } from "@/domain/slides/markdown-parser"

const FRONTMATTER = `
\`\`\`yaml
lesson: test-lesson
language: ar
\`\`\`
`.trim()

describe("parseMarkdownLesson", () => {
  test("parses document frontmatter", () => {
    const md = `
\`\`\`yaml
lesson: madd-rules
language: ar
title: "المدود في التجويد"
style: default
\`\`\`

\`\`\`yaml
kind: cover
title: "العنوان"
\`\`\`
`.trim()

    const { meta } = parseMarkdownLesson(md)
    expect(meta).toEqual({
      lesson: "madd-rules",
      language: "ar",
      title: "المدود في التجويد",
      style: "default",
    })
  })

  test("throws MarkdownParseError when the file doesn't open with a yaml frontmatter fence", () => {
    const md = `# no frontmatter here`
    expect(() => parseMarkdownLesson(md)).toThrow(MarkdownParseError)
  })

  test("throws MarkdownParseError when frontmatter is missing lesson/language", () => {
    const md = `
\`\`\`yaml
title: "missing required fields"
\`\`\`
`.trim()
    expect(() => parseMarkdownLesson(md)).toThrow(MarkdownParseError)
  })

  test("parses a cover slide", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: cover
eyebrow: "علم التجويد"
eyebrowIcon: book
title: "المدود في التجويد"
subtitle: "أحكام المد الطبيعي والفرعي"
chips:
  - { tone: primary, label: "المد الطبيعي" }
\`\`\`
`.trim()

    const { slides } = parseMarkdownLesson(md)
    expect(slides[0]).toEqual({
      kind: "cover",
      variant: "opening",
      eyebrow: "علم التجويد",
      eyebrowIcon: "book",
      title: "المدود في التجويد",
      subtitle: "أحكام المد الطبيعي والفرعي",
      chips: [{ tone: "primary", label: "المد الطبيعي" }],
      meta: undefined,
    })
  })

  test("parses a divider slide", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: divider
num: "١"
eyebrow: "الدرس الأول"
title: "عنوان الدرس"
desc: "وصف الدرس هنا"
\`\`\`
`.trim()

    const { slides } = parseMarkdownLesson(md)
    expect(slides[0]).toEqual({
      kind: "divider",
      num: "١",
      eyebrow: "الدرس الأول",
      title: "عنوان الدرس",
      desc: "وصف الدرس هنا",
    })
  })

  test("parses a content slide with a paragraph and inline tones", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: content
eyebrow: "المد الطبيعي · ١"
title: "حروف المد الثلاثة"
\`\`\`
حروف المدّ ثلاثة، وهي [em]أصل[/em] كل مدٍّ في القرآن الكريم.
`.trim()

    const { slides } = parseMarkdownLesson(md)
    expect(slides[0]).toEqual({
      kind: "content",
      eyebrow: "المد الطبيعي · ١",
      title: "حروف المد الثلاثة",
      blocks: [
        {
          kind: "paragraph",
          text: [
            { text: "حروف المدّ ثلاثة، وهي " },
            { text: "أصل", tone: "em" },
            { text: " كل مدٍّ في القرآن الكريم." },
          ],
        },
      ],
    })
  })

  test("parses a heading and an alert (with admonition tone)", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: content
eyebrow: eyebrow
title: title
\`\`\`
### قسم فرعي

> [!WARNING]
> تنبيه هام
`.trim()

    const { slides } = parseMarkdownLesson(md)
    const slide = slides[0]
    expect(slide.kind).toBe("content")
    if (slide.kind !== "content") throw new Error("unreachable")
    expect(slide.blocks).toEqual([
      { kind: "heading", text: "قسم فرعي" },
      { kind: "alert", tone: "warning", text: [{ text: "تنبيه هام" }] },
    ])
  })

  test("parses a fenced grid:letters block", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: content
eyebrow: eyebrow
title: title
\`\`\`
\`\`\`grid:letters
- glyph: ا
  label: الألف
  hint: ساكنة، قبلها فتح
\`\`\`
`.trim()

    const { slides } = parseMarkdownLesson(md)
    const slide = slides[0]
    if (slide.kind !== "content") throw new Error("unreachable")
    expect(slide.blocks).toEqual([
      {
        kind: "grid",
        variant: "letters",
        items: [{ glyph: "ا", label: "الألف", hint: "ساكنة، قبلها فتح" }],
      },
    ])
  })

  test("parses a fenced grid:compare block with inline tones inside yaml strings", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: content
eyebrow: eyebrow
title: title
\`\`\`
\`\`\`grid:compare
- emphasis: default
  badge: واجب متصل
  title: المدّ الواجب المتصل
  desc: حرف المدّ والهمزة في نفس الكلمة
  example: "جَ[madd]ا[/madd][hamza]ءَ[/hamza]"
\`\`\`
`.trim()

    const { slides } = parseMarkdownLesson(md)
    const slide = slides[0]
    if (slide.kind !== "content") throw new Error("unreachable")
    expect(slide.blocks).toEqual([
      {
        kind: "grid",
        variant: "compare",
        items: [
          {
            emphasis: "default",
            badge: "واجب متصل",
            title: "المدّ الواجب المتصل",
            desc: [{ text: "حرف المدّ والهمزة في نفس الكلمة" }],
            example: [{ text: "جَ" }, { text: "ا", tone: "madd" }, { text: "ءَ", tone: "hamza" }],
          },
        ],
      },
    ])
  })

  test("parses a table slide with headers, rows, and a trailing note", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: table
eyebrow: "خلاصة"
title: "جدول المقارنة"
\`\`\`
| النوع | مقدار المد |
| --- | :---: |
| المد الطبيعي | حركتان |

> [!INFO]
> القاعدة الذهبية
`.trim()

    const { slides } = parseMarkdownLesson(md)
    expect(slides[0]).toEqual({
      kind: "table",
      eyebrow: "خلاصة",
      title: "جدول المقارنة",
      headers: [{ text: "النوع", align: undefined }, { text: "مقدار المد", align: "center" }],
      rows: [
        [
          { text: [{ text: "المد الطبيعي" }], align: undefined },
          { text: [{ text: "حركتان" }], align: "center" },
        ],
      ],
      note: { tone: "info", text: [{ text: "القاعدة الذهبية" }] },
    })
  })

  test("parses multiple slides separated by thematic breaks", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: cover
title: "العنوان"
\`\`\`

---

<!-- slide -->
\`\`\`yaml
kind: content
eyebrow: eyebrow
title: title
\`\`\`
نص
`.trim()

    const { slides } = parseMarkdownLesson(md)
    expect(slides).toHaveLength(2)
    expect(slides[0].kind).toBe("cover")
    expect(slides[1].kind).toBe("content")
  })

  test("throws MarkdownParseError on a slide missing `kind`", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
title: "no kind field"
\`\`\`
`.trim()
    expect(() => parseMarkdownLesson(md)).toThrow(MarkdownParseError)
  })

  test("throws MarkdownParseError on an unknown slide kind", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: bogus
\`\`\`
`.trim()
    expect(() => parseMarkdownLesson(md)).toThrow(MarkdownParseError)
  })

  test("throws MarkdownParseError on an unknown fenced block kind", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: content
eyebrow: eyebrow
title: title
\`\`\`
\`\`\`bogusBlock
foo: bar
\`\`\`
`.trim()
    expect(() => parseMarkdownLesson(md)).toThrow(MarkdownParseError)
  })

  test("throws MarkdownParseError when a content slide is missing eyebrow/title", () => {
    const md = `
${FRONTMATTER}

<!-- slide -->
\`\`\`yaml
kind: content
\`\`\`
just a paragraph, no eyebrow/title in the yaml fence
`.trim()
    expect(() => parseMarkdownLesson(md)).toThrow(MarkdownParseError)
  })
})
