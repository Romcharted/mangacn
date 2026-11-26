/*
 * Third-party marks for the showcase only (site/public/brands, see its README). They are used unmodified,
 * under each owner's brand rules; registry items never ship them (SocialButton only has a logo slot).
 */

/** The official Google icon from the "Sign in with Google" bundle: light asset on paper, dark asset in dark mode. */
export function GoogleMark() {
  const src = (theme: "light" | "dark") => `${import.meta.env.BASE_URL}brands/google-signin-icon-${theme}@2x.png`
  return (
    <>
      <img src={src("light")} alt="" width={32} height={32} className="size-8 dark:hidden" />
      <img src={src("dark")} alt="" width={32} height={32} className="hidden size-8 dark:block" />
    </>
  )
}

/**
 * The official Apple logo, unmodified file (black, transparent background). Apple publishes it in black and
 * in white: black on paper, and in dark mode the same file shown white (colour only, the drawing untouched),
 * as Apple's guidelines allow. About 20 px tall in the 32 px slot, so it weighs as much as the Google "G".
 */
export function AppleMark() {
  return <img src={`${import.meta.env.BASE_URL}brands/apple-logo-black.png`} alt="" width={16} height={20} className="h-5 w-auto dark:invert" />
}
