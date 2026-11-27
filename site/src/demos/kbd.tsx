import { Kbd, KbdGroup } from "@registry/manga/ui/kbd"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex w-80 flex-col items-center gap-4 text-center text-base">
      <p>
        Turn the page with <Kbd>←</Kbd> <Kbd>→</Kbd>.
      </p>
      <p>
        Search the library with{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        .
      </p>
      <p>
        Close the panel with <Kbd>Esc</Kbd>.
      </p>
    </div>
  )
}

function Chords() {
  return (
    <div className="flex w-80 flex-col items-center gap-4 text-center text-base">
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  )
}

function InAMenu() {
  const shortcuts = [
    { label: "Next page", keys: ["→"] },
    { label: "Previous page", keys: ["←"] },
    { label: "Open the search", keys: ["Ctrl", "K"] },
  ]
  return (
    <dl className="grid w-80 gap-3 text-base">
      {shortcuts.map((s) => (
        <div key={s.label} className="flex items-center justify-between gap-4">
          <dt>{s.label}</dt>
          <dd>
            <KbdGroup>
              {s.keys.map((k) => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </KbdGroup>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function InASentence() {
  return (
    <p className="w-80 text-center text-base">
      Press <Kbd>Esc</Kbd> to close the panel, or <Kbd>Enter</Kbd> to keep the change.
    </p>
  )
}

export const examples: Example[] = [
  { fn: "Chords", title: "Chords", description: "KbdGroup spaces the keys of one shortcut on one line: Ctrl Shift P, Ctrl K.", Component: Chords },
  { fn: "InAMenu", title: "In a list", description: "Keys sit at the end of a row, to show the shortcut next to its action.", Component: InAMenu },
  { fn: "InASentence", title: "In a sentence", description: "A single Kbd works inline, in the middle of a sentence.", Component: InASentence },
]

/** A key is not interactive: it has no hover, press or focus. Every state is the same cap. */
export function States() {
  return (
    <Tiles>
      <Tile label="key · single letter">
        <Kbd>K</Kbd>
      </Tile>
      <Tile label="key · word">
        <Kbd>Enter</Kbd>
      </Tile>
      <Tile label="key · symbol">
        <Kbd>⌘</Kbd>
      </Tile>
      <Tile label="group · chord" size="lg">
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
      </Tile>
      <Tile label="in a sentence" size="lg">
        <p className="text-base">
          Press <Kbd>Esc</Kbd> to close.
        </p>
      </Tile>
      <Tile label="on an ink flat (selected row)" size="lg">
        <span className="ink-fill fill-in px-3 py-2 font-letter uppercase">
          Go to <Kbd>G</Kbd>
        </span>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  )
}
