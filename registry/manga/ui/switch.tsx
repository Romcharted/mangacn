import * as React from "react"
import { cn } from "cn"

import { Switch as ShadcnSwitch } from "@/components/ui/switch"

export type SwitchProps = React.ComponentProps<typeof ShadcnSwitch>

// 44 × 24 px. Off: paper track, ink thumb. On: ink track, paper thumb. Disabled: dashed.
// No screentone at this size (rule C). Both libraries set role="switch" + aria-checked.
// Motion: the thumb travels in three steps, a trail of speed lines shrinks behind it,
// and a small spark flies off when it turns on (data-fx, set below; skipped with reduced motion).
const classes = [
  "relative h-6! w-11! shrink-0 rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background! px-0.5 shadow-none transition-none",
  "aria-checked:bg-primary! aria-checked:border-primary",
  // thumb
  "[&_[data-slot=switch-thumb]]:z-10 [&_[data-slot=switch-thumb]]:size-4 [&_[data-slot=switch-thumb]]:rounded-[calc(var(--radius)*0.6)] [&_[data-slot=switch-thumb]]:shadow-none",
  "[&_[data-slot=switch-thumb]]:transition-[translate]! [&_[data-slot=switch-thumb]]:duration-[249ms]! [&_[data-slot=switch-thumb]]:ease-[steps(3,jump-start)]!",
  "[&_[data-slot=switch-thumb]]:bg-foreground! [&_[data-slot=switch-thumb]]:translate-x-0!",
  "aria-checked:[&_[data-slot=switch-thumb]]:bg-background! aria-checked:[&_[data-slot=switch-thumb]]:translate-x-5! rtl:aria-checked:[&_[data-slot=switch-thumb]]:-translate-x-5!",
  // hover: heavier frame and the thumb leans toward the other side
  "hover:border-[3px] hover:px-[1px] hover:[&_[data-slot=switch-thumb]]:translate-x-[3px]! rtl:hover:[&_[data-slot=switch-thumb]]:-translate-x-[3px]!",
  "aria-checked:hover:[&_[data-slot=switch-thumb]]:translate-x-[17px]! rtl:aria-checked:hover:[&_[data-slot=switch-thumb]]:-translate-x-[17px]!",
  "active:translate-y-0.5",
  "focus-visible:border-border focus-visible:ring-0 focus-ink",
  // trail: three horizontal speed lines between the start and the end of the run
  "before:pointer-events-none before:invisible before:absolute before:inset-y-[5px] before:w-4 before:content-['']",
  "before:[background-image:repeating-linear-gradient(to_bottom,currentColor_0_1.5px,transparent_1.5px_4.5px)]",
  "data-[fx=on]:before:start-[3px] data-[fx=on]:before:text-background data-[fx=on]:before:origin-right rtl:data-[fx=on]:before:origin-left data-[fx=on]:before:animate-trail",
  "data-[fx=off]:before:end-[3px] data-[fx=off]:before:text-foreground data-[fx=off]:before:origin-left rtl:data-[fx=off]:before:origin-right data-[fx=off]:before:animate-trail",
  // spark: a small ink burst off the end of the track (replaces the stock hit area for a third of a second)
  "data-[fx=on]:after:invisible data-[fx=on]:after:inset-auto data-[fx=on]:after:-top-3 data-[fx=on]:after:-end-3 data-[fx=on]:after:size-4 data-[fx=on]:after:bg-foreground data-[fx=on]:after:shape-burst data-[fx=on]:after:animate-spark",
  // disabled
  "data-disabled:opacity-100 disabled:opacity-100 aria-disabled:opacity-100 group-has-disabled/field:opacity-100 data-disabled:cursor-not-allowed",
  "data-disabled:border-dashed data-disabled:bg-background! data-disabled:aria-checked:bg-background! data-disabled:border-border data-disabled:hover:border-[length:var(--mg-bw)] data-disabled:hover:px-0.5",
  "data-disabled:hover:[&_[data-slot=switch-thumb]]:translate-x-0! data-disabled:aria-checked:hover:[&_[data-slot=switch-thumb]]:translate-x-5! rtl:data-disabled:aria-checked:hover:[&_[data-slot=switch-thumb]]:-translate-x-5!",
  "data-disabled:[&_[data-slot=switch-thumb]]:bg-background! data-disabled:[&_[data-slot=switch-thumb]]:border-[length:var(--mg-bw)] data-disabled:[&_[data-slot=switch-thumb]]:border-dashed data-disabled:[&_[data-slot=switch-thumb]]:border-foreground",
  "aria-invalid:border-destructive aria-invalid:ring-0",
]

function Switch({ className, ref, ...props }: SwitchProps) {
  const local = React.useRef<HTMLElement | null>(null)

  // Watch aria-checked (works for controlled and uncontrolled use, Radix and Base UI).
  React.useEffect(() => {
    const el = local.current
    if (!el) return
    let last = el.getAttribute("aria-checked")
    let timer = 0
    const mo = new MutationObserver(() => {
      const now = el.getAttribute("aria-checked")
      if (now === last) return
      last = now
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
      el.removeAttribute("data-fx")
      void el.offsetWidth // restart the animation on quick toggles
      el.setAttribute("data-fx", now === "true" ? "on" : "off")
      window.clearTimeout(timer)
      timer = window.setTimeout(() => el.removeAttribute("data-fx"), 340)
    })
    mo.observe(el, { attributes: true, attributeFilter: ["aria-checked"] })
    return () => {
      mo.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      local.current = node
      if (typeof ref === "function") ref(node as never)
      else if (ref) (ref as React.RefObject<HTMLElement | null>).current = node
    },
    [ref],
  )

  return <ShadcnSwitch ref={setRef as never} data-manga="switch" className={cn(classes, className)} {...props} />
}

export { Switch }
