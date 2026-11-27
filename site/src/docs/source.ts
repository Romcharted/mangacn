import { userPaths } from "../interfaces"

/*
 * Source text for the Code tabs and the Manual install, loaded on demand (never in the first paint).
 *   demoSource(name)        the showcase demo of an item (site/src/demos/<name>.tsx)
 *   fileSource(path)        a registry file as listed in the item (registry/manga/ui/button.tsx)
 *   snippet(src, fnName)    one function of a demo, with the imports and the local helpers it uses
 */

const demoSources = Object.fromEntries(
  Object.entries(import.meta.glob<string>("../demos/*.tsx", { query: "?raw", import: "default" })).map(([p, load]) => [
    p.replace(/^.*\/(.+)\.tsx$/, "$1"),
    load,
  ]),
)
const registrySources = Object.fromEntries(
  Object.entries(import.meta.glob<string>("../../../registry/manga/**/*.{ts,tsx,css}", { query: "?raw", import: "default" })).map(
    ([p, load]) => [p.replace(/^(\.\.\/)+/, ""), load],
  ),
)

const cache = new Map<string, Promise<string>>()
const once = (key: string, load: () => Promise<string>) => {
  if (!cache.has(key)) cache.set(key, load())
  return cache.get(key)!
}

export const demoSource = (name: string) => (demoSources[name] ? once(`demo:${name}`, demoSources[name]) : Promise.resolve(""))
export const fileSource = (path: string) =>
  registrySources[path] ? once(`file:${path}`, registrySources[path]) : Promise.resolve(`// ${path} is not part of the showcase build`)

type Decl = { names: string[]; text: string; start: number }

/** Top-level statements of a module: imports and declarations, each with the names it binds. */
function topLevel(src: string) {
  const lines = src.split("\n")
  const blocks: { text: string; start: number }[] = []
  let current: string[] = []
  let start = 0
  const flush = () => {
    const text = current.join("\n").trim()
    if (text) blocks.push({ text, start })
    current = []
  }
  lines.forEach((line, i) => {
    // a new statement starts at column 0 with a keyword; comments stick to the statement that follows
    const statement = /^(export |import |function |const |let |type |interface )/.test(line)
    const comment = /^(\/\*|\/\/)/.test(line)
    if (statement || comment) {
      const onlyComments = current.length > 0 && current.every((l) => /^\s*(\/\*|\*|\/\/|$)/.test(l))
      if (!onlyComments) {
        flush()
        start = i
      }
    }
    current.push(line)
  })
  flush()
  const imports: { text: string; names: string[] }[] = []
  const decls: Decl[] = []
  for (const b of blocks) {
    const code = b.text.replace(/^(\/\*[\s\S]*?\*\/|\/\/[^\n]*\n)\s*/g, "")
    if (code.startsWith("import ")) {
      const names = [...code.replace(/from\s+["'][^"']+["']/, "").matchAll(/([A-Za-z_$][\w$]*)(?=\s*[,}\n]|\s+from)/g)].map((m) => m[1])
      imports.push({ text: code, names: names.filter((n) => !["import", "type", "as"].includes(n)) })
      continue
    }
    const m = code.match(/^(?:export\s+)?(?:default\s+)?(?:function|const|let|type|interface)\s+([A-Za-z_$][\w$]*)/)
    if (m) decls.push({ names: [m[1]], text: b.text, start: b.start })
  }
  return { imports, decls }
}

const uses = (text: string, name: string) => new RegExp(`(^|[^\\w$.])${name.replace(/\$/g, "\\$")}(?![\\w$])`).test(text)

/** One function (or const) of a demo file as a self-contained snippet: its imports, its helpers, itself. */
export function snippet(src: string, name: string) {
  const { imports, decls } = topLevel(src)
  const target = decls.find((d) => d.names.includes(name))
  if (!target) return ""
  const needed = new Set<Decl>([target])
  // helpers the function uses, and the helpers they use (a few levels are enough)
  for (let round = 0; round < 4; round++) {
    for (const d of decls) {
      if (needed.has(d) || d.names.some((n) => /^(Preview|States|Thumb|examples)$/.test(n))) continue
      if ([...needed].some((n) => d.names.some((x) => uses(n.text, x)))) needed.add(d)
    }
  }
  const body = decls.filter((d) => needed.has(d))
  const text = body.map((d) => d.text).join("\n\n")
  const usedImports = imports
    .map((imp) => {
      // keep the import line, trimmed to the names in use ("type X" and "X as Y" stay as written)
      const from = imp.text.match(/from\s+(["'][^"']+["'])/)?.[1]
      if (!from) return null
      const isType = /^import\s+type\s/.test(imp.text)
      const def = imp.text.match(/^import\s+(?:type\s+)?([A-Za-z_$][\w$]*)\s*(?:,|from)/)?.[1]
      const braces = imp.text.match(/\{([\s\S]*?)\}/)?.[1] ?? ""
      const named = braces
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((spec) => uses(text, spec.split(/\s+as\s+/).pop()!.replace(/^type\s+/, "")))
      const parts = [def && uses(text, def) ? def : null, named.length ? `{ ${named.join(", ")} }` : null].filter(Boolean)
      if (!parts.length) return null
      return `import ${isType ? "type " : ""}${parts.join(", ")} from ${from}`
    })
    .filter(Boolean)
    // showcase helpers are not part of what a user copies
    .filter((l) => !/from ["']\.\.?\/(state-grid|playground|copy)["']/.test(l!))
  const out = `${usedImports.join("\n")}\n\n${text.replace(/^export function (Preview)\(/m, "export function Demo(")}`
  return userPaths(out.trim()).replace(/from "\.\.\/art"/g, `from "./art" // your own drawings`)
}
