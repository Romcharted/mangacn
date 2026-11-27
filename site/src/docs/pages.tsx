import { lazy, useEffect, type ReactNode } from "react"
import { AiGuide } from "../ai"
import { Code } from "../copy"
import { REPO, items } from "../registry"
import { to } from "../router"
import changelog from "../../../CHANGELOG.md?raw"
import { H2 } from "./component-page"
import { componentRoute } from "./nav"

const Grammar = lazy(() => import("../grammar").then((m) => ({ default: m.Grammar })))

/* The "Get started" pages of the documentation. Every h2 has an id: it shows in "On this page". */

function Title({ title, lead }: { title: string; lead: ReactNode }) {
  useEffect(() => {
    document.title = `${title} — mangacn`
  }, [title])
  return (
    <header className="space-y-3">
      <p className="font-mono text-xs">Get started</p>
      <h1 id="page-title" className="font-letter text-4xl leading-none uppercase sm:text-5xl">
        {title}
      </h1>
      <p className="text-lg">{lead}</p>
    </header>
  )
}

const Prose = ({ children }: { children: ReactNode }) => <div className="grid gap-4 [&_a]:underline [&_code]:font-mono [&_code]:text-[0.92em]">{children}</div>
const Doc = ({ name, children }: { name: string; children?: ReactNode }) => (
  <a href={to(componentRoute(name))}>{children ?? items.find((i) => i.name === name)?.title ?? name}</a>
)

export function Introduction() {
  const count = items.length
  return (
    <article aria-labelledby="page-title">
      <Title title="Introduction" lead="shadcn/ui, inked like a manga: the same components and props, redrawn in ink and screentone." />
      <Prose>
        <H2 id="what">What it is</H2>
        <p>
          mangacn is a shadcn registry of {count} items. Each restyled component wraps your own shadcn component, so it keeps its
          props, its accessibility and its primitives (Radix or Base UI). The manga pieces (speech bubbles, panels, screentone,
          speed lines, readers) are new components drawn with the same lines.
        </p>
        <p>You install items one by one with the shadcn CLI. The code lands in your project, and you own it.</p>
        <H2 id="how">How it looks</H2>
        <p>
          Ink on paper, one accent colour, no blur, no rounded corners. Depth is a screentone shadow, motion moves in steps at 12
          frames per second, and every component draws from the same eight gestures. See <a href={to("docs/grammar")}>Grammar</a>.
        </p>
        <H2 id="where">Where to start</H2>
        <ul className="grid list-disc gap-1 ps-5">
          <li>
            <a href={to("docs/installation")}>Installation</a>: one command in a shadcn project.
          </li>
          <li>
            <a href={to("docs/components")}>All components</a>, with live previews.
          </li>
          <li>
            <a href={to("examples")}>Examples</a>: ten full interfaces made only with the kit.
          </li>
          <li>
            <a href={to("studio")}>Studio</a>: letter your own manga page.
          </li>
        </ul>
      </Prose>
    </article>
  )
}

export function Installation() {
  return (
    <article aria-labelledby="page-title">
      <Title title="Installation" lead="One command per item, in a project already set up with shadcn." />
      <Prose>
        <H2 id="requirements">Requirements</H2>
        <p>
          A React project with shadcn/ui and Tailwind CSS 4 (<code>npx shadcn@latest init</code>), Next.js or Vite. Radix and Base
          UI both work.
        </p>
        <H2 id="add">Add an item</H2>
        <Code text={`npx shadcn@latest add ${REPO}/button`} />
        <p>
          That installs the manga Button and everything it needs: <Doc name="base" /> (tokens, screentone utilities, stepped
          animations), <Doc name="gestures" /> and three fonts under the SIL Open Font License. List several items to add them at once:
        </p>
        <Code text={`npx shadcn@latest add ${REPO}/dialog ${REPO}/tabs ${REPO}/speech-bubble`} />
        <H2 id="files">Where files go</H2>
        <ul className="grid list-disc gap-1 ps-5">
          <li>
            restyled shadcn components: <code>components/ui/manga/&lt;name&gt;.tsx</code>. Each wraps your own{" "}
            <code>components/ui/&lt;name&gt;</code>, which the CLI adds if it is missing;
          </li>
          <li>
            manga pieces: <code>components/manga/&lt;name&gt;.tsx</code>;
          </li>
          <li>
            the gestures: <code>lib/manga/gestures.tsx</code>.
          </li>
        </ul>
        <H2 id="use">Use it</H2>
        <Code
          text={`import { Button } from "@/components/ui/manga/button"

export function Cta() {
  return <Button variant="shout">Read chapter 1</Button>
}`}
        />
        <H2 id="browse">Browse from the CLI</H2>
        <Code text={`npx shadcn@latest list ${REPO}\nnpx shadcn@latest search ${REPO} --query bubble`} />
      </Prose>
    </article>
  )
}

export function GrammarPage() {
  return (
    <article aria-labelledby="grammar-title">
      <p className="font-mono text-xs">Get started</p>
      <Grammar />
    </article>
  )
}

export function Theming() {
  return (
    <article aria-labelledby="page-title">
      <Title title="Theming and accent" lead="Ink, paper and one accent colour. Dark mode is the negative of the page." />
      <Prose>
        <H2 id="tokens">Tokens</H2>
        <p>
          <Doc name="base" /> sets shadcn&apos;s tokens to ink and paper and adds the kit&apos;s own: line widths (
          <code>--mg-bw</code>, <code>--mg-bw-panel</code>, <code>--mg-bw-fine</code>), screentones and the accent.
        </p>
        <H2 id="accent">Accent colour</H2>
        <p>
          The only colour of the kit is <code>--mg-accent</code>, stamp red by default. Three presets come with it:
        </p>
        <div className="flex flex-wrap gap-3">
          {["stamp", "indigo", "pine", "ochre"].map((a) => (
            <span key={a} data-accent={a} className="inline-flex items-center gap-2 border-ink px-3 py-2 font-mono text-sm">
              <span className="block size-5 bg-[var(--mg-accent)]" /> {a}
            </span>
          ))}
        </div>
        <Code text={`<html data-accent="indigo">\n\n/* or your own */\n:root { --mg-accent: oklch(0.55 0.2 260); }`} />
        <H2 id="dark">Dark mode</H2>
        <p>
          Dark mode uses shadcn&apos;s <code>.dark</code> class. The page turns into its negative: paper lines on ink, and
          screentones keep their contrast. Try it from the Display menu in the header.
        </p>
      </Prose>
    </article>
  )
}

export function Fonts() {
  const fonts = items.filter((i) => i.name.startsWith("font-"))
  return (
    <article aria-labelledby="page-title">
      <Title title="Fonts" lead="Three fonts under the SIL Open Font License, plus an optional Japanese one." />
      <Prose>
        <H2 id="families">The families</H2>
        <ul className="grid gap-3">
          {fonts.map((f) => (
            <li key={f.name} className="grid gap-1 border-ink-fine p-3">
              <Doc name={f.name} />
              <span>{f.meta?.tagline ?? f.description}</span>
            </li>
          ))}
        </ul>
        <H2 id="install">Install</H2>
        <p>The reading, lettering and sound-effect fonts come with every item. The Japanese font is a separate item.</p>
        <Code text={`npx shadcn@latest add ${REPO}/font-japanese`} />
        <H2 id="use">Use</H2>
        <p>
          <code>font-sans</code> for reading, <code>font-letter</code> for lettering and labels, <code>font-sfx</code> for sound
          effects and titles.
        </p>
      </Prose>
    </article>
  )
}

export function ReadingDirection() {
  return (
    <article aria-labelledby="page-title">
      <Title title="Reading direction" lead="Panels and bubbles right to left, like a printed manga, while text stays left to right." />
      <Prose>
        <H2 id="manga-order">Manga reading order</H2>
        <p>
          Set <code>data-reading=&quot;rtl&quot;</code> on <code>&lt;html&gt;</code>. Panels, strips and bubble tails flip, and the{" "}
          <code>reading-rtl:</code> variant lets your own layout follow. The <Doc name="direction" /> item adds the variant and a
          small hook. Try it from the Display menu in the header.
        </p>
        <Code text={`<html data-reading="rtl">`} />
        <H2 id="writing">Writing direction</H2>
        <p>
          Arabic or Hebrew text uses the standard <code>dir=&quot;rtl&quot;</code>, separately. Every component uses logical sides
          (start and end), so both work at once.
        </p>
      </Prose>
    </article>
  )
}

export function ForAi() {
  return (
    <article aria-labelledby="page-title">
      <Title title="For AI" lead="Everything a coding agent needs to install and use the kit." />
      <div className="mt-10">
        <AiGuide page />
      </div>
      <p className="mt-10">
        Every component page also has a <strong>Copy for AI</strong> button: the item as Markdown, with its install command, usage and props.
      </p>
    </article>
  )
}

/** CHANGELOG.md, rendered: headings, lists, bold, code and links. */
export function Changelog() {
  const blocks = changelog.replace(/^# Changelog\s*/, "").split(/\n(?=## )/)
  return (
    <article aria-labelledby="page-title">
      <Title title="Changelog" lead="What changed, release by release." />
      <div className="mt-6 grid gap-2">
        {blocks.map((b, i) => (
          <Markdown key={i} text={b} />
        ))}
      </div>
    </article>
  )
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith("`")) return <code key={i} className="font-mono text-[0.92em]">{part.slice(1, -1)}</code>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) return <a key={i} href={link[2]} className="underline">{link[1]}</a>
    return part
  })
}

function Markdown({ text }: { text: string }) {
  const out: ReactNode[] = []
  let list: string[] = []
  let para: string[] = []
  const flush = () => {
    if (para.length) out.push(<p key={out.length}>{inline(para.join(" "))}</p>)
    if (list.length) out.push(<ul key={out.length} className="grid list-disc gap-1 ps-5">{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>)
    para = []
    list = []
  }
  for (const line of text.split("\n")) {
    if (/^## /.test(line)) {
      flush()
      const title = line.slice(3).replace(/[[\]]/g, "")
      out.push(
        <H2 key={out.length} id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}>
          {title}
        </H2>,
      )
    } else if (/^### /.test(line)) {
      flush()
      out.push(<h3 key={out.length} className="mt-6 font-letter text-xl uppercase">{line.slice(4)}</h3>)
    } else if (/^- /.test(line)) {
      if (para.length) flush()
      list.push(line.slice(2))
    } else if (/^\s+\S/.test(line) && list.length) {
      list[list.length - 1] += " " + line.trim()
    } else if (!line.trim()) {
      flush()
    } else {
      if (list.length) flush()
      para.push(line)
    }
  }
  flush()
  return <div className="grid gap-3">{out}</div>
}
