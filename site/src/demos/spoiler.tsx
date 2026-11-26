import { Spoiler } from "@registry/manga/signature/spoiler"
import { Tile, force } from "../state-grid"

import { artSrc } from "../mapless"

// A panel from "Mapless", the showcase's series (AI-generated, see public/art/CREDITS.md).
function Panel() {
  return <img src={artSrc("spear-clash", 320)} alt="The Eraser's spear smashes the ink bridge" className="mx-auto block aspect-[4/3] h-auto w-full max-w-[23rem] object-cover" />
}

export function Preview() {
  return (
    <div className="grid max-w-md gap-6">
      <Spoiler label="Chapter 4 ending" className="w-full">
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

/** Live: a click reveals the panel, another hides it. */
export function Thumb() {
  return (
    <Spoiler label="Ch. 4 ending" className="w-28">
      <Panel />
    </Spoiler>
  )
}
