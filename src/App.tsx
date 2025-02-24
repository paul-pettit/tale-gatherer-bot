import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import { AppRoutes } from "./AppRoutes"
import { ConvexClientProvider } from "./convex/ConvexClientProvider"

function App() {
  return (
    <ConvexClientProvider>
      <BrowserRouter>
        <Toaster richColors position="top-center" />
        <AppRoutes />
      </BrowserRouter>
    </ConvexClientProvider>
  )
}

export default App
