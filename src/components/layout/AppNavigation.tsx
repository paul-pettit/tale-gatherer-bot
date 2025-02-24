import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AppNavigation() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <img 
            src="/lovable-uploads/e32eb416-f89a-47ac-a548-fb5cd566fa06.png"
            alt="Memory Stitcher" 
            className="h-12 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/stories/new")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Write a Story
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/stories")}>
                  My Stories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/families")}>
                  Family Management
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/credits")}>
                  Credits & Packages
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}