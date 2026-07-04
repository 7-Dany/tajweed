"use client"

/**
 * Renders a Slide[] (domain/slides/schema.ts) — same <SlideRenderer/> used
 * by the real player (components/course/lesson-player.tsx), but without
 * <SlideDeck/>'s global keyboard/pointer listeners (which would hijack the
 * whole admin page).
 *
 * Unlike a scaled-down thumbnail, the slide is rendered at its real size
 * (100% of the frame) inside a `@container` context. The mobile-layout
 * rules in globals.css are written as a `@container (max-width: 640px)`
 * query rather than a viewport media query, so shrinking *this panel*
 * (e.g. by dragging the resizable split, same as shrinking a browser
 * window on the live site) genuinely reflows the slide into its mobile
 * layout — not a shrunk miniature of the desktop one. This mirrors how
 * shadcn's block preview works, minus the iframe.
 */

import { useEffect, useRef, useState } from "react"
import { IconChevronLeft, IconChevronRight, IconDeviceDesktop, IconDeviceMobile } from "@tabler/icons-react"

import type { Slide } from "@/domain/slides/schema"
import { SlideRenderer, slideToClassName } from "@/components/slides/slide-renderer"
import { SlidePageContext } from "@/components/slides/slide"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Matches the `@container (max-width: 640px)` breakpoint in globals.css. */
const MOBILE_BREAKPOINT = 640

/**
 * Prev/counter/next controls for the slide preview, split out from the
 * stage itself so callers can place it wherever they like (e.g. inline in
 * a panel header next to the "معاينة" label) instead of below the slide.
 */
export function SlidePreviewNav({
  activeSlide,
  slideCount,
  onActiveSlideChange,
}: {
  activeSlide: number
  slideCount: number
  onActiveSlideChange: (index: number) => void
}) {
  if (slideCount === 0) return null
  const current = Math.min(activeSlide, slideCount - 1)

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={current === 0}
        onClick={() => onActiveSlideChange(current - 1)}
        aria-label="الشريحة السابقة"
      >
        <IconChevronRight />
      </Button>
      <span className="text-xs tabular-nums text-muted-foreground">
        {current + 1} / {slideCount}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={current === slideCount - 1}
        onClick={() => onActiveSlideChange(current + 1)}
        aria-label="الشريحة التالية"
      >
        <IconChevronLeft />
      </Button>
    </div>
  )
}

export function SlidePreviewStage({
  slides,
  activeSlide,
}: {
  slides: Slide[]
  activeSlide: number
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(Math.round(w))
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const isMobile = width !== null && width <= MOBILE_BREAKPOINT

  if (slides.length === 0) {
    return (
      <div ref={frameRef} className="grid h-full w-full place-items-center bg-slide-bg text-sm text-muted-foreground">
        لا توجد شرائح بعد
      </div>
    )
  }

  const current = Math.min(activeSlide, slides.length - 1)
  const slide = slides[current]

  return (
    <div ref={frameRef} className="@container/slide relative h-full w-full overflow-hidden bg-slide-bg">
      {/* Inline styles here intentionally win over the global .page rules
          in globals.css (width: 100dvw/100dvh from the base rule) — inside
          this frame the slide should fill the frame exactly, not the real
          viewport. Everything else (fonts, spacing, the mobile @container
          query) is the same CSS the live site uses, so this is a genuine
          render at real size, not a scaled miniature. */}
      <section
        className={cn("page", slideToClassName(slide))}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <SlidePageContext.Provider value={{ index: current, total: slides.length }}>
          <SlideRenderer slide={slide} />
        </SlidePageContext.Provider>
      </section>

      {width !== null && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-slide-border bg-slide-card/90 px-2.5 py-1 text-[10px] font-medium text-slide-fg-muted shadow-slide-sm backdrop-blur-sm">
          {isMobile ? <IconDeviceMobile size={12} /> : <IconDeviceDesktop size={12} />}
          <span dir="ltr" className="tabular-nums">{width}px</span>
        </div>
      )}
    </div>
  )
}
