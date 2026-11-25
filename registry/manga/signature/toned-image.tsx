"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Toned image: a picture turned into a screentone with CSS only (no canvas, no SVG filter, no
 * feImage), so it reads the same in Chromium, Firefox and WebKit, and cross-origin pictures work.
 *
 * Layers, bottom to top:
 * 1. stage (white): the picture as darkness (greyscale, inverted), then a radial dot screen blended in
 *    color-dodge. Where darkness beats the screen the result is white; the stage's filter sharpens it
 *    to black and white and, in light mode, inverts it so ink is black.
 * 2. paper: a sibling overlay in var(--background): multiply in light mode, screen in dark mode, so
 *    ink and paper follow the kit's colours (dark mode is the negative).
 */

export type TonedPattern = "dots" | "lines" | "cross" | "noise"

export type TonedOptions = {
  /** dots: a 45° grid of dots · lines: parallel bars · cross: crossed bars · noise: scattered grain */
  pattern?: TonedPattern
  /** Cell size in px: smaller = finer screen. */
  density?: number
  /** 1 keeps the picture as is; above 1 pushes shadows and lights apart. */
  contrast?: number
  /** 0 = off. Above 0, more of the picture goes solid ink (dark areas first). */
  threshold?: number
}

export type TonedImageProps = TonedOptions & {
  src: string
  alt: string
  className?: string
}

/* Screen value = 1 - T, where T is 0 at the centre of a cell and 1 at its edge (what color-dodge needs). */
const SCREENS: Record<TonedPattern, { backgroundImage: string; blend?: string; rotate?: string }> = {
  dots: { backgroundImage: "radial-gradient(circle, #fff, #000)", rotate: "45deg" },
  lines: { backgroundImage: "linear-gradient(90deg, #000, #fff 50%, #000)" },
  cross: {
    backgroundImage: "linear-gradient(90deg, #000, #fff 50%, #000), linear-gradient(180deg, #000, #fff 50%, #000)",
    blend: "multiply",
  },
  noise: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 1'/%3E%3C/filter%3E%3Crect width='64' height='64' filter='url(%23f)'/%3E%3C/svg%3E\")",
  },
}

/**
 * A picture as a screentone: black and white, dots or bars in ink, paper where it is light.
 * Keeps `alt`. Colours come from --foreground (ink) and --background (paper); dark mode inverts.
 */
function TonedImage({ src, alt, pattern = "dots", density = 6, contrast = 1, threshold = 0, className }: TonedImageProps) {
  const s = Math.max(2, density)
  const screen = SCREENS[pattern]
  return (
    <span
      data-manga="toned-image"
      data-pattern={pattern}
      className={cn(
        "relative isolate block min-w-0 max-w-full overflow-hidden",
        // light: ink is black on paper; dark: the negative (white ink, paper from --background)
        "[--toned-flip:#000] [--toned-blend:multiply] [.dark_&]:[--toned-flip:#fff] [.dark_&]:[--toned-blend:screen]",
        className,
      )}
    >
      <span
        className="absolute inset-0 block overflow-hidden bg-white"
        style={{ filter: "brightness(0.6667) contrast(30) invert(1)" }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute inset-0 block size-full object-cover"
          style={{
            filter: `grayscale(1) invert(1) blur(${s / 6}px) contrast(${contrast}) brightness(${1 + 2 * threshold})`,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1/2"
          style={{
            backgroundImage: screen.backgroundImage,
            backgroundSize: `${s}px ${s}px`,
            backgroundBlendMode: screen.blend,
            mixBlendMode: "color-dodge",
            rotate: screen.rotate,
          }}
        />
      </span>
      {/* dark mode: the ink is inverted to white (difference with white; black in light mode is a no-op) */}
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundColor: "var(--toned-flip)", mixBlendMode: "difference" }} />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-background" style={{ mixBlendMode: "var(--toned-blend)" as React.CSSProperties["mixBlendMode"] }} />
    </span>
  )
}

export { TonedImage }
