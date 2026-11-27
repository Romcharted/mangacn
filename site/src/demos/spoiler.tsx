import { useState } from "react"
import { Spoiler } from "@registry/manga/signature/spoiler"
import type { Example } from "../registry"
import { Tile, force } from "../state-grid"

import { artSrc } from "../mapless"

// A panel from "Mapless", the showcase's series (AI-generated, see public/art/CREDITS.md).
function Panel() {
  return <img src={artSrc("spear-clash", 320)} alt="The Eraser's spear smashes the ink bridge" className="mx-auto block aspect-[4/3] h-auto w-full max-w-[23rem] object-cover" />
}

// On phones the inline reveal is padded to 44 px tall (the line box does not grow).
const INLINE_TOUCH = "max-sm:py-3"

export function Preview() {
  return (
    <div className="w-72">
      <Spoiler label="Chapter 4 ending" className="w-full">
        <Panel />
      </Spoiler>
    </div>
  )
}

function Sentence() {
  return (
    <p className="w-72 max-w-full font-sans text-base leading-relaxed">
      The letter was signed by{" "}
      <Spoiler variant="inline" label="the editor" className={INLINE_TOUCH}>
        the editor
      </Spoiler>
      , not by the sender.
    </p>
  )
}

function Controlled() {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="grid w-72 max-w-full justify-items-center gap-3">
      <Spoiler label="Chapter 4 ending" revealed={revealed} onRevealedChange={setRevealed} className="w-full">
        <Panel />
      </Spoiler>
      <p aria-live="polite" className="font-mono text-sm">
        {revealed ? "Revealed. Hide covers it again." : "Hidden. Tap the cover to reveal it."}
      </p>
    </div>
  )
}

function Paragraph() {
  return (
    <div className="w-72 max-w-full">
      <Spoiler label="the ending of chapter 4" className="w-full">
        <p className="p-4 font-sans text-base leading-relaxed">The Eraser never fell. The bridge broke under him, and the lighthouse went dark for the first time.</p>
      </Spoiler>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Sentence", title: "In a sentence", description: "variant inline hides a few words; the reveal is an ink bar that shows them on tap.", Component: Sentence },
  { fn: "Controlled", title: "Controlled", description: "revealed and onRevealedChange keep the state in your code, here to show a line of status text.", Component: Controlled },
  { fn: "Paragraph", title: "A paragraph", description: "The block variant covers a paragraph of text the same way it covers an image.", Component: Paragraph },
]

export function States() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tile label="block · hidden" size="lg">
        <div className="w-40">
          <Spoiler label="Chapter 4 ending" revealed={false}>
            <Panel />
          </Spoiler>
        </div>
      </Tile>
      <Tile label="block · hidden · hover" size="lg">
        <div className="w-40">
          <Spoiler label="Chapter 4 ending" revealed={false} triggerProps={force("hover")}>
            <Panel />
          </Spoiler>
        </div>
      </Tile>
      <Tile label="block · hidden · focus" size="lg">
        <div className="w-40">
          <Spoiler label="Chapter 4 ending" revealed={false} triggerProps={force("focus")}>
            <Panel />
          </Spoiler>
        </div>
      </Tile>
      <Tile label="block · revealed" size="lg">
        <div className="w-40">
          <Spoiler label="Chapter 4 ending" revealed>
            <Panel />
          </Spoiler>
        </div>
      </Tile>
      <Tile label="inline · hidden" size="md">
        <p className="font-sans text-sm">
          Signed by <Spoiler variant="inline" label="the editor" revealed={false} className={INLINE_TOUCH}>the editor</Spoiler>.
        </p>
      </Tile>
      <Tile label="inline · hidden · hover" size="md">
        <p className="font-sans text-sm">
          Signed by{" "}
          <Spoiler variant="inline" label="the editor" revealed={false} triggerProps={force("hover")} className={INLINE_TOUCH}>
            the editor
          </Spoiler>
          .
        </p>
      </Tile>
      <Tile label="inline · hidden · focus" size="md">
        <p className="font-sans text-sm">
          Signed by{" "}
          <Spoiler variant="inline" label="the editor" revealed={false} triggerProps={force("focus")} className={INLINE_TOUCH}>
            the editor
          </Spoiler>
          .
        </p>
      </Tile>
      <Tile label="inline · revealed" size="md">
        <p className="font-sans text-sm">
          Signed by <Spoiler variant="inline" label="the editor" revealed>the editor</Spoiler>.
        </p>
      </Tile>
    </div>
  )
}

/** Live: a click reveals the panel, another hides it. */
export function Thumb() {
  return (
    <Spoiler label="Ch. 4 ending" className="w-28">
      <Panel />
    </Spoiler>
  )
}
