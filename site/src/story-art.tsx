// Demo art for the narration pieces (Yonkoma, DialogueBox, MagazineCover…): abstract faces and scenes,
// drawn for this repository. Ink = currentColor, paper = var(--background).
type ArtProps = { className?: string }

const paper = "var(--background)"

/** A guide with a bob and round glasses, front view. */
export function FaceGuide({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <rect width="100" height="100" fill={paper} />
      <path d="M14 100c4-18 18-26 36-26s32 8 36 26z" fill="currentColor" />
      <ellipse cx="50" cy="50" rx="24" ry="27" fill={paper} stroke="currentColor" strokeWidth="3.5" />
      <path d="M24 52c-4-26 10-38 26-38s32 10 28 38c-4-10-6-16-10-18-10 6-26 6-40 0-2 4-3 10-4 18z" fill="currentColor" />
      <circle cx="40" cy="54" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="60" cy="54" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M47 54h6M44 68c4 3 8 3 12 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="54" r="2.5" fill="currentColor" />
      <circle cx="60" cy="54" r="2.5" fill="currentColor" />
    </svg>
  )
}

/** A beginner with spiky hair and wide eyes. */
export function FaceRookie({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <rect width="100" height="100" fill="currentColor" />
      <path d="M18 100c4-16 16-24 32-24s28 8 32 24z" fill={paper} />
      <ellipse cx="50" cy="54" rx="22" ry="25" fill={paper} />
      <path d="M26 50 22 22l12 12 4-20 10 16 8-18 6 18 12-12-2 32c-8-8-18-12-24-10-10 0-20 4-26 10z" fill={paper} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="41" cy="57" rx="4" ry="6" fill="currentColor" />
      <ellipse cx="59" cy="57" rx="4" ry="6" fill="currentColor" />
      <circle cx="42.5" cy="55" r="1.5" fill={paper} />
      <circle cx="60.5" cy="55" r="1.5" fill={paper} />
      <path d="M45 70h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** A cat-shaped mascot, all ink. */
export function FaceMascot({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <rect width="100" height="100" fill={paper} />
      <path d="M20 86c0-30 10-50 30-50s30 20 30 50z" fill="currentColor" />
      <path d="M26 46 30 18l16 18M74 46 70 18 54 36" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="50" cy="52" rx="26" ry="20" fill="currentColor" />
      <path d="M36 52h8M56 52h8" stroke={paper} strokeWidth="4" strokeLinecap="round" />
      <path d="M46 62q4 4 8 0" fill="none" stroke={paper} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/** Cover art: a figure in front of a big sun, with rays. */
export function CoverSun({ className }: ArtProps) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2
    const b = a + 0.1
    return `M100 120L${(100 + Math.cos(a) * 240).toFixed(1)} ${(120 + Math.sin(a) * 240).toFixed(1)}L${(100 + Math.cos(b) * 240).toFixed(1)} ${(120 + Math.sin(b) * 240).toFixed(1)}Z`
  }).join("")
  return (
    <svg viewBox="0 0 200 266" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect width="200" height="266" fill={paper} />
      <path d={rays} fill="currentColor" />
      <circle cx="100" cy="120" r="52" fill={paper} stroke="currentColor" strokeWidth="5" />
      <path d="M100 96c13 0 22 10 22 24 0 9-4 17-10 21l2 7c18 4 30 14 34 40H52c4-26 16-36 34-40l2-7c-6-4-10-12-10-21 0-14 9-24 22-24z" fill="currentColor" />
      <path d="M40 266c10-44 34-62 60-62s50 18 60 62z" fill="currentColor" />
    </svg>
  )
}

/** Cover art: rooftops and a moon, cut in ink. */
export function CoverNight({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 200 266" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect width="200" height="266" fill="currentColor" />
      <circle cx="140" cy="100" r="30" fill={paper} />
      <circle cx="152" cy="92" r="26" fill="currentColor" />
      <path d="M0 266V190l30-20 30 20v-30h24v-20l18-14 18 14v40h20v-24l30-18 30 18v110z" fill={paper} />
      <path d="M10 220h40M110 230h60M70 200h20" stroke="currentColor" strokeWidth="6" />
    </svg>
  )
}

/** One beat of a little four-panel story: a seed, rain, waiting, a flower. */
export function Beat({ step, className }: ArtProps & { step: 1 | 2 | 3 | 4 }) {
  return (
    <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMax meet" className={className} aria-hidden>
      <path d="M0 104h160" stroke="currentColor" strokeWidth="4" />
      <path d="M50 104c0-12 60-12 60 0z" fill="currentColor" />
      {step === 1 && (
        <>
          <ellipse cx="80" cy="74" rx="6" ry="8" fill="currentColor" />
          <path d="M80 58v-8M70 62l-6-6M90 62l6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {step === 2 && (
        <>
          <path d="M44 34c0-12 14-18 24-12 4-10 22-12 28 0 12-2 22 6 20 16-1 6-6 10-12 10H54c-6 0-10-6-10-14z" fill={paper} stroke="currentColor" strokeWidth="3.5" />
          <path d="M58 60l-4 10M76 62l-4 10M94 60l-4 10M66 78l-4 10M86 80l-4 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {step === 3 && (
        <>
          <path d="M80 94v-8" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M80 88c-6-2-8-6-8-10 6 0 8 4 8 10z" fill="currentColor" />
          <circle cx="128" cy="40" r="14" fill={paper} stroke="currentColor" strokeWidth="3" />
          <circle cx="123" cy="38" r="2" fill="currentColor" />
          <circle cx="133" cy="38" r="2" fill="currentColor" />
          <path d="M124 47h8" stroke="currentColor" strokeWidth="2.5" />
          <path d="M146 26c3 6 6 8 6 12a5 5 0 0 1-10 0c0-4 2-6 4-12z" fill={paper} stroke="currentColor" strokeWidth="2.5" />
        </>
      )}
      {step === 4 && (
        <>
          <path d="M80 96V48" stroke="currentColor" strokeWidth="4" />
          <path d="M80 76c-14-2-20-12-20-20 14 0 20 8 20 20zM80 70c12-2 18-10 18-18-12 0-18 6-18 18z" fill="currentColor" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2
            return <ellipse key={i} cx={80 + Math.cos(a) * 13} cy={36 + Math.sin(a) * 13} rx="9" ry="6" transform={`rotate(${(a * 180) / Math.PI} ${80 + Math.cos(a) * 13} ${36 + Math.sin(a) * 13})`} fill={paper} stroke="currentColor" strokeWidth="3" />
          })}
          <circle cx="80" cy="36" r="7" fill="currentColor" />
        </>
      )}
    </svg>
  )
}
