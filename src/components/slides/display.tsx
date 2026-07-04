import { cn } from "@/lib/utils"
import type { LegendTone } from "@/domain/slides/schema"

function DisplaySymbol({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="symbol-display"
      className={cn(
        "my-2 flex items-center gap-4 rounded-slide-lg border border-slide-primary-soft bg-slide-primary-tint p-4 @sm/slide:my-3 @sm/slide:gap-8 @sm/slide:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DisplaySymbolGlyph({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="symbol-display-glyph"
      className={cn(
        "text-4xl leading-none font-bold text-slide-primary @sm/slide:text-6xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DisplaySymbolCaption({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="symbol-display-caption"
      className={cn(
        "max-w-[40ch] text-sm leading-relaxed text-slide-fg-muted @sm/slide:text-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DisplayMiniHeading({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="mini-heading"
      className={cn(
        "flex items-center justify-center gap-2 text-base font-bold text-slide-fg before:h-4 before:w-1 before:rounded before:bg-slide-primary @sm/slide:gap-2.5 @sm/slide:text-lg @sm/slide:before:h-5",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function DisplayConditions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="conditions"
      className={cn("my-3 grid gap-2.5 @sm/slide:my-4 @sm/slide:gap-3", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DisplayCausesRow({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="causes-row"
      className={cn("my-1 mb-2.5 grid grid-cols-2 gap-3 @sm/slide:my-1.5 @sm/slide:mb-3 @sm/slide:gap-4.5", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DisplayLegendRow({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="legend-row"
      className={cn(
        "mt-2.5 flex flex-wrap justify-center gap-2 border-t border-dashed border-slide-border-strong pt-2.5 @sm/slide:mt-3 @sm/slide:gap-3 @sm/slide:pt-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Typed against LegendTone so a new tone added to the schema fails to
 * compile here instead of silently rendering an uncolored dot — Tailwind's
 * scanner needs these class names to appear as literal text, so (unlike
 * CoverChip's hand-written CSS classes) this can't be built dynamically. */
const dotColors: Record<LegendTone, string> = {
  haa: "bg-slide-haa",
  khaa: "bg-slide-khaa",
  madd: "bg-slide-madd",
  hamza: "bg-slide-hamza",
}

function DisplayLegendChip({
  color = "madd",
  children,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  color?: LegendTone
}) {
  return (
    <span
      data-slot="legend-chip"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-slide-border bg-slide-card px-2.5 py-1 text-xs text-slide-fg-muted shadow-slide-sm @sm/slide:gap-2 @sm/slide:px-3 @sm/slide:py-1.5 @sm/slide:text-sm",
        className
      )}
      {...props}
    >
      <span className={cn("size-2 rounded-full @sm/slide:size-2.5", dotColors[color])} />
      {children}
    </span>
  )
}

export {
  DisplaySymbol,
  DisplaySymbolGlyph,
  DisplaySymbolCaption,
  DisplayMiniHeading,
  DisplayConditions,
  DisplayCausesRow,
  DisplayLegendRow,
  DisplayLegendChip,
}
