import { lazy, useState, type ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { GoogleMark } from "../brands"
import { Deferred } from "../load-error"

/*
 * #examples/auth: the five Auth screens, each its own registry:block, wired together. Every block takes
 * `onNavigate(screen)`; here it switches the screen on show. Only the screen on show is loaded. The official
 * Google mark comes from the site (site/public/brands): the blocks themselves ship no logo.
 */
export type AuthScreen = "sign-in" | "sign-up" | "forgot-password" | "verify-code" | "reset-password"
type Purpose = "sign-in" | "sign-up" | "reset"
type Nav = { onNavigate?: (screen: AuthScreen) => void }
type Provider = { id: string; label: string; logo?: ReactNode }

const SignIn = lazy(() => import("@registry/manga/blocks/sign-in/sign-in").then((m) => ({ default: m.SignIn })))
const SignUp = lazy(() => import("@registry/manga/blocks/sign-up/sign-up").then((m) => ({ default: m.SignUp })))
const ForgotPassword = lazy(() => import("@registry/manga/blocks/forgot-password/forgot-password").then((m) => ({ default: m.ForgotPassword })))
const VerifyCode = lazy(() => import("@registry/manga/blocks/verify-code/verify-code").then((m) => ({ default: m.VerifyCode })))
const ResetPassword = lazy(() => import("@registry/manga/blocks/reset-password/reset-password").then((m) => ({ default: m.ResetPassword })))

export const AUTH_SCREENS: { slug: AuthScreen; title: string }[] = [
  { slug: "sign-in", title: "Sign in" },
  { slug: "sign-up", title: "Sign up" },
  { slug: "forgot-password", title: "Forgot password" },
  { slug: "verify-code", title: "Verify code" },
  { slug: "reset-password", title: "Reset password" },
]

// Google keeps its official mark; Apple shows its label only until its official artwork is added.
const PROVIDERS: Provider[] = [
  { id: "google", label: "Continue with Google", logo: <GoogleMark /> },
  { id: "apple", label: "Continue with Apple" },
]

// Where a code screen is reached from decides what it unlocks.
const PURPOSE_FROM: Partial<Record<AuthScreen, Purpose>> = { "sign-in": "sign-in", "sign-up": "sign-up", "forgot-password": "reset" }

export function AuthFlow() {
  const [screen, setScreen] = useState<AuthScreen>("sign-in")
  const [purpose, setPurpose] = useState<Purpose>("sign-in")
  const go = (to: AuthScreen) => {
    if (to === "verify-code") setPurpose(PURPOSE_FROM[screen] ?? "sign-in")
    setScreen(to)
  }
  const nav: Nav = { onNavigate: go }
  return (
    <div>
      <Tabs variant="underline" value={screen} onValueChange={(v) => go(v as AuthScreen)} className="px-3 pt-2">
        <TabsList aria-label="Auth screens" className="flex-wrap">
          {AUTH_SCREENS.map((s) => (
            <TabsTrigger key={s.slug} value={s.slug}>
              {s.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="border-t-[length:var(--mg-bw-panel)] border-border">
        <Deferred
          resetKey={screen}
          fallback={
            <div role="status" className="grid min-h-[32rem] place-items-center font-letter text-sm uppercase">
              Inking…
            </div>
          }
        >
          {screen === "sign-in" && <SignIn key="sign-in" {...nav} providers={PROVIDERS} />}
          {screen === "sign-up" && <SignUp key="sign-up" {...nav} providers={PROVIDERS} />}
          {screen === "forgot-password" && <ForgotPassword key="forgot-password" {...nav} />}
          {screen === "verify-code" && <VerifyCode key={`verify-${purpose}`} {...nav} purpose={purpose} />}
          {screen === "reset-password" && <ResetPassword key="reset-password" {...nav} />}
        </Deferred>
      </div>
    </div>
  )
}
