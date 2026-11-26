import type { ReactNode } from "react"

/*
 * Drawings for the "Lunch break" page, made for this repo: Rin (black bob, hair clip, striped scarf) and
 * Mochi (a white cat with one black ear and a bell). Ink is currentColor, paper is var(--background), so
 * dark mode draws the negative. Every scene covers its panel (slice) and scales with the page.
 */

const PAPER = "var(--background)"
const INK = "currentColor"

/** A scene filling its panel. */
export function Scene({ w = 142, h = 100, children, label }: { w?: number; h?: number; children: ReactNode; label?: string }) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="absolute inset-0 size-full text-foreground"
      fill="none"
      stroke={INK}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

type At = { x: number; y: number; s: number; flip?: boolean; rotate?: number }
const place = ({ x, y, s, flip, rotate = 0 }: At) => `translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -s : s} ${s})`

export type RinFace = "open" | "happy" | "closed" | "shock" | "angry" | "side"

function Eyes({ face }: { face: RinFace }) {
  switch (face) {
    case "happy":
      return (
        <g strokeWidth={4}>
          <path d="M-25 12 Q-17 2 -9 12" />
          <path d="M9 12 Q17 2 25 12" />
        </g>
      )
    case "closed":
      return (
        <g strokeWidth={4}>
          <path d="M-25 9 Q-17 15 -9 9" />
          <path d="M9 9 Q17 15 25 9" />
        </g>
      )
    case "shock":
      return (
        <g strokeWidth={3}>
          <ellipse cx={-17} cy={8} rx={9} ry={11} fill={PAPER} />
          <ellipse cx={17} cy={8} rx={9} ry={11} fill={PAPER} />
          <circle cx={-17} cy={9} r={2.6} fill={INK} stroke="none" />
          <circle cx={17} cy={9} r={2.6} fill={INK} stroke="none" />
          <path d="M-28 -10 L-8 -6 M28 -10 L8 -6" strokeWidth={3.5} />
        </g>
      )
    case "angry":
      return (
        <g>
          <path d="M-28 -6 L-8 2 M28 -6 L8 2" strokeWidth={5} />
          <ellipse cx={-17} cy={12} rx={5.5} ry={7} fill={INK} stroke="none" />
          <ellipse cx={17} cy={12} rx={5.5} ry={7} fill={INK} stroke="none" />
        </g>
      )
    case "side":
      return (
        <g stroke="none" fill={INK}>
          <ellipse cx={-10} cy={8} rx={6} ry={9} />
          <ellipse cx={22} cy={8} rx={5} ry={9} />
          <circle cx={-8} cy={4} r={2} fill={PAPER} />
          <circle cx={24} cy={4} r={1.8} fill={PAPER} />
        </g>
      )
    default:
      return (
        <g stroke="none" fill={INK}>
          <ellipse cx={-17} cy={8} rx={6.5} ry={9.5} />
          <ellipse cx={17} cy={8} rx={6.5} ry={9.5} />
          <circle cx={-15} cy={4} r={2.2} fill={PAPER} />
          <circle cx={19} cy={4} r={2.2} fill={PAPER} />
        </g>
      )
  }
}

function Mouth({ face }: { face: RinFace }) {
  if (face === "shock") return <ellipse cx={0} cy={34} rx={6} ry={8} fill={INK} stroke="none" />
  if (face === "angry") return <path d="M-14 30 Q0 26 14 30 Q10 44 0 45 Q-10 44 -14 30 Z" fill={INK} strokeWidth={3} />
  if (face === "happy") return <path d="M-9 29 Q0 39 9 29 Z" fill={INK} strokeWidth={3} />
  return <path d="M-6 32 Q0 36 6 32" strokeWidth={3} />
}

/** Rin's head, centred on the face (about 110 units tall). */
export function RinHead({ at, face = "open" }: { at: At; face?: RinFace }) {
  return (
    <g transform={place(at)} strokeWidth={3}>
      {/* the bob, behind the face */}
      <path d="M-56 -12 C-62 -62 -30 -80 0 -80 C30 -80 62 -62 56 -12 L58 40 L36 46 L36 4 L-36 4 L-36 46 L-58 40 Z" fill={INK} />
      <path d="M-40 -20 C-42 22 -24 52 0 56 C24 52 42 22 40 -20 Z" fill={PAPER} />
      {/* bangs */}
      <path d="M-46 -16 C-42 -66 42 -66 46 -16 L32 -30 L24 -12 L12 -32 L2 -14 L-10 -32 L-20 -12 L-32 -30 Z" fill={INK} />
      {/* the clip: her mark, always on the right side of the bangs */}
      <rect x={22} y={-52} width={18} height={7} transform="rotate(-24 31 -48)" fill={PAPER} />
      <Eyes face={face} />
      <Mouth face={face} />
      {face === "happy" && <path d="M-34 22 l5 -5 M-28 24 l5 -5 M24 22 l5 -5 M30 24 l5 -5" strokeWidth={2} />}
    </g>
  )
}

/** Rin from the waist up: scarf with two stripes, a plain jacket. */
export function RinBust({ at, face = "open", arms = "down" }: { at: At; face?: RinFace; arms?: "down" | "hold" | "fist" | "phone" }) {
  return (
    <g transform={place(at)} strokeWidth={3}>
      <path d="M-58 170 C-60 100 -40 74 0 72 C40 74 60 100 58 170 Z" fill={PAPER} />
      <path d="M0 96 L0 170" strokeWidth={2} />
      {/* scarf */}
      <path d="M-34 62 Q0 80 34 62 L36 80 Q0 98 -36 80 Z" fill={INK} />
      <path d="M-32 70 Q0 86 32 70" stroke={PAPER} strokeWidth={3} />
      <path d="M18 82 L26 128 L10 130 L6 86 Z" fill={INK} />
      <path d="M12 100 L24 98 M14 114 L25 112" stroke={PAPER} strokeWidth={3} />
      {arms === "hold" && (
        <g>
          <path d="M-50 130 Q-30 118 -8 116" strokeWidth={14} stroke={INK} />
          <path d="M-50 130 Q-30 118 -8 116" strokeWidth={8} stroke={PAPER} />
          <Onigiri at={{ x: 2, y: 106, s: 0.9 }} />
        </g>
      )}
      {arms === "fist" && (
        <g>
          <path d="M44 130 Q66 92 70 50" strokeWidth={14} stroke={INK} />
          <path d="M44 130 Q66 92 70 50" strokeWidth={8} stroke={PAPER} />
          <circle cx={70} cy={44} r={11} fill={PAPER} />
          <path d="M62 40 h14 M62 46 h14" strokeWidth={2} />
        </g>
      )}
      <g transform="translate(0 0)">
        <RinHead at={{ x: 0, y: 0, s: 1 }} face={face} />
      </g>
      {/* drawn over the head: the hand holds the phone against the ear, in front of the bob */}
      {arms === "phone" && (
        <g>
          <path d="M48 150 Q84 96 66 20" strokeWidth={16} stroke={INK} />
          <path d="M48 150 Q84 96 66 20" strokeWidth={10} stroke={PAPER} />
          <g transform="rotate(12 66 0)">
            <rect x={54} y={-30} width={24} height={44} rx={4} fill={PAPER} />
            <rect x={58} y={-24} width={16} height={28} rx={1.5} fill={INK} stroke="none" />
          </g>
          <circle cx={64} cy={20} r={10} fill={PAPER} />
        </g>
      )}
    </g>
  )
}

/** Mochi the cat, sitting; `look` turns the eyes. */
export function Mochi({ at, eyes = "round", chew = false }: { at: At; eyes?: "round" | "sly" | "wink"; chew?: boolean }) {
  return (
    <g transform={place(at)} strokeWidth={3}>
      {/* tail and body */}
      <path d="M38 70 Q78 64 70 22 Q66 8 58 14" strokeWidth={9} />
      <path d="M38 70 Q78 64 70 22 Q66 8 58 14" strokeWidth={3.5} stroke={PAPER} />
      <path d="M-40 78 C-46 40 -30 18 0 16 C30 18 46 40 40 78 Z" fill={PAPER} />
      <path d="M-14 78 L-14 60 M14 78 L14 60" strokeWidth={2.5} />
      {/* ears: the left one is black, the cat's mark */}
      <path d="M-36 -18 L-30 -60 L-6 -36 Z" fill={INK} />
      <path d="M36 -18 L30 -60 L6 -36 Z" fill={PAPER} />
      <path d="M-40 4 C-40 -30 -20 -40 0 -40 C20 -40 40 -30 40 4 C40 30 22 40 0 40 C-22 40 -40 30 -40 4 Z" fill={PAPER} />
      {/* collar and bell */}
      <path d="M-28 34 Q0 46 28 34" strokeWidth={5} />
      <circle cx={0} cy={47} r={7} fill={PAPER} />
      <path d="M-4 49 h8" strokeWidth={2} />
      {eyes === "sly" ? (
        <g>
          <path d="M-24 0 Q-15 -6 -6 0 M6 0 Q15 -6 24 0" strokeWidth={3.5} />
          <path d="M-22 1 Q-15 6 -8 1 Z M8 1 Q15 6 22 1 Z" fill={INK} />
        </g>
      ) : eyes === "wink" ? (
        <g>
          <path d="M-24 2 Q-15 -6 -6 2" strokeWidth={3.5} />
          <ellipse cx={15} cy={0} rx={8} ry={9} fill={PAPER} />
          <ellipse cx={15} cy={0} rx={2.5} ry={7} fill={INK} stroke="none" />
        </g>
      ) : (
        <g>
          <ellipse cx={-15} cy={0} rx={8} ry={9} fill={PAPER} />
          <ellipse cx={15} cy={0} rx={8} ry={9} fill={PAPER} />
          <ellipse cx={-15} cy={0} rx={2.5} ry={7} fill={INK} stroke="none" />
          <ellipse cx={15} cy={0} rx={2.5} ry={7} fill={INK} stroke="none" />
        </g>
      )}
      <path d="M-4 12 L4 12 L0 17 Z" fill={INK} strokeWidth={2} />
      {chew ? <path d="M-10 22 Q-5 28 0 22 Q5 28 10 22" strokeWidth={2.5} /> : <path d="M-8 21 Q-4 25 0 20 Q4 25 8 21" strokeWidth={2.5} />}
      <path d="M-24 14 L-48 10 M-24 19 L-48 22 M24 14 L48 10 M24 19 L48 22" strokeWidth={1.8} />
      {chew && <Onigiri at={{ x: 0, y: 30, s: 0.55, rotate: -12 }} bitten />}
    </g>
  )
}

/** A rice ball with its strip of seaweed. */
export function Onigiri({ at, bitten = false }: { at: At; bitten?: boolean }) {
  return (
    <g transform={place(at)} strokeWidth={3}>
      <path
        d={
          bitten
            ? "M-22 18 Q-26 6 -12 -14 Q-4 -24 0 -22 Q6 -16 2 -10 Q10 -10 10 -2 Q18 2 16 8 Q26 18 18 20 Q0 24 -22 18 Z"
            : "M-24 18 Q-28 6 -12 -16 Q0 -30 12 -16 Q28 6 24 18 Q0 24 -24 18 Z"
        }
        fill={PAPER}
      />
      <path d="M-12 8 L12 8 L13 21 Q0 23 -13 21 Z" fill={INK} />
    </g>
  )
}

/** Park bench seen from the front. */
export function Bench({ at }: { at: At }) {
  return (
    <g transform={place(at)} strokeWidth={3}>
      <path d="M-70 -20 H70 M-70 -8 H70" strokeWidth={5} />
      <path d="M-74 10 H74" strokeWidth={6} />
      <path d="M-62 10 V40 M62 10 V40 M-62 -20 V10 M62 -20 V10" strokeWidth={4} />
    </g>
  )
}

/** A round tree in ink, with paper dots of light. */
export function Tree({ at }: { at: At }) {
  return (
    <g transform={place(at)} strokeWidth={3}>
      <path d="M-4 80 L-6 10 M4 80 L6 10" strokeWidth={6} />
      <path d="M-50 10 C-70 -20 -40 -60 -10 -56 C10 -80 50 -60 46 -30 C70 -10 50 30 20 20 C0 36 -40 34 -50 10 Z" fill={INK} />
      <g fill={PAPER} stroke="none">
        <circle cx={-20} cy={-30} r={3} />
        <circle cx={10} cy={-44} r={2.5} />
        <circle cx={24} cy={-12} r={3} />
        <circle cx={-34} cy={2} r={2.5} />
      </g>
    </g>
  )
}

/** A low wall of bricks. */
export function Wall({ y, w = 260 }: { y: number; w?: number }) {
  const rows = [0, 10, 20]
  return (
    <g strokeWidth={2}>
      <rect x={-2} y={y} width={w + 4} height={34} fill={PAPER} strokeWidth={3} />
      {rows.map((r, i) => (
        <g key={r}>
          <path d={`M0 ${y + r + 10} H${w}`} />
          {Array.from({ length: Math.ceil(w / 26) }, (_, k) => (
            <path key={k} d={`M${k * 26 + (i % 2 ? 13 : 0)} ${y + r} v10`} />
          ))}
        </g>
      ))}
    </g>
  )
}
