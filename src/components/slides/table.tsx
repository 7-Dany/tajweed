import * as React from "react"

import { cn } from "@/lib/utils"

function TableContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-wrap"
      className={cn(
        "overflow-hidden rounded-slide-lg border border-slide-border bg-slide-card shadow-slide-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function Table({
  className,
  children,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <table
      data-slot="summary-table"
      className={cn(
        "w-full border-collapse text-start text-sm sm:text-lg",
        "[&_thead_th]:bg-slide-primary [&_thead_th]:p-2.5 [&_thead_th]:text-start [&_thead_th]:text-xs [&_thead_th]:font-bold [&_thead_th]:text-slide-primary-fg sm:[&_thead_th]:p-4 sm:[&_thead_th]:text-base",
        "[&_tbody_td]:border-b [&_tbody_td]:border-slide-border [&_tbody_td]:px-2.5 [&_tbody_td]:py-2.5 [&_tbody_td]:text-slide-fg-muted sm:[&_tbody_td]:px-5.5 sm:[&_tbody_td]:py-4.5",
        "[&_tbody_tr:last-child_td]:border-b-0",
        "[&_tbody_td:first-child]:font-bold [&_tbody_td:first-child]:text-slide-fg",
        className
      )}
      {...props}
    >
      {children}
    </table>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={className} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={className} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={className} {...props} />
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th data-slot="table-head" className={className} {...props} />
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={className} {...props} />
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

const TableWrap = TableContainer
const TableSummary = Table

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableContainer,
  TableWrap,
  TableSummary,
}
