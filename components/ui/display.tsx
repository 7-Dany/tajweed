import { cn } from "@/lib/utils"

function DisplaySymbol({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="symbol-display"
      className={cn(
        "my-3 flex items-center gap-8 rounded-slide-lg border border-slide-primary-soft bg-slide-primary-tint p-8",
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
        "text-6xl leading-none font-bold text-slide-primary",
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
        "max-w-[40ch] text-lg leading-relaxed text-slide-fg-muted",
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
        "flex items-center justify-center gap-2.5 text-lg font-bold text-slide-fg before:h-5 before:w-1 before:rounded before:bg-slide-primary",
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
      className={cn("my-4 grid gap-3", className)}
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
      className={cn("my-1.5 mb-3 grid grid-cols-2 gap-4.5", className)}
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
        "mt-3 flex flex-wrap justify-center gap-3 border-t border-dashed border-slide-border-strong pt-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const dotColors: Record<string, string> = {
  haa: "bg-slide-letter-haa",
  khaa: "bg-slide-letter-khaa",
  madd: "bg-slide-madd",
  hamza: "bg-slide-hamza",
}

function DisplayLegendChip({
  color = "madd",
  children,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  color?: "haa" | "khaa" | "madd" | "hamza"
}) {
  return (
    <span
      data-slot="legend-chip"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-slide-border bg-slide-card px-3 py-1.5 text-sm text-slide-fg-muted shadow-slide-sm",
        className
      )}
      {...props}
    >
      <span className={cn("size-2.5 rounded-full", dotColors[color])} />
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
