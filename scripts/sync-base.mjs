// Turns registry/manga/base/mangacn.css into the `base` item (registry/items/base.json).
//   :root -> cssVars.light, .dark -> cssVars.dark, @theme inline -> cssVars.theme,
//   everything else -> css. `@apply x` of a utility defined in the same file is
//   inlined so the installed CSS does not depend on rule order.
import { readFileSync, writeFileSync } from "node:fs"
import postcss from "postcss"

const CSS = "registry/manga/base/mangacn.css"
const ITEM = "registry/items/base.json"

const root = postcss.parse(readFileSync(CSS, "utf8"))
const clean = (s) => s.replace(/\s+/g, " ").trim()

const utilities = new Map()
root.walkAtRules("utility", (r) => utilities.set(r.params.trim(), r))

const vars = (rule) =>
  Object.fromEntries(
    rule.nodes.filter((n) => n.type === "decl").map((d) => [d.prop.replace(/^--/, ""), clean(d.value)]),
  )

function toObject(container) {
  const out = {}
  for (const node of container.nodes ?? []) {
    if (node.type === "comment") continue
    if (node.type === "decl") {
      out[node.prop] = clean(node.value) + (node.important ? " !important" : "")
    } else if (node.type === "rule") {
      const key = node.selectors.map(clean).join(", ")
      out[key] = { ...(out[key] ?? {}), ...toObject(node) }
    } else if (node.type === "atrule") {
      if (node.name === "apply" && utilities.has(node.params.trim())) {
        Object.assign(out, toObject(utilities.get(node.params.trim())))
        continue
      }
      out[`@${node.name} ${clean(node.params)}`.trim()] = node.nodes ? toObject(node) : {}
    }
  }
  return out
}

const cssVars = { theme: {}, light: {}, dark: {} }
const rest = postcss.root()
for (const node of root.nodes) {
  if (node.type === "rule" && node.selector === ":root") cssVars.light = vars(node)
  else if (node.type === "rule" && node.selector === ".dark") cssVars.dark = vars(node)
  else if (node.type === "atrule" && node.name === "theme") cssVars.theme = vars(node)
  else if (node.type !== "comment") rest.append(node.clone())
}

const base = JSON.parse(readFileSync(ITEM, "utf8"))
base.cssVars = cssVars
base.css = toObject(rest)
writeFileSync(ITEM, JSON.stringify(base, null, 2) + "\n")
console.log(`synced base: ${Object.keys(base.css).length} css blocks, ${Object.keys(cssVars.light).length} light vars`)
