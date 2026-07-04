"use client"

import Link from "next/link"
import { DirectionProvider } from "@/components/ui/direction"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider direction="rtl">
      <div className="admin-root flex h-dvh flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin/courses" className="text-base font-semibold">
              لوحة الإدارة
            </Link>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              الدورات
            </Link>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            الرجوع إلى الموقع
          </Link>
        </header>
        <main className="flex flex-1 min-h-0 flex-col overflow-hidden px-4 py-6">{children}</main>
      </div>
    </DirectionProvider>
  )
}
