"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  memo,
  Children,
  isValidElement,
} from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ─── Types ─── */

type Direction = "forward" | "backward" | null

type DeckState = {
  current: number
  direction: Direction
}

type DeckAction = { type: "go"; index: number; total: number }

/* ─── Deck Reducer ─── */

function deckReducer(state: DeckState, action: DeckAction): DeckState {
  const next = Math.max(0, Math.min(action.index, action.total - 1))
  if (next === state.current) return state
  return {
    current: next,
    direction: next > state.current ? "forward" : "backward",
  }
}

/* ─── Deck Context ─── */

interface SlideDeckContextValue {
  current: number
  total: number
  direction: Direction
  goTo: (index: number) => void
}

const SlideDeckContext = createContext<SlideDeckContextValue | null>(null)

function useSlideDeck() {
  const ctx = useContext(SlideDeckContext)
  if (!ctx) throw new Error("useSlideDeck must be used within SlideDeck")
  return ctx
}

/* ─── Slide Page Context ─── */

interface SlidePageContextValue {
  index: number
  total: number
}

const SlidePageContext = createContext<SlidePageContextValue | null>(null)

function useSlidePageContext() {
  const ctx = useContext(SlidePageContext)
  if (!ctx) throw new Error("useSlidePageContext must be used within SlidePage")
  return ctx
}

/* ─── Slide Page ─── */

function SlidePage({
  index,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { index: number }) {
  const { current, total, direction } = useSlideDeck()
  return (
    <SlidePageContext.Provider value={{ index, total }}>
      <section
        data-slot="slide-page"
        className={cn("page", className, {
          "is-active": index === current,
          "is-before": index < current,
          "is-after": index > current,
        })}
        aria-hidden={index !== current}
        tabIndex={index === current ? 0 : -1}
        data-direction={direction}
        {...props}
      >
        {children}
      </section>
    </SlidePageContext.Provider>
  )
}

/* ─── Deck ─── */

function SlideDeck({
  children,
  slideClasses = [],
}: {
  children: React.ReactNode
  slideClasses?: Array<string | undefined>
}) {
  const slides = useMemo(() => Children.toArray(children), [children])
  const total = slides.length

  const [{ current, direction }, dispatch] = useReducer(deckReducer, {
    current: 0,
    direction: null,
  })

  const goTo = useCallback(
    (index: number) => dispatch({ type: "go", index, total }),
    [total]
  )

  const contextValue = useMemo(
    () => ({ current, total, direction, goTo }),
    [current, total, direction, goTo]
  )

  useEffect(() => {
    document.body.classList.add("deck-enhanced")
    return () => document.body.classList.remove("deck-enhanced")
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
      ) {
        return
      }

      if (["ArrowLeft", "ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault()
        goTo(current + 1)
      } else if (["ArrowRight", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault()
        goTo(current - 1)
      } else if (event.key === "Home") {
        event.preventDefault()
        goTo(0)
      } else if (event.key === "End") {
        event.preventDefault()
        goTo(total - 1)
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [current, goTo, total])

  useEffect(() => {
    let pointerStart: { x: number; y: number } | null = null

    const onPointerDown = (event: PointerEvent) => {
      pointerStart = { x: event.clientX, y: event.clientY }
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!pointerStart) return
      const deltaX = event.clientX - pointerStart.x
      const deltaY = event.clientY - pointerStart.y
      pointerStart = null
      if (Math.abs(deltaX) < 46 || Math.abs(deltaX) < Math.abs(deltaY)) return
      goTo(current + (deltaX < 0 ? 1 : -1))
    }

    window.addEventListener("pointerdown", onPointerDown, { passive: true })
    window.addEventListener("pointerup", onPointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [current, goTo])

  return (
    <SlideDeckContext.Provider value={contextValue}>
      <div className="deck-viewport">
        {slides.map((child, i) =>
          isValidElement(child) ? (
            <SlidePage key={i} index={i} className={slideClasses[i]}>
              {child}
            </SlidePage>
          ) : (
            child
          )
        )}
      </div>
      <nav className="deck-controls" dir="ltr" aria-label="Slide controls">
        <Button
          className="deck-button"
          type="button"
          variant="outline"
          size="icon"
          data-slide-next
          aria-label="الشريحة التالية"
          title="الشريحة التالية"
          disabled={current === total - 1}
          onClick={() => goTo(current + 1)}
        >
          <IconChevronLeft data-icon="inline-start" />
        </Button>
        <span className="deck-status" data-slide-status>
          {current + 1} / {total}
        </span>
        <Button
          className="deck-button"
          type="button"
          variant="outline"
          size="icon"
          data-slide-prev
          aria-label="الشريحة السابقة"
          title="الشريحة السابقة"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
        >
          <IconChevronRight data-icon="inline-start" />
        </Button>
      </nav>
    </SlideDeckContext.Provider>
  )
}

/* ─── Slide sub-components (memo'd) ─── */

const SlideHeader = memo(function SlideHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="slide-header"
      className={cn("slide-header", className)}
      {...props}
    >
      {children}
    </header>
  )
})

const SlideHeaderLeft = memo(function SlideHeaderLeft({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="slide-header-left"
      className={cn("slide-header__left", className)}
      {...props}
    >
      {children}
    </div>
  )
})

const SlideBody = memo(function SlideBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="slide-body"
      className={cn("slide-body", className)}
      {...props}
    >
      {children}
    </div>
  )
})

const SlideNum = memo(function SlideNum({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="slide-num"
      className={cn("slide-num", className)}
      {...props}
    >
      {children}
    </div>
  )
})

const SlidePageno = memo(function SlidePageno({
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children">) {
  const { index, total } = useSlidePageContext()
  return (
    <span
      data-slot="slide-pageno"
      dir="ltr"
      className={cn("slide-pageno", className)}
      {...props}
    >
      {index + 1} / {total}
    </span>
  )
})

const SlideEyebrow = memo(function SlideEyebrow({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="slide-eyebrow"
      className={cn("slide-eyebrow", className)}
      {...props}
    >
      {children}
    </p>
  )
})

const SlideTitle = memo(function SlideTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="slide-title"
      className={cn("slide-title", className)}
      {...props}
    >
      {children}
    </h2>
  )
})

export {
  SlideDeck,
  SlidePage,
  useSlideDeck,
  SlideHeader,
  SlideHeaderLeft,
  SlideBody,
  SlideNum,
  SlidePageno,
  SlideEyebrow,
  SlideTitle,
}
