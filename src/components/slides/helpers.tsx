/**
 * Shared building blocks for slide decks.
 *
 * Every lesson deck (in src/content/lessons/*.slides.ts) resolves to Slide[]
 * data, rendered by <SlideRenderer /> (slide-renderer.tsx) using the shells
 * and colored inline-text wrappers defined here, so markup stays consistent.
 */

import type { ReactNode } from "react"

import {
  SlideBody,
  SlideEyebrow,
  SlideHeader,
  SlideHeaderLeft,
  SlidePageno,
  SlideTitle,
} from "@/components/slides/slide"
import {
  DividerDesc,
  DividerEyebrow,
  DividerInner,
  DividerNum,
  DividerRule,
  DividerTitle,
} from "@/components/slides/divider"

/* ───────────────────────── Types ───────────────────────── */

type SlideShellProps = {
  eyebrow: string
  title: string
  children: ReactNode
}

type DividerSlideProps = {
  num: string
  eyebrow: string
  title: string
  desc: string
}

/* ──────────────── Colored inline-text helpers ──────────────── */
/* Small wrappers around <span> so the Quranic example markup reads  */
/* like plain text instead of a tangle of className strings.          */

export function Em({ children }: { children: ReactNode }) {
  return <span className="em">{children}</span>
}

export function Madd({ children }: { children: ReactNode }) {
  return <span className="madd">{children}</span>
}

export function Hamza({ children }: { children: ReactNode }) {
  return <span className="hamza">{children}</span>
}

export function Haa({ children }: { children: ReactNode }) {
  return <span className="haa">{children}</span>
}

export function Khaa({ children }: { children: ReactNode }) {
  return <span className="khaa">{children}</span>
}

/* ──────────────────── Shared slide shells ──────────────────── */

export function SlideShell({ eyebrow, title, children }: SlideShellProps) {
  return (
    <>
      <SlideHeader>
        <SlideHeaderLeft>
          <div>
            <SlideEyebrow>{eyebrow}</SlideEyebrow>
            <SlideTitle>{title}</SlideTitle>
          </div>
        </SlideHeaderLeft>
        <SlidePageno />
      </SlideHeader>
      <SlideBody>{children}</SlideBody>
    </>
  )
}

export function DividerSlide({
  num,
  eyebrow,
  title,
  desc,
}: DividerSlideProps) {
  return (
    <DividerInner>
      <DividerNum>{num}</DividerNum>
      <div className="divider__text">
        <DividerEyebrow>{eyebrow}</DividerEyebrow>
        <DividerTitle>{title}</DividerTitle>
        <DividerRule />
        <DividerDesc>{desc}</DividerDesc>
      </div>
    </DividerInner>
  )
}

/** A centred column used to stack example groups inside a slide body. */
export function CenteredStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col justify-center">{children}</div>
}
