# Issue 06 — Teacher entity + write functions

**Status:** 🔜 Ready, not started.

## Problem
`Teacher` is a singleton baked into `courses.json` and duplicated in
`site-config.ts`. There's no `teacherId`-scoped ownership, and `lib/courses.ts`
is read-only (`getCourses`, `getCourseBySlug`, `getCourseById`) — there's no
`createCourse`, `createChapter`, or `createLesson`. "Teachers create courses"
can't be built without this, independent of the markdown work.

## Change (proposed)
- `courses.json` gains a `teachers: Teacher[]` array (plural) instead of one
  singleton `teacher` object; existing `teacherId` fields on courses already
  point at an id, so this is a low-risk shape change.
- `lib/courses.ts` gains:
  - `createCourse(teacherId, input): CourseWithRelations`
  - `createChapter(courseId, input): ChapterWithLessons`
  - `createLesson(chapterId, input): LessonWithChapter` (input includes a
    `LessonSource` from Issue 03)
  - All three read-modify-write `courses.json` for now (fs write), exactly
    like the doc comment already promises for the eventual Prisma swap —
    same signatures will hold when swapped to real DB calls.
- New API routes: `POST /api/courses`, `POST /api/courses/[slug]/chapters`,
  `POST /api/courses/[slug]/chapters/[chapterId]/lessons`.
- No auth yet (matches `use-lesson-progress.ts`'s existing "no auth for now"
  precedent) — `teacherId` passed explicitly until an auth layer exists.

## Acceptance criteria
- [ ] A teacher can create a course/chapter/lesson via API without touching
      `courses.json` by hand.
- [ ] Existing read paths (`getCourses`, `getCourseBySlug`) unaffected.
- [ ] Write functions have the exact signature shape they'll keep after a
      future Prisma swap (per the file's own stated design goal).
