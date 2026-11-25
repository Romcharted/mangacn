import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "@registry/manga/ui/sonner"
import { TooltipProvider } from "@registry/manga/ui/tooltip"
import { loadAnalytics } from "./analytics"
import { App } from "./app"
import "./index.css"

loadAnalytics()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </StrictMode>,
)
