import { insetPolygon, pageGeometry, type PageData, type PageItem, type PanelGeometry, type Pt } from "@registry/manga/signature/page-geometry"

/*
 * PNG export of a page, drawn on a canvas from the same geometry as <Page>: frames, pictures (toned with a
 * halftone of dots), bubbles with their tails, sound effects and captions. Everything stays in the browser.
 */

const PX = 16 // canvas pixels per page unit (1600px for a page)
const ANCHOR: Record<string, [number, number]> = {
  "top-left": [0, 0],
  top: [0.5, 0],
  "top-right": [1, 0],
  left: [0, 0.5],
  center: [0.5, 0.5],
  right: [1, 0.5],
  "bottom-left": [0, 1],
  bottom: [0.5, 1],
  "bottom-right": [1, 1],
}

function fontOf(cls: string) {
  const el = document.createElement("span")
  el.className = cls
  el.style.position = "absolute"
  el.style.visibility = "hidden"
  document.body.appendChild(el)
  const family = getComputedStyle(el).fontFamily
  el.remove()
  return family
}

function load(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function path(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath()
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x * PX, p.y * PX) : ctx.moveTo(p.x * PX, p.y * PX)))
  ctx.closePath()
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = []
  for (const para of text.split("\n")) {
    let line = ""
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > max && line) {
        lines.push(line)
        line = word
      } else line = test
    }
    lines.push(line)
  }
  return lines
}

function superellipse(cx: number, cy: number, rx: number, ry: number, n = 3, count = 72) {
  return Array.from({ length: count }, (_, i): [number, number] => {
    const a = (i / count) * Math.PI * 2
    const c = Math.cos(a)
    const s = Math.sin(a)
    return [cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n), cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n)]
  })
}

type Colors = { ink: string; paper: string }

function drawItem(ctx: CanvasRenderingContext2D, it: PageItem, box: { x: number; y: number; w: number; h: number }, lettering: number, fonts: { letter: string; sfx: string }, c: Colors) {
  const u = PX
  const [ax, ay] = ANCHOR[it.anchor ?? "center"] ?? ANCHOR.center
  const bx = box.x * u
  const by = box.y * u
  const bw = box.w * u
  const bh = box.h * u
  const clampBox = (w: number, h: number) => {
    let x = bx + (it.x / 100) * bw - ax * w
    let y = by + (it.y / 100) * bh - ay * h
    x = Math.max(bx, Math.min(x, bx + bw - w))
    y = Math.max(by, Math.min(y, by + bh - h))
    return { x, y }
  }
  ctx.save()
  if (it.type === "sfx") {
    const size = { sm: 4.5, md: 6.5, lg: 9, xl: 13 }[it.size ?? "md"] * lettering * u
    ctx.font = `${size}px ${fonts.sfx}`
    const w = ctx.measureText(it.text).width
    const { x, y } = clampBox(w, size)
    ctx.translate(x + w / 2, y + size / 2)
    ctx.rotate(((it.rotate ?? -8) * Math.PI) / 180)
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.lineJoin = "round"
    ctx.lineWidth = size * 0.14
    ctx.strokeStyle = it.variant === "outline" ? c.ink : c.paper
    ctx.fillStyle = it.variant === "outline" ? c.paper : c.ink
    ctx.strokeText(it.text, 0, 0)
    ctx.fillText(it.text, 0, 0)
    ctx.restore()
    return
  }
  const caption = it.type === "caption"
  const size = (caption ? 1.9 : 2.3) * lettering * u * (it.type === "bubble" && it.variant === "shout" ? 1.11 : 1)
  ctx.font = `${size}px ${fonts.letter}`
  const maxW = ((it.maxWidth ?? (caption ? 60 : 46)) / 100) * bw
  const padX = caption ? size * 0.57 : size * (it.type === "bubble" && it.variant === "shout" ? 1.9 : 1.15)
  const padY = caption ? size * 0.29 : size * (it.type === "bubble" && it.variant === "shout" ? 1.4 : 0.9)
  const text = caption || (it.type === "bubble" && it.variant === "shout") ? it.text.toUpperCase() : it.text
  const lines = wrap(ctx, text, maxW - padX * 2)
  const lh = size * 1.3
  const tw = Math.max(...lines.map((l) => ctx.measureText(l).width))
  const w = tw + padX * 2
  const h = lines.length * lh + padY * 2
  const { x, y } = clampBox(w, h)
  ctx.lineWidth = size * 0.14
  ctx.strokeStyle = c.ink
  ctx.fillStyle = c.paper
  ctx.lineJoin = "round"
  if (caption || (it.type === "bubble" && (it.variant === "narration" || it.variant === "electronic"))) {
    ctx.fillRect(x, y, w, h)
    ctx.strokeRect(x, y, w, h)
  } else if (it.type === "bubble") {
    const cx = x + w / 2
    const cy = y + h / 2
    const rx = w / 2
    const ry = h / 2
    let pts: [number, number][]
    if (it.variant === "shout") {
      pts = Array.from({ length: 36 }, (_, i): [number, number] => {
        const a = (i / 36) * Math.PI * 2
        const k = i % 2 ? 0.78 : 1
        return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
      })
    } else pts = superellipse(cx, cy, rx, ry, it.variant === "thought" ? 2 : 3)
    // the tail, under the body
    if (it.pointAt) {
      const tx = bx + (it.pointAt.x / 100) * bw
      const ty = by + (it.pointAt.y / 100) * bh
      const dx = tx - cx
      const dy = ty - cy
      const d = Math.hypot(dx, dy) || 1
      const nx = dx / d
      const ny = dy / d
      const reach = 1 / (Math.abs(dx / rx) ** 3 + Math.abs(dy / ry) ** 3) ** (1 / 3)
      if (reach < 1) {
        const base = [cx + dx * reach * 0.9, cy + dy * reach * 0.9]
        const half = size * 0.6
        if (it.variant === "thought") {
          ;[0.35, 0.65, 0.9].forEach((t, i) => {
            ctx.beginPath()
            ctx.arc(base[0] + (tx - base[0]) * t, base[1] + (ty - base[1]) * t, [0.3, 0.22, 0.15][i] * size, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
          })
        } else {
          ctx.beginPath()
          ctx.moveTo(base[0] - ny * half, base[1] + nx * half)
          ctx.lineTo(tx - nx * size * 0.25, ty - ny * size * 0.25)
          ctx.lineTo(base[0] + ny * half, base[1] - nx * half)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }
      }
    }
    ctx.beginPath()
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
    ctx.closePath()
    if (it.variant === "whisper") ctx.setLineDash([size * 0.4, size * 0.3])
    ctx.fill()
    ctx.stroke()
    ctx.setLineDash([])
    // hide the tail's base under the body
    ctx.beginPath()
    superellipse(cx, cy, rx * 0.92, ry * 0.88).forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
    ctx.fill()
  }
  ctx.fillStyle = c.ink
  ctx.textBaseline = "middle"
  const align = it.type === "bubble" && it.align ? it.align : caption ? "start" : "center"
  ctx.textAlign = align === "start" ? "left" : align === "end" ? "right" : "center"
  const tx = align === "start" ? x + padX : align === "end" ? x + w - padX : x + w / 2
  lines.forEach((l, i) => ctx.fillText(l, tx, y + padY + lh * (i + 0.5)))
  ctx.restore()
}

async function drawArt(ctx: CanvasRenderingContext2D, g: PanelGeometry, c: Colors) {
  const art = g.data.art
  if (!art) return
  const img = await load(art.src)
  if (!img) return
  const b = g.box
  const w = b.w * PX
  const h = b.h * PX
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight) * Math.max(1, art.zoom ?? 1)
  const W = img.naturalWidth * s
  const H = img.naturalHeight * s
  const ox = b.x * PX - (W - w) * ((art.x ?? 50) / 100)
  const oy = b.y * PX - (H - h) * ((art.y ?? 50) / 100)
  if (!art.toned) {
    ctx.drawImage(img, ox, oy, W, H)
    return
  }
  // halftone: one dot per cell, its size from the darkness of the picture there
  const cell = PX * 0.9
  const cols = Math.ceil(w / cell)
  const rows = Math.ceil(h / cell)
  const tmp = document.createElement("canvas")
  tmp.width = cols
  tmp.height = rows
  const t = tmp.getContext("2d")!
  t.drawImage(img, (ox - b.x * PX) / cell, (oy - b.y * PX) / cell, W / cell, H / cell)
  const data = t.getImageData(0, 0, cols, rows).data
  ctx.fillStyle = c.ink
  for (let r = 0; r < rows; r++)
    for (let q = 0; q < cols; q++) {
      const i = (r * cols + q) * 4
      const lum = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 255
      const dark = 1 - lum
      if (dark < 0.04) continue
      ctx.beginPath()
      ctx.arc(b.x * PX + (q + 0.5) * cell, b.y * PX + (r + 0.5) * cell, cell * Math.sqrt(dark / Math.PI), 0, Math.PI * 2)
      ctx.fill()
    }
}

/** Draws the page and returns a PNG blob. */
export async function pageToPng(page: PageData): Promise<Blob> {
  const g = pageGeometry(page)
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(g.width * PX)
  canvas.height = Math.round(g.height * PX)
  const ctx = canvas.getContext("2d")!
  const css = getComputedStyle(document.documentElement)
  const c: Colors = { ink: css.getPropertyValue("--foreground").trim() || "#1a1714", paper: css.getPropertyValue("--background").trim() || "#f8f5ef" }
  const fonts = { letter: fontOf("font-letter"), sfx: fontOf("font-sfx") }
  await Promise.all([document.fonts.load(`20px ${fonts.letter}`), document.fonts.load(`20px ${fonts.sfx}`)]).catch(() => undefined)
  ctx.fillStyle = c.paper
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const lettering = page.lettering ?? 1
  const ordered = [...g.panels.filter((p) => !p.inset), ...g.panels.filter((p) => p.inset)]
  for (const p of ordered) {
    ctx.save()
    path(ctx, p.outline)
    ctx.fillStyle = p.data.ink ? c.ink : c.paper
    ctx.fill()
    ctx.clip()
    await drawArt(ctx, p, c)
    ctx.restore()
    if (!p.data.frameless) {
      ctx.save()
      ctx.lineWidth = g.line * PX
      ctx.strokeStyle = c.ink
      ctx.lineJoin = p.data.shape === "cloud" ? "round" : "miter"
      if (p.data.shape === "memory") {
        path(ctx, p.outline)
        const inner = insetPolygon(p.outline, 1.6)
        ctx.moveTo(inner[0].x * PX, inner[0].y * PX)
        inner.slice(1).forEach((v) => ctx.lineTo(v.x * PX, v.y * PX))
        ctx.closePath()
        ctx.fillStyle = c.ink
        ctx.fill("evenodd")
      }
      path(ctx, p.outline)
      ctx.stroke()
      ctx.restore()
    }
  }
  for (const p of g.panels) for (const it of p.data.items ?? []) drawItem(ctx, it, p.box, lettering, fonts, c)
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG failed"))), "image/png"))
}
