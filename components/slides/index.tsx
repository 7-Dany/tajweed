import type { ComponentType, ReactNode } from "react"
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
  CardWord,
  CardWords,
  CauseCard,
  CompareCard,
  CompareCardDesc,
  CompareCardExample,
  CompareCardLabel,
  CompareCardTitle,
  LetterCard,
} from "@/components/ui/cards"
import {
  ClosingRule,
  ClosingSub,
  ClosingText,
  ClosingTitle,
} from "@/components/ui/closing"
import {
  CoverChip,
  CoverEyebrow,
  CoverFrame,
  CoverMeta,
  CoverRule,
  CoverSubtitle,
  CoverTitle,
} from "@/components/ui/cover"
import {
  DisplayCausesRow,
  DisplayConditions,
  DisplayLegendChip,
  DisplayLegendRow,
  DisplayMiniHeading,
  DisplaySymbol,
  DisplaySymbolCaption,
  DisplaySymbolGlyph,
} from "@/components/ui/display"
import {
  DividerDesc,
  DividerEyebrow,
  DividerInner,
  DividerNum,
  DividerRule,
  DividerTitle,
} from "@/components/ui/divider"
import {
  SlideBody,
  SlideEyebrow,
  SlideHeader,
  SlideHeaderLeft,
  SlideNum,
  SlidePageno,
  SlideTitle,
} from "@/components/ui/slide"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type SlideDefinition = {
  Component: ComponentType
  className?: string
}

type SlideShellProps = {
  num: string
  eyebrow: string
  title: string
  children: ReactNode
}

function SlideShell({ num, eyebrow, title, children }: SlideShellProps) {
  return (
    <>
      <SlideHeader>
        <SlideHeaderLeft>
          <SlideNum>{num}</SlideNum>
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

type DividerSlideProps = {
  num: string
  eyebrow: string
  title: string
  desc: string
}

function DividerSlide({ num, eyebrow, title, desc }: DividerSlideProps) {
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

export function SlideCover() {
  return (
    <>
      <CoverFrame />
      <CoverEyebrow>
        <IconBook />
        علم التجويد
      </CoverEyebrow>
      <CoverTitle>أحكام التجويد</CoverTitle>
      <CoverRule />
      <CoverSubtitle>المدود في التجويد وتمارين نطق الحروف</CoverSubtitle>
      <CoverMeta>
        <CoverChip color="primary">المد الطبيعي</CoverChip>
        <CoverChip color="madd">حرف المد</CoverChip>
        <CoverChip color="hamza">الهمزة</CoverChip>
        <CoverChip color="haa">الحاء</CoverChip>
        <CoverChip color="khaa">الخاء</CoverChip>
      </CoverMeta>
    </>
  )
}

export function SlideDivider1() {
  return (
    <DividerSlide
      num="١"
      eyebrow="القسم الأول"
      title="المدود في التجويد"
      desc="أحكام المد الطبيعي والفرعي، مع الأمثلة القرآنية المُلوَّنة."
    />
  )
}

export function SlideLetters() {
  const letters = [
    { glyph: "ا", label: "الألف", hint: "ساكنة، قبلها فتح" },
    { glyph: "و", label: "الواو", hint: "ساكنة، قبلها ضم" },
    { glyph: "ي", label: "الياء", hint: "ساكنة، قبلها كسر" },
  ]

  return (
    <SlideShell num="٣" eyebrow="المد الطبيعي · ١" title="حروف المد الثلاثة">
      <p className="m-0 mb-2.5 text-center text-lg text-slide-fg-muted">
        حروف المدّ ثلاثة، وهي أصل كل مدٍّ في القرآن الكريم:
      </p>
      <div className="my-5 grid grid-cols-3 gap-6.5">
        {letters.map((letter) => (
          <LetterCard key={letter.glyph} {...letter} />
        ))}
      </div>
      <Alert variant="info" className="mt-5.5">
        <IconInfoCircle />
        <AlertDescription>
          المد الطبيعي يُمدّ بمقدار <span className="em">حركتين</span> فقط، وهو
          الأصل الذي تُبنى عليه بقية أنواع المدّ.
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

export function SlideConditions() {
  const conditions = [
    {
      glyph: "ا",
      content: (
        <>
          الألف: تكون ساكنة، وقبلها حرف <span className="em">مفتوح</span>.
        </>
      ),
    },
    {
      glyph: "و",
      content: (
        <>
          الواو: تكون ساكنة، وقبلها حرف <span className="em">مضموم</span>.
        </>
      ),
    },
    {
      glyph: "ي",
      content: (
        <>
          الياء: تكون ساكنة، وقبلها حرف <span className="em">مكسور</span>.
        </>
      ),
    },
  ]

  return (
    <SlideShell num="٤" eyebrow="المد الطبيعي · ٢" title="شروط حروف المد">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        يشترط في كل حرف من حروف المدّ أن يكون ساكناً، ويكون الحرف الذي قبله
        مفتوحاً أو مضموناً أو مكسوراً بحسب نوعه:
      </p>
      <DisplayConditions>
        {conditions.map((condition) => (
          <CardCondition key={condition.glyph} glyph={condition.glyph}>
            {condition.content}
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

export function SlideExamples() {
  return (
    <SlideShell num="٥" eyebrow="المد الطبيعي · ٣" title="أمثلة المد الطبيعي">
      <div className="flex flex-1 flex-col justify-center">
        <CardExamples className="mb-3">
          <CardExample variant="single">
            قَ‍<span className="madd">‍ا</span>لَ
          </CardExample>
          <CardExample variant="single">
            كَتَ‍<span className="madd">‍ا</span>ب
          </CardExample>
          <CardExample variant="single">
            يَقُ‍<span className="madd">‍و</span>لُ
          </CardExample>
        </CardExamples>
        <DisplayMiniHeading>الأمثلة العُليا، الألف والواو</DisplayMiniHeading>
        <CardExamples>
          <CardExample variant="single">
            نُ‍<span className="madd">‍و</span>ر
          </CardExample>
          <CardExample variant="single">
            قِ‍<span className="madd">‍ي‍</span>لَ
          </CardExample>
          <CardExample variant="single">
            كَرِ<span className="madd">ي‍</span>‍م
          </CardExample>
        </CardExamples>
      </div>
      <DisplayLegendRow>
        <DisplayLegendChip color="madd">
          حرف المد (يُمدّ حركتين)
        </DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

export function SlideSubCause() {
  return (
    <SlideShell
      num="٦"
      eyebrow="المد الفرعي · ١"
      title="سبب المد الفرعي وعلامته"
    >
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
          علامة المدّ في <span className="em">المصحف الشريف</span>، تُرسم فوق
          حرف المدّ لتدلّ على وجود مدٍّ زائدٍ على المدّ الطبيعي.
        </DisplaySymbolCaption>
      </DisplaySymbol>
    </SlideShell>
  )
}

export function SlideHamzaTypes() {
  return (
    <SlideShell
      num="٧"
      eyebrow="المد الفرعي · ٢"
      title="المد بسبب الهمزة، نوعان"
    >
      <div className="my-2 grid grid-cols-2 gap-5.5">
        <CompareCard>
          <CompareCardLabel>واجب متصل</CompareCardLabel>
          <CompareCardTitle>المدّ الواجب المتصل</CompareCardTitle>
          <CompareCardDesc>
            حرف المدّ والهمزة في <span className="em">نفس الكلمة</span>، يجب
            مدّه أربع حركات.
          </CompareCardDesc>
          <CompareCardExample>
            جَ‍<span className="madd">‍ا</span>
            <span className="hamza">ءَ</span>
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
            يَ‍<span className="madd">‍ا</span>{" "}
            <span className="hamza">أَ</span>يُّهَا
          </CompareCardExample>
        </CompareCard>
      </div>
      <Alert variant="info" className="mt-4">
        <IconInfoCircle />
        <AlertDescription>
          للتبسيط: يُمدّ النوعان معاً بمقدار{" "}
          <span className="em">أربع حركات</span>.
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

export function SlideMuttasil() {
  return (
    <SlideShell
      num="٨"
      eyebrow="المد الفرعي · ٣"
      title="المدّ الواجب المتصل، أمثلة"
    >
      <div className="flex flex-1 flex-col justify-center">
        <p className="m-0 mb-3 text-center text-base text-slide-fg-muted">
          حرف المدّ والهمزة في نفس الكلمة، يُمدّ أربع حركات.
        </p>
        <CardExamples className="mb-3">
          <CardExample>
            جَ‍<span className="madd">‍ا</span>
            <span className="hamza">ءَ</span>
          </CardExample>
          <CardExample>
            شَ‍<span className="madd">‍ا</span>
            <span className="hamza">ءَ</span>
          </CardExample>
          <CardExample>
            سُ‍<span className="madd">‍و</span>
            <span className="hamza">ءَ</span>
          </CardExample>
        </CardExamples>
        <CardExamples>
          <CardExample>
            تَبُ‍<span className="madd">‍و</span>
            <span className="hamza">ءَ</span>
          </CardExample>
          <CardExample>
            ﺟِ<span className="madd">ﻲ</span>
            <span className="hamza">ءَ</span>
          </CardExample>
          <CardExample>
            هَنِ‍<span className="madd">‍ي‍</span>
            <span className="hamza">ئًا</span>
          </CardExample>
        </CardExamples>
      </div>
      <DisplayLegendRow>
        <DisplayLegendChip color="madd">حرف المد</DisplayLegendChip>
        <DisplayLegendChip color="hamza">الهمزة</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

export function SlideMunfasil() {
  return (
    <SlideShell
      num="٩"
      eyebrow="المد الفرعي · ٤"
      title="المدّ الجائز المنفصل، أمثلة"
    >
      <div className="flex flex-1 flex-col justify-center">
        <p className="m-0 mb-3 text-center text-base text-slide-fg-muted">
          حرف المدّ في آخر كلمة، والهمزة في أول الكلمة التي تليها.
        </p>
        <CardExamples className="mb-3">
          <CardExample>
            فِيهَ‍<span className="madd">‍ا</span>&nbsp;{" "}
            <span className="hamza">أَ</span>نْهَارٌ
          </CardExample>
          <CardExample>
            يَ‍<span className="madd">‍ا</span>&nbsp;{" "}
            <span className="hamza">أَ</span>يُّهَا
          </CardExample>
          <CardExample>
            قَالُ‍<span className="madd">‍وا</span>&nbsp;{" "}
            <span className="hamza">إِ</span>نَّا
          </CardExample>
        </CardExamples>
        <CardExamples>
          <CardExample>
            آمَنُ‍<span className="madd">‍وا</span>&nbsp;{" "}
            <span className="hamza">أَ</span>نْزَلْنَا
          </CardExample>
          <CardExample>
            فِ‍<span className="madd">‍ي</span>&nbsp;{" "}
            <span className="hamza">أَ</span>نْفُسِكُمْ
          </CardExample>
          <CardExample>
            إِنِّ‍<span className="madd">‍ي</span>&nbsp;{" "}
            <span className="hamza">أَ</span>عْلَمُ
          </CardExample>
        </CardExamples>
      </div>
      <DisplayLegendRow>
        <DisplayLegendChip color="madd">حرف المد</DisplayLegendChip>
        <DisplayLegendChip color="hamza">الهمزة</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

export function SlideSummary() {
  return (
    <SlideShell num="١٠" eyebrow="خلاصة" title="ملخّص سريع، جدول المقارنة">
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
            <TableRow>
              <TableCell>المد الطبيعي</TableCell>
              <TableCell>لا همزة ولا سكون</TableCell>
              <TableCell className="text-center">
                <Badge variant="slide">حركتان</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>المد الواجب المتصل</TableCell>
              <TableCell>همزة بعد حرف المد في نفس الكلمة</TableCell>
              <TableCell className="text-center">
                <Badge variant="accent">٤ حركات</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>المد الجائز المنفصل</TableCell>
              <TableCell>حرف المد في كلمة، والهمزة في الكلمة التالية</TableCell>
              <TableCell className="text-center">
                <Badge variant="accent">٤ حركات</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Alert variant="info" className="mt-4">
        <IconInfoCircle />
        <AlertDescription>
          القاعدة الذهبية: المد الطبيعي <span className="em">حركتان</span>،
          والمدّ بسبب الهمزة <span className="em">أربع حركات</span>.
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

export function SlideDivider2() {
  return (
    <DividerSlide
      num="٢"
      eyebrow="القسم الثاني"
      title="تمارين نطق الحروف"
      desc="كلماتٌ ذات معنى وكلماتٌ تدريبية لتمييز الحاء والخاء."
    />
  )
}

export function SlideWordsMeaning() {
  const words = [
    <>
      بَ‍<span className="haa">‍حـ</span>َثَ
    </>,
    <>خَـبَـأَ</>,
    <>أَخَـذَ</>,
    <>
      <span className="haa">حـ</span>َذَرَ
    </>,
    <>
      <span className="khaa">خـ</span>َرَجَ
    </>,
    <>دَرَسَ</>,
    <>
      شَـرَ<span className="haa">ح</span>َ
    </>,
    <>
      ذَبَ‍<span className="haa">‍ح</span>َ
    </>,
    <>
      <span className="haa">حـ</span>َرَثَ
    </>,
    <>سَـجَـدَ</>,
    <>
      رَجَ‍<span className="haa">‍ح</span>َ
    </>,
    <>
      بَـذَ<span className="khaa">خ</span>َ
    </>,
    <>
      <span className="khaa">خـ</span>َشَـبَ
    </>,
    <>
      شَ‍<span className="haa">‍حـ</span>َذَ
    </>,
    <>
      <span className="haa">حـ</span>َشَـدَ
    </>,
  ]

  return (
    <SlideShell num="١٢" eyebrow="التمارين · ١" title="كلماتٌ ذات معنى">
      <p className="m-0 mb-2 text-center text-base text-slide-fg-muted">
        كلماتٌ مألوفة لتثبيت نطق الحروف في سياقٍ طبيعي.
      </p>
      <CardWords>
        {words.map((word, index) => (
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

export function SlideWordsPractice() {
  const words = [
    <>
      بَـتَ‍<span className="haa">‍ح</span>َ
    </>,
    <>
      تَـبَ‍<span className="khaa">‍خ</span>َ
    </>,
    <>ثَـبَـجَ</>,
    <>
      جَـبَ‍<span className="haa">‍ح</span>َ
    </>,
    <>
      <span className="haa">حـ</span>َبَـثَ
    </>,
    <>
      <span className="khaa">خـ</span>َبَـتَ
    </>,
    <>
      بَـجَ‍<span className="haa">‍ح</span>َ
    </>,
    <>
      تَ‍<span className="haa">‍حـ</span>َبَ
    </>,
    <>
      ثَ‍<span className="khaa">‍خـ</span>َبَ
    </>,
    <>جَـثَـبَ</>,
    <>
      <span className="haa">حـ</span>َتَـجَ
    </>,
    <>
      <span className="khaa">خـ</span>َجَـبَ
    </>,
    <>
      بَـثَ‍<span className="khaa">‍خ</span>َ
    </>,
    <>تَـجَـثَ</>,
    <>
      ثَ‍<span className="haa">‍حـ</span>َبَ
    </>,
  ]

  return (
    <SlideShell num="١٣" eyebrow="التمارين · ٢" title="كلماتٌ تدريبية">
      <p className="m-0 mb-2 text-center text-base text-slide-fg-muted">
        مقاطعُ غيرِ ذات معنى لتركيز الانتباه على تمييز المخارج المتقاربة.
      </p>
      <CardWords>
        {words.map((word, index) => (
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

export function SlideClosing() {
  return (
    <>
      <CoverFrame />
      <ClosingTitle>تمّ بحمد الله</ClosingTitle>
      <ClosingRule />
      <ClosingText>﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</ClosingText>
      <ClosingSub>أحكام التجويد، المدود وتمارين النطق</ClosingSub>
    </>
  )
}

export const SLIDES: readonly SlideDefinition[] = [
  { Component: SlideCover, className: "cover" },
  { Component: SlideDivider1, className: "divider" },
  { Component: SlideLetters },
  { Component: SlideConditions },
  { Component: SlideExamples },
  { Component: SlideSubCause },
  { Component: SlideHamzaTypes },
  { Component: SlideMuttasil },
  { Component: SlideMunfasil },
  { Component: SlideSummary },
  { Component: SlideDivider2, className: "divider" },
  { Component: SlideWordsMeaning },
  { Component: SlideWordsPractice },
  { Component: SlideClosing, className: "closing" },
] as const

export type Slide = (typeof SLIDES)[number]
