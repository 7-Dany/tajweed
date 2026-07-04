"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "فشل تسجيل الدخول")
        return
      }

      toast.success("تم تسجيل الدخول")
      router.push("/admin/courses")
    } catch {
      toast.error("تعذّر الاتصال بالخادم")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <h1 className="mb-6 text-center text-xl font-bold">تسجيل الدخول</h1>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="username">اسم المستخدم</FieldLabel>
            <FieldContent>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
            <FieldContent>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </FieldContent>
          </Field>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "جارٍ تسجيل الدخول..." : "دخول"}
          </Button>
        </div>
      </form>
    </div>
  )
}
