import { describe, it, expect } from "bun:test"
import { SupabaseCourseRepository } from "@/domain/supabase-course-repository"

const repo = new SupabaseCourseRepository()

describe("SupabaseCourseRepository", () => {
  describe("listCourses", () => {
    it("returns seeded courses", async () => {
      const courses = await repo.listCourses()
      expect(courses.length).toBeGreaterThan(0)
      expect(courses[0]).toHaveProperty("id")
      expect(courses[0]).toHaveProperty("slug")
      expect(courses[0]).toHaveProperty("title")
      expect(courses[0]).toHaveProperty("teacher")
      expect(courses[0].teacher).toHaveProperty("name")
    })
  })

  describe("getCourseBySlug", () => {
    it("returns a known course", async () => {
      const course = await repo.getCourseBySlug("tajweed-rules")
      expect(course).not.toBeNull()
      expect(course!.title).toBe("أحكام التجويد")
      expect(course!.chapters.length).toBeGreaterThan(0)
    })

    it("returns null for unknown slug", async () => {
      const course = await repo.getCourseBySlug("does-not-exist")
      expect(course).toBeNull()
    })
  })

  describe("getCourseById", () => {
    it("finds a course by ID", async () => {
      const courses = await repo.listCourses()
      const first = courses[0]
      const course = await repo.getCourseById(first.id)
      expect(course).not.toBeNull()
      expect(course!.slug).toBe(first.slug)
    })
  })

  describe("CRUD: chapters", () => {
    it("creates, reads, updates, and deletes a chapter", async () => {
      const courses = await repo.listCourses()
      const firstCourse = courses.find((c) => c.chapterCount > 0) ?? courses[0]
      const course = await repo.getCourseBySlug(firstCourse.slug)
      expect(course).not.toBeNull()

      const chapter = await repo.createChapter(course!.id, {
        title: "فصل اختبار",
        titleEn: "Test Chapter",
      })
      expect(chapter.title).toBe("فصل اختبار")
      expect(chapter.titleEn).toBe("Test Chapter")
      expect(chapter.lessons).toEqual([])

      const fetched = await repo.getChapterById(chapter.id)
      expect(fetched).not.toBeNull()
      expect(fetched!.title).toBe("فصل اختبار")

      const updated = await repo.updateChapter(chapter.id, {
        title: "فصل اختبار معدل",
      })
      expect(updated.title).toBe("فصل اختبار معدل")

      await repo.deleteChapter(chapter.id)
      const afterDelete = await repo.getChapterById(chapter.id)
      expect(afterDelete).toBeNull()
    })
  })

  describe("CRUD: lessons", () => {
    async function getFirstChapter() {
      const courses = await repo.listCourses()
      // Find a course that has chapters
      for (const c of courses) {
        const course = await repo.getCourseBySlug(c.slug)
        if (course && course.chapters.length > 0) return course.chapters[0]
      }
      throw new Error("No courses with chapters found")
    }

    it("creates, updates, and deletes a lesson", async () => {
      const chapter = await getFirstChapter()

      const lesson = await repo.createLesson(chapter.id, {
        slug: "test-lesson",
        title: "درس اختبار",
        titleEn: "Test Lesson",
        description: "وصف الاختبار",
        descriptionEn: "Test description",
        contentKey: "test-lesson",
        source: {
          type: "markdown",
          markdown: "# اختبار\n\nمحتوى اختبار.",
        },
      })
      expect(lesson.title).toBe("درس اختبار")
      expect(lesson.titleEn).toBe("Test Lesson")
      expect(lesson.description).toBe("وصف الاختبار")
      expect(lesson.descriptionEn).toBe("Test description")

      const updated = await repo.updateLesson(lesson.id, {
        title: "درس معدل",
      })
      expect(updated.title).toBe("درس معدل")

      await repo.deleteLesson(lesson.id)
      const afterDelete = await repo.getLessonById(lesson.id)
      expect(afterDelete).toBeNull()
    })

    it("rejects duplicate slugs within the same chapter", async () => {
      const chapter = await getFirstChapter()

      const first = await repo.createLesson(chapter.id, {
        slug: "dup-slug",
        title: "First",
        contentKey: "first",
      })

      try {
        await repo.createLesson(chapter.id, {
          slug: "dup-slug",
          title: "Second",
          contentKey: "second",
        })
        expect.unreachable("Should have thrown")
      } catch (err) {
        expect((err as Error).message).toContain("already exists")
      }

      await repo.deleteLesson(first.id)
    })
  })

  describe("CRUD: courses", () => {
    async function getTeacherId() {
      const courses = await repo.listCourses()
      return courses[0].teacher.id
    }

    it("creates, updates, and deletes a course", async () => {
      const course = await repo.createCourse(
        await getTeacherId(),
        {
          slug: "crud-test-course",
          title: "دورة اختبار",
          titleEn: "Test Course",
          description: "وصف الدورة",
          descriptionEn: "Test course description",
        }
      )
      expect(course.title).toBe("دورة اختبار")
      expect(course.titleEn).toBe("Test Course")
      expect(course.descriptionEn).toBe("Test course description")
      expect(course.chapters).toEqual([])

      const updated = await repo.updateCourse(course.id, {
        title: "دورة معدلة",
      })
      expect(updated.title).toBe("دورة معدلة")

      await repo.deleteCourse(course.id)
      const afterDelete = await repo.getCourseById(course.id)
      expect(afterDelete).toBeNull()
    })

    it("rejects duplicate slugs", async () => {
      const teacherId = await getTeacherId()
      const slug = "dup-course-test"
      await repo.createCourse(teacherId, { slug, title: "First" })

      await expect(
        repo.createCourse(teacherId, { slug, title: "Duplicate" })
      ).rejects.toThrow()

      const course = await repo.getCourseBySlug(slug)
      if (course) await repo.deleteCourse(course.id)
    })
  })
})
