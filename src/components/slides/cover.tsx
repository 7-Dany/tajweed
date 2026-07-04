import { cn } from "@/lib/utils"
import type { LegendTone } from "@/domain/slides/schema"

function CoverFrame({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cover-frame"
      className={cn("cover__frame", className)}
      {...props}
    />
  )
}

function CoverEyebrow({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="cover-eyebrow"
      className={cn("cover__eyebrow", className)}
      {...props}
    >
      {children}
    </span>
  )
}

function CoverTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="cover-title"
      className={cn("cover__title", className)}
      {...props}
    >
      {children}
    </h1>
  )
}

function CoverRule({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cover-rule"
      className={cn("cover__rule", className)}
      {...props}
    />
  )
}

function CoverSubtitle({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="cover-subtitle"
      className={cn("cover__subtitle", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function CoverMeta({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cover-meta"
      className={cn("cover__meta", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/** Big accent-colored number (matches the divider slide style). */
function CoverNum({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cover-num"
      className={cn("cover__num", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CoverChip({
  color = "primary",
  children,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  color?: LegendTone | "primary"
}) {
  return (
    <span
      data-slot="cover-chip"
      className={cn("cover__chip", className)}
      {...props}
    >
      <span className={cn("cover__chip-dot", `cover__chip-dot--${color}`)} />
      {children}
    </span>
  )
}

export { CoverFrame, CoverEyebrow, CoverTitle, CoverRule, CoverSubtitle, CoverMeta, CoverChip, CoverNum }
