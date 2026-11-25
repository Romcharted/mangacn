import type { ReactNode } from "react"
import { VolumeCard, type VolumeStatus } from "@registry/manga/signature/volume-card"
import { Tile, force } from "../state-grid"

// Covers drawn for this showcase: abstract shapes, no existing work. Ink = currentColor, paper = the background.

function SunHills() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <circle cx="100" cy="112" r="56" fill="currentColor" />
      <path d="M0 200c40-40 80-40 120 0s60 30 80 0v100H0z" fill="var(--background)" stroke="currentColor" strokeWidth="4" />
      <path d="M0 236c50-30 90-30 140 0s40 22 60 6v58H0z" fill="currentColor" />
    </svg>
  )
}

function Diagonal() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <path d="M-20 300 140 -20h30L-10 300z" fill="currentColor" />
      <path d="M60 300 200 60v20L80 300z" fill="currentColor" />
      <circle cx="150" cy="210" r="22" fill="var(--background)" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}

function Silhouette() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <circle cx="100" cy="90" r="30" fill="currentColor" />
      <path d="M62 136c10-18 66-18 76 0l16 92H46z" fill="currentColor" />
      <path d="M100 150 124 300H92z" fill="var(--background)" />
      <path d="M46 232 14 268M154 232l32 36" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
    </svg>
  )
}

function Waves() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="currentColor" />
      {[70, 120, 170, 220].map((y, i) => (
        <path key={y} d={`M-10 ${y}q25 ${-18 - i * 3} 50 0t50 0 50 0 50 0 50 0`} fill="none" stroke="var(--background)" strokeWidth="10" />
      ))}
      <circle cx="150" cy="50" r="18" fill="var(--background)" />
    </svg>
  )
}

function City() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <circle cx="140" cy="70" r="30" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M0 300V190h30V150h28v40h22V120h26v70h24v-36h22v116z" fill="currentColor" />
      <path d="M0 260h200" stroke="var(--background)" strokeWidth="3" />
    </svg>
  )
}

function Focus() {
  const rays = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2
    return `M100 150L${(100 + Math.cos(a) * 260).toFixed(1)} ${(150 + Math.sin(a) * 260).toFixed(1)}L${(100 + Math.cos(a + 0.09) * 260).toFixed(1)} ${(150 + Math.sin(a + 0.09) * 260).toFixed(1)}Z`
  }).join("")
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <path d={rays} fill="currentColor" />
      <circle cx="100" cy="150" r="34" fill="var(--background)" stroke="currentColor" strokeWidth="4" />
      <circle cx="100" cy="150" r="12" fill="currentColor" />
    </svg>
  )
}

const VOLUMES: { volume: number; title: string; author: string; cover: ReactNode; status: VolumeStatus; read: number; total: number }[] = [
  { volume: 1, title: "Ember Line", author: "A. Vance", cover: <SunHills />, status: "completed", read: 40, total: 40 },
  { volume: 2, title: "Night Rail", author: "M. Oda", cover: <Diagonal />, status: "ongoing", read: 18, total: 40 },
  { volume: 3, title: "Open Road", author: "J. Lind", cover: <Silhouette />, status: "new", read: 0, total: 36 },
  { volume: 4, title: "Tidewall", author: "S. Ito", cover: <Waves />, status: "hiatus", read: 9, total: 32 },
  { volume: 5, title: "Concrete Sky", author: "R. Kade", cover: <City />, status: "ongoing", read: 32, total: 40 },
  { volume: 6, title: "Still Point", author: "L. Moreau", cover: <Focus />, status: "completed", read: 28, total: 28 },
]

export function Preview() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
      {VOLUMES.map((v) => (
        <div key={v.volume} className="min-w-0">
          <VolumeCard
            href="#"
            title={v.title}
            volume={v.volume}
            author={v.author}
            cover={v.cover}
            status={v.status}
            read={v.read}
            total={v.total}
          />
        </div>
      ))}
    </div>
  )
}

const STATUS_ROWS: VolumeStatus[] = ["new", "ongoing", "completed", "hiatus"]
const PROGRESS = [
  { label: "unread", read: 0 },
  { label: "in progress", read: 18 },
  { label: "finished", read: 40 },
] as const

export function States() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_ROWS.map((s) => (
          <Tile key={s} label={`status · ${s}`} size="full">
            <div className="w-full max-w-40">
              <VolumeCard title="Ember Line" volume={3} cover={<Silhouette />} status={s} read={6} total={20} />
            </div>
          </Tile>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PROGRESS.map((p) => (
          <Tile key={p.label} label={`reading · ${p.label}`} size="full">
            <div className="w-full max-w-40">
              <VolumeCard title="Night Rail" volume={2} cover={<Diagonal />} status="ongoing" read={p.read} total={40} />
            </div>
          </Tile>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Tile label="interactive · hover" size="full">
          <div className="w-full max-w-40">
            <VolumeCard href="#" title="Tidewall" volume={4} cover={<Waves />} status="hiatus" read={9} total={32} {...force("hover")} />
          </div>
        </Tile>
        <Tile label="interactive · focus" size="full">
          <div className="w-full max-w-40">
            <VolumeCard href="#" title="Tidewall" volume={4} cover={<Waves />} status="hiatus" read={9} total={32} {...force("focus")} />
          </div>
        </Tile>
        <Tile label="interactive · pressed" size="full">
          <div className="w-full max-w-40">
            <VolumeCard href="#" title="Tidewall" volume={4} cover={<Waves />} status="hiatus" read={9} total={32} {...force("active")} />
          </div>
        </Tile>
      </div>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="w-24">
      <VolumeCard title="Night Rail" volume={2} cover={<Diagonal />} status="ongoing" read={18} total={40} />
    </div>
  )
}
