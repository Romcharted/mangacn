/*
 * Third-party marks for the showcase only (site/public/brands, see its README). They are used unmodified,
 * under each owner's brand rules; registry items never ship them (SocialButton only has a logo slot).
 */

/** The Google "G" on its own (file supplied by the project owner, unmodified), in its standard colours, in both themes. */
export function GoogleMark() {
  return <img src={`${import.meta.env.BASE_URL}brands/google-g.png`} alt="" width={20} height={20} className="size-5" />
}

/**
 * The official Apple logo, unmodified file (black, transparent background). Apple publishes it in black and
 * in white: black on paper, and in dark mode the same file shown white (colour only, the drawing untouched),
 * as Apple's guidelines allow. 20 px tall in the 32 px slot, like the Google "G".
 */
export function AppleMark() {
  return <img src={`${import.meta.env.BASE_URL}brands/apple-logo-black.png`} alt="" width={16} height={20} className="h-5 w-auto dark:invert" />
}
