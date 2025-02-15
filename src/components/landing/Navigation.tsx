
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  isLoggedIn: boolean;
}

export function Navigation({ isLoggedIn }: NavigationProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <img 
            src="/lovable-uploads/1be5fd17-4da1-4e64-be1c-0a0930d6f9b1.png" 
            alt="Memory Stitcher" 
            className="h-16 w-auto"
          />
          {!isLoggedIn && (
            <div className="space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-white text-black hover:bg-white/90"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
