import { SlideDeck } from "@/components/ui/slide"
import { SLIDES } from "@/components/slides"

export default function Page() {
  return (
    <SlideDeck slideClasses={SLIDES.map((slide) => slide.className)}>
      {SLIDES.map(({ Component }, i) => (
        <Component key={i} />
      ))}
    </SlideDeck>
  )
}
