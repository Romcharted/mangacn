import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectLoading,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@registry/manga/ui/select"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const volumes = [
  { value: "v1", label: "Vol. 1 — The long night" },
  { value: "v2", label: "Vol. 2 — After the rain" },
  { value: "v3", label: "Vol. 3 — Harbour" },
]

export function Preview() {
  return (
    <Select items={volumes} defaultValue="v2">
      <SelectTrigger aria-label="Volume">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          <SelectLabel>Season one</SelectLabel>
          {volumes.map((v) => (
            <SelectItem key={v.value} value={v.value}>
              {v.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function Groups() {
  return (
    <Select items={volumes} defaultValue="v1">
      <SelectTrigger aria-label="Volume">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          <SelectLabel>Season one</SelectLabel>
          <SelectItem value="v1">Vol. 1 — The long night</SelectItem>
          <SelectItem value="v2">Vol. 2 — After the rain</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Season two</SelectLabel>
          <SelectItem value="v4" disabled>
            Vol. 4 — Coming soon
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function Empty() {
  return (
    <Select>
      <SelectTrigger aria-label="Chapter">
        <SelectValue placeholder="No chapters" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectEmpty />
      </SelectContent>
    </Select>
  )
}

function Invalid() {
  return (
    <Select items={volumes}>
      <SelectTrigger aria-label="Volume" aria-invalid>
        <SelectValue placeholder="Required" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {volumes.map((v) => (
          <SelectItem key={v.value} value={v.value}>
            {v.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const examples: Example[] = [
  { fn: "Groups", title: "Groups and a disabled option", description: "SelectGroup with SelectLabel and SelectSeparator splits the list; a disabled item keeps its label with a dashed underline.", Component: Groups },
  { fn: "Empty", title: "Empty list", description: "SelectEmpty tells the reader there is nothing to pick yet, with a mark and a short line.", Component: Empty },
  { fn: "Invalid", title: "Invalid trigger", description: "aria-invalid on SelectTrigger draws the error look until a volume is chosen.", Component: Invalid },
]

/** A static list that looks like the open one, for frozen states. */
function StaticList({ children }: { children: React.ReactNode }) {
  return (
    <div data-side="bottom" className="relative mt-3 w-60 ink-case case-notch p-1 text-base">
      {children}
    </div>
  )
}

function Row({ children, state }: { children: React.ReactNode; state?: "highlighted" | "selected" | "disabled" }) {
  return (
    <div
      className={
        "relative py-1.5 ps-2 pe-9 " +
        (state === "highlighted" ? "bg-foreground text-background" : "") +
        (state === "disabled" ? "cursor-not-allowed underline decoration-dashed underline-offset-4" : "")
      }
    >
      {children}
      {state === "selected" && <span aria-hidden className="absolute end-2 top-1/2 -translate-y-1/2 mark-check text-lg" />}
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="trigger · rest">
        <Select>
          <SelectTrigger aria-label="Rest">
            <SelectValue placeholder="Volume" />
          </SelectTrigger>
        </Select>
      </Tile>
      <Tile label="trigger · hover">
        <Select>
          <SelectTrigger aria-label="Hover" {...force("hover")}>
            <SelectValue placeholder="Volume" />
          </SelectTrigger>
        </Select>
      </Tile>
      <Tile label="trigger · focus">
        <Select>
          <SelectTrigger aria-label="Focus" {...force("focus")}>
            <SelectValue placeholder="Volume" />
          </SelectTrigger>
        </Select>
      </Tile>
      <Tile label="trigger · disabled">
        <Select disabled>
          <SelectTrigger aria-label="Disabled">
            <SelectValue placeholder="Volume" />
          </SelectTrigger>
        </Select>
      </Tile>
      <Tile label="trigger · error">
        <Select>
          <SelectTrigger aria-label="Error" aria-invalid>
            <SelectValue placeholder="Required" />
          </SelectTrigger>
        </Select>
      </Tile>
      <Tile label="list · hover, chosen, disabled, group" size="lg">
        <StaticList>
          <div className="px-2 pt-1.5 pb-1 font-letter text-sm tracking-wide uppercase underline decoration-2 underline-offset-4">Season one</div>
          <Row>Vol. 1 — The long night</Row>
          <Row state="highlighted">Vol. 2 — After the rain</Row>
          <Row state="selected">Vol. 3 — Harbour</Row>
          <div className="-mx-1 my-1 h-px bg-border" />
          <Row state="disabled">Vol. 4 — Coming soon</Row>
        </StaticList>
      </Tile>
      <Tile label="list · empty" size="lg">
        <StaticList>
          <SelectEmpty />
        </StaticList>
      </Tile>
      <Tile label="list · loading" size="lg">
        <StaticList>
          <SelectLoading />
        </StaticList>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Select items={volumes} defaultValue="v1">
      <SelectTrigger size="sm" aria-label="Volume">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {volumes.map((v) => (
          <SelectItem key={v.value} value={v.value}>
            {v.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
