/*
 * Grammar: none. Direction is not a visual component, so nothing is dressed here: the wrapper only re-exports the
 * stock provider with the same API. It always takes `direction` ("ltr" | "rtl"), which both the Base UI and the
 * Radix versions of shadcn accept. Writing direction (`dir`) is what the kit's rtl: variants and logical
 * properties follow; manga reading order is a separate attribute (data-reading), set by the showcase toggle.
 */

import * as React from "react"

import { DirectionProvider as ShadcnDirectionProvider, useDirection as shadcnUseDirection } from "@/components/ui/direction"

export type Direction = "ltr" | "rtl"

function DirectionProvider({ direction, children }: { direction: Direction; children?: React.ReactNode }) {
  return <ShadcnDirectionProvider direction={direction}>{children}</ShadcnDirectionProvider>
}

const useDirection = shadcnUseDirection

export { DirectionProvider, useDirection }
