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
