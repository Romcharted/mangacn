import { ImpactLines, withImpact } from "@/lib/manga/gestures"

/** A plain element made to hit: data-[impact]:animate-hit + <ImpactLines /> + withImpact(). */
function Hit({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={withImpact()}
      className="relative border-ink bg-primary px-4 py-2 font-letter text-primary-foreground uppercase focus-ink press active:bg-background active:text-foreground data-[impact]:animate-hit"
    >
      {children}
      <ImpactLines />
    </button>
  )
}

export function Preview() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-12 px-8 py-4">
        <Hit>Hit me</Hit>
        <Hit>Again</Hit>
      </div>
      <p className="text-sm">
        Without JavaScript the press still shows a 2px offset, the negative and the lines. Every gesture is on the{" "}
        <a href="#grammar" className="hover-underline">
          Grammar page
        </a>
        .
      </p>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="px-6">
      <Hit>Hit me</Hit>
    </div>
  )
}
