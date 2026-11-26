import {
  PAGE_TEMPLATES,
  isColumn,
  pagePanels,
  type CellData,
  type ColumnData,
  type PageData,
  type PageItem,
  type PageTemplate,
  type PanelData,
  type TierData,
} from "@registry/manga/signature/page-geometry"

/*
 * Page studio: edits on PageData, always on a copy (the history keeps every state).
 * A path is [tier, cell] at the top level, [tier, cell, tier, cell] inside a column, and so on.
 */

export const clone = <T>(v: T): T => structuredClone(v)

export function newPage(template: PageTemplate = "big-plus-two"): PageData {
  return { version: 1, format: "pocket", ...clone(PAGE_TEMPLATES[template].page) }
}

/** The tiers array that holds the tier at `tierPath` (whose last index is the tier). */
function tiersAt(page: PageData, tierPath: number[]): TierData[] {
  let tiers = page.tiers
  for (let i = 0; i + 1 < tierPath.length; i += 2) {
    const cell = tiers[tierPath[i]].panels[tierPath[i + 1]]
    if (!isColumn(cell)) throw new Error("bad path")
    tiers = cell.tiers
  }
  return tiers
}

export function getCell(page: PageData, path: number[]): CellData | undefined {
  try {
    return tiersAt(page, path.slice(0, -1))[path[path.length - 2]]?.panels[path[path.length - 1]]
  } catch {
    return undefined
  }
}

export function getPanel(page: PageData, path: number[] | null): PanelData | undefined {
  if (!path) return undefined
  const c = getCell(page, path)
  return c && !isColumn(c) ? c : undefined
}

export function updatePanel(page: PageData, path: number[], fn: (p: PanelData) => void): PageData {
  const next = clone(page)
  const p = getPanel(next, path)
  if (p) fn(p)
  return next
}

const share = (v: number | undefined) => (typeof v === "number" && v > 0 ? v : 1)
const round = (v: number) => Math.round(v * 100) / 100

/** Moves a cut: the shares of the two neighbours change, their sum stays. */
export function moveCut(page: PageData, kind: "tier" | "cell", path: number[], delta: number, span: number): PageData {
  const next = clone(page)
  if (kind === "tier") {
    const tiers = tiersAt(next, path)
    const k = path[path.length - 1]
    const a = tiers[k]
    const b = tiers[k + 1]
    if (!a || !b) return page
    const sum = tiers.reduce((s, t) => s + share(t.height), 0)
    const d = (delta / span) * sum
    const ha = share(a.height) + d
    const hb = share(b.height) - d
    if (ha < 0.25 || hb < 0.25) return page
    a.height = round(ha)
    b.height = round(hb)
  } else {
    const tiers = tiersAt(next, path.slice(0, -1))
    const cells = tiers[path[path.length - 2]].panels
    const i = path[path.length - 1]
    const j = cells.findIndex((c, n) => n > i && (isColumn(c) || !c.inset))
    if (j < 0) return page
    const flow = cells.filter((c) => isColumn(c) || !c.inset)
    const sum = flow.reduce((s, c) => s + share(c.width), 0)
    const d = (delta / span) * sum
    const wa = share(cells[i].width) + d
    const wb = share(cells[j].width) - d
    if (wa < 0.2 || wb < 0.2) return page
    cells[i].width = round(wa)
    cells[j].width = round(wb)
  }
  return next
}

/** Changes the slant of a cut. */
export function slantCut(page: PageData, kind: "tier" | "cell", path: number[], slant: number): PageData {
  const next = clone(page)
  const s = Math.max(-30, Math.min(30, Math.round(slant * 10) / 10))
  if (kind === "tier") tiersAt(next, path)[path[path.length - 1]].slant = s || undefined
  else {
    const cell = getCell(next, path)
    if (cell) cell.slant = s || undefined
  }
  return next
}

export function getSlant(page: PageData, kind: "tier" | "cell", path: number[]): number {
  if (kind === "tier") return tiersAt(page, path)[path[path.length - 1]]?.slant ?? 0
  return getCell(page, path)?.slant ?? 0
}

/** Splits a panel: "side" puts a new panel beside it, "below" one under it. */
export function splitPanel(page: PageData, path: number[], how: "side" | "below"): PageData {
  const next = clone(page)
  const tiers = tiersAt(next, path.slice(0, -1))
  const t = path[path.length - 2]
  const i = path[path.length - 1]
  const tier = tiers[t]
  const cell = tier.panels[i]
  if (!cell || isColumn(cell) || cell.inset) return page
  if (how === "side") {
    const w = share(cell.width) / 2
    cell.width = round(w)
    tier.panels.splice(i + 1, 0, { width: round(w) })
  } else if (tier.panels.filter((c) => isColumn(c) || !c.inset).length === 1) {
    const h = share(tier.height) / 2
    tier.height = round(h)
    tiers.splice(t + 1, 0, { height: round(h), panels: [{}] })
  } else {
    const col: ColumnData = { width: cell.width, slant: cell.slant, tiers: [{ panels: [{ ...cell, width: undefined, slant: undefined }] }, { panels: [{}] }] }
    tier.panels[i] = col
  }
  return next
}

/** Can the panel merge with the next one (same tier, or the tier below when both are alone)? */
export function canMerge(page: PageData, path: number[]): boolean {
  const tiers = tiersAt(page, path.slice(0, -1))
  const t = path[path.length - 2]
  const i = path[path.length - 1]
  const cells = tiers[t].panels
  const nextIdx = cells.findIndex((c, n) => n > i && (isColumn(c) || !c.inset))
  if (nextIdx >= 0) return !isColumn(cells[nextIdx])
  const flow = (k: number) => tiers[k]?.panels.filter((c) => isColumn(c) || !c.inset) ?? []
  return flow(t).length === 1 && flow(t + 1).length === 1 && !isColumn(flow(t + 1)[0])
}

/** Merges the panel with the next one; the first keeps its picture and items, the second's items follow. */
export function mergeNext(page: PageData, path: number[]): PageData {
  if (!canMerge(page, path)) return page
  const next = clone(page)
  const tiers = tiersAt(next, path.slice(0, -1))
  const t = path[path.length - 2]
  const i = path[path.length - 1]
  const cells = tiers[t].panels
  const a = cells[i] as PanelData
  const j = cells.findIndex((c, n) => n > i && (isColumn(c) || !c.inset))
  if (j >= 0) {
    const b = cells[j] as PanelData
    a.width = round(share(a.width) + share(b.width))
    a.slant = b.slant
    a.items = [...(a.items ?? []), ...(b.items ?? [])]
    if (!a.art && b.art) a.art = b.art
    cells.splice(j, 1)
  } else {
    const below = tiers[t + 1]
    const b = below.panels.find((c) => !isColumn(c) && !c.inset) as PanelData
    tiers[t].height = round(share(tiers[t].height) + share(below.height))
    tiers[t].slant = below.slant
    a.items = [...(a.items ?? []), ...(b.items ?? [])]
    if (!a.art && b.art) a.art = b.art
    tiers[t].panels.push(...below.panels.filter((c) => !isColumn(c) && c.inset))
    tiers.splice(t + 1, 1)
  }
  return tidy(next)
}

export function removePanel(page: PageData, path: number[]): PageData {
  const next = clone(page)
  const tiers = tiersAt(next, path.slice(0, -1))
  const t = path[path.length - 2]
  const cells = tiers[t].panels
  cells.splice(path[path.length - 1], 1)
  if (!cells.some((c) => isColumn(c) || !c.inset)) tiers.splice(t, 1)
  const tidied = tidy(next)
  return tidied.tiers.length ? tidied : page
}

export function addInset(page: PageData, path: number[]): PageData {
  const next = clone(page)
  const tiers = tiersAt(next, path.slice(0, -1))
  const cells = tiers[path[path.length - 2]].panels
  let i = path[path.length - 1] + 1
  while (cells[i] && !isColumn(cells[i]) && (cells[i] as PanelData).inset) i++
  cells.splice(i, 0, { inset: { x: 55, y: 8, w: 38, h: 38 } })
  return next
}

/** Columns left with one tier of one panel turn back into that panel. */
function tidy(page: PageData): PageData {
  const walk = (tiers: TierData[]) =>
    tiers.forEach((tier) => {
      tier.panels = tier.panels.map((c) => {
        if (!isColumn(c)) return c
        walk(c.tiers)
        if (c.tiers.length === 1 && c.tiers[0].panels.length === 1 && !isColumn(c.tiers[0].panels[0]))
          return { ...c.tiers[0].panels[0], width: c.width, slant: c.slant }
        return c
      })
    })
  walk(page.tiers)
  return page
}

/** A new layout from a template; the panels' pictures and items move over in reading order. */
export function applyTemplate(page: PageData, template: PageTemplate): PageData {
  const fresh: PageData = { ...clone(page), ...clone(PAGE_TEMPLATES[template].page) }
  if (!PAGE_TEMPLATES[template].page.spread) delete fresh.spread
  const old = pagePanels(page)
  pagePanels(fresh).forEach(({ panel }, i) => {
    const o = old[i]?.panel
    if (o?.art) panel.art = clone(o.art)
    if (o?.items) panel.items = clone(o.items)
  })
  return fresh
}

export function addItem(page: PageData, path: number[], item: PageItem): PageData {
  return updatePanel(page, path, (p) => {
    p.items = [...(p.items ?? []), item]
  })
}

export function updateItem(page: PageData, path: number[], index: number, patch: Partial<PageItem>): PageData {
  return updatePanel(page, path, (p) => {
    if (p.items?.[index]) p.items[index] = { ...p.items[index], ...patch } as PageItem
  })
}

export function removeItem(page: PageData, path: number[], index: number): PageData {
  return updatePanel(page, path, (p) => {
    p.items = (p.items ?? []).filter((_, i) => i !== index)
    if (!p.items.length) delete p.items
  })
}

/** Loose check of an imported page. */
export function parsePage(text: string): PageData {
  const data = JSON.parse(text) as PageData
  if (!data || !Array.isArray(data.tiers) || !data.tiers.every((t) => Array.isArray(t.panels))) throw new Error("Not a page: it needs a tiers array, each with panels.")
  return data
}

export const samePath = (a: number[] | null, b: number[] | null) => !!a && !!b && a.length === b.length && a.every((v, i) => v === b[i])
