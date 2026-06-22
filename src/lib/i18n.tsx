/**
 * Lightweight i18n — React context backed by src/content/texts.ts.
 *
 * All translatable strings live in src/content/texts.ts. This module
 * provides the React context, the useI18n/useTranslations hooks, and a
 * translateContent() helper for DB-backed content (courses/chapters/lessons).
 *
 * Usage:
 *   const t = useTranslations()         // UI strings: t("catalog.title")
 *   const { locale } = useI18n()        // current locale
 *   translateContent(slug, locale, fallback)  // DB content by slug
 */

"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import {
  LOCALE_DIR,
  UI_TEXT,
  translateContent as doTranslate,
  type Locale,
} from "@/content/texts"

const STORAGE_KEY = "tajweed-locale"

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  /** Translate DB content (course/chapter/lesson) by slug. */
  tc: (
    slug: string,
    fallbackTitle: string,
    fallbackDescription?: string | null
  ) => { title: string; description: string }
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default to "ar" on both server and client first render (hydration-safe).
  const [locale, setLocaleState] = useState<Locale>("ar")

  // Read stored preference after mount. This setState in an effect is
  // intentional — it syncs the persisted locale into React after hydration,
  // matching the server's default ("ar") on first render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored && stored in LOCALE_DIR) {
        setLocaleState(stored)
      }
    } catch {
      /* ignore */
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Keep <html lang/dir> in sync with the active locale.
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = LOCALE_DIR[locale]
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback(
    (key: string) => UI_TEXT[locale]?.[key] ?? UI_TEXT.ar[key] ?? key,
    [locale]
  )

  const tc = useCallback(
    (
      slug: string,
      fallbackTitle: string,
      fallbackDescription?: string | null
    ) => doTranslate(slug, locale, fallbackTitle, fallbackDescription),
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tc }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

/** Convenience hook that returns just the `t` function for UI strings. */
export function useTranslations() {
  return useI18n().t
}

/** Convenience hook that returns just the `tc` function for DB content. */
export function useContent() {
  return useI18n().tc
}

/** Re-export for components that need the type or metadata. */
export type { Locale } from "@/content/texts"
export { LOCALE_DIR, LOCALE_META, LOCALES } from "@/content/texts"
