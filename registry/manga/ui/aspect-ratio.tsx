import * as React from "react"
import { AspectRatio as ShadcnAspectRatio } from "@/components/ui/aspect-ratio"

/* No manga effect: the ratio box is a layout tool. Only the data-manga hook is added; the API is the stock one. */
function AspectRatio(props: React.ComponentProps<typeof ShadcnAspectRatio>) {
  return <ShadcnAspectRatio data-manga="aspect-ratio" {...props} />
}

export { AspectRatio }
