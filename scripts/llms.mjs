// Generates site/public/llms.txt and the README component list from registry.json (never edit either by hand).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"

const REPO = "Romcharted/mangacn"
const registry = JSON.parse(readFileSync("registry.json", "utf8"))

const out = [
  `# mangacn`,
  ``,
  `> ${registry.items.length} shadcn/ui registry items that redraw shadcn in a manga style (ink, paper, screentone) with one accent colour, a dark mode (the negative of the page) and right-to-left reading order. MIT. Installed with the shadcn CLI straight from GitHub.`,
  ``,
  `Install any item: \`npx shadcn@latest add ${REPO}/<item>\``,
  `Every item depends on \`${REPO}/base\` (tokens, screentone utilities, animations), installed automatically.`,
  `Restyled shadcn components install to \`@ui/manga/<name>.tsx\` and wrap the project's own \`@/components/ui/<name>\` (works with Radix and Base UI).`,
  `Homepage: ${registry.homepage}`,
  ``,
  `## Items`,
  ``,
]

for (const item of registry.items) {
  out.push(`### ${item.title} (\`${item.name}\`)`, ``, item.description, ``)
  out.push(`- Install: \`npx shadcn@latest add ${REPO}/${item.name}\``)
  if (item.categories?.length) out.push(`- Categories: ${item.categories.join(", ")}`)
  const props = item.meta?.props ?? []
  if (props.length) {
    out.push(`- Props:`)
    for (const p of props)
      out.push(`  - \`${p.name}\`: \`${p.type}\`${p.default ? ` (default \`${p.default}\`)` : ""} — ${p.description}`)
  }
  if (item.meta?.usage) out.push(``, "```tsx", item.meta.usage, "```")
  out.push(``)
}

mkdirSync("site/public", { recursive: true })
writeFileSync("site/public/llms.txt", out.join("\n"))
console.log(`llms.txt: ${registry.items.length} items`)

// README: the component list between the two markers, grouped like the showcase.
const CATEGORIES = { foundations: "Foundations", actions: "Actions & input", feedback: "Feedback", overlays: "Overlays", navigation: "Navigation", display: "Display", manga: "Manga pieces", blocks: "Full interfaces" }
const list = [`${registry.items.length} items. Each one installs with \`npx shadcn@latest add ${REPO}/<name>\`.`, ``]
for (const [key, label] of Object.entries(CATEGORIES)) {
  const items = registry.items.filter((i) => i.categories?.[0] === key)
  if (!items.length) continue
  list.push(`### ${label}`, ``, `| Name | Item | What it looks like |`, `| --- | --- | --- |`)
  for (const i of items) list.push(`| ${i.title} | \`${i.name}\` | ${i.meta?.tagline ?? ""} |`)
  list.push(``)
}
const readme = readFileSync("README.md", "utf8")
const start = "<!-- items:start -->", end = "<!-- items:end -->"
if (readme.includes(start)) {
  const at = readme.indexOf(start) + start.length
  const next = readme.slice(0, at) + "\n\n" + list.join("\n") + "\n" + readme.slice(readme.indexOf(end))
  writeFileSync("README.md", next)
  console.log(`README: ${registry.items.length} items listed`)
}
