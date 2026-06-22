/**
 * Deck: letter-practice
 * Chapter 2 · Lesson 1 — "تمييز الحاء والخاء"
 *
 * Pronunciation exercises distinguishing ح (haa) from خ (khaa),
 * using meaningful words and practice syllables.
 */

import type { ReactNode } from "react"
import { IconBook } from "@tabler/icons-react"

import { CardWord, CardWords } from "@/components/slides/cards"
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
} from "@/components/slides/display"
import {
  CenteredStack,
  DividerSlide,
  Haa,
  Khaa,
  SlideShell,
  type SlideDefinition,
} from "@/components/slides/helpers"

/* ──────────────────────── Data ──────────────────────── */

const MEANINGFUL_WORDS: ReactNode[] = [
  <span key={0}>بَ‍<Haa>‍حـ</Haa>َثَ</span>,
  <span key={1}>خَـبَـأَ</span>,
  <span key={2}>أَخَـذَ</span>,
  <span key={3}><Haa>حـ</Haa>َذَرَ</span>,
  <span key={4}><Khaa>خـ</Khaa>َرَجَ</span>,
  <span key={5}>دَرَسَ</span>,
  <span key={6}>شَـرَ<Haa>ح</Haa>َ</span>,
  <span key={7}>ذَبَ‍<Haa>‍ح</Haa>َ</span>,
  <span key={8}><Haa>حـ</Haa>َرَثَ</span>,
  <span key={9}>سَـجَـدَ</span>,
  <span key={10}>رَجَ‍<Haa>‍ح</Haa>َ</span>,
  <span key={11}>بَـذَ<Khaa>خ</Khaa>َ</span>,
  <span key={12}><Khaa>خـ</Khaa>َشَـبَ</span>,
  <span key={13}>شَ‍<Haa>‍حـ</Haa>َذَ</span>,
  <span key={14}><Haa>حـ</Haa>َشَـدَ</span>,
]

const PRACTICE_WORDS: ReactNode[] = [
  <span key={0}>بَـتَ‍<Haa>‍ح</Haa>َ</span>,
  <span key={1}>تَـبَ‍<Khaa>‍خ</Khaa>َ</span>,
  <span key={2}>ثَـبَـجَ</span>,
  <span key={3}>جَـبَ‍<Haa>‍ح</Haa>َ</span>,
  <span key={4}><Haa>حـ</Haa>َبَـثَ</span>,
  <span key={5}><Khaa>خـ</Khaa>َبَـتَ</span>,
  <span key={6}>بَـجَ‍<Haa>‍ح</Haa>َ</span>,
  <span key={7}>تَ‍<Haa>‍حـ</Haa>َبَ</span>,
  <span key={8}>ثَ‍<Khaa>‍خـ</Khaa>َبَ</span>,
  <span key={9}>جَـثَـبَ</span>,
  <span key={10}><Haa>حـ</Haa>َتَـجَ</span>,
  <span key={11}><Khaa>خـ</Khaa>َجَـبَ</span>,
  <span key={12}>بَـثَ‍<Khaa>‍خ</Khaa>َ</span>,
  <span key={13}>تَـجَـثَ</span>,
  <span key={14}>ثَ‍<Haa>‍حـ</Haa>َبَ</span>,
]

/* ──────────────────────── Slides ──────────────────────── */

function SlideCover() {
  return (
    <>
      <CoverFrame />
      <CoverEyebrow>
        <IconBook />
        تمارين النطق
      </CoverEyebrow>
      <div className="cover__main">
        <CoverTitle>تمييز الحاء والخاء</CoverTitle>
        <CoverRule />
        <CoverSubtitle>كلماتٌ ذات معنى وكلماتٌ تدريبية لتمييز المخارج المتقاربة</CoverSubtitle>
        <CoverMeta>
          <CoverChip color="haa">الحاء (ح)</CoverChip>
          <CoverChip color="khaa">الخاء (خ)</CoverChip>
        </CoverMeta>
      </div>
    </>
  )
}

function SlideDivider() {
  return (
    <DividerSlide
      num="٢"
      eyebrow="القسم الثاني"
      title="تمارين نطق الحروف"
      desc="كلماتٌ ذات معنى وكلماتٌ تدريبية لتمييز الحاء والخاء."
    />
  )
}

function SlideWordsMeaning() {
  return (
    <SlideShell eyebrow="التمارين · ١" title="كلماتٌ ذات معنى">
      <p className="m-0 mb-2 text-center text-base text-slide-fg-muted">
        كلماتٌ مألوفة لتثبيت نطق الحروف في سياقٍ طبيعي.
      </p>
      <CardWords>
        {MEANINGFUL_WORDS.map((word, index) => (
          <CardWord key={index}>{word}</CardWord>
        ))}
      </CardWords>
      <DisplayLegendRow>
        <DisplayLegendChip color="haa">الحاء (ح)</DisplayLegendChip>
        <DisplayLegendChip color="khaa">الخاء (خ)</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideWordsPractice() {
  return (
    <SlideShell eyebrow="التمارين · ٢" title="كلماتٌ تدريبية">
      <p className="m-0 mb-2 text-center text-base text-slide-fg-muted">
        مقاطعُ غيرِ ذات معنى لتركيز الانتباه على تمييز المخارج المتقاربة.
      </p>
      <CardWords>
        {PRACTICE_WORDS.map((word, index) => (
          <CardWord key={index}>{word}</CardWord>
        ))}
      </CardWords>
      <DisplayLegendRow>
        <DisplayLegendChip color="haa">الحاء (ح)</DisplayLegendChip>
        <DisplayLegendChip color="khaa">الخاء (خ)</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideClosing() {
  return (
    <>
      <CoverFrame />
      <div className="cover__main">
        <CoverTitle>تمّ بحمد الله</CoverTitle>
        <CoverRule />
        <CoverSubtitle>﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</CoverSubtitle>
      </div>
    </>
  )
}

/* ──────────────────────── Deck ──────────────────────── */

export const LETTER_PRACTICE_SLIDES_AR: readonly SlideDefinition[] = [
  { Component: SlideCover, className: "cover" },
  { Component: SlideDivider, className: "divider" },
  { Component: SlideWordsMeaning },
  { Component: SlideWordsPractice },
  { Component: SlideClosing, className: "closing" },
] as const
