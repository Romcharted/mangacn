import { useEffect, useState, type ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { CopyForAi } from "../ai"
import { Code, CodeToggle, CopyButton } from "../copy"
import { LoadError } from "../load-error"
import { REPO, items, useDemo, type Item } from "../registry"
import { to } from "../router"
import { track } from "../visits"
import { ExampleFrame } from "./frame"
import { componentRoute, familyOf } from "./nav"
import { fileSource } from "./source"

/*
 * One component page, a single scrolling page like the shadcn site:
 *   breadcrumb, title, one sentence (and the shadcn page for a wrapper)
 *   the main Preview / Code frame
 *   Installation (CLI with the package manager, or Manual), Usage, Examples, States, API reference.
 * Previous / next come from the layout.
 */

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/** The shadcn component a wrapper builds on (its plain registry dependency), if any. */
export function upstreamOf(item: Item) {
  return item.registryDependencies?.find((d) => /^[a-z][a-z0-9-]*$/.test(d)) ?? null
}

const PMS = ["pnpm", "npm", "yarn", "bun"] as const
type Pm = (typeof PMS)[number]
const RUN: Record<Pm, string> = { pnpm: "pnpm dlx", npm: "npx", yarn: "yarn dlx", bun: "bunx --bun" }
const ADD: Record<Pm, string> = { pnpm: "pnpm add", npm: "npm install", yarn: "yarn add", bun: "bun add" }

function usePm(): [Pm, (pm: Pm) => void] {
  const [pm, setPm] = useState<Pm>(() => {
    try {
      const saved = localStorage.getItem("mangacn-pm")
      return PMS.includes(saved as Pm) ? (saved as Pm) : "npm"
    } catch {
      return "npm"
    }
  })
  return [
    pm,
    (next) => {
      setPm(next)
      try {
        localStorage.setItem("mangacn-pm", next)
      } catch {
        /* storage unavailable */
      }
    },
  ]
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-14 mb-4 scroll-mt-20 font-letter text-3xl leading-none uppercase">
      <a href={`#${id}`} className="hover:underline focus-ink">
        {children}
      </a>
    </h2>
  )
}

function CommandLine({ text, item }: { text: string; item: string }) {
  return (
    <div className="flex items-stretch border-ink">
      <code className="min-w-0 flex-1 overflow-x-auto px-3 py-2.5 text-sm whitespace-nowrap">{text}</code>
      <CopyButton text={text} onCopied={() => track("copy-install", { item })} className="min-h-11 border-s-[length:var(--mg-bw)] sm:min-h-9" />
    </div>
  )
}

function Install({ item }: { item: Item }) {
  const [pm, setPm] = usePm()
  const upstream = upstreamOf(item)
  const kit = (item.registryDependencies ?? []).filter((d) => d.startsWith(`${REPO}/`)).map((d) => d.slice(REPO.length + 1))
  const deps = item.dependencies ?? []
  const command = `${RUN[pm]} shadcn@latest add ${REPO}/${item.name}`
  return (
    <Tabs variant="underline" defaultValue="cli" className="min-w-0 gap-0">
      <TabsList aria-label="How to install">
        <TabsTrigger value="cli" className="max-sm:min-h-11">
          CLI
        </TabsTrigger>
        <TabsTrigger value="manual" className="max-sm:min-h-11">
          Manual
        </TabsTrigger>
      </TabsList>
      <TabsContent value="cli" className="mt-3 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
        <div role="radiogroup" aria-label="Package manager" className="flex w-fit border-ink">
          {PMS.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={pm === p}
              onClick={() => setPm(p)}
              className="min-h-11 border-s-[length:var(--mg-bw-fine)] border-border px-3 font-mono text-sm first:border-s-0 focus-ink focus-visible:relative aria-checked:ink-fill sm:min-h-8"
            >
              {p}
            </button>
          ))}
        </div>
        <CommandLine text={command} item={item.name} />
        <div className="flex flex-wrap items-center gap-3">
          <CopyForAi item={item} />
          <p className="text-sm">The CLI brings what it needs with it: the base tokens, the fonts and any piece it builds on.</p>
        </div>
      </TabsContent>
      <TabsContent value="manual" className="mt-3 min-w-0">
        <ol className="grid list-none grid-cols-[minmax(0,1fr)] gap-6 [counter-reset:step]">
          {upstream && (
            <Step title={`Add shadcn's ${upstream}`}>
              <p className="text-sm">The manga version wraps your own shadcn component, so Radix and Base UI both work.</p>
              <CommandLine text={`${RUN[pm]} shadcn@latest add ${upstream}`} item={item.name} />
            </Step>
          )}
          {deps.length > 0 && (
            <Step title="Install the dependencies">
              <CommandLine text={`${ADD[pm]} ${deps.join(" ")}`} item={item.name} />
            </Step>
          )}
          {kit.length > 0 && (
            <Step title="Add the mangacn pieces it uses">
              <p className="text-sm">
                {kit.map((k, i) => (
                  <span key={k}>
                    {i > 0 && ", "}
                    <a href={to(items.some((x) => x.name === k && x.type !== "registry:block") ? componentRoute(k) : `examples/${k}`)} className="underline">
                      {items.find((x) => x.name === k)?.title ?? k}
                    </a>
                  </span>
                ))}
                .
              </p>
            </Step>
          )}
          <Step title={item.files && item.files.length > 1 ? "Copy the source files" : "Copy the source file"}>
            {(item.files ?? []).map((f) => (
              <div key={f.path} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5">
                <p className="font-mono text-xs break-all">{target(f)}</p>
                <CodeToggle load={() => fileSource(f.path).then(userFile)} label="Show the source" />
              </div>
            ))}
          </Step>
          <Step title="Check the import paths">
            <p className="text-sm">The files import each other from the paths above. Adjust them if your aliases differ.</p>
          </Step>
        </ol>
      </TabsContent>
    </Tabs>
  )
}

/** Where a file lands after install, as the shadcn CLI writes it. */
function target(f: { path: string; type: string; target?: string }) {
  if (f.target) return f.target.replace(/^@ui\//, "components/ui/").replace(/^@\//, "")
  return f.path.replace(/^registry\/manga\/ui\//, "components/ui/manga/").replace(/^registry\/manga\/signature\//, "components/manga/").replace(/^registry\/manga\/lib\//, "lib/manga/")
}

const userFile = (src: string) => src

function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 ps-10 [counter-increment:step] relative before:absolute before:start-0 before:top-0 before:grid before:size-7 before:place-items-center before:border-ink before:font-letter before:text-sm before:content-[counter(step)]">
      <p className="font-letter text-lg leading-7 uppercase">{title}</p>
      {children}
    </li>
  )
}

function ApiReference({ item }: { item: Item }) {
  const props = item.meta?.props ?? []
  const upstream = upstreamOf(item)
  const upstreamLink = upstream && (
    <a href={`https://ui.shadcn.com/docs/components/${upstream}`} className="underline">
      shadcn&apos;s {upstream} documentation
    </a>
  )
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
      {upstream ? (
        <p>
          {props.length ? "The props mangacn adds. " : "mangacn adds no props of its own. "}Every other prop is shadcn&apos;s and works the same: see {upstreamLink}.
        </p>
      ) : props.length === 0 ? (
        <p>This piece takes no props of its own beyond the standard HTML attributes of its root element.</p>
      ) : null}
      {props.length > 0 && (
        <div className="overflow-x-auto border-ink">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b-[length:var(--mg-bw)] border-border text-start">
                <th scope="col" className="px-3 py-2 text-start font-letter uppercase">
                  Prop
                </th>
                <th scope="col" className="px-3 py-2 text-start font-letter uppercase">
                  Type
                </th>
                <th scope="col" className="px-3 py-2 text-start font-letter uppercase">
                  Default
                </th>
              </tr>
            </thead>
            <tbody>
              {props.map((p, i) => (
                <tr key={`${p.name}-${i}`} className="border-b-[length:var(--mg-bw-fine)] border-border align-top last:border-b-0">
                  <th scope="row" className="px-3 py-2 text-start font-mono font-bold break-words">
                    {p.name}
                  </th>
                  <td className="px-3 py-2">
                    <code className="font-mono break-words">{p.type}</code>
                    <span className="mt-1 block font-sans">{p.description}</span>
                  </td>
                  <td className="px-3 py-2 font-mono">{p.default ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function ComponentPage({ item }: { item: Item }) {
  const { demo, ready, failed } = useDemo(item.name)
  const family = familyOf(item)
  const upstream = upstreamOf(item)
  useEffect(() => {
    document.title = `${item.title} — mangacn`
  }, [item.title])
  const examples = demo?.examples ?? []
  return (
    <article aria-labelledby="page-title">
      <nav aria-label="Breadcrumb" className="font-mono text-xs">
        <ol className="flex flex-wrap items-center gap-x-1.5">
          <li>
            <a href={to("docs")} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-ink sm:min-h-6">
              Docs
            </a>
          </li>
          <li aria-hidden>/</li>
          <li>
            <a href={to("docs/components")} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-ink sm:min-h-6">
              {family.section === "manga" ? "Manga" : "Components"}
            </a>
          </li>
          <li aria-hidden>/</li>
          <li>
            <a
              href={to(`docs/components#${family.id}`)}
              className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-ink sm:min-h-6"
            >
              {family.title}
            </a>
          </li>
        </ol>
      </nav>
      <header className="mt-3 space-y-3">
        <h1 id="page-title" className="font-letter text-4xl leading-none uppercase break-words sm:text-5xl">
          {item.title}
        </h1>
        <p className="text-lg">{item.meta?.tagline ?? item.description}</p>
        {upstream && (
          <p className="text-sm">
            Built on{" "}
            <a href={`https://ui.shadcn.com/docs/components/${upstream}`} className="underline">
              shadcn&apos;s {upstream}
            </a>
            : same props, redrawn in ink.
          </p>
        )}
      </header>

      <section aria-label="Preview" className="mt-8">
        {!ready ? (
          <p role="status" className="grid min-h-[350px] place-items-center border-ink-fine font-letter text-sm uppercase">
            Inking…
          </p>
        ) : failed ? (
          <LoadError />
        ) : demo?.Preview ? (
          <ExampleFrame demo={item.name} fn="Preview" Component={demo.Preview} wide={demo.previewWide} label={item.title} />
        ) : (
          <p>No live preview for this item.</p>
        )}
      </section>

      <H2 id="installation">Installation</H2>
      <Install item={item} />

      {item.meta?.usage && (
        <>
          <H2 id="usage">Usage</H2>
          <Code text={item.meta.usage} />
        </>
      )}

      {examples.length > 0 && (
        <>
          <H2 id="examples">Examples</H2>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-12">
            {examples.map((ex) => {
              const id = `example-${slugify(ex.title)}`
              return (
                <section key={ex.fn} aria-labelledby={id} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
                  <h3 id={id} className="scroll-mt-20 font-letter text-xl leading-none uppercase">
                    {ex.title}
                  </h3>
                  <p>{ex.description}</p>
                  <ExampleFrame demo={item.name} fn={ex.fn} Component={ex.Component} wide={ex.wide} label={ex.title} />
                </section>
              )
            })}
          </div>
        </>
      )}

      {demo?.States && (
        <>
          <H2 id="states">States</H2>
          <div data-demo>
            <demo.States />
          </div>
        </>
      )}

      <H2 id="api-reference">API reference</H2>
      <ApiReference item={item} />
    </article>
  )
}
