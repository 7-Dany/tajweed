<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:database -->
# Supabase Database

The app uses Supabase (PostgreSQL) for storage. The `CourseRepository` interface in `src/domain/course-repository.ts` is implemented by `SupabaseCourseRepository` in `src/domain/supabase-course-repository.ts`.

## Schema

Migrations are in `supabase/migrations/`:

| File | Description |
| --- | --- |
| `00001_create_tables.sql` | teachers, courses, chapters, lessons tables |
| `00002_enable_rls.sql` | Row-level security with public read |

## Tables

- **teachers**: `id UUID PK`, `name`, `email`, `bio`, `avatar_url`
- **courses**: `id UUID PK`, `slug UNIQUE`, `title`, `title_en`, `description`, `description_en`, `teacher_id FK`
- **chapters**: `id UUID PK`, `course_id FK CASCADE`, `title`, `title_en`, `order`
- **lessons**: `id UUID PK`, `chapter_id FK CASCADE`, `slug`, `title`, `title_en`, `description`, `description_en`, `content_key`, `order`, `source JSONB`

## Repository

The `SupabaseCourseRepository` reads/writes lessons' `source` field as-is from JSONB, but resolves `{ type: "markdown-file", file, fileEn? }` references on read by loading `.md` files from `src/content/lessons/`.

## Seed

To populate from `courses.json`:
```bash
bun run scripts/seed-supabase.ts
```

## Env Variables

| Variable | Required For |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & server |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin client (bypasses RLS) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side queries |

<!-- END:database -->
