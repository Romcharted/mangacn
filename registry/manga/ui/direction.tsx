/*
 * Grammar: none. Direction is not a visual component, so nothing is dressed here: the wrapper only re-exports the
 * stock provider with the same API. It always takes `direction` ("ltr" | "rtl"), which both the Base UI and the
 * Radix versions of shadcn accept. Writing direction (`dir`) is what the kit's rtl: variants and logical
 * properties follow; manga reading order is a separate attribute (data-reading), set by the showcase toggle.
 */

import * as React from "react"

import { DirectionProvider as ShadcnDirectionProvider, useDirection as shadcnUseDirection } from "@/components/ui/direction"

export type Direction = "ltr" | "rtl"

// The Radix version types `dir` as required (it reads `direction ?? dir`); the Base UI version reads `direction`.
// Passing both, through a loose type, compiles and works with either library.
const Provider = ShadcnDirectionProvider as unknown as React.ComponentType<{
  direction: Direction
  dir: Direction
  children?: React.ReactNode
}>

function DirectionProvider({ direction, children }: { direction: Direction; children?: React.ReactNode }) {
  return (
    <Provider direction={direction} dir={direction}>
      {children}
    </Provider>
  )
}

const useDirection = shadcnUseDirection

export { DirectionProvider, useDirection }
