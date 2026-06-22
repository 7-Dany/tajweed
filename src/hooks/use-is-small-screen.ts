"use client"

import { useEffect, useState } from "react"

/**
 * Returns true when the viewport is below the `sm` breakpoint (640px).
 * Used to conditionally render Sheet (mobile) vs Dialog (desktop) for
 * the settings panel — avoids rendering both in the DOM.
 *
 * Defaults to `false` on the server / first render (hydration-safe),
 * then updates after mount.
 */
export function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)")
    const onChange = () => setIsSmall(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isSmall
}
