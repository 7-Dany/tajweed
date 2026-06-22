/**
 * useLessonProgress — tracks completed lessons in localStorage.
 *
 * No auth / no database for now. When auth is added later, this can be
 * swapped for a DB-backed implementation without changing the UI.
 *
 * Hydration-safe: the server and first client render both see an empty
 * list, then the real localStorage value is applied after mount.
 */

"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "tajweed-progress"

type ProgressData = {
  completedLessons: string[]
}

function readFromStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ProgressData
    return Array.isArray(parsed.completedLessons) ? parsed.completedLessons : []
  } catch {
    return []
  }
}

function writeToStorage(completedLessons: string[]) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completedLessons } satisfies ProgressData)
    )
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function useLessonProgress() {
  // Start empty on both server and client so SSR HTML matches.
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  // Read the real localStorage value once after mount. This setState in
  // an effect is intentional and safe — it syncs external state into React
  // after hydration, which is the documented use case for effects.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setCompletedLessons(readFromStorage())
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Keep state in sync if another tab changes progress.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        setCompletedLessons(readFromStorage())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const markCompleted = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev
      const next = [...prev, lessonId]
      writeToStorage(next)
      return next
    })
  }, [])

  const isCompleted = useCallback(
    (lessonId: string) => completedLessons.includes(lessonId),
    [completedLessons]
  )

  return { completedLessons, markCompleted, isCompleted }
}
