
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
import SubscriptionPage from "./pages/subscription";
import SubscriptionSuccess from "./pages/subscription/success";
import NotFound from "./pages/NotFound";
import FamiliesPage from "./pages/families";
import FamilyDetailsPage from "./pages/families/[id]";
import NewStoryPage from "./pages/stories/new";
import ProfilePage from "./pages/profile";
import AdminPage from "./pages/admin";

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
