import { Spoiler } from "@registry/manga/signature/spoiler"
import { Tile, force } from "../state-grid"

// Art drawn for this showcase: abstract shapes, no existing work. Ink = currentColor, paper = the background.

function Panel() {
  return (
    <svg viewBox="0 0 320 240" className="block h-auto w-full" aria-hidden>
      <rect width="320" height="240" fill="var(--background)" />
      <circle cx="232" cy="72" r="34" fill="currentColor" />
      <path d="M0 170c60-44 110-44 170 0s90 24 150-6v76H0z" fill="currentColor" />
      <path d="M40 240V150h30v90M96 240V120h22v120" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M150 240 210 130l60 110z" fill="var(--background)" stroke="currentColor" strokeWidth="5" />
    </svg>
  )
}

export function Preview() {
  return (
    <div className="grid max-w-md gap-6">
      <Spoiler label="Chapter 12 ending" className="w-full">
        <Panel />
      </Spoiler>
      <p className="font-sans text-base leading-relaxed">
        The letter was signed by <Spoiler variant="inline" label="the editor">the editor</Spoiler>, not by the sender.
      </p>
    </div>
  )
}

export function States() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tile label="block · hidden" size="lg">
        <div className="w-40">
          <Spoiler label="Chapter 12 ending" revealed={false}>
            <Panel />
          </Spoiler>
        </div>
      </Tile>
      <Tile label="block · hidden · hover" size="lg">
        <div className="w-40">
          <Spoiler label="Chapter 12 ending" revealed={false} triggerProps={force("hover")}>
            <Panel />
          </Spoiler>
        </div>
      </Tile>
      <Tile label="block · hidden · focus" size="lg">
        <div className="w-40">
          <Spoiler label="Chapter 12 ending" revealed={false} triggerProps={force("focus")}>
            <Panel />
          </Spoiler>
        </div>
      </Tile>
      <Tile label="block · revealed" size="lg">
        <div className="w-40">
          <Spoiler label="Chapter 12 ending" revealed>
            <Panel />
          </Spoiler>
        </div>
      </Tile>
      <Tile label="inline · hidden" size="md">
        <p className="font-sans text-sm">
          Signed by <Spoiler variant="inline" label="the editor" revealed={false}>the editor</Spoiler>.
        </p>
      </Tile>
      <Tile label="inline · hidden · hover" size="md">
        <p className="font-sans text-sm">
          Signed by{" "}
          <Spoiler variant="inline" label="the editor" revealed={false} triggerProps={force("hover")}>
            the editor
          </Spoiler>
          .
        </p>
      </Tile>
      <Tile label="inline · hidden · focus" size="md">
        <p className="font-sans text-sm">
          Signed by{" "}
          <Spoiler variant="inline" label="the editor" revealed={false} triggerProps={force("focus")}>
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

export function Thumb() {
  return (
    <div className="relative aspect-[4/3] w-24 border-2 border-border">
      <div className="absolute inset-0 bg-background tone-35" aria-hidden />
    </div>
  )
}
