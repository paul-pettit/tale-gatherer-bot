import { Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import { StoryGuard } from "./components/StoryGuard"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import AuthPage from "./pages/auth"
import VerificationPending from "./pages/auth/verification-pending"
import VerificationSuccess from "./pages/auth/verification-success"

export function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/verification-pending" element={<VerificationPending />} />
        <Route path="/auth/verification-success" element={<VerificationSuccess />} />
        <Route path="/stories/*" element={<StoryGuard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  )
}
