import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@registry/manga/ui/sheet"
import { track } from "./analytics"
import { Code, CopyButton } from "./copy"
import { REPO, installCommand, type Item } from "./registry"

/** Where this copy of the site is served from, so the links work on any host and base path. */
function siteBase() {
  return location.origin + location.pathname.replace(/[^/]*$/, "")
}

/** Where the item's files land after `shadcn add`, by registry type. */
function importPath(item: Item) {
  if (item.type === "registry:ui") return `@/components/ui/manga/${item.name}`
  if (item.type === "registry:lib") return `@/lib/manga/${item.name}`
  if (item.type === "registry:component" || item.type === "registry:block") return `@/components/manga/${item.name}`
  return null
}

/** One item as Markdown for a coding agent: install, import, usage, props. */
export function itemMarkdown(item: Item) {
  const out = [`# ${item.title} — mangacn`, "", item.description, "", "## Install", "", "```bash", installCommand(item.name), "```", ""]
  const from = importPath(item)
  if (from) out.push(`Files are imported from \`${from}\`. Every item brings \`base\` (tokens, screentone, stepped motion) with it.`, "")
  if (item.meta?.usage) out.push("## Usage", "", "```tsx", item.meta.usage, "```", "")
  const props = item.meta?.props ?? []
  if (props.length) {
    out.push("## Props", "", "| Prop | Type | Default | Description |", "| --- | --- | --- | --- |")
    for (const p of props) out.push(`| \`${p.name}\` | \`${p.type.replaceAll("|", "\\|")}\` | ${p.default ? `\`${p.default}\`` : ""} | ${p.description} |`)
    out.push("")
  }
  out.push(`All items: ${siteBase()}llms.txt`)
  return out.join("\n")
}

export function CopyForAi({ item }: { item: Item }) {
  return (
    <span onClickCapture={() => track("copy-ai", { item: item.name })} className="contents">
      <CopyButton text={itemMarkdown(item)} label="Copy for AI" className="h-9 border-ink" />
    </span>
  )
}

function mcpConfig() {
  return JSON.stringify({ registries: { "@mangacn": `${siteBase()}r/{name}.json` } }, null, 2)
}

function agentPrompt() {
  return [
    "Restyle this project's UI with mangacn, a shadcn/ui registry drawn like a manga (ink, paper, screentone).",
    "",
    `1. Read ${siteBase()}llms.txt first: it lists every item with its install command, props and an example.`,
    "2. The project must already use shadcn/ui (components.json). Install items with",
    `   npx shadcn@latest add ${REPO}/<item>  (base, fonts and gestures come along).`,
    "3. Import restyled shadcn components from @/components/ui/manga/<name>: same props as shadcn.",
    "   Manga pieces (speech bubbles, panels, screentone, speed lines) come from @/components/manga/<name>.",
    "4. Keep one accent colour (--mg-accent). Dark mode is shadcn's .dark class. Do not add colours,",
    "   blurred shadows or rounded corners: the kit draws with lines and tones.",
    "5. Start with button, input, card, tabs and dialog, then show me the result before going further.",
  ].join("\n")
}

/** The "AI" button of the header: llms.txt, the MCP server setup, a prompt for a coding agent. */
export function AiPanel() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            className="h-9 border-ink px-3 font-letter text-sm uppercase hover:border-[3px] hover:px-[11px] focus-ink aria-expanded:ink-fill"
          />
        }
      >
        AI
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="pe-12">
          <SheetTitle>Use mangacn with an AI</SheetTitle>
          <SheetDescription>Everything a coding agent needs to install and use the kit.</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 pb-6">
          <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
            <h3 className="font-letter text-lg uppercase">1. llms.txt</h3>
            <p className="text-sm">Every item with its install command, props and a minimal example.</p>
            <div className="flex items-stretch border-ink">
              <a href="./llms.txt" className="min-w-0 flex-1 truncate px-3 py-2 font-mono text-sm underline focus-ink">
                {siteBase()}llms.txt
              </a>
              <CopyButton text={`${siteBase()}llms.txt`} className="border-s-[length:var(--mg-bw)]" />
            </div>
          </section>
          <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
            <h3 className="font-letter text-lg uppercase">2. shadcn MCP server</h3>
            <p className="text-sm">
              Add the namespace to <code className="font-mono">components.json</code>, then set up the server for your
              assistant and restart it.
            </p>
            <Code text={mcpConfig()} />
            <Code text="npx shadcn@latest mcp init --client claude   # or cursor, vscode, codex, opencode" />
          </section>
          <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2">
            <h3 className="font-letter text-lg uppercase">3. A prompt for your agent</h3>
            <p className="text-sm">Paste it into Claude Code, Cursor, Codex or any coding agent.</p>
            <Code text={agentPrompt()} />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
