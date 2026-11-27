import { Fragment, type ComponentProps } from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { X } from "lucide-react"

import {
  Combobox,
  ComboboxChip,
  comboboxChipClassName,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  comboboxContentClassName,
  ComboboxEmpty,
  comboboxEmptyClassName,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  comboboxItemClassName,
  ComboboxLabel,
  comboboxLabelClassName,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@registry/manga/ui/combobox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@registry/manga/ui/input-group"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const series = ["Night Shift Ink", "Paper Lanterns", "The Rooftop Club", "Salt and Steel", "Harbour Lights", "Last Train Home"]
const genres = ["Action", "Comedy", "Drama", "Mystery", "Romance", "Slice of life", "Sports", "Horror"]
const shelves = [
  { value: "Reading", items: ["Night Shift Ink", "Salt and Steel"] },
  { value: "Plan to read", items: ["Paper Lanterns", "Harbour Lights"] },
  { value: "Finished", items: ["The Rooftop Club"] },
]

/** The input with its own named trigger: the stock trigger has no accessible name, so the demo names it. */
function PickerInput(props: ComponentProps<typeof ComboboxInput>) {
  return (
    <ComboboxInput showTrigger={false} {...props}>
      <InputGroupAddon align="inline-end">
        <ComboboxTrigger
          aria-label={`Open ${props["aria-label"] ?? "the list"}`}
          disabled={props.disabled}
          className="grid size-8 place-items-center max-sm:size-11"
        />
      </InputGroupAddon>
    </ComboboxInput>
  )
}

/** A chip with its own named remove button: the stock remove button has no accessible name. */
function Chip({ value }: { value: string }) {
  return (
    <ComboboxChip showRemove={false}>
      {value}
      <ComboboxPrimitive.ChipRemove aria-label={`Remove ${value}`}>
        <X className="pointer-events-none" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxChip>
  )
}

function SeriesPicker() {
  return (
    <Combobox items={series} defaultValue="Paper Lanterns">
      <PickerInput aria-label="Series" placeholder="Find a series…" className="w-full" />
      <ComboboxContent>
        <ComboboxEmpty>No series found</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function GenrePicker() {
  const anchor = useComboboxAnchor()
  return (
    <Combobox multiple items={genres} defaultValue={["Mystery", "Slice of life", "Sports"]}>
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {(values: string[]) => (
            <Fragment>
              {values.map((value) => (
                <Chip key={value} value={value} />
              ))}
              <ComboboxChipsInput aria-label="Genres" placeholder={values.length ? "" : "Add a genre…"} />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No genre found</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ShelfPicker() {
  return (
    <Combobox items={shelves}>
      <PickerInput aria-label="From your shelves" placeholder="From your shelves…" className="w-full" />
      <ComboboxContent>
        <ComboboxEmpty>Nothing on your shelves</ComboboxEmpty>
        <ComboboxList>
          {(group: (typeof shelves)[number], index: number) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              {index < shelves.length - 1 && <ComboboxSeparator />}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <span className="font-letter text-sm tracking-wide uppercase">{label}</span>
      {children}
    </div>
  )
}

function Genres() {
  return (
    <div className="w-72">
      <Field label="Genres">
        <GenrePicker />
      </Field>
    </div>
  )
}

function Shelves() {
  return (
    <div className="w-72">
      <Field label="Shelves">
        <ShelfPicker />
      </Field>
    </div>
  )
}

function Locked() {
  return (
    <div className="w-72">
      <Field label="Publisher (locked)">
        <Combobox items={series} disabled>
          <PickerInput aria-label="Publisher" placeholder="Set by your editor" disabled className="w-full" />
        </Combobox>
      </Field>
    </div>
  )
}

export function Preview() {
  return (
    <div className="w-72">
      <Field label="Series">
        <SeriesPicker />
      </Field>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Genres", title: "Several values", description: "multiple turns the field into chips: each pick adds one, and its remove cell takes it out.", Component: Genres },
  { fn: "Shelves", title: "Grouped list", description: "Items sorted under underlined group labels, with a fine rule between the groups.", Component: Shelves },
  { fn: "Locked", title: "Disabled", description: "disabled keeps the field on paper with a dashed line and a tone frame; nothing opens.", Component: Locked },
]

/** A static popup that looks like the open one (same classes), for frozen states. */
function StaticPopup({ children }: { children: React.ReactNode }) {
  return (
    <div data-side="bottom" className={`relative mt-3 w-full max-w-64 ${comboboxContentClassName}`}>
      <div className="p-1">{children}</div>
    </div>
  )
}

function Row({ children, state }: { children: React.ReactNode; state?: "highlighted" | "selected" | "disabled" }) {
  return (
    <div
      className={comboboxItemClassName}
      data-highlighted={state === "highlighted" ? "" : undefined}
      data-selected={state === "selected" ? "" : undefined}
      data-disabled={state === "disabled" ? "" : undefined}
    >
      {children}
    </div>
  )
}

function Single(props: { invalid?: boolean; disabled?: boolean; value?: string }) {
  return (
    <Combobox items={series} defaultValue={props.value ?? null} disabled={props.disabled}>
      <PickerInput
        aria-label="Series"
        placeholder="Find a series…"
        className="w-full max-w-64"
        aria-invalid={props.invalid || undefined}
        disabled={props.disabled}
      />
    </Combobox>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="input · rest" size="lg">
        <Single />
      </Tile>
      <Tile label="input · hover" size="lg">
        <InputGroup className="w-full max-w-64" {...force("hover")}>
          <InputGroupInput aria-label="Series" placeholder="Find a series…" />
          <InputGroupAddon align="inline-end">
            <span aria-hidden className="grid size-6 place-items-center">
              <span className="mark-chevron text-sm" />
            </span>
          </InputGroupAddon>
        </InputGroup>
      </Tile>
      <Tile label="input · focus" size="lg">
        <Combobox items={series}>
          <PickerInput aria-label="Series" placeholder="Find a series…" className="w-full max-w-64" {...force("focus")} />
        </Combobox>
      </Tile>
      <Tile label="input · error" size="lg">
        <Single invalid value="Salt and Steel" />
      </Tile>
      <Tile label="input · disabled" size="lg">
        <Single disabled />
      </Tile>
      <Tile label="input · chosen" size="lg">
        <Single value="Harbour Lights" />
      </Tile>
      <Tile label="list · highlighted, chosen, disabled, group" size="lg">
        <StaticPopup>
          <div className={comboboxLabelClassName}>Reading</div>
          <Row>Night Shift Ink</Row>
          <Row state="highlighted">Salt and Steel</Row>
          <Row state="selected">Paper Lanterns</Row>
          <div className="-mx-1 my-1 h-px bg-border" />
          <div className={comboboxLabelClassName}>Coming soon</div>
          <Row state="disabled">Last Train Home</Row>
        </StaticPopup>
      </Tile>
      <Tile label="list · empty" size="lg">
        <StaticPopup>
          <div className={`flex ${comboboxEmptyClassName}`}>No series found</div>
        </StaticPopup>
      </Tile>
      <Tile label="chips · rest" size="lg">
        <Combobox multiple items={genres} defaultValue={["Mystery", "Slice of life", "Sports"]}>
          <ComboboxChips className="w-full max-w-72">
            <ComboboxValue>
              {(values: string[]) => (
                <Fragment>
                  {values.map((value) => (
                    <Chip key={value} value={value} />
                  ))}
                  <ComboboxChipsInput aria-label="Genres" />
                </Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
        </Combobox>
      </Tile>
      <Tile label="chip · remove hover, remove focus" size="lg">
        <div className="flex flex-wrap gap-1.5">
          <span className={`flex w-fit items-center ${comboboxChipClassName}`}>
            Drama
            <button type="button" aria-label="Remove Drama" className="flex items-center justify-center" {...force("hover")}>
              ×
            </button>
          </span>
          <span className={`flex w-fit items-center ${comboboxChipClassName}`}>
            Horror
            <button type="button" aria-label="Remove Horror" className="flex items-center justify-center" {...force("focus")}>
              ×
            </button>
          </span>
        </div>
      </Tile>
      <Tile label="chips · error" size="lg">
        <Combobox multiple items={genres} defaultValue={["Romance"]}>
          <ComboboxChips className="w-full max-w-72">
            <ComboboxValue>
              {(values: string[]) => (
                <Fragment>
                  {values.map((value) => (
                    <Chip key={value} value={value} />
                  ))}
                  <ComboboxChipsInput aria-label="Genres" aria-invalid />
                </Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
        </Combobox>
      </Tile>
      <Tile label="chips · disabled" size="lg">
        <Combobox multiple items={genres} defaultValue={["Action"]} disabled>
          <ComboboxChips className="w-full max-w-72">
            <ComboboxValue>
              {(values: string[]) => (
                <Fragment>
                  {values.map((value) => (
                    <Chip key={value} value={value} />
                  ))}
                  <ComboboxChipsInput aria-label="Genres" disabled />
                </Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
        </Combobox>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="w-56">
      <Combobox items={series} defaultValue="Paper Lanterns">
        <PickerInput aria-label="Series" className="w-full" />
      </Combobox>
    </div>
  )
}
