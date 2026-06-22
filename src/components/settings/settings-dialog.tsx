"use client"

import { useEffect, useState, type ReactNode } from "react"
import {
  IconCheck,
  IconLanguage,
  IconMoon,
  IconSettings,
  IconSun,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useI18n, useTranslations } from "@/lib/i18n"
import { useIsSmallScreen } from "@/hooks/use-is-small-screen"
import { LOCALES, LOCALE_META, type Locale } from "@/content/texts"

type SettingsTab = "language" | "theme"

export function SettingsDialog() {
  const { locale, setLocale, t } = useI18n()
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<SettingsTab>("language")
  const [mounted, setMounted] = useState(false)
  const isSmall = useIsSmallScreen()

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => setMounted(true), [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const isDark = mounted && resolvedTheme === "dark"

  const triggerButton = (
    <button
      aria-label={t("settings.title")}
      title={t("settings.title")}
      className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--slide-border-strong)] bg-[var(--slide-card)] text-[var(--slide-fg)] shadow-sm transition-all hover:bg-[var(--slide-primary)] hover:text-[var(--slide-primary-fg)] hover:border-[var(--slide-primary)] max-sm:size-8"
    >
      <IconSettings size={18} className="max-sm:hidden" />
      <IconSettings size={16} className="hidden max-sm:block" />
    </button>
  )

  /** Shared sidebar nav — horizontal on mobile, vertical on desktop. */
  const sidebar = (
    <nav className="flex shrink-0 flex-row gap-1 border-b border-[var(--slide-border)] p-2 sm:w-40 sm:flex-col sm:border-b-0 sm:border-e sm:p-3">
      <button
        onClick={() => setTab("language")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors sm:flex-none sm:justify-start ${
          tab === "language"
            ? "bg-[var(--slide-primary)] text-[var(--slide-primary-fg)]"
            : "text-[var(--slide-fg-muted)] hover:bg-[var(--slide-bg-subtle)]"
        }`}
      >
        <IconLanguage size={18} />
        <span className="hidden sm:inline">{t("settings.language")}</span>
      </button>
      <button
        onClick={() => setTab("theme")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors sm:flex-none sm:justify-start ${
          tab === "theme"
            ? "bg-[var(--slide-primary)] text-[var(--slide-primary-fg)]"
            : "text-[var(--slide-fg-muted)] hover:bg-[var(--slide-bg-subtle)]"
        }`}
      >
        {isDark ? <IconMoon size={18} /> : <IconSun size={18} />}
        <span className="hidden sm:inline">{t("settings.theme")}</span>
      </button>
    </nav>
  )

  /** Shared content area — language list or theme options. */
  const content = (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5">
      {tab === "language" && (
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 text-sm font-bold text-[var(--slide-fg-muted)]">
            {t("settings.chooseLanguage")}
          </h3>
          {LOCALES.map((loc: Locale) => {
            const meta = LOCALE_META[loc]
            const isActive = loc === locale
            return (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "border-[var(--slide-primary)] bg-[var(--slide-primary-tint)] text-[var(--slide-primary)]"
                    : "border-[var(--slide-border)] text-[var(--slide-fg)] hover:border-[var(--slide-primary-soft)] hover:bg-[var(--slide-bg-subtle)]"
                }`}
              >
                <span className="text-xl">{meta.flag}</span>
                <span className="flex-1 text-start">{meta.nativeName}</span>
                {isActive && <IconCheck size={18} />}
              </button>
            )
          })}
        </div>
      )}

      {tab === "theme" && (
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 text-sm font-bold text-[var(--slide-fg-muted)]">
            {t("settings.chooseTheme")}
          </h3>
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition-all ${
              !isDark
                ? "border-[var(--slide-primary)] bg-[var(--slide-primary-tint)] text-[var(--slide-primary)]"
                : "border-[var(--slide-border)] text-[var(--slide-fg)] hover:border-[var(--slide-primary-soft)] hover:bg-[var(--slide-bg-subtle)]"
            }`}
          >
            <IconSun size={20} />
            <span className="flex-1 text-start">{t("theme.light")}</span>
            {!isDark && <IconCheck size={18} />}
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition-all ${
              isDark
                ? "border-[var(--slide-primary)] bg-[var(--slide-primary-tint)] text-[var(--slide-primary)]"
                : "border-[var(--slide-border)] text-[var(--slide-fg)] hover:border-[var(--slide-primary-soft)] hover:bg-[var(--slide-bg-subtle)]"
            }`}
          >
            <IconMoon size={20} />
            <span className="flex-1 text-start">{t("theme.dark")}</span>
            {isDark && <IconCheck size={18} />}
          </button>
        </div>
      )}
    </div>
  )

  // ── Mobile: bottom Sheet (only rendered when isSmall) ──
  if (isSmall) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={triggerButton} />
        <SheetContent
          side="bottom"
          className="max-h-[85vh] gap-0 border-[var(--slide-border)] bg-[var(--slide-card)] p-0"
          aria-describedby={undefined}
        >
          <SheetHeader className="border-b border-[var(--slide-border)] p-4">
            <SheetTitle className="text-lg font-bold text-[var(--slide-fg)]">
              {t("settings.title")}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col overflow-hidden">
            {sidebar}
            {content}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // ── Desktop: centered Dialog ──
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerButton} />
      <DialogContent
        className="max-w-lg gap-0 overflow-hidden border-[var(--slide-border)] bg-[var(--slide-card)] p-0"
        aria-describedby={undefined}
      >
        <DialogHeader className="border-b border-[var(--slide-border)] p-5">
          <DialogTitle className="text-lg font-bold text-[var(--slide-fg)]">
            {t("settings.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex min-h-[280px]">
          {sidebar}
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
