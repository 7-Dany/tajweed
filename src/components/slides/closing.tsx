import { cn } from "@/lib/utils"

function ClosingTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="closing-title"
      className={cn("closing__title", className)}
      {...props}
    >
      {children}
    </h2>
  )
}

function ClosingRule({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="closing-rule"
      className={cn("closing__rule", className)}
      {...props}
    />
  )
}

function ClosingText({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="closing-text"
      className={cn("closing__text", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function ClosingSub({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="closing-sub"
      className={cn("closing__sub", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { ClosingTitle, ClosingRule, ClosingText, ClosingSub }
