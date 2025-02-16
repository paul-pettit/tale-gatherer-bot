
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { StoryGuard } from "@/components/StoryGuard";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import AuthPage from "./pages/auth";
import VerificationPendingPage from "./pages/auth/verification-pending";
import VerificationSuccessPage from "./pages/auth/verification-success";
import OnboardingPage from "./pages/onboarding";
import SubscriptionPage from "./pages/subscription";
import SubscriptionSuccess from "./pages/subscription/success";
import NotFound from "./pages/NotFound";
import FamiliesPage from "./pages/families";
import FamilyDetailsPage from "./pages/families/[id]";
import NewStoryPage from "./pages/stories/new";
import ProfilePage from "./pages/profile";
import AdminPage from "./pages/admin";
import CreditsPage from "./pages/credits";
import CreditsPurchaseSuccess from "./pages/credits/success";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/verification-pending" element={<VerificationPendingPage />} />
            <Route path="/auth/verification-success" element={<VerificationSuccessPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />
            <Route
              path="*"
              element={
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/families" element={<FamiliesPage />} />
                    <Route path="/families/:id" element={<FamilyDetailsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/credits" element={<CreditsPage />} />
                    <Route path="/credits/success" element={<CreditsPurchaseSuccess />} />
                    <Route
                      path="/stories/new"
                      element={
                        <StoryGuard>
                          <NewStoryPage />
                        </StoryGuard>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
