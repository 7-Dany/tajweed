/**
 * LessonSource — where a lesson's slide content comes from.
 *
 * See refactor-issues/03-lesson-source.md, 05-migrate-remaining-decks.md, and
 * 07-markdown-parser.md.
 *
 * All lessons are now markdown-authored (the six static `.slides.ts` decks
 * and the `static-deck` source type they backed have been removed — every
 * lesson resolves via parseMarkdownLesson instead). This is the seam that
 * lets LessonPlayer / SlideDeck stay agnostic to where a lesson's markdown
 * came from (inline vs. resolved from separate .md files on disk).
 */

import type { Locale } from "@/translations/provider"
import type { Slide } from "@/domain/slides/schema"

import { parseMarkdownLesson } from "@/domain/slides/markdown-parser"

export type LessonSource =
  | { type: "markdown"; markdown: string }
  /** Same markdown-parsed content, but with locale-specific bodies resolved
   * ahead of time by the data layer (domain/courses.ts) from separate .md
   * files on disk (e.g. madd-rules.md + madd-rules.en.md). Falls back to
   * `ar` if the requested locale has no markdown of its own. */
  | { type: "markdown-i18n"; ar: string; en?: string }

/**
 * Resolves a LessonSource to renderable Slide[] data. Returns null if the
 * source can't be resolved, mirroring the old getDeck()'s null-fallback
 * contract used by LessonPlayer's "deck not found" screen.
 */
export function resolveLessonSlides(
  source: LessonSource,
  locale: Locale = "ar"
): Slide[] | null {
  switch (source.type) {
    case "markdown": {
      // parseMarkdownLesson also returns `meta` (lesson key + language read
      // from the file's own frontmatter) — not needed here since the caller
      // already supplies `locale` explicitly, but it's there for callers
      // (e.g. a DB-backed lesson picker) that need to know which lesson/
      // language a given markdown blob is before deciding to load it.
      const { slides } = parseMarkdownLesson(source.markdown)
      return slides
    }
    case "markdown-i18n": {
      const markdown = locale === "en" && source.en ? source.en : source.ar
      const { slides } = parseMarkdownLesson(markdown)
      return slides
    }
    default: {
      const _exhaustive: never = source
      return _exhaustive
    }
  }
}
