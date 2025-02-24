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
  const isAuthPage = location.pathname.startsWith("/auth");

  // Only hide AppNavigation on auth pages
  const showAppNavigation = user && !isAuthPage;

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
