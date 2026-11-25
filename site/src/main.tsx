import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "@registry/manga/ui/sonner"
import { TooltipProvider } from "@registry/manga/ui/tooltip"
import { App } from "./app"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </StrictMode>,
)
