import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react"
import { Menu, Search } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@registry/manga/ui/command"
import { Kbd, KbdGroup } from "@registry/manga/ui/kbd"
import { Popover, PopoverContent, PopoverTrigger } from "@registry/manga/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@registry/manga/ui/sheet"
import { AiPanel } from "./ai"
import { interfaces } from "./interfaces"
import { ACCENTS, type Accent, type Prefs } from "./prefs"
import { CATEGORIES, GITHUB_URL, categories, categoryOf, items } from "./registry"
import { track } from "./visits"

/*
 * Site header, one line. From lg up: logo, the three sections, a search field that opens the command palette
 * (Ctrl/⌘ K or /, like the shadcn site), AI, GitHub and a Display menu (theme, accent, reading order).
 * Under lg: logo, search, AI and a menu button that opens a Sheet with everything else.
 */

const ACCENT_LABEL: Record<Accent, string> = { stamp: "Stamp red", indigo: "Indigo", pine: "Pine", ochre: "Ochre" }

const subscribeWidth = (onChange: () => void) => {
  const media = matchMedia("(max-width: 1023.98px)")
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
const useCompactHeader = () => useSyncExternalStore(subscribeWidth, () => matchMedia("(max-width: 1023.98px)").matches)

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)

export type HeaderProps = {
  hash: string
  category: string | null
  onCategory: (c: string | null) => void
  prefs: Prefs
  set: (patch: Partial<Prefs>) => void
}

export function SiteHeader(props: HeaderProps) {
  const compact = useCompactHeader()
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = /input|textarea|select/i.test(t.tagName) || t.isContentEditable
      // Inside the Dashboard example, Ctrl/⌘ K belongs to its own palette.
      const inExample = !!t.closest?.("[data-manga=dashboard]")
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !inExample) || (e.key === "/" && !typing)) {
        e.preventDefault()
        e.stopImmediatePropagation()
        setSearching((open) => !open)
      }
    }
    addEventListener("keydown", onKey, true)
    return () => removeEventListener("keydown", onKey, true)
  }, [])

  return (
    <header className="sticky top-0 z-40 h-14 border-b-[length:var(--mg-bw-panel)] border-border bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-2 px-4">
        <a
          href="#/"
          className="me-2 inline-flex h-11 items-center font-sfx text-xl leading-none focus-ink"
          aria-label="mangacn, home"
        >
          manga<span className="ink-fill px-1">cn</span>
        </a>
        {compact ? (
          <>
            <button
              type="button"
              aria-label="Search components"
              onClick={() => setSearching(true)}
              className="ms-auto grid size-11 place-items-center border-ink focus-ink active:ink-fill"
            >
              <Search aria-hidden className="size-5" />
            </button>
            <AiPanel />
            <PhoneMenu {...props} />
          </>
        ) : (
          <>
            <nav aria-label="Sections" className="flex items-center">
              <Section href="#/" current={props.hash === "" || props.hash === "/" || items.some((i) => i.name === props.hash)}>
                Components
              </Section>
              <Section href="#examples" current={props.hash.startsWith("examples")}>
                Examples
              </Section>
              <Section href="#grammar" current={props.hash === "grammar"}>
                Grammar
              </Section>
            </nav>
            <button
              type="button"
              onClick={() => setSearching(true)}
              className="ms-auto flex h-9 w-44 items-center gap-2 border-ink px-2.5 text-start hover:border-[3px] hover:px-[8px] focus-ink lg:w-72"
            >
              <Search aria-hidden className="size-4 shrink-0" />
              <span className="flex-1 truncate">Search components…</span>
              <KbdGroup aria-hidden className="hidden lg:inline-flex">
                <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </button>
            <AiPanel />
            <a
              href={GITHUB_URL}
              onClick={() => track("github", { from: "header" })}
              className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink"
            >
              GitHub
            </a>
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-1.5 border-ink px-3 font-letter text-sm uppercase hover:border-[3px] hover:px-[10px] focus-ink aria-expanded:ink-fill after:mark-chevron after:text-xs"
                  />
                }
              >
                Display
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <DisplaySettings prefs={props.prefs} set={props.set} idPrefix="pop" />
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
      <SearchPalette open={searching} onOpenChange={setSearching} />
    </header>
  )
}

function Section({ href, current, children }: { href: string; current: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className="inline-flex h-9 items-center px-2.5 font-letter text-base uppercase underline-offset-[6px] hover:underline hover:decoration-2 focus-ink aria-[current=page]:underline aria-[current=page]:decoration-[3px]"
    >
      {children}
    </a>
  )
}

/** Theme, accent and reading order, each with a line saying what it does. Popover on desktop, menu on phones. */
function DisplaySettings({ prefs, set, idPrefix }: { prefs: Prefs; set: (patch: Partial<Prefs>) => void; idPrefix: string }) {
  return (
    <div className="grid gap-4">
      <Segmented
        id={`${idPrefix}-theme`}
        label="Theme"
        value={prefs.dark ? "dark" : "light"}
        options={[
          ["light", "Light"],
          ["dark", "Dark"],
        ]}
        onChange={(v) => set({ dark: v === "dark" })}
      />
      <div className="grid gap-1.5">
        <span id={`${idPrefix}-accent`} className="font-letter text-sm uppercase">
          Accent colour
        </span>
        <div role="radiogroup" aria-labelledby={`${idPrefix}-accent`} className="flex gap-1.5">
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={prefs.accent === a}
              aria-label={ACCENT_LABEL[a]}
              title={ACCENT_LABEL[a]}
              onClick={() => {
                set({ accent: a })
                track("accent", { accent: a })
              }}
              data-accent={a}
              className="grid size-11 place-items-center border-ink-fine focus-ink aria-checked:border-ink aria-checked:outline-2 aria-checked:outline-offset-2 aria-checked:outline-foreground sm:size-9"
            >
              <span className="block size-5 bg-[var(--mg-accent)]" />
            </button>
          ))}
        </div>
        <p className="text-sm">
          The only colour in the kit. In your app, set <code className="font-mono">--mg-accent</code>.
        </p>
      </div>
      <div className="grid gap-1.5">
        <Segmented
          id={`${idPrefix}-reading`}
          label="Reading order"
          value={prefs.reading}
          options={[
            ["ltr", "Left → right"],
            ["rtl", "Right ← left"],
          ]}
          onChange={(v) => set({ reading: v as Prefs["reading"] })}
        />
        <p className="text-sm">Right to left mirrors panels and bubbles, like a printed manga. Text stays left to right.</p>
      </div>
    </div>
  )
}

function Segmented({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: [string, string][]
  onChange: (value: string) => void
}) {
  return (
    <div className="grid gap-1.5">
      <span id={id} className="font-letter text-sm uppercase">
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={id} className="grid auto-cols-fr grid-flow-col border-ink">
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className="h-11 border-s-[length:var(--mg-bw-fine)] border-border px-2 font-letter text-sm uppercase first:border-s-0 hover:shadow-[inset_0_-3px_0_var(--foreground)] focus-ink focus-visible:relative aria-checked:ink-fill aria-checked:hover:shadow-none sm:h-9"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

function PhoneMenu(props: HeaderProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const link =
    "flex h-11 items-center border-ink px-3 font-letter text-base uppercase focus-ink active:ink-fill aria-[current=page]:ink-fill"
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className="inline-flex h-11 items-center gap-1.5 border-ink px-3 font-letter text-sm uppercase focus-ink aria-expanded:ink-fill"
          />
        }
      >
        <Menu aria-hidden className="size-4" />
        Menu
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-sm">
        <SheetHeader className="pe-14">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Sections, categories, display settings and links.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-7 px-4 pb-10">
          <nav aria-label="Sections" className="grid gap-2">
            <a
              href="#/"
              onClick={close}
              className={link}
              aria-current={props.hash === "" || props.hash === "/" ? "page" : undefined}
            >
              Components
            </a>
            <a
              href="#examples"
              onClick={close}
              className={link}
              aria-current={props.hash.startsWith("examples") ? "page" : undefined}
            >
              Examples
            </a>
            <a href="#grammar" onClick={close} className={link} aria-current={props.hash === "grammar" ? "page" : undefined}>
              Grammar
            </a>
          </nav>
          <nav aria-label="Categories" className="grid gap-2">
            <span className="font-letter text-sm uppercase">Categories</span>
            <div className="flex flex-wrap gap-2">
              <CategoryPill active={props.category === null} onClick={() => (props.onCategory(null), close())}>
                All
              </CategoryPill>
              {categories.map((c) => (
                <CategoryPill key={c} active={props.category === c} onClick={() => (props.onCategory(c), close())}>
                  {CATEGORIES[c] ?? c}
                </CategoryPill>
              ))}
            </div>
          </nav>
          <section aria-label="Display" className="grid gap-2">
            <DisplaySettings prefs={props.prefs} set={props.set} idPrefix="menu" />
          </section>
          <div className="grid gap-2">
            <a href={GITHUB_URL} onClick={() => track("github", { from: "menu" })} className={link}>
              GitHub
            </a>
            <a href="#legal" onClick={close} className={link}>
              Legal notice
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function CategoryPill(props: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={props.active}
      onClick={props.onClick}
      className="h-11 shrink-0 border-ink-fine px-3 font-letter text-sm uppercase hover:border-ink focus-ink aria-pressed:ink-fill sm:h-8 sm:px-2.5"
    >
      {props.children}
    </button>
  )
}

/*
 * Word matching instead of cmdk's fuzzy score, which ranks "Atkinson" above "Tabs" for "tab": a title that
 * starts with the query first, then a word that starts with it, then the category, then any substring.
 */
function match(value: string, search: string, keywords?: string[]) {
  const q = search.trim().toLowerCase()
  if (!q) return 1
  const v = value.toLowerCase()
  if (v.startsWith(q)) return 1
  if (v.split(/[\s\-/()]+/).some((word) => word.startsWith(q))) return 0.8
  if (keywords?.some((k) => k.toLowerCase().startsWith(q))) return 0.5
  return v.includes(q) ? 0.3 : 0
}

/** The palette: pages, full interfaces, then every component by category. Choosing one opens it. */
function SearchPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const go = (hash: string) => {
    location.hash = hash
    onOpenChange(false)
  }
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search mangacn"
      description="Find a component, an example or a page."
    >
      <Command filter={match}>
        <CommandInput placeholder="Search components, examples…" />
        <CommandList>
          <CommandEmpty>Nothing matches.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem value="Components gallery all" onSelect={() => go("/")}>
              All components
            </CommandItem>
            <CommandItem value="Examples interfaces" onSelect={() => go("examples")}>
              Examples
            </CommandItem>
            <CommandItem value="Grammar gestures rules" onSelect={() => go("grammar")}>
              Grammar
            </CommandItem>
          </CommandGroup>
          {interfaces.length > 0 && (
            <CommandGroup heading="Interfaces">
              {interfaces.map((i) => (
                <CommandItem key={i.slug} value={`${i.title} interface example`} onSelect={() => go(`examples/${i.slug}`)}>
                  {i.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          {categories.map((c) => (
            <CommandGroup key={c} heading={CATEGORIES[c] ?? c}>
              {items
                .filter((i) => i.type !== "registry:block" && categoryOf(i) === c)
                .map((i) => (
                  <CommandItem
                    key={i.name}
                    value={`${i.title} ${i.name}`}
                    keywords={[CATEGORIES[c] ?? c]}
                    onSelect={() => go(i.name)}
                  >
                    {i.title}
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
