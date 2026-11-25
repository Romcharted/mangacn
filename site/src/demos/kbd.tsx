import { Kbd, KbdGroup } from "@registry/manga/ui/kbd"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex max-w-md flex-col gap-4 text-base">
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
