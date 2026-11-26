import { isColumn, type CellData, type PageData, type PageItem, type TierData } from "@registry/manga/signature/page-geometry"

/* The page studio's code export: PageData -> the JSX a project writes with the kit. */

const q = (s: string) => JSON.stringify(s)
const text = (s: string) =>
  s
    .split("\n")
    .map((l) => l.replace(/[{}<>]/g, (c) => `{${q(c)}}`))
    .join("<br />")
const n = (v: number) => String(Math.round(v * 100) / 100)

function attrs(list: [string, unknown][]) {
  return list
    .filter(([, v]) => v !== undefined && v !== false && v !== null)
    .map(([k, v]) => (v === true ? ` ${k}` : typeof v === "number" ? ` ${k}={${n(v)}}` : typeof v === "string" ? ` ${k}=${q(v)}` : ` ${k}={${JSON.stringify(v)}}`))
    .join("")
}

function item(it: PageItem, pad: string) {
  const place = attrs([
    ["x", `${n(it.x)}%`],
    ["y", `${n(it.y)}%`],
    ["anchor", it.anchor && it.anchor !== "center" ? it.anchor : undefined],
    ["maxWidth", it.type !== "sfx" && it.maxWidth ? `${n(it.maxWidth)}%` : undefined],
    // the folded tail target has no JSX form: SpeechBubble takes one pointAt
    ["fold", it.fold && Object.fromEntries(Object.entries(it.fold).filter(([k]) => k !== "pointAt"))],
  ])
  let inner: string
  if (it.type === "bubble") {
    const point = it.pointAt ? ` pointAt={{ x: "${n(it.pointAt.x)}%", y: "${n(it.pointAt.y)}%" }}` : ` tail="none"`
    inner = `<SpeechBubble${attrs([["variant", it.variant && it.variant !== "speech" ? it.variant : undefined], ["align", it.align]])}${point}>${text(it.text)}</SpeechBubble>`
  } else if (it.type === "sfx")
    inner = `<Sfx${attrs([["size", it.size], ["rotate", it.rotate], ["variant", it.variant], ["label", it.label]])}>${text(it.text)}</Sfx>`
  else inner = `<PanelCaption position="free">${text(it.text)}</PanelCaption>`
  return `${pad}<Place${place}>\n${pad}  ${inner}\n${pad}</Place>`
}

function cell(c: CellData, pad: string, images: Map<string, string>): string {
  if (isColumn(c)) return `${pad}<Column${attrs([["width", c.width], ["slant", c.slant]])}>\n${tiers(c.tiers, pad + "  ", images)}\n${pad}</Column>`
  const head = `${pad}<Panel${attrs([
    ["width", c.width],
    ["slant", c.slant],
    ["shape", c.shape && c.shape !== "straight" ? c.shape : undefined],
    ["tilt", c.shape === "tilted" ? c.tilt : undefined],
    ["bleed", c.bleed],
    ["frameless", c.frameless],
    ["overflow", c.overflow],
    ["ink", c.ink],
    ["inset", c.inset],
    ["foldRatio", c.foldRatio],
    ["label", c.label],
  ])}`
  const body: string[] = []
  if (c.art) {
    let src = c.art.src
    if (src.startsWith("data:") || src.startsWith("blob:")) {
      if (!images.has(src)) images.set(src, `/images/panel-${images.size + 1}.jpg`)
      src = images.get(src)!
    }
    body.push(
      `${pad}  <PanelArt${attrs([
        ["src", src],
        ["alt", c.art.alt],
        ["x", c.art.x !== undefined && c.art.x !== 50 ? c.art.x : undefined],
        ["y", c.art.y !== undefined && c.art.y !== 50 ? c.art.y : undefined],
        ["zoom", c.art.zoom && c.art.zoom !== 1 ? c.art.zoom : undefined],
        ["toned", c.art.toned === true ? true : c.art.toned || undefined],
      ])} />`,
    )
  }
  for (const it of c.items ?? []) body.push(item(it, pad + "  "))
  return body.length ? `${head}>\n${body.join("\n")}\n${pad}</Panel>` : `${head} />`
}

function tiers(list: TierData[], pad: string, images: Map<string, string>): string {
  return list
    .map((t) => `${pad}<Tier${attrs([["height", t.height], ["slant", t.slant]])}>\n${t.panels.map((c) => cell(c, pad + "  ", images)).join("\n")}\n${pad}</Tier>`)
    .join("\n")
}

/** The page as JSX for a project that installed Romcharted/mangacn/panel. */
export function pageToJsx(page: PageData, name = "MyPage"): string {
  const images = new Map<string, string>()
  const body = tiers(page.tiers, "      ", images)
  const pageAttrs = attrs([
    ["format", page.format ?? "pocket"],
    ["spread", page.spread],
    ["reading", page.reading === "rtl" ? "rtl" : undefined],
    ["gutter", page.gutter],
    ["margin", page.margin],
    ["line", page.line],
    ["lettering", page.lettering],
  ])
  const used = (s: string) => body.includes(`<${s}`)
  const panelImports = ["Column", "Page", "Panel", "PanelArt", "PanelCaption", "Place", "Tier"].filter((s) => s === "Page" || used(s))
  const lines = [`import { ${panelImports.join(", ")} } from "@/components/manga/panel"`]
  if (used("Sfx")) lines.push(`import { Sfx } from "@/components/manga/sfx"`)
  if (used("SpeechBubble")) lines.push(`import { SpeechBubble } from "@/components/manga/speech-bubble"`)
  const note = images.size ? `\n// Pictures dropped in the studio: save them as ${[...images.values()].join(", ")} in public/.\n` : ""
  return `${lines.join("\n")}\n${note}\nexport function ${name}() {\n  return (\n    <Page${pageAttrs}>\n${body}\n    </Page>\n  )\n}\n`
}
