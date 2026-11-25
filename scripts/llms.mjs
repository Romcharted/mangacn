// Generates site/public/llms.txt from registry.json (never edit llms.txt by hand).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"

const REPO = "Romcharted/mangacn"
const registry = JSON.parse(readFileSync("registry.json", "utf8"))

const out = [
  `# mangacn`,
  ``,
  `> ${registry.items.length} shadcn/ui registry items that redraw shadcn in a manga style (ink, paper, screentone) with a webtoon theme (data-theme="webtoon"). MIT. Installed with the shadcn CLI straight from GitHub.`,
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
