"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { parseMarkdownLesson } from "@/domain/slides/markdown-parser"
import type { Slide } from "@/domain/slides/schema"
import { SlidePreviewNav, SlidePreviewStage } from "@/components/admin/slide-preview-stage"
import { DEFAULT_LESSON_MARKDOWN_EN } from "@/components/admin/default-lesson-markdown"
import { cn } from "@/lib/utils"

const PARSE_DEBOUNCE_MS = 350

type Lang = "ar" | "en"

export function LessonMarkdownEditor({
  arValue,
  enValue,
  onArChange,
  onEnChange,
  onValidityChange,
  actions,
}: {
  arValue: string
  enValue?: string
  onArChange: (value: string) => void
  onEnChange?: (value: string) => void
  onValidityChange?: (valid: boolean) => void
  actions?: React.ReactNode
}) {
  const hasEn = enValue !== undefined && onEnChange !== undefined
  /** English isn't there yet, but the capability to add it is (the parent
   * gave us an onEnChange setter) — show "+ Add English version" instead of
   * hiding the feature entirely just because no English content exists yet. */
  const canAddEn = !hasEn && onEnChange !== undefined
  const [lang, setLang] = useState<Lang>("ar")
  const currentValue = lang === "ar" ? arValue : (enValue ?? "")

  const handleAddEn = () => {
    onEnChange?.(DEFAULT_LESSON_MARKDOWN_EN)
    setLang("en")
  }

  const [slides, setSlides] = useState<Slide[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const lastToastedError = useRef<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const parsed = parseMarkdownLesson(currentValue)
        setSlides(parsed.slides)
        setError(null)
        onValidityChange?.(true)
        lastToastedError.current = null
        setActiveSlide((i) => Math.min(i, Math.max(parsed.slides.length - 1, 0)))
      } catch (err) {
        const message = err instanceof Error ? err.message : "تعذّر تحليل نص Markdown"
        setError(message)
        onValidityChange?.(false)
        if (lastToastedError.current !== message) {
          toast.error("خطأ في تحليل Markdown", { description: message })
          lastToastedError.current = message
        }
      }
    }, PARSE_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [currentValue, onValidityChange])

  const handleEditorChange = (newValue: string) => {
    if (lang === "ar") {
      onArChange(newValue)
    } else {
      onEnChange?.(newValue)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-2 min-h-0">
      {(actions || hasEn || canAddEn) && (
      <div className="flex items-center justify-between">
        {actions && <div className="flex items-center gap-2">{actions}</div>}
        {hasEn && (
        <div className="flex gap-1 rounded-lg bg-muted p-1 self-start">
          <button
            type="button"
            onClick={() => setLang("ar")}
            className={cn(
              "rounded-md px-3 py-1 text-sm transition-colors",
              lang === "ar" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            )}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "rounded-md px-3 py-1 text-sm transition-colors",
              lang === "en" ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            )}
          >
            English
          </button>
        </div>
      )}
        {canAddEn && (
          <Button type="button" variant="outline" size="sm" onClick={handleAddEn}>
            + إضافة نسخة إنجليزية
          </Button>
        )}
      </div>
      )}
      <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1 rounded-2xl border">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
              <span className="text-sm font-medium">Markdown</span>
              <span className="text-xs text-muted-foreground">{lang === "ar" ? "عربي" : "English"}</span>
            </div>
            <Textarea
              value={currentValue}
              onChange={(e) => handleEditorChange(e.target.value)}
              className="h-full min-h-0 flex-1 resize-none overflow-auto rounded-none border-0 font-mono text-xs leading-relaxed focus-visible:ring-0"
              dir="ltr"
              spellCheck={false}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
              <span className="text-sm font-medium">معاينة</span>
              {!error && (
                <SlidePreviewNav
                  activeSlide={activeSlide}
                  slideCount={slides.length}
                  onActiveSlideChange={setActiveSlide}
                />
              )}
            </div>
            <div className="min-h-0 flex-1">
              {error ? (
                <div className="h-full overflow-auto p-3">
                  <Alert variant="destructive">
                    <AlertTitle>تعذّر تحليل نص Markdown</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
                  </Alert>
                </div>
              ) : (
                <SlidePreviewStage slides={slides} activeSlide={activeSlide} />
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
