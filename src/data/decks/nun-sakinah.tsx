/**
 * Deck: nun-sakinah
 * Course 2 · "أحكام النون الساكنة والتنوين"
 *
 * Covers the four rules of the silent noon (نْ) and tanween:
 * Izhār (إظهار), Idghām (إدغام), Iqlāb (إقلاب), Ikhfā’ (إخفاء).
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
        علم التجويد
      </CoverEyebrow>
      <div className="cover__main">
        <CoverTitle>أحكام النون الساكنة</CoverTitle>
        <CoverRule />
        <CoverSubtitle>الأحكام الأربعة: الإظهار والإدغام والإقلاب والإخفاء</CoverSubtitle>
        <CoverMeta>
          <CoverChip color="primary">الإظهار</CoverChip>
          <CoverChip color="madd">الإدغام</CoverChip>
          <CoverChip color="hamza">الإقلاب</CoverChip>
          <CoverChip color="khaa">الإخفاء</CoverChip>
        </CoverMeta>
      </div>
    </>
  )
}

function SlideDivider() {
  return (
    <DividerSlide
      num="١"
      eyebrow="الدرس"
      title="أحكام النون الساكنة والتنوين"
      desc="للنون الساكنة والتنوين أربعة أحكام عند ملاقاة الحروف الهجائية."
    />
  )
}

function SlideOverview() {
  const rules = [
    { name: "الإظهار", letters: "٦ حروف", desc: "حروف الحلق" },
    { name: "الإدغام", letters: "٦ حروف", desc: "ينقسم: بغنة وبدون غنة" },
    { name: "الإقلاب", letters: "حرف واحد", desc: "الباء (ب)" },
    { name: "الإخفاء", letters: "١٥ حرفاً", desc: "باقي الحروف" },
  ]
  return (
    <SlideShell eyebrow="نظرة عامة" title="الأحكام الأربعة">
      <p className="m-0 mb-4 text-center text-lg text-slide-fg-muted">
        للنون الساكنة والتنوين أربعة أحكام عند ملاقاة الحروف:
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
    <SlideShell eyebrow="الحكم الثاني" title="الإدغام">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        الإدغام: إدخال النون الساكنة أو التنوين في الحرف الذي بعدها، وحروفه ستة
        مجموعة في كلمة <Em>«يَرْمَلُون»</Em>. ينقسم إلى:
      </p>
      <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5.5">
        <div className="rounded-slide-lg border border-slide-border bg-slide-card p-5 shadow-slide-sm">
          <p className="mb-2 text-lg font-bold text-slide-primary">
            إدغام بغنة
          </p>
          <p className="mb-3 text-sm text-slide-fg-muted">
            حروفه: <Em>ي ن م و</Em> (ينمو)
          </p>
          <div className="rounded-slide border border-slide-border bg-slide-bg-subtle p-3 text-center text-2xl font-bold text-slide-fg">
            مِنْ <span className="madd">وَ</span>ل
          </div>
        </div>
        <div className="rounded-slide-lg border border-slide-border bg-slide-card p-5 shadow-slide-sm">
          <p className="mb-2 text-lg font-bold text-slide-primary">
            إدغام بدون غنة
          </p>
          <p className="mb-3 text-sm text-slide-fg-muted">
            حروفه: <Em>ل ر</Em>
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
    <SlideShell eyebrow="الحكم الثالث" title="الإقلاب">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        الإقلاب: قلب النون الساكنة أو التنوين ميماً مخفاة بغنة عند ملاقاة حرف
        واحد وهو <Em>الباء (ب)</Em>.
      </p>
      <CenteredStack>
        <DisplayMiniHeading>الأمثلة</DisplayMiniHeading>
        <CardExamples>
          <CardExample>أَنْ<span className="hamza">بَ</span>اءَ</CardExample>
          <CardExample>مِنْ<span className="hamza">بَ</span>عْد</CardExample>
          <CardExample>سَمِيعٌ <span className="hamza">بَ</span>صِير</CardExample>
        </CardExamples>
      </CenteredStack>
      <DisplayLegendRow>
        <DisplayLegendChip color="hamza">حرف الإقلاب (ب)</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideClosing() {
  return (
    <>
      <CoverFrame />
      <div className="cover__main">
        <CoverTitle>تمّ الدرس</CoverTitle>
        <CoverRule />
        <CoverSubtitle>﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ ﴾</CoverSubtitle>
      </div>
    </>
  )
}

/* ──────────────────────── Deck ──────────────────────── */

export const NUN_SAKINAH_SLIDES_AR: readonly SlideDefinition[] = [
  { Component: SlideCover, className: "cover" },
  { Component: SlideDivider, className: "divider" },
  { Component: SlideOverview },
  { Component: SlideIdgham },
  { Component: SlideIqlab },
  { Component: SlideClosing, className: "closing" },
] as const
