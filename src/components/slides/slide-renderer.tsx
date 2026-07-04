"use client"

/**
 * SlideRenderer — turns Slide data (domain/slides/schema.ts) into JSX using
 * the existing slide primitives. See refactor-issues/02-slide-renderer.md
 * and refactor-issues/09-generic-block-schema.md (block-kind collapse).
 *
 * This file is the ONLY new consumer of components/slides/{cards,cover,
 * display,divider,table,helpers}.tsx — none of those files change.
 */

import type { ReactNode } from "react"
import { IconAlertTriangle, IconArrowRight, IconBook, IconInfoCircle } from "@tabler/icons-react"

import type { Block, CardItem, GridBlock, ListBlock, RichText, Slide, Tone } from "@/domain/slides/schema"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Em, Madd, Hamza, Haa, Khaa, SlideShell, DividerSlide as DividerSlideShell, CenteredStack } from "@/components/slides/helpers"
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
} from "@/components/slides/cards"
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/slides/table"

/* ───────────────────────── Rich text ───────────────────────── */

const TONE_COMPONENTS = { em: Em, madd: Madd, hamza: Hamza, haa: Haa, khaa: Khaa } as const satisfies Record<
  Tone,
  (props: { children: ReactNode }) => ReactNode
>

/** Renders a RichText run array as plain text + colored spans. */
export function Rich({ runs }: { runs: RichText }): ReactNode {
  return (
    <>
      {runs.map((run, i) => {
        if (!run.tone) return <span key={i}>{run.text}</span>
        const ToneComponent = TONE_COMPONENTS[run.tone]
        return <ToneComponent key={i}>{run.text}</ToneComponent>
      })}
    </>
  )
}

/* ───────────────────────── Grid (letters/examples/words/compare/causes/pairs) ───────────────────────── */

function GridRenderer({ block }: { block: GridBlock }) {
  switch (block.variant) {
    case "letters":
      return (
        <div className="my-4 grid grid-cols-1 gap-3 @sm/slide:my-5 @sm/slide:grid-cols-3 @sm/slide:gap-6.5">
          {block.items.map((item, i) => (
            <LetterCard key={i} glyph={item.glyph ?? ""} label={item.label ?? ""} hint={item.hint} />
          ))}
        </div>
      )
    case "causes":
      return (
        <DisplayCausesRow>
          {block.items.map((item, i) => (
            <CauseCard key={i} glyph={item.glyph ?? ""} label={item.label ?? ""} />
          ))}
        </DisplayCausesRow>
      )
    case "examples":
    case "examples-single":
      return (
        <CardExamples>
          {block.items.map((item, i) => (
            <CardExample key={i} variant={block.variant === "examples-single" ? "single" : undefined}>
              <Rich runs={item.example ?? []} />
            </CardExample>
          ))}
        </CardExamples>
      )
    case "words":
      return (
        <CardWords>
          {block.items.map((item, i) => (
            <CardWord key={i}>
              <Rich runs={item.example ?? []} />
            </CardWord>
          ))}
        </CardWords>
      )
    case "compare":
      return (
        <div className="my-2 grid grid-cols-1 gap-3 @sm/slide:grid-cols-2 @sm/slide:gap-5.5">
          {block.items.map((item, i) => (
            <CompareCard key={i} variant={item.emphasis}>
              <CompareCardLabel>{item.badge}</CompareCardLabel>
              <CompareCardTitle>{item.title}</CompareCardTitle>
              <CompareCardDesc>
                <Rich runs={item.desc ?? []} />
              </CompareCardDesc>
              <CompareCardExample>
                <Rich runs={item.example ?? []} />
              </CompareCardExample>
            </CompareCard>
          ))}
        </div>
      )
    case "pairs":
      return (
        <div className="my-2 grid grid-cols-1 gap-3 @sm/slide:grid-cols-2 @sm/slide:gap-5.5">
          {block.items.map((item, i) => (
            <PairCard key={i} item={item} />
          ))}
        </div>
      )
    default: {
      const _exhaustive: never = block.variant
      return _exhaustive
    }
  }
}

function PairCard({ item }: { item: CardItem }) {
  return (
    <div className="rounded-slide-lg border border-slide-border bg-slide-card p-5 shadow-slide-sm">
      <p className="mb-2 text-lg font-bold text-slide-primary">{item.title}</p>
      <p className="mb-3 text-sm text-slide-fg-muted">
        <Rich runs={item.desc ?? []} />
      </p>
      <div className="rounded-slide border border-slide-border bg-slide-bg-subtle p-3 text-center text-2xl font-bold text-slide-fg">
        <Rich runs={item.example ?? []} />
      </div>
    </div>
  )
}

/* ───────────────────────── List (conditions/overview) ───────────────────────── */

function ListRenderer({ block }: { block: ListBlock }) {
  switch (block.variant) {
    case "conditions":
      return (
        <DisplayConditions>
          {block.items.map((item, i) => (
            <CardCondition key={i} glyph={item.glyph ?? ""}>
              <Rich runs={item.desc ?? []} />
            </CardCondition>
          ))}
        </DisplayConditions>
      )
    case "overview":
      return (
        <div className="my-4 grid grid-cols-1 gap-3 @sm/slide:my-5 @sm/slide:grid-cols-2 @sm/slide:gap-5.5">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 rounded-slide border border-slide-border bg-slide-card p-4 shadow-slide-sm"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slide-primary-tint text-sm font-bold text-slide-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-slide-fg">{item.title}</p>
                <p className="text-sm text-slide-fg-subtle">
                  {item.meta} — <Rich runs={item.desc ?? []} />
                </p>
              </div>
              <IconArrowRight size={20} className="dir-arrow shrink-0 text-slide-fg-subtle" />
            </div>
          ))}
        </div>
      )
    default: {
      const _exhaustive: never = block.variant
      return _exhaustive
    }
  }
}

/* ───────────────────────── Blocks ───────────────────────── */

function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p className="text-base leading-relaxed text-slide-fg @sm/slide:text-lg">
          <Rich runs={block.text} />
        </p>
      )
    case "heading":
      return <DisplayMiniHeading>{block.text}</DisplayMiniHeading>
    case "grid":
      return <GridRenderer block={block} />
    case "list":
      return <ListRenderer block={block} />
    case "legend":
      return (
        <DisplayLegendRow>
          {block.items.map((item, i) => (
            <DisplayLegendChip key={i} color={item.tone}>
              {item.label}
            </DisplayLegendChip>
          ))}
        </DisplayLegendRow>
      )
    case "symbol":
      return (
        <DisplaySymbol>
          <DisplaySymbolGlyph>{block.glyph}</DisplaySymbolGlyph>
          <DisplaySymbolCaption>{block.caption}</DisplaySymbolCaption>
        </DisplaySymbol>
      )
    case "alert":
      return (
        <Alert variant="info" className="mt-4">
          {block.tone === "warning" ? <IconAlertTriangle /> : <IconInfoCircle />}
          <AlertDescription>
            <Rich runs={block.text} />
          </AlertDescription>
        </Alert>
      )
    default: {
      const _exhaustive: never = block
      return _exhaustive
    }
  }
}

/* ───────────────────────── Slides ───────────────────────── */

export function SlideRenderer({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "cover":
      return (
        <>
          <CoverFrame />
          {slide.eyebrow && (
            <CoverEyebrow>
              {slide.eyebrowIcon === "book" && <IconBook />}
              {slide.eyebrow}
            </CoverEyebrow>
          )}
          <div className="cover__main">
            <CoverTitle>{slide.title}</CoverTitle>
            <CoverRule />
            {slide.subtitle && <CoverSubtitle>{slide.subtitle}</CoverSubtitle>}
            {slide.chips && (
              <CoverMeta>
                {slide.chips.map((chip, i) => (
                  <CoverChip key={i} color={chip.tone}>
                    {chip.label}
                  </CoverChip>
                ))}
              </CoverMeta>
            )}
          </div>
        </>
      )
    case "divider":
      return (
        <DividerSlideShell
          num={slide.num}
          eyebrow={slide.eyebrow}
          title={slide.title}
          desc={slide.desc}
        />
      )
    case "content":
      return (
        <SlideShell eyebrow={slide.eyebrow} title={slide.title}>
          <CenteredStack>
            {slide.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </CenteredStack>
        </SlideShell>
      )
    case "table":
      return (
        <SlideShell eyebrow={slide.eyebrow} title={slide.title}>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  {slide.headers.map((h, i) => (
                    <TableHead
                      key={i}
                      className={h.align === "center" ? "text-center!" : undefined}
                    >
                      {h.text}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {slide.rows.map((row, ri) => (
                  <TableRow key={ri}>
                    {row.map((cell, ci) => (
                      <TableCell
                        key={ci}
                        className={cell.align === "center" ? "text-center" : undefined}
                      >
                        {cell.badge ? (
                          <Badge variant={cell.badge}>
                            <Rich runs={cell.text} />
                          </Badge>
                        ) : (
                          <Rich runs={cell.text} />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {slide.note && (
            <Alert variant="info" className="mt-4">
              {slide.note.tone === "warning" ? <IconAlertTriangle /> : <IconInfoCircle />}
              <AlertDescription>
                <Rich runs={slide.note.text} />
              </AlertDescription>
            </Alert>
          )}
        </SlideShell>
      )
    default: {
      const _exhaustive: never = slide
      return _exhaustive
    }
  }
}

/** Mirrors the per-kind className each deck used to pass via SlideDefinition.className. */
export function slideToClassName(slide: Slide): string | undefined {
  switch (slide.kind) {
    case "cover":
      return slide.variant === "closing" ? "closing" : "cover"
    case "divider":
      return "divider"
    default:
      return undefined
  }
}
