import * as React from "react"
import { cn } from "cn"

import {
  Combobox,
  ComboboxChip as ShadcnComboboxChip,
  ComboboxChips as ShadcnComboboxChips,
  ComboboxChipsInput as ShadcnComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent as ShadcnComboboxContent,
  ComboboxEmpty as ShadcnComboboxEmpty,
  ComboboxGroup as ShadcnComboboxGroup,
  ComboboxInput as ShadcnComboboxInput,
  ComboboxItem as ShadcnComboboxItem,
  ComboboxLabel as ShadcnComboboxLabel,
  ComboboxList as ShadcnComboboxList,
  ComboboxSeparator as ShadcnComboboxSeparator,
  ComboboxTrigger as ShadcnComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { inputGroupClassName } from "@/components/ui/manga/input-group"

/*
 * Grammar: the input is the kit input group (2px line, hover thickens — G3 fields —, focus 3px + paper + ink);
 * its chevron is a brush mark (G8) that turns when open; the clear button is a small 2px square that inverts.
 * The popup is a case with a notch toward the input (G1 + G6) that pops in (G5). The highlighted item inverts
 * (G3); the chosen one gets a brush check (G8). Group labels: underlined lettering. Empty: a solid-line box with
 * a "…" mark and lettering, like Empty. Chips (multiple) are drawn like Badge, their remove button inverts.
 * shadcn ships the same Base UI Combobox in its Radix and Base UI versions; states come from the attributes
 * Base UI sets (data-highlighted="", data-selected="", data-disabled="", data-side, aria-expanded).
 */

const comboboxInputClassName = [
  inputGroupClassName,
  // the trigger: a frameless brush chevron (the stock icon is hidden) that inverts on hover
  "[&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:relative [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:rounded-(--radius) [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:bg-transparent [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:text-foreground [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:transition-none",
  "[&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])>svg]:hidden [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:after:mark-chevron [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:after:text-sm",
  "[&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:aria-expanded:after:rotate-180 [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:aria-expanded:after:animate-chevron",
  "[&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:enabled:hover:bg-foreground [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:enabled:hover:text-background",
  "[&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:enabled:active:translate-x-0.5 [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:enabled:active:translate-y-0.5 [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:rtl:enabled:active:-translate-x-0.5 [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:enabled:active:bg-foreground [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:enabled:active:text-background [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:enabled:active:shadow-[inset_0_0_0_2px_var(--background)]",
  "[&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:focus-visible:ring-0 [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:focus-visible:outline-solid [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:focus-visible:outline-2 [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:focus-visible:outline-offset-2 [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:focus-visible:outline-ring",
  "[&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:disabled:pointer-events-auto [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:disabled:cursor-not-allowed [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:disabled:opacity-100",
  "[&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:max-sm:before:absolute [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:max-sm:before:-inset-[10px] [&_[data-slot=input-group-addon]>button:not([data-slot=combobox-clear])]:max-sm:before:content-['']",
  // the clear button: a small 2px square; hover inverts, pressed is a negative with a 2px offset
  "[&_[data-slot=combobox-clear]]:relative [&_[data-slot=combobox-clear]]:rounded-(--radius) [&_[data-slot=combobox-clear]]:border-[length:var(--mg-bw)] [&_[data-slot=combobox-clear]]:border-border [&_[data-slot=combobox-clear]]:bg-background [&_[data-slot=combobox-clear]]:text-foreground [&_[data-slot=combobox-clear]]:opacity-100 [&_[data-slot=combobox-clear]]:transition-none",
  "[&_[data-slot=combobox-clear]]:enabled:hover:border-foreground [&_[data-slot=combobox-clear]]:enabled:hover:bg-foreground [&_[data-slot=combobox-clear]]:enabled:hover:text-background",
  "[&_[data-slot=combobox-clear]]:enabled:active:translate-x-0.5 [&_[data-slot=combobox-clear]]:enabled:active:translate-y-0.5 [&_[data-slot=combobox-clear]]:rtl:enabled:active:-translate-x-0.5 [&_[data-slot=combobox-clear]]:enabled:active:bg-foreground [&_[data-slot=combobox-clear]]:enabled:active:text-background [&_[data-slot=combobox-clear]]:enabled:active:shadow-[inset_0_0_0_2px_var(--background)]",
  "[&_[data-slot=combobox-clear]]:focus-visible:ring-0 [&_[data-slot=combobox-clear]]:focus-visible:outline-solid [&_[data-slot=combobox-clear]]:focus-visible:outline-2 [&_[data-slot=combobox-clear]]:focus-visible:outline-offset-2 [&_[data-slot=combobox-clear]]:focus-visible:outline-ring",
  "[&_[data-slot=combobox-clear]]:disabled:pointer-events-auto [&_[data-slot=combobox-clear]]:disabled:cursor-not-allowed [&_[data-slot=combobox-clear]]:disabled:border-dashed [&_[data-slot=combobox-clear]]:disabled:opacity-100",
  "[&_[data-slot=combobox-clear]]:max-sm:after:absolute [&_[data-slot=combobox-clear]]:max-sm:after:-inset-[10px] [&_[data-slot=combobox-clear]]:max-sm:after:content-['']",
].join(" ")

function ComboboxInput({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxInput>) {
  return <ShadcnComboboxInput data-manga="combobox-input" className={cn(comboboxInputClassName, className)} {...props} />
}

/** A standalone trigger (e.g. a button that opens a list with its own search): the chevron is a brush mark. */
function ComboboxTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxTrigger>) {
  return (
    <ShadcnComboboxTrigger
      data-manga="combobox-trigger"
      className={cn("[&>svg:last-child]:hidden after:mark-chevron after:shrink-0 after:text-sm aria-expanded:after:rotate-180 aria-expanded:after:animate-chevron", className)}
      {...props}
    />
  )
}

/** The popup: a case with a notch toward the input, popping in. */
const comboboxContentClassName = [
  "ink-case case-notch overflow-visible! rounded-(--radius)! text-base shadow-none! ring-0!",
  "duration-0 data-open:animate-pop! data-closed:animate-none!",
  // a search field inside the popup keeps the kit field look
  "*:data-[slot=input-group]:border-input! *:data-[slot=input-group]:bg-background!",
].join(" ")

function ComboboxContent({ className, sideOffset = 14, ...props }: React.ComponentProps<typeof ShadcnComboboxContent>) {
  return <ShadcnComboboxContent data-manga="combobox-content" sideOffset={sideOffset} className={cn(comboboxContentClassName, className)} {...props} />
}

function ComboboxList({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxList>) {
  return <ShadcnComboboxList data-manga="combobox-list" className={cn(className)} {...props} />
}

/** An item: inverts when highlighted, a brush check when chosen, a dashed underline when disabled. 44px rows under 640px. */
const comboboxItemClassName = [
  "relative flex w-full items-center gap-2 rounded-none! py-1.5! ps-2! pe-9! text-base! max-sm:min-h-11 cursor-pointer",
  "data-[highlighted]:bg-foreground! data-[highlighted]:text-background! data-[highlighted]:**:text-background!",
  // the stock check is hidden; the chosen item gets a brush check that draws itself
  "[&>span.absolute>svg]:hidden data-[selected]:after:mark-check after:absolute after:end-2 after:text-lg",
  "data-[disabled]:pointer-events-auto data-[disabled]:cursor-not-allowed data-[disabled]:opacity-100! data-[disabled]:underline data-[disabled]:decoration-dashed data-[disabled]:decoration-2 data-[disabled]:underline-offset-4",
  "data-[disabled]:data-[highlighted]:bg-transparent! data-[disabled]:data-[highlighted]:text-foreground!",
].join(" ")

function ComboboxItem({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxItem>) {
  return <ShadcnComboboxItem data-manga="combobox-item" className={cn(comboboxItemClassName, className)} {...props} />
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxGroup>) {
  return <ShadcnComboboxGroup data-manga="combobox-group" className={cn("not-first:mt-1", className)} {...props} />
}

const comboboxLabelClassName = "px-2 pt-1.5 pb-1 font-letter text-sm! tracking-wide text-foreground! uppercase underline decoration-2 underline-offset-4"

function ComboboxLabel({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxLabel>) {
  return <ShadcnComboboxLabel data-manga="combobox-label" className={cn(comboboxLabelClassName, className)} {...props} />
}

/** Empty: a solid-line box (dashes mean "disabled"), a "…" mark, lettering. */
const comboboxEmptyClassName =
  "m-1.5 w-auto! items-center gap-3 border-[length:var(--mg-bw)] border-solid border-border px-3 py-3! font-letter text-base! tracking-wide text-foreground! uppercase before:font-sfx before:text-2xl before:leading-none before:content-['…']"

function ComboboxEmpty({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxEmpty>) {
  return <ShadcnComboboxEmpty data-manga="combobox-empty" className={cn(comboboxEmptyClassName, className)} {...props} />
}

function ComboboxSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxSeparator>) {
  return <ShadcnComboboxSeparator data-manga="combobox-separator" className={cn("h-[length:var(--mg-bw-fine)] bg-border", className)} {...props} />
}

/** The chips field: the input-group look around chips that wrap. */
function ComboboxChips({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxChips>) {
  return (
    <ShadcnComboboxChips
      data-manga="combobox-chips"
      className={cn(
        "relative min-h-10 max-sm:min-h-11 gap-1.5! max-sm:gap-x-2! max-sm:gap-y-3! rounded-(--radius)! border-[length:var(--mg-bw)]! border-input bg-background! py-1.5! text-base! text-foreground shadow-none ring-0! transition-none dark:bg-background! hover-thicken",
        "has-[[data-slot=combobox-chip-input]:focus-visible]:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        // error: accent line, a "!" at the end, a serrated bottom edge
        "has-aria-invalid:border-destructive has-aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)] has-aria-invalid:pe-8!",
        "has-[[aria-invalid=true]:focus-visible]:shadow-[inset_0_0_0_1px_var(--destructive),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        "after:absolute after:end-3 after:top-1/2 after:-translate-y-1/2 after:font-sfx after:text-xl after:leading-none after:text-destructive has-aria-invalid:after:content-['!']",
        "has-aria-invalid:[background-image:conic-gradient(from_-45deg_at_50%_100%,var(--destructive)_90deg,#0000_0)] has-aria-invalid:[background-size:8px_5px] has-aria-invalid:bg-bottom-left has-aria-invalid:bg-repeat-x",
        // disabled: dashed line + tone frame, chips stay on paper
        "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:border-dashed has-[input:disabled]:tone-frame has-[input:disabled]:hover:shadow-none",
        className,
      )}
      {...props}
    />
  )
}

/** A chip, drawn like Badge: 2px frame, lettering, square; its remove button is a cell that inverts. */
const comboboxChipClassName = [
  "h-6! max-sm:h-8! gap-1.5! rounded-(--radius)! border-[length:var(--mg-bw)] border-border bg-background! bg-none! px-2! font-letter text-sm! font-normal! tracking-wide text-foreground! uppercase",
  "has-[>button]:pe-0! has-disabled:opacity-100! has-disabled:border-dashed",
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "[&>button]:relative [&>button]:ms-0! [&>button]:h-full! [&>button]:w-6! [&>button]:max-sm:w-8! [&>button]:rounded-none! [&>button]:border-y-0! [&>button]:border-e-0! [&>button]:border-s-[length:var(--mg-bw)]! [&>button]:border-border! [&>button]:bg-transparent [&>button]:text-foreground [&>button]:opacity-100! [&>button]:shadow-none [&>button]:transition-none [&>button_svg]:size-3.5!",
  "[&>button]:hover:bg-foreground! [&>button]:hover:text-background! [&>button]:active:bg-background! [&>button]:active:text-foreground! [&>button]:active:translate-y-0!",
  // focus stays inside the chip: the cell inverts with a paper line inside
  "[&>button]:focus-visible:bg-foreground! [&>button]:focus-visible:text-background! [&>button]:focus-visible:ring-0! [&>button]:focus-visible:outline-solid! [&>button]:focus-visible:outline-2! [&>button]:focus-visible:outline-offset-[-4px]! [&>button]:focus-visible:outline-background!",
  "[&>button]:max-sm:after:absolute [&>button]:max-sm:after:-inset-x-[6px] [&>button]:max-sm:after:-inset-y-[8px] [&>button]:max-sm:after:content-['']",
].join(" ")

function ComboboxChip({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxChip>) {
  return <ShadcnComboboxChip data-manga="combobox-chip" className={cn(comboboxChipClassName, className)} {...props} />
}

function ComboboxChipsInput({ className, ...props }: React.ComponentProps<typeof ShadcnComboboxChipsInput>) {
  return (
    <ShadcnComboboxChipsInput
      data-manga="combobox-chips-input"
      className={cn("min-h-7 bg-transparent ps-1 text-base text-foreground placeholder:text-foreground placeholder:italic disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

export {
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
}
