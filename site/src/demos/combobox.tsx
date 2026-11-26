import { Fragment } from "react"

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
  ComboboxValue,
  useComboboxAnchor,
} from "@registry/manga/ui/combobox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@registry/manga/ui/input-group"
import { force, Tile, Tiles } from "../state-grid"

const series = ["Night Shift Ink", "Paper Lanterns", "The Rooftop Club", "Salt and Steel", "Harbour Lights", "Last Train Home"]
const genres = ["Action", "Comedy", "Drama", "Mystery", "Romance", "Slice of life", "Sports", "Horror"]
const shelves = [
  { value: "Reading", items: ["Night Shift Ink", "Salt and Steel"] },
  { value: "Plan to read", items: ["Paper Lanterns", "Harbour Lights"] },
  { value: "Finished", items: ["The Rooftop Club"] },
]

function SeriesPicker() {
  return (
    <Combobox items={series} defaultValue="Paper Lanterns">
      <ComboboxInput aria-label="Series" placeholder="Find a series…" showClear className="w-full" />
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
                <ComboboxChip key={value}>{value}</ComboboxChip>
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
      <ComboboxInput aria-label="From your shelves" placeholder="From your shelves…" className="w-full" />
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

export function Preview() {
  return (
    <div className="grid w-full max-w-md gap-5">
      <Field label="Series">
        <SeriesPicker />
      </Field>
      <Field label="Genres">
        <GenrePicker />
      </Field>
      <Field label="Shelves">
        <ShelfPicker />
      </Field>
      <Field label="Publisher (locked)">
        <Combobox items={series} disabled>
          <ComboboxInput aria-label="Publisher" placeholder="Set by your editor" disabled className="w-full" />
        </Combobox>
      </Field>
    </div>
  )
}

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

function Single(props: { invalid?: boolean; disabled?: boolean; clear?: boolean; value?: string }) {
  return (
    <Combobox items={series} defaultValue={props.value ?? null} disabled={props.disabled}>
      <ComboboxInput
        aria-label="Series"
        placeholder="Find a series…"
        className="w-full max-w-64"
        aria-invalid={props.invalid || undefined}
        disabled={props.disabled}
        showClear={props.clear}
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
          <ComboboxInput aria-label="Series" placeholder="Find a series…" className="w-full max-w-64" {...force("focus")} />
        </Combobox>
      </Tile>
      <Tile label="input · error" size="lg">
        <Single invalid value="Salt and Steel" />
      </Tile>
      <Tile label="input · disabled" size="lg">
        <Single disabled />
      </Tile>
      <Tile label="input · with clear" size="lg">
        <Single clear value="Harbour Lights" />
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
                    <ComboboxChip key={value}>{value}</ComboboxChip>
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
                    <ComboboxChip key={value}>{value}</ComboboxChip>
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
                    <ComboboxChip key={value}>{value}</ComboboxChip>
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
        <ComboboxInput aria-label="Series" className="w-full" />
      </Combobox>
    </div>
  )
}
