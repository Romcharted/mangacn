import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "@registry/manga/ui/sonner"
import { TooltipProvider } from "@registry/manga/ui/tooltip"
import { loadAnalytics } from "./visits"
import { App, redirectLegacy } from "./app"
import "./index.css"

loadAnalytics()
// an old link in "#" (#button) is replaced by its new address before the first paint
redirectLegacy()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </StrictMode>,
)
