# Issue 08 — Route-based lesson navigation (optional, independent)

**Status:** 🔜 Optional. Can be done any time, doesn't block 01–07.

## Problem
`CourseApp` is a client-side state machine (`useState` for
catalog/browser/player) rather than real routes. Fine today; becomes a real
gap once lessons are dynamic/shareable content — no deep link to
`/courses/tajweed-rules/lessons/madd-rules`, no back-button semantics, no
resuming a specific slide via URL.

## Change (proposed)
- `app/courses/[slug]/page.tsx` → course browser (replaces client-side
  `activeCourseSlug` state)
- `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` → lesson player
- `CourseApp`'s useState/useTransition machine can be deleted once routing
  owns this; `useLessonProgress` (localStorage) is unaffected either way.

## Acceptance criteria
- [ ] Lessons are linkable/bookmarkable.
- [ ] Browser back/forward works naturally between catalog → course → lesson.
- [ ] No regression to the code-split `lazy(() => import(LessonPlayer))`
      behavior — Next.js route-based code splitting replaces it for free.
