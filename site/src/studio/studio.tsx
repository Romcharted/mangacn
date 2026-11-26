import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"
import { Button } from "@registry/manga/ui/button"
import { Page } from "@registry/manga/signature/panel"
import {
  PAGE_FORMATS,
  PAGE_TEMPLATES,
  pageGeometry,
  type FrameShape,
  type PageData,
  type PageFormat,
  type PageItem,
  type PageTemplate,
  type PanelGeometry,
} from "@registry/manga/signature/page-geometry"
import { Code } from "../copy"
import { Choice, Flag, Slider } from "../playground"
import { JSON_CHAPTER } from "../demos/reader-json"
import { pageToJsx } from "./codegen"
import {
  addInset,
  addItem,
  applyTemplate,
  canMerge,
  getPanel,
  getSlant,
  mergeNext,
  moveCut,
  newPage,
  parsePage,
  removeItem,
  removePanel,
  samePath,
  slantCut,
  splitPanel,
  updateItem,
  updatePanel,
} from "./model"
import { pageToPng } from "./png"

/*
 * The page studio (#studio): edits a PageData and writes the code. Everything stays in this browser:
 * pictures are read from your files, the page is saved in localStorage, nothing is sent anywhere.
 */

const KEY = "mangacn-studio-page"
const TEMPLATES = Object.keys(PAGE_TEMPLATES) as PageTemplate[]
const FORMATS = Object.keys(PAGE_FORMATS) as PageFormat[]
const SHAPES: FrameShape[] = ["straight", "tilted", "jagged", "cloud", "memory"]
const HIT = 22 // px: half of a 44px touch target

type ItemKind = "speech" | "thought" | "shout" | "whisper" | "narration" | "sfx" | "caption"
const NEW_ITEM: Record<ItemKind, PageItem> = {
  speech: { type: "bubble", x: 50, y: 25, text: "Hello there.", pointAt: { x: 40, y: 75 } },
  thought: { type: "bubble", variant: "thought", x: 50, y: 25, text: "Hmm…", pointAt: { x: 40, y: 75 } },
  shout: { type: "bubble", variant: "shout", x: 50, y: 30, text: "Look out!", pointAt: { x: 40, y: 80 } },
  whisper: { type: "bubble", variant: "whisper", x: 50, y: 25, text: "psst…" },
  narration: { type: "bubble", variant: "narration", x: 6, y: 6, anchor: "top-left", text: "Meanwhile…" },
  sfx: { type: "sfx", x: 50, y: 50, text: "BAM", size: "md", rotate: -8 },
  caption: { type: "caption", x: 4, y: 5, anchor: "top-left", text: "The next day." },
}

function load(): PageData | null {
  try {
    const s = localStorage.getItem(KEY)
    return s ? parsePage(s) : null
  } catch {
    return null
  }
}

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Reads a picture file into a JPEG data URL, at most 1400px wide: it stays in the browser. */
function readPicture(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, 1400 / img.naturalWidth)
      const c = document.createElement("canvas")
      c.width = Math.round(img.naturalWidth * k)
      c.height = Math.round(img.naturalHeight * k)
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL("image/jpeg", 0.85))
    }
    img.onerror = () => reject(new Error("Not a picture"))
    img.src = url
  })
}

type Drag =
  | { kind: "cut"; cut: number; x0: number; y0: number; start: PageData; slant: boolean }
  | { kind: "item"; panel: number[]; item: number; x0: number; y0: number; start: PageData; box: PanelGeometry["box"]; moved: boolean }
  | { kind: "tail"; panel: number[]; item: number; start: PageData; box: PanelGeometry["box"] }

export function Studio() {
  const [hist, setHist] = useState<{ list: PageData[]; at: number }>(() => ({ list: [load() ?? structuredClone(JSON_CHAPTER[0])], at: 0 }))
  const page = hist.list[hist.at]
  const [live, setLive] = useState<PageData | null>(null)
  const shown = live ?? page
  const [sel, setSel] = useState<number[] | null>([0, 0])
  const [item, setItem] = useState<number | null>(null)
  const [editing, setEditing] = useState<number | null>(null)
  const [saved, setSaved] = useState<"saved" | "full" | "">("")
  const [msg, setMsg] = useState("")
  const [code, setCode] = useState<"jsx" | "json">("jsx")

  const commit = useCallback((next: PageData) => {
    setLive(null)
    setHist((h) => (h.list[h.at] === next ? h : { list: [...h.list.slice(0, h.at + 1), next].slice(-80), at: Math.min(h.at + 1, 79) }))
  }, [])
  const undo = useCallback(() => setHist((h) => ({ ...h, at: Math.max(0, h.at - 1) })), [])
  const redo = useCallback(() => setHist((h) => ({ ...h, at: Math.min(h.list.length - 1, h.at + 1) })), [])

  // local save, debounced
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(page))
        setSaved("saved")
      } catch {
        setSaved("full")
      }
    }, 400)
    return () => clearTimeout(t)
  }, [page])

  // keyboard: undo / redo, delete the selected bubble
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("input, textarea, select, [contenteditable]")) return
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener("keydown", on)
    return () => window.removeEventListener("keydown", on)
  }, [undo, redo])

  const geometry = useMemo(() => pageGeometry(shown), [shown])
  const panel = getPanel(shown, sel)
  const selItem = panel && item !== null ? panel.items?.[item] : undefined
  const setPanel = (fn: Parameters<typeof updatePanel>[2]) => sel && commit(updatePanel(page, sel, fn))

  const pickPicture = async (files: FileList | null, path: number[] | null) => {
    const file = files?.[0]
    if (!file || !path) return
    try {
      const src = await readPicture(file)
      commit(updatePanel(page, path, (p) => (p.art = { src, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), toned: true })))
      setSel(path)
      setMsg(`Picture added to panel. It stays in this browser.`)
    } catch {
      setMsg("That file is not a picture.")
    }
  }

  // height of the sticky toolbar (wide screens), so the settings stick right under it
  const barRef = useRef<HTMLDivElement>(null)
  const [barHeight, setBarHeight] = useState(0)
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setBarHeight(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const importRef = useRef<HTMLInputElement>(null)
  const pictureRef = useRef<HTMLInputElement>(null)
  const [paste, setPaste] = useState("")

  const jsx = useMemo(() => pageToJsx(page), [page])
  const json = useMemo(() => JSON.stringify(page, null, 2), [page])

  return (
    <article className="pt-6" aria-labelledby="studio-title">
      <a href="#examples" className="inline-flex h-11 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink sm:h-9">
        ← Examples
      </a>
      <header className="mt-6 max-w-prose space-y-2">
        <h1 id="studio-title" className="font-letter text-5xl leading-none uppercase">
          Page studio
        </h1>
        <p className="text-lg">
          Lay out a manga page, drop your pictures in, letter it, then take the code. Everything stays in your browser.
        </p>
      </header>

      {/* Wide screens: the toolbar (templates, undo / redo) stays under the site header while the page scrolls. */}
      <div
        ref={barRef}
        className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 border-ink bg-background p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:sticky lg:top-14 lg:z-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
      >
        <label className="grid gap-1">
          <span className="font-mono text-xs">template (keeps your pictures and bubbles, in order)</span>
          <span className="relative grid">
          <select
            className="h-11 appearance-none border-ink bg-background ps-2 pe-8 font-letter text-foreground uppercase focus-ink sm:h-9"
            value=""
            onChange={(e) => e.target.value && commit(applyTemplate(page, e.target.value as PageTemplate))}
          >
            <option value="">Choose a template…</option>
            {TEMPLATES.map((t) => (
              <option key={t} value={t}>
                {PAGE_TEMPLATES[t].label}
              </option>
            ))}
          </select>
          <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute end-3 top-1/2 h-2 w-3 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M1 1l5 5 5-5" />
          </svg>
          </span>
        </label>
        <Choice label="format" value={page.format ?? "pocket"} options={FORMATS} onChange={(f) => commit({ ...page, format: f })} />
        <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={hist.at === 0} className="max-sm:min-h-11">
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={hist.at >= hist.list.length - 1} className="max-sm:min-h-11">
            Redo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="max-sm:min-h-11"
            onClick={() => {
              commit(newPage())
              setSel([0, 0])
              setItem(null)
            }}
          >
            New page
          </Button>
          <div className="w-52">
            <Flag label="read right to left" checked={page.reading === "rtl"} onChange={(v) => commit({ ...page, reading: v ? "rtl" : undefined })} />
          </div>
          <span role="status" className="ms-auto font-mono text-xs">
            {saved === "saved" ? "Saved in this browser" : saved === "full" ? "Too big to save here: export the JSON" : ""}
          </span>
        </div>
      </div>

      <div
        className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]"
        style={{ "--studio-bar": `${barHeight}px`, "--page-ratio": geometry.width / geometry.height } as CSSProperties}
      >
        {/*
         * Phones and tablets: the page sticks under the site header, at a reduced size, so the effect of a
         * slider shows while it moves. Wide screens: the page scrolls, the settings stick beside it.
         */}
        <section
          aria-label="Page"
          className="grid content-start justify-items-center border-ink-fine bg-background p-3 max-lg:sticky max-lg:top-14 max-lg:z-20 max-lg:self-start sm:p-6"
        >
          <div className={`${shown.spread ? "w-full" : "w-full max-w-2xl"} max-lg:w-[min(100%,calc(38dvh*var(--page-ratio)))]`}>
            <Canvas
              page={shown}
              geometry={geometry}
              sel={sel}
              item={item}
              onSelect={(p, i) => {
                setSel(p)
                setItem(i)
                if (i === null) setEditing(null)
              }}
              onEdit={(i) => setEditing(i)}
              editing={editing}
              onText={(i, text) => sel && commit(updateItem(page, sel, i, { text }))}
              onLive={setLive}
              onCommit={commit}
              base={page}
              onDrop={(files, path) => pickPicture(files, path)}
            />
          </div>
          {msg && (
            <p role="status" className="mt-2 font-mono text-xs">
              {msg}
            </p>
          )}
        </section>
        <p className="max-w-prose justify-self-center text-sm lg:col-start-1 lg:row-start-2">
          Click a panel to select it, drag a circle on a cut to move it, its square to slant it. Drag a bubble to move it, the red ring
          to aim its tail, double-click it to write. Drop a picture on a panel.
        </p>

        <aside
          aria-label="Selection"
          className="grid content-start gap-4 lg:sticky lg:top-[calc(3.5rem+var(--studio-bar)+1rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-h-[calc(100dvh-3.5rem-var(--studio-bar)-2rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pe-1"
        >
          {panel && sel ? (
            <fieldset className="grid gap-3 border-ink p-3">
              <legend className="px-1 font-letter text-sm uppercase">Panel {geometry.panels.findIndex((g) => samePath(g.path, sel)) + 1}</legend>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="max-sm:min-h-11" disabled={!!panel.inset} onClick={() => commit(splitPanel(page, sel, "side"))}>
                  Split ↔
                </Button>
                <Button variant="outline" size="sm" className="max-sm:min-h-11" disabled={!!panel.inset} onClick={() => commit(splitPanel(page, sel, "below"))}>
                  Split ↕
                </Button>
                <Button variant="outline" size="sm" className="max-sm:min-h-11" disabled={!!panel.inset || !canMerge(page, sel)} onClick={() => commit(mergeNext(page, sel))}>
                  Merge next
                </Button>
                <Button variant="outline" size="sm" className="max-sm:min-h-11" disabled={!!panel.inset} onClick={() => commit(addInset(page, sel))}>
                  Add inset
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="col-span-2 max-sm:min-h-11"
                  onClick={() => {
                    commit(removePanel(page, sel))
                    setSel(null)
                    setItem(null)
                  }}
                >
                  Delete panel
                </Button>
              </div>
              <Choice label="shape" value={panel.shape ?? "straight"} options={SHAPES} onChange={(s) => setPanel((p) => (p.shape = s === "straight" ? undefined : s))} />
              {panel.shape === "tilted" && <Slider label="tilt" value={panel.tilt ?? -2.5} min={-8} max={8} step={0.5} onChange={(v) => setPanel((p) => (p.tilt = v))} />}
              <Flag label="bleed off the page" checked={!!panel.bleed} onChange={(v) => setPanel((p) => (p.bleed = v || undefined))} />
              <Flag label="ink background" checked={!!panel.ink} onChange={(v) => setPanel((p) => (p.ink = v || undefined))} />
              <Flag label="no frame" checked={!!panel.frameless} onChange={(v) => setPanel((p) => (p.frameless = v || undefined))} />
              {panel.inset && (
                <>
                  <Slider label="inset x %" value={panel.inset.x} min={0} max={90} onChange={(v) => setPanel((p) => (p.inset = { ...p.inset!, x: v }))} />
                  <Slider label="inset y %" value={panel.inset.y} min={0} max={90} onChange={(v) => setPanel((p) => (p.inset = { ...p.inset!, y: v }))} />
                  <Slider label="inset width %" value={panel.inset.w} min={10} max={100} onChange={(v) => setPanel((p) => (p.inset = { ...p.inset!, w: v }))} />
                  <Slider label="inset height %" value={panel.inset.h} min={10} max={100} onChange={(v) => setPanel((p) => (p.inset = { ...p.inset!, h: v }))} />
                </>
              )}
              <div className="grid gap-2 border-t-[length:var(--mg-bw-fine)] border-border pt-3">
                <span className="font-letter text-sm uppercase">Picture</span>
                <input ref={pictureRef} type="file" accept="image/*" className="sr-only" onChange={(e) => pickPicture(e.target.files, sel)} tabIndex={-1} />
                <Button variant="outline" size="sm" className="max-sm:min-h-11" onClick={() => pictureRef.current?.click()}>
                  {panel.art ? "Replace picture…" : "Add a picture…"}
                </Button>
                {panel.art && (
                  <>
                    <label className="grid gap-1">
                      <span className="font-mono text-xs">description (alt)</span>
                      <input
                        className="h-11 border-ink bg-background px-2 focus-ink sm:h-9"
                        value={panel.art.alt}
                        onChange={(e) => setLive(updatePanel(page, sel, (p) => (p.art!.alt = e.target.value)))}
                        onBlur={() => live && commit(live)}
                      />
                    </label>
                    <Slider label="focus x %" value={panel.art.x ?? 50} min={0} max={100} onChange={(v) => setPanel((p) => (p.art!.x = v))} />
                    <Slider label="focus y %" value={panel.art.y ?? 50} min={0} max={100} onChange={(v) => setPanel((p) => (p.art!.y = v))} />
                    <Slider label="zoom" value={panel.art.zoom ?? 1} min={1} max={4} step={0.1} onChange={(v) => setPanel((p) => (p.art!.zoom = v))} />
                    <Flag label="screentone" checked={!!panel.art.toned} onChange={(v) => setPanel((p) => (p.art!.toned = v || undefined))} />
                    {panel.art.toned && (
                      <Choice
                        label="pattern"
                        value={(typeof panel.art.toned === "object" && panel.art.toned.pattern) || "dots"}
                        options={["dots", "lines", "cross", "noise"] as const}
                        onChange={(pattern) => setPanel((p) => (p.art!.toned = { pattern }))}
                      />
                    )}
                    <Button variant="ghost" size="sm" className="max-sm:min-h-11" onClick={() => setPanel((p) => delete p.art)}>
                      Remove picture
                    </Button>
                  </>
                )}
              </div>
              <div className="grid gap-2 border-t-[length:var(--mg-bw-fine)] border-border pt-3">
                <span className="font-letter text-sm uppercase">Add lettering</span>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(NEW_ITEM) as ItemKind[]).map((k) => (
                    <Button
                      key={k}
                      variant="outline"
                      size="sm"
                      className="max-sm:min-h-11"
                      onClick={() => {
                        commit(addItem(page, sel, structuredClone(NEW_ITEM[k])))
                        setItem(panel.items?.length ?? 0)
                      }}
                    >
                      {k}
                    </Button>
                  ))}
                </div>
              </div>
            </fieldset>
          ) : (
            <p className="border-ink-fine p-3 text-sm">Select a panel to change it.</p>
          )}

          {panel && sel && selItem && item !== null && (
            <fieldset className="grid gap-3 border-ink p-3">
              <legend className="px-1 font-letter text-sm uppercase">{selItem.type === "sfx" ? "Sound effect" : selItem.type}</legend>
              <label className="grid gap-1">
                <span className="font-mono text-xs">text</span>
                <textarea
                  rows={3}
                  className="border-ink bg-background p-2 focus-ink"
                  value={selItem.text}
                  onChange={(e) => setLive(updateItem(page, sel, item, { text: e.target.value }))}
                  onBlur={() => live && commit(live)}
                />
              </label>
              {selItem.type === "bubble" && (
                <>
                  <Choice
                    label="variant"
                    value={selItem.variant ?? "speech"}
                    options={["speech", "thought", "shout", "whisper", "narration", "electronic", "wobbly"] as const}
                    onChange={(variant) => commit(updateItem(page, sel, item, { variant }))}
                  />
                  <Flag
                    label="tail aims at a point"
                    checked={!!selItem.pointAt}
                    onChange={(v) => commit(updateItem(page, sel, item, { pointAt: v ? { x: selItem.x, y: Math.min(95, selItem.y + 40) } : undefined }))}
                  />
                </>
              )}
              {selItem.type !== "sfx" && (
                <Slider label="max width %" value={selItem.maxWidth ?? (selItem.type === "caption" ? 60 : 46)} min={15} max={100} onChange={(v) => commit(updateItem(page, sel, item, { maxWidth: v }))} />
              )}
              {selItem.type === "sfx" && (
                <>
                  <Choice label="size" value={selItem.size ?? "md"} options={["sm", "md", "lg", "xl"] as const} onChange={(size) => commit(updateItem(page, sel, item, { size }))} />
                  <Slider label="tilt" value={selItem.rotate ?? -8} min={-45} max={45} onChange={(rotate) => commit(updateItem(page, sel, item, { rotate }))} />
                  <Flag label="outline letters" checked={selItem.variant === "outline"} onChange={(v) => commit(updateItem(page, sel, item, { variant: v ? "outline" : undefined }))} />
                </>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="max-sm:min-h-11"
                onClick={() => {
                  commit(removeItem(page, sel, item))
                  setItem(null)
                }}
              >
                Delete
              </Button>
            </fieldset>
          )}
        </aside>
      </div>

      <section aria-labelledby="studio-out" className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-3">
        <h2 id="studio-out" className="font-letter text-3xl uppercase">
          Take it with you
        </h2>
        <div className="flex flex-wrap items-end gap-2">
          <Choice label="code" value={code} options={["jsx", "json"] as const} onChange={setCode} />
          <Button
            variant="outline"
            className="max-sm:min-h-11"
            onClick={() => download(code === "jsx" ? "page.tsx" : "page.json", new Blob([code === "jsx" ? jsx : json], { type: "text/plain" }))}
          >
            Download {code === "jsx" ? "page.tsx" : "page.json"}
          </Button>
          <Button
            className="max-sm:min-h-11"
            onClick={async () => {
              setMsg("Drawing the PNG…")
              try {
                download("page.png", await pageToPng(page))
                setMsg("PNG ready.")
              } catch {
                setMsg("The PNG could not be drawn.")
              }
            }}
          >
            Export PNG
          </Button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              try {
                commit(parsePage(await f.text()))
                setSel([0, 0])
                setMsg("Page imported.")
              } catch (err) {
                setMsg(err instanceof Error ? err.message : "That file is not a page.")
              }
            }}
          />
          <Button variant="outline" className="max-sm:min-h-11" onClick={() => importRef.current?.click()}>
            Import JSON…
          </Button>
        </div>
        <Code text={code === "jsx" ? jsx : json.length > 60000 ? json.slice(0, 60000) + "\n… (download the file for the rest)" : json} />
        <details className="border-ink-fine p-3">
          <summary className="cursor-pointer font-letter uppercase">Paste a page (JSON)</summary>
          <textarea
            rows={6}
            className="mt-2 w-full border-ink bg-background p-2 font-mono text-sm focus-ink"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            aria-label="Page JSON"
          />
          <Button
            variant="outline"
            className="mt-2 max-sm:min-h-11"
            onClick={() => {
              try {
                commit(parsePage(paste))
                setSel([0, 0])
                setMsg("Page imported.")
              } catch (err) {
                setMsg(err instanceof Error ? err.message : "That is not a page.")
              }
            }}
          >
            Load this page
          </Button>
        </details>
      </section>
    </article>
  )
}

/* ---------- the editable page ---------- */

type CanvasProps = {
  page: PageData
  base: PageData
  geometry: ReturnType<typeof pageGeometry>
  sel: number[] | null
  item: number | null
  editing: number | null
  onSelect: (path: number[] | null, item: number | null) => void
  onEdit: (item: number | null) => void
  onText: (item: number, text: string) => void
  onLive: (p: PageData | null) => void
  onCommit: (p: PageData) => void
  onDrop: (files: FileList | null, path: number[]) => void
}

type Rect = { x: number; y: number; w: number; h: number }

function Canvas({ page, base, geometry, sel, item, editing, onSelect, onEdit, onText, onLive, onCommit, onDrop }: CanvasProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [px, setPx] = useState(1) // screen pixels per page unit
  const [rects, setRects] = useState<Record<string, Rect[]>>({})
  const drag = useRef<Drag | null>(null)
  const { width: W, height: H } = geometry
  const rtl = page.reading === "rtl"

  // measure the rendered bubbles (their real boxes) after every render
  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const unit = r.width / W
    setPx((v) => (Math.abs(v - unit) > 0.01 ? unit : v))
    const next: Record<string, Rect[]> = {}
    for (const g of geometry.panels) {
      const places = el.querySelectorAll(`[data-panel-index="${g.index}"] > [data-panel-over] > [data-manga=place] > div`)
      next[g.path.join(".")] = [...places].map((p) => {
        const b = p.getBoundingClientRect()
        return { x: (b.left - r.left) / unit, y: (b.top - r.top) / unit, w: b.width / unit, h: b.height / unit }
      })
    }
    setRects((old) => (JSON.stringify(old) === JSON.stringify(next) ? old : next))
  })

  const toUnits = (e: { clientX: number; clientY: number }) => {
    const r = svg.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
  }
  const spanOf = (prefix: number[], axis: "x" | "y") => {
    const ps = geometry.panels.filter((g) => !g.inset && prefix.every((v, i) => g.path[i] === v))
    if (!ps.length) return axis === "x" ? W : H
    return axis === "x"
      ? Math.max(...ps.map((p) => p.box.x + p.box.w)) - Math.min(...ps.map((p) => p.box.x))
      : Math.max(...ps.map((p) => p.box.y + p.box.h)) - Math.min(...ps.map((p) => p.box.y))
  }

  // target: where to capture the pointer, when the handle itself goes away on the next render (a grip of another panel)
  const begin = (e: ReactPointerEvent, d: Drag, target?: Element | null) => {
    e.stopPropagation()
    e.preventDefault()
    drag.current = d
    // capture on the handle (a double-click still reaches it); the moves bubble up to the svg
    try {
      ;(target ?? (e.currentTarget as Element)).setPointerCapture(e.pointerId)
    } catch {
      try {
        svg.current?.setPointerCapture(e.pointerId)
      } catch {
        /* moves still reach the svg while the pointer is over it */
      }
    }
  }
  // the page the drag shows last, kept here: the release may come before React has drawn it
  const last = useRef<PageData | null>(null)
  const show = (p: PageData) => {
    last.current = p
    onLive(p)
  }
  const move = (e: ReactPointerEvent) => {
    const d = drag.current
    if (!d) return
    const p = toUnits(e)
    if (d.kind === "cut") {
      const c = geometry.cuts[d.cut]
      const dx = (p.x - d.x0) * (rtl ? -1 : 1)
      const dy = p.y - d.y0
      if (d.slant) show(slantCut(d.start, c.kind, c.path, getSlant(d.start, c.kind, c.path) + 2 * (c.kind === "tier" ? dy : dx)))
      else
        show(
          c.kind === "tier"
            ? moveCut(d.start, "tier", c.path, dy, spanOf(c.path.slice(0, -1), "y"))
            : moveCut(d.start, "cell", c.path, dx, spanOf(c.path.slice(0, -1), "x")),
        )
    } else if (d.kind === "item") {
      const it = getPanel(d.start, d.panel)?.items?.[d.item]
      if (!it) return
      const nx = Math.max(0, Math.min(100, it.x + ((p.x - d.x0) / d.box.w) * 100))
      const ny = Math.max(0, Math.min(100, it.y + ((p.y - d.y0) / d.box.h) * 100))
      if (Math.abs(p.x - d.x0) + Math.abs(p.y - d.y0) > 0.4) d.moved = true
      show(updateItem(d.start, d.panel, d.item, { x: Math.round(nx * 10) / 10, y: Math.round(ny * 10) / 10 }))
    } else {
      const x = Math.round(((p.x - d.box.x) / d.box.w) * 1000) / 10
      const y = Math.round(((p.y - d.box.y) / d.box.h) * 1000) / 10
      show(updateItem(d.start, d.panel, d.item, { pointAt: { x, y } }))
    }
  }
  const end = () => {
    const d = drag.current
    drag.current = null
    const shown = last.current
    last.current = null
    if (!d) return
    if ((d.kind === "item" && !d.moved) || !shown) {
      onLive(null)
      return
    }
    onCommit(shown)
  }

  const nudgeCut = (i: number, key: string, slant: boolean) => {
    const c = geometry.cuts[i]
    const step = key.startsWith("Arrow") ? 1 : 0
    if (!step) return false
    const s = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1
    if (slant) onCommit(slantCut(base, c.kind, c.path, getSlant(base, c.kind, c.path) + s))
    else onCommit(moveCut(base, c.kind, c.path, s, spanOf(c.path.slice(0, -1), c.kind === "tier" ? "y" : "x")))
    return true
  }

  const hit = HIT / px
  const selected = geometry.panels.find((g) => samePath(g.path, sel))
  const items = selected ? (getPanel(page, selected.path)?.items ?? []) : []
  const boxes = selected ? (rects[selected.path.join(".")] ?? []) : []
  const editRect = editing !== null ? boxes[editing] : undefined
  const editText = editing !== null ? items[editing]?.text : undefined

  return (
    <div ref={wrap} className="relative">
      <Page page={page} fold="never" label="Page being edited" />
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full touch-none select-none"
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerDown={() => onSelect(null, null)}
        aria-label="Page editor"
        role="group"
      >
        {geometry.panels.map((g) => (
          <polygon
            key={g.index}
            points={g.outline.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="transparent"
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Panel ${g.index + 1}${samePath(g.path, sel) ? ", selected" : ""}`}
            onPointerDown={(e) => {
              e.stopPropagation()
              onSelect(g.path, null)
            }}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(g.path, null))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              onDrop(e.dataTransfer.files, g.path)
            }}
          />
        ))}
        {selected && (
          <polygon
            points={selected.outline.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="var(--mg-accent)"
            strokeWidth={4}
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
        )}
        {/* cuts: a circle to move, a square to slant */}
        {geometry.cuts.map((c, i) => {
          const [a, b] = c.line
          const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
          const end = c.kind === "tier" ? b : a
          const r = 6 / px
          return (
            <g key={`${c.kind}-${c.path.join(".")}`}>
              <g
                role="slider"
                tabIndex={0}
                aria-label={`Move the ${c.kind === "tier" ? "cut between tiers" : "cut between panels"}`}
                aria-valuenow={0}
                className="cursor-grab focus-visible:outline-none [&:focus-visible>circle:last-child]:stroke-[var(--mg-accent)]"
                onPointerDown={(e) => begin(e, { kind: "cut", cut: i, x0: toUnits(e).x, y0: toUnits(e).y, start: base, slant: false })}
                onKeyDown={(e) => nudgeCut(i, e.key, false) && e.preventDefault()}
              >
                <circle cx={mid.x} cy={mid.y} r={hit} fill="transparent" />
                <circle cx={mid.x} cy={mid.y} r={r} fill="var(--background)" stroke="var(--foreground)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              </g>
              <g
                role="slider"
                tabIndex={0}
                aria-label="Slant the cut"
                aria-valuenow={getSlant(base, c.kind, c.path)}
                className="cursor-grab focus-visible:outline-none [&:focus-visible>rect:last-child]:stroke-[var(--mg-accent)]"
                onPointerDown={(e) => begin(e, { kind: "cut", cut: i, x0: toUnits(e).x, y0: toUnits(e).y, start: base, slant: true })}
                onKeyDown={(e) => nudgeCut(i, e.key, true) && e.preventDefault()}
              >
                <circle cx={end.x} cy={end.y} r={hit} fill="transparent" />
                <rect x={end.x - r} y={end.y - r} width={2 * r} height={2 * r} fill="var(--foreground)" stroke="var(--background)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              </g>
            </g>
          )
        })}
        {/*
         * lettering of the other panels: invisible grips, so a bubble moves from the first gesture (it selects
         * its panel and starts the drag at once). Pointer only: the keyboard reaches them through their panel.
         */}
        {geometry.panels.map((g) =>
          samePath(g.path, sel)
            ? null
            : (getPanel(page, g.path)?.items ?? []).map((_, i) => {
                const b = rects[g.path.join(".")]?.[i]
                if (!b) return null
                return (
                  <rect
                    key={`${g.index}-${i}`}
                    data-grip="item"
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    fill="transparent"
                    className="cursor-move"
                    aria-hidden
                    onPointerDown={(e) => {
                      onSelect(g.path, i)
                      begin(e, { kind: "item", panel: g.path, item: i, x0: toUnits(e).x, y0: toUnits(e).y, start: base, box: g.box, moved: false }, svg.current)
                    }}
                  />
                )
              }),
        )}
        {/* lettering of the selected panel: drag the box, aim the tail */}
        {selected &&
          items.map((it, i) => {
            const b = boxes[i]
            if (!b) return null
            const on = i === item
            return (
              <g key={i}>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  fill="transparent"
                  stroke={on ? "var(--mg-accent)" : "var(--foreground)"}
                  strokeWidth={on ? 3 : 1}
                  vectorEffect="non-scaling-stroke"
                  className="cursor-move"
                  role="button"
                  tabIndex={0}
                  aria-label={`${it.type}: ${it.text}. Enter to write, arrows to move.`}
                  onPointerDown={(e) => {
                    onSelect(selected.path, i)
                    begin(e, { kind: "item", panel: selected.path, item: i, x0: toUnits(e).x, y0: toUnits(e).y, start: base, box: selected.box, moved: false })
                  }}
                  onDoubleClick={() => onEdit(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") return (e.preventDefault(), onSelect(selected.path, i), onEdit(i))
                    const dx = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0
                    const dy = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0
                    if (dx || dy) {
                      e.preventDefault()
                      onCommit(updateItem(base, selected.path, i, { x: Math.max(0, Math.min(100, it.x + dx)), y: Math.max(0, Math.min(100, it.y + dy)) }))
                    }
                  }}
                />
                {it.type === "bubble" && it.pointAt && (
                  <g
                    role="slider"
                    tabIndex={0}
                    aria-label="Aim the tail"
                    aria-valuenow={it.pointAt.x}
                    className="cursor-crosshair"
                    onPointerDown={(e) => {
                      onSelect(selected.path, i)
                      begin(e, { kind: "tail", panel: selected.path, item: i, start: base, box: selected.box })
                    }}
                    onKeyDown={(e) => {
                      const dx = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0
                      const dy = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0
                      if (dx || dy) {
                        e.preventDefault()
                        onCommit(updateItem(base, selected.path, i, { pointAt: { x: it.pointAt!.x + dx, y: it.pointAt!.y + dy } }))
                      }
                    }}
                  >
                    <circle cx={selected.box.x + (it.pointAt.x / 100) * selected.box.w} cy={selected.box.y + (it.pointAt.y / 100) * selected.box.h} r={hit} fill="transparent" />
                    <circle
                      cx={selected.box.x + (it.pointAt.x / 100) * selected.box.w}
                      cy={selected.box.y + (it.pointAt.y / 100) * selected.box.h}
                      r={7 / px}
                      fill="var(--background)"
                      stroke="var(--mg-accent)"
                      strokeWidth={3}
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={selected.box.x + (it.pointAt.x / 100) * selected.box.w}
                      cy={selected.box.y + (it.pointAt.y / 100) * selected.box.h}
                      r={2 / px}
                      fill="var(--mg-accent)"
                    />
                  </g>
                )}
              </g>
            )
          })}
      </svg>
      {editRect && editing !== null && editText !== undefined && (
        <InlineText
          key={editing}
          rect={{ left: editRect.x * px, top: editRect.y * px, width: Math.max(editRect.w * px, 140), height: Math.max(editRect.h * px, 60) }}
          text={editText}
          onDone={(t) => {
            if (t !== editText) onText(editing, t)
            onEdit(null)
          }}
        />
      )}
    </div>
  )
}

function InlineText({ rect, text, onDone }: { rect: { left: number; top: number; width: number; height: number }; text: string; onDone: (t: string) => void }): ReactNode {
  const [value, setValue] = useState(text)
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])
  return (
    <textarea
      ref={ref}
      aria-label="Text of the bubble"
      className="absolute z-20 resize-none border-ink-panel bg-background p-2 text-center font-letter leading-snug focus-ink"
      style={rect}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onDone(value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") onDone(text)
        else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onDone(value)
      }}
    />
  )
}
