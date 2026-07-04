import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <form
        action="/api/admin/login"
        method="POST"
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <h1 className="mb-6 text-center text-xl font-bold">تسجيل الدخول</h1>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="username">اسم المستخدم</FieldLabel>
            <FieldContent>
              <Input
                id="username"
                name="username"
                autoComplete="username"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
            <FieldContent>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
              />
            </FieldContent>
          </Field>

          <Button type="submit" className="w-full">
            دخول
          </Button>
        </div>
      </form>
    </div>
  )
}
