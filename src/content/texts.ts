/**
 * ═══════════════════════════════════════════════════════════════
 *  ALL TRANSLATABLE TEXT IN ONE PLACE
 * ═══════════════════════════════════════════════════════════════
 *
 * This file contains every user-visible string in the app, grouped by
 * section. To translate the app to a new language, add a new locale
 * object below (e.g. `fr`) and fill in the keys.
 *
 * Two kinds of text live here:
 *   1. UI_TEXT — chrome strings (buttons, labels, headings)
 *   2. CONTENT — DB-backed text (course/chapter/lesson titles & descriptions),
 *      keyed by their slug so the catalog/browser can look them up per locale.
 *
 * Supported locales: "ar" (Arabic, RTL — default) and "en" (English, LTR).
 * To add a new language: add it to `Locale`, `LOCALE_DIR`, `LOCALE_META`,
 * and add a `ui` + `content` object for it below.
 */

export type Locale = "ar" | "en"

/** Text direction per locale. */
export const LOCALE_DIR: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
}

/** Metadata for the language dropdown. */
export const LOCALE_META: Record<
  Locale,
  { label: string; nativeName: string; flag: string }
> = {
  ar: { label: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  en: { label: "English", nativeName: "English", flag: "🇬🇧" },
}

/** Ordered list of locales for the dropdown. */
export const LOCALES: Locale[] = ["ar", "en"]

/* ───────────────────────── 1. UI TEXT ───────────────────────── */

export type UiText = Record<string, string>

export const UI_TEXT: Record<Locale, UiText> = {
  ar: {
    // Catalog
    "catalog.badge": "منصة التجويد",
    "catalog.title": "اختر دورتك",
    "catalog.subtitle": "دوراتٌ تعليمية في أحكام التجويد، اختر دورةً للبدء.",
    "catalog.empty": "لا توجد دورات متاحة بعد.",
    "catalog.loading": "جارٍ تحميل الدورة...",
    "catalog.chapters": "فصول",
    "catalog.lessons": "دروس",
    "catalog.teacher": "المعلّم",

    // Course browser
    "browser.backToCatalog": "كل الدورات",
    "browser.badge": "دورة تعليمية",
    "browser.progress": "التقدّم في الدورة",
    "browser.empty": "لا توجد دروس في هذا الفصل بعد.",

    // Lesson player
    "player.backToCourse": "العودة إلى الدورة",
    "player.next": "الشريحة التالية",
    "player.prev": "الشريحة السابقة",
    "player.deckNotFound": "محتوى الدرس غير متاح",
    "player.back": "العودة إلى الدورة",

    // Empty courses
    "empty.title": "لا توجد دورات متاحة بعد.",
    "empty.hint": "شغّل bun run db:seed لإنشاء بيانات تجريبية.",

    // Theme
    "theme.toggle": "تبديل المظهر",
    "theme.light": "فاتح",
    "theme.dark": "داكن",

    // Language
    "lang.label": "اللغة",

    // Settings
    "settings.title": "الإعدادات",
    "settings.language": "اللغة",
    "settings.theme": "المظهر",
    "settings.chooseLanguage": "اختر اللغة",
    "settings.chooseTheme": "اختر المظهر",
  },

  en: {
    // Catalog
    "catalog.badge": "Tajweed Platform",
    "catalog.title": "Choose Your Course",
    "catalog.subtitle":
      "Educational courses on Tajweed rules. Pick a course to begin.",
    "catalog.empty": "No courses available yet.",
    "catalog.loading": "Loading course...",
    "catalog.chapters": "chapters",
    "catalog.lessons": "lessons",
    "catalog.teacher": "Teacher",

    // Course browser
    "browser.backToCatalog": "All Courses",
    "browser.badge": "Course",
    "browser.progress": "Course progress",
    "browser.empty": "No lessons in this chapter yet.",

    // Lesson player
    "player.backToCourse": "Back to course",
    "player.next": "Next slide",
    "player.prev": "Previous slide",
    "player.deckNotFound": "Lesson content unavailable",
    "player.back": "Back to course",

    // Empty courses
    "empty.title": "No courses available yet.",
    "empty.hint": "Run bun run db:seed to create sample data.",

    // Theme
    "theme.toggle": "Toggle theme",
    "theme.light": "Light",
    "theme.dark": "Dark",

    // Language
    "lang.label": "Language",

    // Settings
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.chooseLanguage": "Choose language",
    "settings.chooseTheme": "Choose theme",
  },
}

/* ─────────────────── 2. DB CONTENT (by slug) ─────────────────── */
/*
 * The database stores one title/description per course/chapter/lesson.
 * To show them in multiple languages without changing the schema, we map
 * each slug → { title, description } per locale here.
 *
 * If a slug isn't found for the current locale, the DB value (Arabic)
 * is used as fallback.
 */

type ContentEntry = { title: string; description: string }
type ContentMap = Record<string, ContentEntry>

export const CONTENT: Record<Locale, ContentMap> = {
  ar: {
    // Courses
    "tajweed-rules": {
      title: "أحكام التجويد",
      description:
        "دورة تعليمية في أحكام التجويد: المدود الطبيعية والفرعية، وتمارين نطق الحروف المتقاربة.",
    },
    "nun-sakinah-rules": {
      title: "أحكام النون الساكنة والتنوين",
      description:
        "دراسة الأحكام الأربعة للنون الساكنة والتنوين: الإظهار والإدغام والإقلاب والإخفاء.",
    },

    // Chapters (keyed by their Arabic title — matches the DB value)
    "المدود في التجويد": {
      title: "المدود في التجويد",
      description: "",
    },
    "تمارين نطق الحروف": {
      title: "تمارين نطق الحروف",
      description: "",
    },
    "الأحكام الأربعة": {
      title: "الأحكام الأربعة",
      description: "",
    },

    // Lessons (keyed by slug)
    "madd-rules": {
      title: "أحكام المد الطبيعي والفرعي",
      description:
        "حروف المدّ الثلاثة، شروطها، المدّ الطبيعي والفرعي بسبب الهمزة، مع أمثلة قرآنية مُلوَّنة.",
    },
    "letter-practice": {
      title: "تمييز الحاء والخاء",
      description:
        "كلماتٌ ذات معنى وكلماتٌ تدريبية لتمييز مخرجَي الحاء والخاء المتقاربَين.",
    },
    "nun-sakinah-overview": {
      title: "نظرة عامة على الأحكام",
      description:
        "تعريف بأحكام النون الساكنة والتنوين الأربعة مع أمثلة قرآنية مُلوَّنة.",
    },

    // Teacher name (keyed by "teacher")
    "teacher": {
      title: "الشيخ تنين",
      description: "",
    },
  },

  en: {
    // Courses
    "tajweed-rules": {
      title: "Tajweed Rules",
      description:
        "A course on Tajweed rules: natural and secondary madd (elongation), and pronunciation exercises for close articulation points.",
    },
    "nun-sakinah-rules": {
      title: "Rules of Silent Noon & Tanween",
      description:
        "Studying the four rules of the silent noon (نْ) and tanween: Izhār, Idghām, Iqlāb, and Ikhfā'.",
    },

    // Chapters
    "المدود في التجويد": {
      title: "Madd (Elongation) in Tajweed",
      description: "",
    },
    "تمارين نطق الحروف": {
      title: "Letter Pronunciation Exercises",
      description: "",
    },
    "الأحكام الأربعة": {
      title: "The Four Rules",
      description: "",
    },

    // Lessons
    "madd-rules": {
      title: "Natural and Secondary Madd Rules",
      description:
        "The three madd letters, their conditions, natural and hamza-caused secondary madd, with colored Quranic examples.",
    },
    "letter-practice": {
      title: "Distinguishing Haa (ح) and Khaa (خ)",
      description:
        "Meaningful words and practice exercises to distinguish the close articulation points of Haa and Khaa.",
    },
    "nun-sakinah-overview": {
      title: "Overview of the Rules",
      description:
        "An introduction to the four rules of silent noon and tanween with colored Quranic examples.",
    },

    // Teacher name (keyed by "teacher")
    "teacher": {
      title: "Sheikh Dragon",
      description: "",
    },
  },
}

/**
 * Look up a translated content entry by slug + locale.
 * Falls back to the Arabic entry, then to the fallback string.
 */
export function translateContent(
  slug: string,
  locale: Locale,
  fallbackTitle: string,
  fallbackDescription?: string | null
): { title: string; description: string } {
  const entry = CONTENT[locale]?.[slug]
  if (entry) {
    return {
      title: entry.title || fallbackTitle,
      description: entry.description ?? fallbackDescription ?? "",
    }
  }
  // Fallback to Arabic content, then to the DB value
  const arEntry = CONTENT.ar[slug]
  return {
    title: arEntry?.title || fallbackTitle,
    description: arEntry?.description ?? fallbackDescription ?? "",
  }
}
