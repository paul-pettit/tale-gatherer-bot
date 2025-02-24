import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import { AppRoutes } from "./AppRoutes"
import { ConvexClientProvider } from "./convex/ConvexClientProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConvexClientProvider>
        <BrowserRouter>
          <Toaster richColors position="top-center" />
          <AppRoutes />
        </BrowserRouter>
      </ConvexClientProvider>
    </QueryClientProvider>
  )
}

export default App
