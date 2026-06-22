/**
 * Deck registry — maps a lesson's `contentKey` (stored in the database)
 * to its slide deck (defined in TypeScript), per locale.
 *
 * To add a new lesson's content:
 *   1. Create deck files in this folder (e.g. `my-deck.ar.tsx`, `my-deck.en.tsx`)
 *   2. Export a `readonly SlideDefinition[]` array from each
 *   3. Register them here under a unique key for each locale
 *   4. Create the corresponding Lesson row in the DB with that contentKey
 *
 * If a locale-specific deck is missing, the Arabic deck is used as fallback
 * (since the Quranic content is inherently Arabic).
 */

import type { SlideDefinition } from "@/components/slides/helpers"
import type { Locale } from "@/lib/i18n"

import { MADDS_SLIDES_AR } from "./madd-rules"
import { MADDS_SLIDES_EN } from "./madd-rules.en"
import { LETTER_PRACTICE_SLIDES_AR } from "./letter-practice"
import { LETTER_PRACTICE_SLIDES_EN } from "./letter-practice.en"
import { NUN_SAKINAH_SLIDES_AR } from "./nun-sakinah"
import { NUN_SAKINAH_SLIDES_EN } from "./nun-sakinah.en"

type DeckMap = Record<string, readonly SlideDefinition[]>

/** Arabic decks (default / fallback). */
const DECKS_AR: DeckMap = {
  "madd-rules": MADDS_SLIDES_AR,
  "letter-practice": LETTER_PRACTICE_SLIDES_AR,
  "nun-sakinah": NUN_SAKINAH_SLIDES_AR,
}

/** English decks. */
const DECKS_EN: DeckMap = {
  "madd-rules": MADDS_SLIDES_EN,
  "letter-practice": LETTER_PRACTICE_SLIDES_EN,
  "nun-sakinah": NUN_SAKINAH_SLIDES_EN,
}

const DECKS_BY_LOCALE: Record<Locale, DeckMap> = {
  ar: DECKS_AR,
  en: DECKS_EN,
}

/**
 * Returns the slide deck for a given contentKey + locale.
 * Falls back to Arabic if the locale or deck is not found.
 */
export function getDeck(
  contentKey: string,
  locale: Locale = "ar"
): readonly SlideDefinition[] | null {
  return (
    DECKS_BY_LOCALE[locale]?.[contentKey] ??
    DECKS_AR[contentKey] ??
    null
  )
}
