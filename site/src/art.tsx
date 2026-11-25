// Demo art for the showcase: abstract silhouettes and shapes, drawn for this repository.
type ArtProps = { className?: string }

/** Head and shoulders, seen from the front. */
export function Figure({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <path
        d="M100 18c22 0 38 17 38 40 0 16-7 29-17 36l3 10c26 6 46 20 54 56H22c8-36 28-50 54-56l3-10c-10-7-17-20-17-36 0-23 16-40 38-40z"
        fill="var(--background)"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M62 56c4-26 26-40 48-38 22 2 34 20 30 40-10-14-26-18-40-14-14 4-26 6-38 12z" fill="currentColor" />
    </svg>
  )
}

/** A row of blocks and a water tower: a city at night, cut out in ink. */
export function Skyline({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <circle cx="150" cy="26" r="13" fill="var(--background)" stroke="currentColor" strokeWidth="3" />
      <path
        d="M0 100V62h18V48h14v14h10V36h20v26h8V54h16v-8h6v8h10V40l12-8 12 8v22h10V50h18v-6h12v18h10v-8h14v46z"
        fill="currentColor"
      />
      <path d="M150 44v-10h8l-4-8-4 8M146 46h16" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

/** A figure running, leaning forward: a silhouette made of a few strokes. */
export function Runner({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <circle cx="74" cy="22" r="11" fill="currentColor" />
      <path
        d="M70 36 52 64l-22 4M62 50l20 10 14-8M52 64l16 20-6 26M52 64l-14 22-20 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A close-up: two wide-open eyes, drawn as abstract almond shapes. */
export function Eyes({ className }: ArtProps) {
  const eye = (x: number) => (
    <g key={x}>
      <path d={`M${x - 34} 50c14-20 54-20 68 0-14 20-54 20-68 0z`} fill="var(--background)" stroke="currentColor" strokeWidth="4" />
      <circle cx={x} cy="50" r="13" fill="currentColor" />
      <circle cx={x + 4} cy="45" r="4" fill="var(--background)" />
      <path d={`M${x - 36} 28c18-10 50-10 70 0`} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </g>
  )
  return (
    <svg viewBox="0 0 200 100" className={className} aria-hidden>
      {eye(56)}
      {eye(144)}
    </svg>
  )
}
