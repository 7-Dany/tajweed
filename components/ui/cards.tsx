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
        "gap-0 rounded-slide-lg border-slide-border bg-slide-card p-7 text-center shadow-slide-sm",
        className
      )}
      {...props}
    >
      <CardHeader className="gap-0 p-0">
        <CardTitle className="mb-3 text-5xl leading-none font-bold text-slide-primary">
          {glyph}
        </CardTitle>
        <CardDescription className="mb-1 text-lg font-bold text-slide-fg">
          {label}
        </CardDescription>
      </CardHeader>
      {hint && (
        <CardContent className="p-0 text-sm text-slide-fg-subtle">
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
        "flex-row items-center gap-4.5 rounded-slide border-slide-border bg-slide-card p-4 shadow-slide-sm",
        className
      )}
      {...props}
    >
      <CardTitle className="w-14 shrink-0 text-center text-4xl font-bold text-slide-primary">
        {glyph}
      </CardTitle>
      <CardContent className="p-0 text-lg leading-relaxed text-slide-fg">
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
        "gap-0 rounded-slide border-slide-border bg-slide-card p-5 text-center shadow-slide-sm",
        className
      )}
      {...props}
    >
      <CardTitle className="mb-1 text-4xl leading-none font-bold text-slide-primary">
        {glyph}
      </CardTitle>
      <CardDescription className="text-lg font-bold text-slide-fg">
        {label}
      </CardDescription>
    </Card>
  )
}

const compareCardVariants = cva(
  "relative overflow-hidden rounded-slide-lg border-slide-border bg-slide-card p-6 shadow-slide-sm before:absolute before:inset-x-0 before:top-0 before:h-1",
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
        "mb-3 inline-block w-fit rounded-full border border-(--label-border,var(--color-slide-primary-soft)) bg-(--label-bg,var(--color-slide-primary-tint)) px-3 py-1 text-sm font-bold text-(--label-fg,var(--color-slide-primary))",
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
      className={cn("mb-2.5 text-2xl font-bold text-slide-fg", className)}
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
        "mb-4 text-base leading-relaxed text-slide-fg-muted",
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
        "rounded-slide border border-slide-border bg-slide-bg-subtle p-3 text-center text-3xl leading-relaxed font-bold text-slide-fg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const exampleVariants = cva(
  "relative flex min-h-25 flex-row items-center justify-center overflow-hidden rounded-slide border-slide-border bg-slide-bg-subtle p-6 text-center text-4xl leading-relaxed font-bold text-slide-fg after:absolute after:inset-x-0 after:bottom-0 after:h-0.75",
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
      className={cn("my-2 grid grid-cols-3 gap-4", className)}
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
        "grid flex-1 grid-cols-5 content-center gap-3.5",
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
        "relative flex min-h-21 flex-row items-center justify-center overflow-hidden rounded-slide border-slide-border bg-slide-card p-4 text-center text-3xl font-bold text-slide-fg shadow-slide-sm before:absolute before:inset-x-0 before:top-0 before:h-0.75 before:bg-[linear-gradient(90deg,var(--color-slide-letter-haa)_0%,var(--color-slide-letter-haa)_50%,var(--color-slide-letter-khaa)_50%,var(--color-slide-letter-khaa)_100%)] before:opacity-60",
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
