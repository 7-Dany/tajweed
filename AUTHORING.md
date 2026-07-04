# Authoring Lesson Slides (.md)

Each lesson is a plain Markdown file parsed into a deck of slides. Files live in
`src/content/lessons/` and are linked to courses via the `contentKey` set in the
admin panel.

File naming:

| File | Purpose |
|---|---|
| `my-lesson.md` | Arabic lesson |
| `my-lesson.en.md` | English translation (optional) |

The stem (`my-lesson`) must match `contentKey` in the admin.

---

## Frontmatter

Every file **must** start with a YAML fence:

````yaml
```yaml
lesson: my-lesson
language: ar            # "ar" or "en"
title: "عنوان الدرس"    # shown in admin (optional)
```
````

---

## Slide structure

Slides are separated by `---` (thematic break). Each slide opens with its own
YAML fence declaring `kind` and kind-specific fields.

````markdown
<!-- slide -->         ← optional visual anchor
```yaml
kind: cover
eyebrow: "..."
title: "..."
```

---
<!-- slide -->
```yaml
kind: content
eyebrow: "..."
title: "..."
```
Body paragraphs, blocks, etc.
---
````

---

## Slide kinds

### Cover

Opening or closing slide.

```yaml
kind: cover
variant: opening      # or "closing" (hides eyebrow/chips)
eyebrow: "علم التجويد"
eyebrowIcon: book     # optional
title: "العنوان الرئيسي"
subtitle: "نص فرعي"   # optional
chips:                # optional
  - { tone: primary, label: "وسم ١" }
  - { tone: madd, label: "وسم ٢" }
meta: "١/١"           # optional
```

### Divider

Section divider with large numeral.

```yaml
kind: divider
num: "١"              # Arabic or Latin
eyebrow: "الدرس"
title: "عنوان القسم"
desc: "وصف القسم"
```

### Content

Workhorse slide — header (eyebrow + title) plus body blocks.

```yaml
kind: content
eyebrow: "القسم"
title: "عنوان الشريحة"
```

Body blocks follow in Markdown (see below).

### Table

```yaml
kind: table
eyebrow: "خلاصة"
title: "جدول المقارنة"
```

Standard GFM table after the YAML fence. Use `{slide}` / `{accent}` inside
cells for badge chips.

```markdown
| النوع | السبب | مقدار المد |
| --- | --- | :---: |
| المد الطبيعي | لا همزة ولا سكون | {slide} حركتان |
| المد الواجب المتصل | همزة بعد حرف المد | {accent} ٤ حركات |
```

Optional trailing note:

```markdown
> [!INFO]
> ملاحظة ختامية.
```

---

## Content blocks

Blocks appear in the body of a `content` slide, below the YAML fence.

### Paragraph

Free text. Supports inline tones.

```markdown
هذا [em]نص[/em] مع [madd]تلوين[/madd].
```

### Heading

```markdown
### عنوان فرعي
```

### Alert / Callout

```markdown
> [!INFO]
> نص التوجيه.

> [!WARNING]
> نص التحذير.
```

### Grid — card layout

Seven variants. Items are YAML lists directly inside the fence (no extra
`kind:` key — the fence language determines the variant).

| Fence language | Per-item fields |
|---|---|
| ```` ```grid:letters ```` | `glyph`, `label`, `hint` |
| ```` ```grid:examples ```` | Plain strings (each is one example) |
| ```` ```grid:examples-single ```` | Plain strings, single column |
| ```` ```grid:words ```` | Plain strings (word list) |
| ```` ```grid:compare ```` | `emphasis`, `badge`, `title`, `desc`, `example` |
| ```` ```grid:causes ```` | `glyph`, `label` |
| ```` ```grid:pairs ```` | `title`, `desc`, `example` |

````yaml
```grid:letters
- glyph: ا
  label: الألف
  hint: ساكنة، قبلها فتح
- glyph: و
  label: الواو
  hint: ساكنة، قبلها ضم
```
````

````yaml
```grid:examples
- "أَنْ[hamza]بَ[/hamza]اءَ"
- "مِنْ[hamza]بَ[/hamza]عْد"
```
````

````yaml
```grid:compare
- emphasis: default
  badge: "واجب متصل"
  title: "المدّ الواجب المتصل"
  desc: "حرف المدّ والهمزة في نفس الكلمة."
  example: "جَ‍[madd]‍ا[/madd][hamza]ءَ[/hamza]"
- emphasis: accent
  badge: "جائز منفصل"
  title: "المدّ الجائز المنفصل"
  desc: "حرف المدّ في كلمة، والهمزة في التي تليها."
  example: "يَ‍[madd]‍ا[/madd] [hamza]أَ[/hamza]يُّهَا"
```
````

````yaml
```grid:words
- "بَ‍[haa]‍حـ[/haa]َثَ"
- "خَـبَـأَ"
- "[khaa]خـ[/khaa]َرَجَ"
```
````

### List

| Fence language | Per-item fields |
|---|---|
| ```` ```list:conditions ```` | `glyph`, `desc` |
| ```` ```list:overview ```` | `title`, `meta`, `desc` |

````yaml
```list:overview
- title: "الإظهار"
  meta: "٦ حروف"
  desc: "حروف الحلق"
- title: "الإدغام"
  meta: "٦ حروف"
  desc: "ينقسم: بغنة وبدون غنة"
```
````

### Legend

Colour chips explaining which tones are used in the examples.

````yaml
```legend
- { tone: madd, label: "حرف المد" }
- { tone: hamza, label: "الهمزة" }
```
````

Valid tones: `madd`, `hamza`, `haa`, `khaa` (the four Tajweed letter colours).

### Symbol

Large centered glyph with caption.

````yaml
```symbol
glyph: "ٓ"
caption: "علامة المدّ في المصحف الشريف."
```
````

---

## Inline tones

Colourised spans inside running text, grids, lists, tables, and alerts.

| Tag | Colour | Meaning |
|---|---|---|
| `[em]...[/em]` | — | emphasis / plain |
| `[madd]...[/madd]` | blue | حرف المد |
| `[hamza]...[/hamza]` | green | الهمزة |
| `[haa]...[/haa]` | purple | الحاء |
| `[khaa]...[/khaa]` | orange | الخاء |

```markdown
قَ‍[madd]‍ا[/madd]لَ            ← madd coloured blue
أَنْ[hamza]بَ[/hamza]اءَ       ← hamza coloured green
```

---

## Complete template

````markdown
```yaml
lesson: my-lesson
language: ar
title: "عنوان الدرس"
```

<!-- slide -->
```yaml
kind: cover
eyebrow: "علم التجويد"
eyebrowIcon: book
title: "عنوان الدرس"
subtitle: "وصف مختصر"
chips:
  - { tone: primary, label: "وسم" }
```

---
<!-- slide -->
```yaml
kind: content
eyebrow: "القسم"
title: "عنوان الشريحة"
```
نص الفقرة مع [madd]تلوين[/madd].

```grid:examples-single
- "مِثَ‍[madd]‍ا[/madd]ل"
- "مِثَ‍[madd]‍ا[/madd]ل"
```

```legend
- { tone: madd, label: "حرف المد" }
```
````

For English, set `language: en` and write body text in English. Slide structure
and YAML fields stay the same.
