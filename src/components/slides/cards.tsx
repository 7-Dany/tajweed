import { cva, type VariantProps } from "class-variance-authority"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

function LetterCard({
  glyph,
  label,
  hint,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  glyph: string
  label: string
  hint?: string
}) {
  return (
    <Card
      data-slot="letter-card"
      className={cn(
        "gap-0 rounded-slide-lg border-slide-border bg-slide-card p-4 text-center shadow-slide-sm @sm/slide:p-7",
        className
      )}
      {...props}
    >
      <CardHeader className="gap-0 p-0">
        <CardTitle className="mb-2 text-4xl leading-none font-bold text-slide-primary @sm/slide:mb-3 @sm/slide:text-5xl">
          {glyph}
        </CardTitle>
        <CardDescription className="mb-1 text-base font-bold text-slide-fg @sm/slide:text-lg">
          {label}
        </CardDescription>
      </CardHeader>
      {hint && (
        <CardContent className="p-0 text-xs text-slide-fg-subtle @sm/slide:text-sm">
          {hint}
        </CardContent>
      )}
    </Card>
  )
}

function CardCondition({
  glyph,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  glyph: string
}) {
  return (
    <Card
      data-slot="condition"
      className={cn(
        "flex-col items-stretch gap-1.5 rounded-slide border-slide-border bg-slide-card p-3 shadow-slide-sm @sm/slide:flex-row @sm/slide:items-center @sm/slide:gap-4.5 @sm/slide:p-4",
        className
      )}
      {...props}
    >
      <CardTitle className="text-center text-3xl font-bold text-slide-primary @sm/slide:w-14 @sm/slide:shrink-0 @sm/slide:text-4xl">
        {glyph}
      </CardTitle>
      <CardContent className="p-0 text-center text-base leading-relaxed text-slide-fg @sm/slide:p-0 @sm/slide:text-start @sm/slide:text-lg">
        {children}
      </CardContent>
    </Card>
  )
}

function CauseCard({
  glyph,
  label,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  glyph: string
  label: string
}) {
  return (
    <Card
      data-slot="cause-card"
      className={cn(
        "gap-0 rounded-slide border-slide-border bg-slide-card p-3.5 text-center shadow-slide-sm @sm/slide:p-5",
        className
      )}
      {...props}
    >
      <CardTitle className="mb-1 text-3xl leading-none font-bold text-slide-primary @sm/slide:text-4xl">
        {glyph}
      </CardTitle>
      <CardDescription className="text-base font-bold text-slide-fg @sm/slide:text-lg">
        {label}
      </CardDescription>
    </Card>
  )
}

const compareCardVariants = cva(
  "relative overflow-hidden rounded-slide-lg border-slide-border bg-slide-card p-4 shadow-slide-sm before:absolute before:inset-x-0 before:top-0 before:h-1 @sm/slide:p-6",
  {
    variants: {
      variant: {
        default: "before:bg-slide-primary",
        accent: "before:bg-slide-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function CompareCard({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof compareCardVariants>) {
  const cssVars =
    variant === "accent"
      ? ({
          "--label-fg": "var(--color-slide-accent)",
          "--label-bg": "var(--color-slide-accent-soft)",
          "--label-border": "#f0d89a",
        } as React.CSSProperties)
      : undefined

  return (
    <Card
      data-slot="compare-card"
      className={cn(compareCardVariants({ variant }), className)}
      style={cssVars}
      {...props}
    >
      {children}
    </Card>
  )
}

function CompareCardLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="compare-card-label"
      className={cn(
        "mb-2 inline-block w-fit rounded-full border border-[var(--label-border,var(--color-slide-primary-soft))] bg-[var(--label-bg,var(--color-slide-primary-tint))] px-2.5 py-0.5 text-xs font-bold text-[var(--label-fg,var(--color-slide-primary))] @sm/slide:mb-3 @sm/slide:px-3 @sm/slide:py-1 @sm/slide:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

function CompareCardTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="compare-card-title"
      className={cn("mb-2 text-xl font-bold text-slide-fg @sm/slide:mb-2.5 @sm/slide:text-2xl", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

function CompareCardDesc({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="compare-card-desc"
      className={cn(
        "mb-3 text-sm leading-relaxed text-slide-fg-muted @sm/slide:mb-4 @sm/slide:text-base",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function CompareCardExample({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="compare-card-example"
      className={cn(
        "rounded-slide border border-slide-border bg-slide-bg-subtle p-2.5 text-center text-2xl leading-relaxed font-bold text-slide-fg @sm/slide:p-3 @sm/slide:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const exampleVariants = cva(
  "relative flex min-h-16 flex-row items-center justify-center overflow-hidden rounded-slide border-slide-border bg-slide-bg-subtle p-4 text-center text-2xl leading-relaxed font-bold text-slide-fg after:absolute after:inset-x-0 after:bottom-0 after:h-0.75 @sm/slide:min-h-25 @sm/slide:p-6 @sm/slide:text-4xl",
  {
    variants: {
      variant: {
        default:
          "after:bg-gradient-to-r after:from-slide-madd after:to-slide-hamza",
        single: "after:bg-slide-madd",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function CardExample({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof exampleVariants>) {
  return (
    <Card
      data-slot="example"
      className={cn(exampleVariants({ variant }), className)}
      {...props}
    >
      <span data-slot="example-text" className="inline-block">
        {children}
      </span>
    </Card>
  )
}

function CardExamples({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="examples-grid"
      className={cn("my-2 grid grid-cols-2 gap-3 @sm/slide:grid-cols-3 @sm/slide:gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function CardWords({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="words-grid"
      className={cn(
        "grid flex-1 grid-cols-3 content-center gap-2.5 @sm/slide:grid-cols-5 @sm/slide:gap-3.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardWord({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card
      data-slot="word-tile"
      className={cn(
        "relative flex min-h-14 flex-row items-center justify-center overflow-hidden rounded-slide border-slide-border bg-slide-card p-2.5 text-center text-2xl font-bold text-slide-fg shadow-slide-sm before:absolute before:inset-x-0 before:top-0 before:h-0.75 before:bg-[linear-gradient(90deg,var(--color-slide-haa)_0%,var(--color-slide-haa)_50%,var(--color-slide-khaa)_50%,var(--color-slide-khaa)_100%)] before:opacity-60 @sm/slide:min-h-21 @sm/slide:p-4 @sm/slide:text-3xl",
        className
      )}
      {...props}
    >
      <span data-slot="word-text" className="inline-block">
        {children}
      </span>
    </Card>
  )
}

export {
  LetterCard,
  CardCondition,
  CauseCard,
  CompareCard,
  CompareCardLabel,
  CompareCardTitle,
  CompareCardDesc,
  CompareCardExample,
  CardExample,
  CardExamples,
  CardWords,
  CardWord,
}
