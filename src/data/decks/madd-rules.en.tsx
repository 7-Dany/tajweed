/**
 * Deck: madd-rules (English)
 * Chapter 1 · Lesson 1 — "Rules of Madd (Elongation)"
 *
 * Covers the three madd letters, their conditions, natural madd examples,
 * secondary madd caused by hamza (muttasil & munfasil), and a summary table.
 *
 * Quranic Arabic examples remain in Arabic script — they are divine text,
 * not translatable. Only the surrounding UI is translated to English.
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
  Khaa,
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
  { glyph: "ا", label: "Alif", hint: "Sakin, preceded by fatha" },
  { glyph: "و", label: "Waw", hint: "Sakin, preceded by damma" },
  { glyph: "ي", label: "Yaa", hint: "Sakin, preceded by kasra" },
] as const

const MAD_CONDITIONS = [
  { glyph: "ا", desc: <>Alif: it is <Em>sakin</Em>, preceded by a letter with fatha.</> },
  { glyph: "و", desc: <>Waw: it is <Em>sakin</Em>, preceded by a letter with damma.</> },
  { glyph: "ي", desc: <>Yaa: it is <Em>sakin</Em>, preceded by a letter with kasra.</> },
] as const

const SUMMARY_ROWS = [
  {
    type: "Natural Madd",
    cause: "No hamza, no sukun",
    duration: "2 harakat",
    badge: "slide" as const,
  },
  {
    type: "Connected Obligatory Madd",
    cause: "Hamza after the madd letter in the same word",
    duration: "4 harakat",
    badge: "accent" as const,
  },
  {
    type: "Permissible Separated Madd",
    cause: "Madd letter in one word, hamza in the next word",
    duration: "4 harakat",
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
        Science of Tajweed
      </CoverEyebrow>
      <div className="cover__main">
        <CoverTitle>Rules of Madd (Elongation)</CoverTitle>
        <CoverRule />
        <CoverSubtitle>
          Rules of natural and secondary madd with Quranic examples
        </CoverSubtitle>
        <CoverMeta>
          <CoverChip color="primary">Natural Madd</CoverChip>
          <CoverChip color="madd">Madd Letter</CoverChip>
          <CoverChip color="hamza">Hamza</CoverChip>
        </CoverMeta>
      </div>
    </>
  )
}

function SlideDivider() {
  return (
    <DividerSlide
      num="1"
      eyebrow="Lesson 1"
      title="Rules of Madd (Elongation)"
      desc="Rules of natural and secondary madd, with colored Quranic examples."
    />
  )
}

function SlideLetters() {
  return (
    <SlideShell eyebrow="Natural Madd · 1" title="The Three Madd Letters">
      <p className="m-0 mb-2.5 text-center text-lg text-slide-fg-muted">
        There are three madd letters, and they are the foundation of every
        madd in the Holy Quran:
      </p>
      <div className="my-4 grid grid-cols-1 gap-3 sm:my-5 sm:grid-cols-3 sm:gap-6.5">
        {MAD_LETTERS.map((letter) => (
          <LetterCard key={letter.glyph} {...letter} />
        ))}
      </div>
      <Alert variant="info" className="mt-5.5">
        <IconInfoCircle />
        <AlertDescription>
          Natural madd is elongated by exactly <Em>2 harakat</Em>, and it is
          the foundation upon which all other types of madd are built.
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

function SlideConditions() {
  return (
    <SlideShell eyebrow="Natural Madd · 2" title="Conditions of the Madd Letters">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        Each madd letter must be sakin (carry a sukun), and the letter before
        it must carry a fatha, damma, or kasra according to its type:
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
          If these conditions are not met, the letters are not considered
          natural madd, but rather letters of <Em>lin</Em> or weak letters
          (huruf al-&#699;illah).
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

function SlideExamples() {
  return (
    <SlideShell eyebrow="Natural Madd · 3" title="Natural Madd Examples">
      <CenteredStack>
        <CardExamples className="mb-3">
          <CardExample variant="single">قَ‍<Madd>‍ا</Madd>لَ</CardExample>
          <CardExample variant="single">كَتَ‍<Madd>‍ا</Madd>ب</CardExample>
          <CardExample variant="single">يَقُ‍<Madd>‍و</Madd>لُ</CardExample>
        </CardExamples>
        <DisplayMiniHeading>Examples above: Alif and Waw</DisplayMiniHeading>
        <CardExamples>
          <CardExample variant="single">نُ‍<Madd>‍و</Madd>ر</CardExample>
          <CardExample variant="single">قِ‍<Madd>‍ي‍</Madd>لَ</CardExample>
          <CardExample variant="single">كَرِ<Madd>ي‍</Madd>‍م</CardExample>
        </CardExamples>
      </CenteredStack>
      <DisplayLegendRow>
        <DisplayLegendChip color="madd">Madd letter (elongated 2 harakat)</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideSubCause() {
  return (
    <SlideShell eyebrow="Secondary Madd · 1" title="Cause of Secondary Madd and Its Sign">
      <p className="m-0 mb-3.5 text-lg text-slide-fg-muted">
        Secondary madd is caused by one of two things:
      </p>
      <DisplayCausesRow>
        <CauseCard glyph="ء" label="Hamza" />
        <CauseCard glyph="ْ" label="Sukun" />
      </DisplayCausesRow>
      <DisplaySymbol className="mt-3.5">
        <DisplaySymbolGlyph>ٓ</DisplaySymbolGlyph>
        <DisplaySymbolCaption>
          The madd sign in the <Em>noble Mushaf</Em>, drawn above the madd
          letter to indicate an elongation beyond the natural madd.
        </DisplaySymbolCaption>
      </DisplaySymbol>
    </SlideShell>
  )
}

function SlideHamzaTypes() {
  return (
    <SlideShell eyebrow="Secondary Madd · 2" title="Madd Due to Hamza, Two Types">
      <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5.5">
        <CompareCard>
          <CompareCardLabel>Connected (Obligatory)</CompareCardLabel>
          <CompareCardTitle>Connected Obligatory Madd</CompareCardTitle>
          <CompareCardDesc>
            The madd letter and hamza are in the <Em>same word</Em>; it must
            be elongated 4 harakat.
          </CompareCardDesc>
          <CompareCardExample>
            جَ‍<Madd>‍ا</Madd>
            <Hamza>ءَ</Hamza>
          </CompareCardExample>
        </CompareCard>

        <CompareCard variant="accent">
          <CompareCardLabel>Separated (Permissible)</CompareCardLabel>
          <CompareCardTitle>Permissible Separated Madd</CompareCardTitle>
          <CompareCardDesc>
            The madd letter is in one word, and the hamza is in{" "}
            <span className="font-normal text-slide-accent">
              the next word
            </span>
            ; it is elongated 4 harakat.
          </CompareCardDesc>
          <CompareCardExample>
            يَ‍<Madd>‍ا</Madd> <Hamza>أَ</Hamza>يُّهَا
          </CompareCardExample>
        </CompareCard>
      </div>
      <Alert variant="info" className="mt-4">
        <IconInfoCircle />
        <AlertDescription>
          For simplicity: both types are elongated <Em>4 harakat</Em>.
        </AlertDescription>
      </Alert>
    </SlideShell>
  )
}

function SlideMuttasil() {
  return (
    <SlideShell eyebrow="Secondary Madd · 3" title="Connected Obligatory Madd, Examples">
      <CenteredStack>
        <p className="m-0 mb-3 text-center text-base text-slide-fg-muted">
          The madd letter and hamza are in the same word; it is elongated 4
          harakat.
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
        <DisplayLegendChip color="madd">Madd letter</DisplayLegendChip>
        <DisplayLegendChip color="hamza">Hamza</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideMunfasil() {
  return (
    <SlideShell eyebrow="Secondary Madd · 4" title="Permissible Separated Madd, Examples">
      <CenteredStack>
        <p className="m-0 mb-3 text-center text-base text-slide-fg-muted">
          The madd letter is at the end of a word, and the hamza is at the
          start of the following word.
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
        <DisplayLegendChip color="madd">Madd letter</DisplayLegendChip>
        <DisplayLegendChip color="hamza">Hamza</DisplayLegendChip>
      </DisplayLegendRow>
    </SlideShell>
  )
}

function SlideSummary() {
  return (
    <SlideShell eyebrow="Summary" title="Quick Summary, Comparison Table">
      <p className="m-0 mb-4 text-lg text-slide-fg-muted">
        A brief table summarizing the three types with their causes and
        durations:
      </p>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Type</TableHead>
              <TableHead className="w-[45%]">Cause</TableHead>
              <TableHead className="w-[25%] text-center!">Duration</TableHead>
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
          Golden rule: Natural madd is <Em>2 harakat</Em>, and madd due to
          hamza is <Em>4 harakat</Em>.
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
        <CoverTitle>Lesson Complete</CoverTitle>
        <CoverRule />
        <CoverSubtitle>Praise be to Allah who taught us</CoverSubtitle>
      </div>
    </>
  )
}

/* ──────────────────────── Deck ──────────────────────── */

export const MADDS_SLIDES_EN: readonly SlideDefinition[] = [
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
