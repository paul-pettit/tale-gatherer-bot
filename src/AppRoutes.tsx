import { Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import { StoryGuard } from "./components/StoryGuard"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"

export function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/stories/*" element={<StoryGuard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  )
}
