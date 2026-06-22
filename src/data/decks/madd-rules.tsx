/**
 * Deck: madd-rules
 * Chapter 1 · Lesson 1 — "أحكام المد الطبيعي والفرعي"
 *
 * Covers the three madd letters, their conditions, natural madd examples,
 * secondary madd caused by hamza (muttasil & munfasil), and a summary table.
 */

import {
  IconAlertTriangle,
  IconBook,
  IconInfoCircle,
} from "@tabler/icons-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  CardCondition,
  CardExample,
  CardExamples,
  CauseCard,
  CompareCard,
  CompareCardDesc,
  CompareCardExample,
  CompareCardLabel,
  CompareCardTitle,
  LetterCard,
} from "@/components/slides/cards"
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
  DisplayCausesRow,
  DisplayConditions,
  DisplayLegendChip,
  DisplayLegendRow,
  DisplayMiniHeading,
  DisplaySymbol,
  DisplaySymbolCaption,
  DisplaySymbolGlyph,
} from "@/components/slides/display"
import {
  CenteredStack,
  DividerSlide,
  Em,
  Haa,
  Hamza,
  Madd,
  SlideShell,
  type SlideDefinition,
} from "@/components/slides/helpers"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/slides/table"

/* ──────────────────────── Data ──────────────────────── */

const MAD_LETTERS = [
  { glyph: "ا", label: "الألف", hint: "ساكنة، قبلها فتح" },
  { glyph: "و", label: "الواو", hint: "ساكنة، قبلها ضم" },
  { glyph: "ي", label: "الياء", hint: "ساكنة، قبلها كسر" },
] as const

const MAD_CONDITIONS = [
  { glyph: "ا", desc: <>الألف: تكون ساكنة، وقبلها حرف <Em>مفتوح</Em>.</> },
  { glyph: "و", desc: <>الواو: تكون ساكنة، وقبلها حرف <Em>مضموم</Em>.</> },
  { glyph: "ي", desc: <>الياء: تكون ساكنة، وقبلها حرف <Em>مكسور</Em>.</> },
] as const

const SUMMARY_ROWS = [
  {
    type: "المد الطبيعي",
    cause: "لا همزة ولا سكون",
    duration: "حركتان",
    badge: "slide" as const,
  },
  {
    type: "المد الواجب المتصل",
    cause: "همزة بعد حرف المد في نفس الكلمة",
    duration: "٤ حركات",
    badge: "accent" as const,
  },
  {
    type: "المد الجائز المنفصل",
    cause: "حرف المد في كلمة، والهمزة في الكلمة التالية",
    duration: "٤ حركات",
    badge: "accent" as const,
  },
]

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
        <CoverTitle>المدود في التجويد</CoverTitle>
        <CoverRule />
        <CoverSubtitle>أحكام المد الطبيعي والفرعي مع الأمثلة القرآنية</CoverSubtitle>
        <CoverMeta>
          <CoverChip color="primary">المد الطبيعي</CoverChip>
          <CoverChip color="madd">حرف المد</CoverChip>
          <CoverChip color="hamza">الهمزة</CoverChip>
        </CoverMeta>
      </div>
    </>
  )
}

function SlideDivider() {
  return (
    <DividerSlide
      num="١"
      eyebrow="الدرس الأول"
      title="المدود في التجويد"
      desc="أحكام المد الطبيعي والفرعي، مع الأمثلة القرآنية المُلوَّنة."
    />
  )
}

function SlideLetters() {
  return (
    <SlideShell eyebrow="المد الطبيعي · ١" title="حروف المد الثلاثة">
      <p className="m-0 mb-2.5 text-center text-lg text-slide-fg-muted">
        حروف المدّ ثلاثة، وهي أصل كل مدٍّ في القرآن الكريم:
      </p>
      <div className="my-4 grid grid-cols-1 gap-3 sm:my-5 sm:grid-cols-3 sm:gap-6.5">
        {MAD_LETTERS.map((letter) => (
          <LetterCard key={letter.glyph} {...letter} />
        ))}
      </div>
      <Alert variant="info" className="mt-5.5">
        <IconInfoCircle />
        <AlertDescription>
          المد الطبيعي يُمدّ بمقدار <Em>حركتين</Em> فقط، وهو الأصل الذي تُبنى
          عليه بقية أنواع المدّ.
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

function SlideConditions() {
  return (
    <SlideShell eyebrow="المد الطبيعي · ٢" title="شروط حروف المد">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        يشترط في كل حرف من حروف المدّ أن يكون ساكناً، ويكون الحرف الذي قبله
        مفتوحاً أو مضموناً أو مكسوراً بحسب نوعه:
      </p>
      <DisplayConditions>
        {MAD_CONDITIONS.map((c) => (
          <CardCondition key={c.glyph} glyph={c.glyph}>
            {c.desc}
          </CardCondition>
        ))}
      </DisplayConditions>
      <Alert variant="info">
        <IconAlertTriangle />
        <AlertDescription>
          إن لم تتحقّق هذه الشروط، فلا تُعدّ الحروف مداً طبيعياً، بل حروف لينٍ
          أو حروف علة.
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

function SlideExamples() {
  return (
    <SlideShell eyebrow="المد الطبيعي · ٣" title="أمثلة المد الطبيعي">
      <CenteredStack>
        <CardExamples className="mb-3">
          <CardExample variant="single">قَ‍<Madd>‍ا</Madd>لَ</CardExample>
          <CardExample variant="single">كَتَ‍<Madd>‍ا</Madd>ب</CardExample>
          <CardExample variant="single">يَقُ‍<Madd>‍و</Madd>لُ</CardExample>
        </CardExamples>
        <DisplayMiniHeading>الأمثلة العُليا، الألف والواو</DisplayMiniHeading>
        <CardExamples>
          <CardExample variant="single">نُ‍<Madd>‍و</Madd>ر</CardExample>
          <CardExample variant="single">قِ‍<Madd>‍ي‍</Madd>لَ</CardExample>
          <CardExample variant="single">كَرِ<Madd>ي‍</Madd>‍م</CardExample>
        </CardExamples>
      </CenteredStack>
      <DisplayLegendRow>
        <DisplayLegendChip color="madd">حرف المد (يُمدّ حركتين)</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideSubCause() {
  return (
    <SlideShell eyebrow="المد الفرعي · ١" title="سبب المد الفرعي وعلامته">
      <p className="m-0 mb-3.5 text-lg text-slide-fg-muted">
        يكون المدّ الفرعي بسبب أحد الأمرين:
      </p>
      <DisplayCausesRow>
        <CauseCard glyph="ء" label="الهمزة" />
        <CauseCard glyph="ْ" label="السكون" />
      </DisplayCausesRow>
      <DisplaySymbol className="mt-3.5">
        <DisplaySymbolGlyph>ٓ</DisplaySymbolGlyph>
        <DisplaySymbolCaption>
          علامة المدّ في <Em>المصحف الشريف</Em>، تُرسم فوق حرف المدّ لتدلّ على
          وجود مدٍّ زائدٍ على المدّ الطبيعي.
        </DisplaySymbolCaption>
      </DisplaySymbol>
    </SlideShell>
  )
}

function SlideHamzaTypes() {
  return (
    <SlideShell eyebrow="المد الفرعي · ٢" title="المد بسبب الهمزة، نوعان">
      <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5.5">
        <CompareCard>
          <CompareCardLabel>واجب متصل</CompareCardLabel>
          <CompareCardTitle>المدّ الواجب المتصل</CompareCardTitle>
          <CompareCardDesc>
            حرف المدّ والهمزة في <Em>نفس الكلمة</Em>، يجب مدّه أربع حركات.
          </CompareCardDesc>
          <CompareCardExample>
            جَ‍<Madd>‍ا</Madd>
            <Hamza>ءَ</Hamza>
          </CompareCardExample>
        </CompareCard>

        <CompareCard variant="accent">
          <CompareCardLabel>جائز منفصل</CompareCardLabel>
          <CompareCardTitle>المدّ الجائز المنفصل</CompareCardTitle>
          <CompareCardDesc>
            حرف المدّ في كلمة، والهمزة في{" "}
            <span className="font-normal text-slide-accent">
              الكلمة التي بعدها
            </span>
            ، يُمدّ أربع حركات.
          </CompareCardDesc>
          <CompareCardExample>
            يَ‍<Madd>‍ا</Madd> <Hamza>أَ</Hamza>يُّهَا
          </CompareCardExample>
        </CompareCard>
      </div>
      <Alert variant="info" className="mt-4">
        <IconInfoCircle />
        <AlertDescription>
          للتبسيط: يُمدّ النوعان معاً بمقدار <Em>أربع حركات</Em>.
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

function SlideMuttasil() {
  return (
    <SlideShell eyebrow="المد الفرعي · ٣" title="المدّ الواجب المتصل، أمثلة">
      <CenteredStack>
        <p className="m-0 mb-3 text-center text-base text-slide-fg-muted">
          حرف المدّ والهمزة في نفس الكلمة، يُمدّ أربع حركات.
        </p>
        <CardExamples className="mb-3">
          <CardExample>جَ‍<Madd>‍ا</Madd><Hamza>ءَ</Hamza></CardExample>
          <CardExample>شَ‍<Madd>‍ا</Madd><Hamza>ءَ</Hamza></CardExample>
          <CardExample>سُ‍<Madd>‍و</Madd><Hamza>ءَ</Hamza></CardExample>
        </CardExamples>
        <CardExamples>
          <CardExample>تَبُ‍<Madd>‍و</Madd><Hamza>ءَ</Hamza></CardExample>
          <CardExample>ﺟِ<Madd>ﻲ</Madd><Hamza>ءَ</Hamza></CardExample>
          <CardExample>هَنِ‍<Madd>‍ي‍</Madd><Hamza>ئًا</Hamza></CardExample>
        </CardExamples>
      </CenteredStack>
      <DisplayLegendRow>
        <DisplayLegendChip color="madd">حرف المد</DisplayLegendChip>
        <DisplayLegendChip color="hamza">الهمزة</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideMunfasil() {
  return (
    <SlideShell eyebrow="المد الفرعي · ٤" title="المدّ الجائز المنفصل، أمثلة">
      <CenteredStack>
        <p className="m-0 mb-3 text-center text-base text-slide-fg-muted">
          حرف المدّ في آخر كلمة، والهمزة في أول الكلمة التي تليها.
        </p>
        <CardExamples className="mb-3">
          <CardExample>فِيهَ‍<Madd>‍ا</Madd>&nbsp; <Hamza>أَ</Hamza>نْهَارٌ</CardExample>
          <CardExample>يَ‍<Madd>‍ا</Madd>&nbsp; <Hamza>أَ</Hamza>يُّهَا</CardExample>
          <CardExample>قَالُ‍<Madd>‍وا</Madd>&nbsp; <Hamza>إِ</Hamza>نَّا</CardExample>
        </CardExamples>
        <CardExamples>
          <CardExample>آمَنُ‍<Madd>‍وا</Madd>&nbsp; <Hamza>أَ</Hamza>نْزَلْنَا</CardExample>
          <CardExample>فِ‍<Madd>‍ي</Madd>&nbsp; <Hamza>أَ</Hamza>نْفُسِكُمْ</CardExample>
          <CardExample>إِنِّ‍<Madd>‍ي</Madd>&nbsp; <Hamza>أَ</Hamza>عْلَمُ</CardExample>
        </CardExamples>
      </CenteredStack>
      <DisplayLegendRow>
        <DisplayLegendChip color="madd">حرف المد</DisplayLegendChip>
        <DisplayLegendChip color="hamza">الهمزة</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideSummary() {
  return (
    <SlideShell eyebrow="خلاصة" title="ملخّص سريع، جدول المقارنة">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        جدولٌ مختصر يُلخّص الأنواع الثلاثة مع أسبابها ومقاديرها:
      </p>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">النوع</TableHead>
              <TableHead className="w-[45%]">السبب</TableHead>
              <TableHead className="w-[25%] text-center!">مقدار المد</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SUMMARY_ROWS.map((row) => (
              <TableRow key={row.type}>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.cause}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={row.badge}>{row.duration}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Alert variant="info" className="mt-4">
        <IconInfoCircle />
        <AlertDescription>
          القاعدة الذهبية: المد الطبيعي <Em>حركتان</Em>، والمدّ بسبب الهمزة{" "}
          <Em>أربع حركات</Em>.
        </AlertDescription>
      </Alert>
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
        <CoverSubtitle>الحمد لله الذي علّمنا</CoverSubtitle>
      </div>
    </>
  )
}

/* ──────────────────────── Deck ──────────────────────── */

export const MADDS_SLIDES_AR: readonly SlideDefinition[] = [
  { Component: SlideCover, className: "cover" },
  { Component: SlideDivider, className: "divider" },
  { Component: SlideLetters },
  { Component: SlideConditions },
  { Component: SlideExamples },
  { Component: SlideSubCause },
  { Component: SlideHamzaTypes },
  { Component: SlideMuttasil },
  { Component: SlideMunfasil },
  { Component: SlideSummary },
  { Component: SlideClosing, className: "closing" },
] as const
