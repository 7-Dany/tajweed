/**
 * Deck: nun-sakinah (English)
 * Course 2 · "Rules of Silent Noon and Tanween"
 *
 * Covers the four rules of the silent noon (نْ) and tanween:
 * Izhār, Idghām, Iqlāb, and Ikhfā'.
 *
 * Quranic Arabic examples remain in Arabic script — they are divine text,
 * not translatable. Only the surrounding UI is translated to English.
 */

import { IconArrowRight, IconBook } from "@tabler/icons-react"

import { CardExample, CardExamples } from "@/components/slides/cards"
import {
  CoverChip,
  CoverEyebrow,
  CoverFrame,
  CoverMeta,
  CoverRule,
  CoverSubtitle,
  CoverTitle,
} from "@/components/slides/cover"
import {
  DisplayLegendChip,
  DisplayLegendRow,
  DisplayMiniHeading,
} from "@/components/slides/display"
import {
  CenteredStack,
  DividerSlide,
  Em,
  SlideShell,
  type SlideDefinition,
} from "@/components/slides/helpers"

/* ──────────────────────── Slides ──────────────────────── */

function SlideCover() {
  return (
    <>
      <CoverFrame />
      <CoverEyebrow>
        <IconBook />
        Tajweed Science
      </CoverEyebrow>
      <div className="cover__main">
        <CoverTitle>Rules of Silent Noon (نْ)</CoverTitle>
        <CoverRule />
        <CoverSubtitle>
          The four rules: Izhār, Idghām, Iqlāb, and Ikhfā&rsquo;
        </CoverSubtitle>
        <CoverMeta>
          <CoverChip color="primary">Izhār</CoverChip>
          <CoverChip color="madd">Idghām</CoverChip>
          <CoverChip color="hamza">Iqlāb</CoverChip>
          <CoverChip color="khaa">Ikhfā&rsquo;</CoverChip>
        </CoverMeta>
      </div>
    </>
  )
}

function SlideDivider() {
  return (
    <DividerSlide
      num="1"
      eyebrow="Lesson"
      title="Rules of Silent Noon and Tanween"
      desc="The silent noon and tanween have four rules when they meet the letters of the alphabet."
    />
  )
}

function SlideOverview() {
  const rules = [
    { name: "Izhār", letters: "6 letters", desc: "throat letters" },
    { name: "Idghām", letters: "6 letters", desc: "Divided: with and without nasalization" },
    { name: "Iqlāb", letters: "1 letter", desc: "Baa (ب)" },
    { name: "Ikhfā’", letters: "15 letters", desc: "remaining letters" },
  ]
  return (
    <SlideShell eyebrow="Overview" title="The Four Rules">
      <p className="m-0 mb-4 text-center text-lg text-slide-fg-muted">
        The silent noon and tanween have four rules when they meet the letters:
      </p>
      <div className="my-4 grid grid-cols-1 gap-3 sm:my-5 sm:grid-cols-2 sm:gap-5.5">
        {rules.map((rule, i) => (
          <div
            key={i}
            className="group flex items-center gap-4 rounded-slide border border-slide-border bg-slide-card p-4 shadow-slide-sm"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slide-primary-tint text-sm font-bold text-slide-primary">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-slide-fg">{rule.name}</p>
              <p className="text-sm text-slide-fg-subtle">
                {rule.letters} — {rule.desc}
              </p>
            </div>
            <IconArrowRight size={20} className="dir-arrow shrink-0 text-slide-fg-subtle" />
          </div>
        ))}
      </div>
    </SlideShell>
  )
}

function SlideIdgham() {
  return (
    <SlideShell eyebrow="Rule 2" title="Idghām">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        Idghām: merging the silent noon or tanween into the letter that follows
        it. Its letters are six, gathered in the word <Em>«يَرْمَلُون»</Em>. It
        is divided into:
      </p>
      <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5.5">
        <div className="rounded-slide-lg border border-slide-border bg-slide-card p-5 shadow-slide-sm">
          <p className="mb-2 text-lg font-bold text-slide-primary">
            Idghām with nasalization
          </p>
          <p className="mb-3 text-sm text-slide-fg-muted">
            Its letters: <Em>ي ن م و</Em> (ينمو)
          </p>
          <div className="rounded-slide border border-slide-border bg-slide-bg-subtle p-3 text-center text-2xl font-bold text-slide-fg">
            مِنْ <span className="madd">وَ</span>ل
          </div>
        </div>
        <div className="rounded-slide-lg border border-slide-border bg-slide-card p-5 shadow-slide-sm">
          <p className="mb-2 text-lg font-bold text-slide-primary">
            Idghām without nasalization
          </p>
          <p className="mb-3 text-sm text-slide-fg-muted">
            Its letters: <Em>ل ر</Em>
          </p>
          <div className="rounded-slide border border-slide-border bg-slide-bg-subtle p-3 text-center text-2xl font-bold text-slide-fg">
            مِنْ <span className="hamza">رَ</span>بّ
          </div>
        </div>
      </div>
    </SlideShell>
  )
}

function SlideIqlab() {
  return (
    <SlideShell eyebrow="Rule 3" title="Iqlāb">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        Iqlāb: converting the silent noon or tanween into a hidden meem with
        nasalization when meeting a single letter, which is <Em>Baa (ب)</Em>.
      </p>
      <CenteredStack>
        <DisplayMiniHeading>Examples</DisplayMiniHeading>
        <CardExamples>
          <CardExample>أَنْ<span className="hamza">بَ</span>اءَ</CardExample>
          <CardExample>مِنْ<span className="hamza">بَ</span>عْد</CardExample>
          <CardExample>سَمِيعٌ <span className="hamza">بَ</span>صِير</CardExample>
        </CardExamples>
      </CenteredStack>
      <DisplayLegendRow>
        <DisplayLegendChip color="hamza">Iqlāb letter (ب)</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideClosing() {
  return (
    <>
      <CoverFrame />
      <div className="cover__main">
        <CoverTitle>Lesson Complete</CoverTitle>
        <CoverRule />
        <CoverSubtitle>﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ ﴾</CoverSubtitle>
      </div>
    </>
  )
}

/* ──────────────────────── Deck ──────────────────────── */

export const NUN_SAKINAH_SLIDES_EN: readonly SlideDefinition[] = [
  { Component: SlideCover, className: "cover" },
  { Component: SlideDivider, className: "divider" },
  { Component: SlideOverview },
  { Component: SlideIdgham },
  { Component: SlideIqlab },
  { Component: SlideClosing, className: "closing" },
] as const
