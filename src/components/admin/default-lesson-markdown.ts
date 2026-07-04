/**
 * Starting point dropped into the markdown editor for a brand-new lesson —
 * a minimal but valid document per the authoring convention documented at
 * the top of domain/slides/markdown-parser.ts (frontmatter fence, then
 * `---`-separated slides, each opening with its own yaml fence).
 */
export const DEFAULT_LESSON_MARKDOWN = `\`\`\`yaml
lesson: new-lesson
language: ar
\`\`\`

\`\`\`yaml
kind: cover
title: عنوان الدرس
subtitle: وصف مختصر للدرس
\`\`\`

---

\`\`\`yaml
kind: content
eyebrow: القسم الأول
title: عنوان الشريحة
\`\`\`

اكتب فقرة المحتوى هنا. يمكنك تمييز جزء من النص باستخدام [em]نص مميز[/em].
`

/** English counterpart, offered when adding an English version to an
 * existing (Arabic) lesson via the "+ Add English version" action in
 * LessonMarkdownEditor. */
export const DEFAULT_LESSON_MARKDOWN_EN = `\`\`\`yaml
lesson: new-lesson
language: en
\`\`\`

\`\`\`yaml
kind: cover
title: Lesson Title
subtitle: A short description of the lesson
\`\`\`

---

\`\`\`yaml
kind: content
eyebrow: Part One
title: Slide Title
\`\`\`

Write the slide content here. You can highlight part of the text using [em]emphasized text[/em].
`
