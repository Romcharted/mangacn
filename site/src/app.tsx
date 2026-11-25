import { useState } from "react"
import { Hero } from "./hero"
import { usePrefs } from "./prefs"
import { GITHUB_URL, demos, grouped, installCommand, items, type Item } from "./registry"
import { Code, CopyButton } from "./copy"

export function App() {
  const [prefs, set] = usePrefs()
  const [filter, setFilter] = useState("")
  const groups = grouped(filter)

  return (
    <>
      <a href="#catalog" className="skip-link">
        Skip to components
      </a>
      <header className="sticky top-0 z-40 border-b-[length:var(--mg-bw-panel)] border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <a href="#top" className="me-auto font-letter text-2xl leading-none tracking-wide focus-ink">
            manga<span className="ink-fill px-1">cn</span>
          </a>
          <Toggle
            label="Dark"
            pressed={prefs.dark}
            onClick={() => set({ dark: !prefs.dark })}
          />
          <Toggle
            label={prefs.theme === "webtoon" ? "Webtoon" : "Manga"}
            pressed={prefs.theme === "webtoon"}
            title="Switch manga / webtoon theme"
            onClick={() => set({ theme: prefs.theme === "manga" ? "webtoon" : "manga" })}
          />
          <Toggle
            label={prefs.dir === "rtl" ? "R→L" : "L→R"}
            pressed={prefs.dir === "rtl"}
            title="Switch reading direction"
            onClick={() => set({ dir: prefs.dir === "ltr" ? "rtl" : "ltr" })}
          />
          <a
            href={GITHUB_URL}
            className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink"
          >
            GitHub
          </a>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-7xl px-4">
        <section className="grid gap-8 py-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="space-y-5">
            <h1 className="font-letter text-5xl leading-[0.95] uppercase sm:text-6xl">
              shadcn/ui,
              <br />
              inked like a manga.
            </h1>
            <p className="max-w-prose text-lg">
              An open source registry that redraws shadcn/ui in ink and screentone — with a soft,
              full-colour webtoon theme. Same components, same props, new lines.
            </p>
            <div className="flex max-w-xl items-stretch border-ink">
              <code className="min-w-0 flex-1 overflow-x-auto px-3 py-2 text-sm whitespace-nowrap">
                {installCommand("base")}
              </code>
              <CopyButton text={installCommand("base")} className="border-s-[length:var(--mg-bw)]" />
            </div>
          </div>
          <Hero />
        </section>

        <div id="catalog" className="grid gap-8 pb-24 md:grid-cols-[13rem_1fr]">
          <nav aria-label="Components" className="md:sticky md:top-20 md:self-start">
            <label className="block">
              <span className="mb-1 block font-letter text-sm uppercase">Filter</span>
              <input
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="button, tabs…"
                className="h-10 w-full border-ink bg-background px-3 focus-ink"
              />
            </label>
            <ol className="mt-4 max-h-[60vh] space-y-3 overflow-y-auto text-sm">
              {groups.map((g) => (
                <li key={g.id}>
                  <a href={`#cat-${g.id}`} className="font-letter uppercase hover:underline">
                    {g.label}
                  </a>
                  <ul className="mt-1 space-y-0.5 border-s-[length:var(--mg-bw)] border-border ps-3">
                    {g.items.map((i) => (
                      <li key={i.name}>
                        <a href={`#${i.name}`} className="block px-1 hover:ink-fill focus-ink">
                          {i.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs">
              {items.length} item{items.length > 1 ? "s" : ""} in registry.json
            </p>
          </nav>

          <div className="min-w-0 space-y-16">
            {groups.length === 0 && (
              <p className="border-ink tone-10 p-6 font-letter uppercase">No item matches “{filter}”.</p>
            )}
            {groups.map((g) => (
              <section key={g.id} id={`cat-${g.id}`} aria-labelledby={`cat-${g.id}-h`}>
                <h2
                  id={`cat-${g.id}-h`}
                  className="mb-6 inline-block ink-fill px-3 py-1 font-letter text-xl uppercase"
                >
                  {g.label}
                </h2>
                <div className="space-y-14">
                  {g.items.map((i) => (
                    <ItemSection key={i.name} item={i} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t-[length:var(--mg-bw-panel)] border-border py-6 text-center text-sm">
        MIT licensed. Not affiliated with shadcn. <a href={`./llms.txt`} className="underline">llms.txt</a>
      </footer>
    </>
  )
}

function Toggle(props: { label: string; pressed: boolean; title?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={props.pressed}
      title={props.title}
      onClick={props.onClick}
      className="h-9 border-ink px-3 font-letter text-sm uppercase hover:tone-20 focus-ink aria-pressed:ink-fill"
    >
      {props.label}
    </button>
  )
}

function ItemSection({ item }: { item: Item }) {
  const demo = demos[item.name]
  const cmd = installCommand(item.name)
  return (
    <article id={item.name} aria-labelledby={`${item.name}-h`} className="scroll-mt-24">
      <h3 id={`${item.name}-h`} className="font-letter text-3xl uppercase">
        {item.title}
      </h3>
      <p className="mt-1 max-w-3xl">{item.description}</p>

      {demo?.Preview && (
        <div className="relative mt-5 border-ink-panel bg-background p-6 tone-shadow">
          <demo.Preview />
        </div>
      )}

      {demo?.States && (
        <div className="mt-8">
          <h4 className="mb-3 font-letter text-lg uppercase">States</h4>
          <demo.States />
        </div>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="mb-2 font-letter text-lg uppercase">Install</h4>
          <Code text={cmd} />
        </div>
        {item.meta?.usage && (
          <div>
            <h4 className="mb-2 font-letter text-lg uppercase">Usage</h4>
            <Code text={item.meta.usage} />
          </div>
        )}
      </div>
    </article>
  )
}
