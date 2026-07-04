/**
 * One-time seed script: reads src/content/courses.json and inserts its data
 * into Supabase.  Run with: bun run scripts/seed-supabase.ts
 *
 * Idempotent — skips teachers/courses that already exist (matched by slug).
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

// ─── config ────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ""
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

const COURSES_JSON_PATH = path.join(process.cwd(), "src", "content", "courses.json")
const LESSONS_DIR = path.join(process.cwd(), "src", "content", "lessons")

// ─── types ──────────────────────────────────────────────────────────────

type JsonTeacher = { id: string; name: string; email: string; bio: string }
type JsonLesson = {
  id: string; slug: string; title: string; titleEn?: string
  description: string; descriptionEn?: string; contentKey: string
  order: number; source?: unknown
}
type JsonChapter = { id: string; title: string; titleEn?: string; order: number; lessons: JsonLesson[] }
type JsonCourse = {
  id: string; slug: string; title: string; titleEn?: string
  description: string; descriptionEn?: string; teacherId: string; chapters: JsonChapter[]
}
type JsonData = { teachers: JsonTeacher[]; courses: JsonCourse[] }

// ─── helpers ────────────────────────────────────────────────────────────

async function upsertTeacher(t: JsonTeacher): Promise<string> {
  const { data: existing } = await supabase
    .from("teachers")
    .select("id")
    .eq("name", t.name)
    .maybeSingle()

  if (existing) return existing.id

  const { data, error } = await supabase
    .from("teachers")
    .insert({ name: t.name, email: t.email, bio: t.bio })
    .select("id")
    .single()

  if (error) throw new Error(`Failed to insert teacher ${t.name}: ${error.message}`)
  console.log(`  ✓ Teacher "${t.name}" → ${data.id}`)
  return data.id
}

async function upsertCourse(c: JsonCourse, teacherId: string): Promise<string> {
  const { data: existing } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", c.slug)
    .maybeSingle()

  if (existing) return existing.id

  const { data, error } = await supabase
    .from("courses")
    .insert({
      slug: c.slug,
      title: c.title,
      title_en: c.titleEn ?? null,
      description: c.description || null,
      description_en: c.descriptionEn ?? null,
      teacher_id: teacherId,
    })
    .select("id")
    .single()

  if (error) throw new Error(`Failed to insert course ${c.slug}: ${error.message}`)
  console.log(`  ✓ Course "${c.title}" → ${data.id}`)
  return data.id
}

async function upsertChapter(ch: JsonChapter, courseId: string): Promise<string> {
  // Use a composite lookup: course_id + title
  const { data: existing } = await supabase
    .from("chapters")
    .select("id")
    .eq("course_id", courseId)
    .eq("title", ch.title)
    .maybeSingle()

  if (existing) return existing.id

  const { data, error } = await supabase
    .from("chapters")
    .insert({
      course_id: courseId,
      title: ch.title,
      title_en: ch.titleEn ?? null,
      order: ch.order,
    })
    .select("id")
    .single()

  if (error) throw new Error(`Failed to insert chapter ${ch.title}: ${error.message}`)
  console.log(`    ✓ Chapter "${ch.title}" → ${data.id}`)
  return data.id
}

async function upsertLesson(l: JsonLesson, chapterId: string): Promise<void> {
  const { data: existing } = await supabase
    .from("lessons")
    .select("id")
    .eq("chapter_id", chapterId)
    .eq("slug", l.slug)
    .maybeSingle()

  if (existing) return

  const { error } = await supabase
    .from("lessons")
    .insert({
      chapter_id: chapterId,
      slug: l.slug,
      title: l.title,
      title_en: l.titleEn ?? null,
      description: l.description || null,
      description_en: l.descriptionEn ?? null,
      content_key: l.contentKey,
      order: l.order,
      source: l.source ?? null,
    })

  if (error) throw new Error(`Failed to insert lesson ${l.slug}: ${error.message}`)
  console.log(`      ✓ Lesson "${l.title}"`)
}

// ─── main ───────────────────────────────────────────────────────────────

async function main() {
  console.log("Reading courses.json...")
  const raw = readFileSync(COURSES_JSON_PATH, "utf-8")
  const data: JsonData = JSON.parse(raw)

  console.log(`Found ${data.teachers.length} teacher(s), ${data.courses.length} course(s)`)

  // 1. Teachers
  const teacherIdMap = new Map<string, string>()
  for (const t of data.teachers) {
    const id = await upsertTeacher(t)
    teacherIdMap.set(t.id, id)
  }

  // 2. Courses → Chapters → Lessons
  for (const c of data.courses) {
    const dbTeacherId = teacherIdMap.get(c.teacherId)
    if (!dbTeacherId) {
      console.warn(`  ⚠ Teacher ${c.teacherId} not found, skipping course "${c.slug}"`)
      continue
    }
    const dbCourseId = await upsertCourse(c, dbTeacherId)

    for (const ch of c.chapters) {
      const dbChapterId = await upsertChapter(ch, dbCourseId)

      for (const l of ch.lessons) {
        await upsertLesson(l, dbChapterId)
      }
    }
  }

  console.log("\n✅ Seed complete!")
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
