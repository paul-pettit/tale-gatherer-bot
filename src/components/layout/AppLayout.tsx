import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppNavigation } from "./AppNavigation";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname.startsWith("/auth");

  // Don't show AppNavigation on home page (it has its own navigation)
  // or auth pages
  const showAppNavigation = user && !isHomePage && !isAuthPage;

  return (
    <div className="min-h-screen">
      {showAppNavigation && <AppNavigation />}
      <div className={showAppNavigation ? "pt-16" : ""}>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
