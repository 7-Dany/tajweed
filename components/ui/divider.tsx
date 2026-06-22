import { cn } from "@/lib/utils"

function DividerInner({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="divider-inner"
      className={cn("divider__inner", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DividerNum({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="divider-num"
      className={cn("divider__num", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DividerEyebrow({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="divider-eyebrow"
      className={cn("divider__eyebrow", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function DividerTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="divider-title"
      className={cn("divider__title", className)}
      {...props}
    >
      {children}
    </h2>
  )
}

function DividerRule({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="divider-rule"
      className={cn("divider__rule", className)}
      {...props}
    />
  )
}

function DividerDesc({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="divider-desc"
      className={cn("divider__desc", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { DividerInner, DividerNum, DividerEyebrow, DividerTitle, DividerRule, DividerDesc }
