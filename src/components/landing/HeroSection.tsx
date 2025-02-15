
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  isFreeTier: boolean;
  remainingStories: number;
  isLoggedIn: boolean;
}

export function HeroSection({ isFreeTier, remainingStories, isLoggedIn }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3818956/pexels-photo-3818956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
      
      <div className="container mx-auto px-4 py-24 relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Weave Your Moments Into a Legacy
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Capture and share precious memories with loved ones. Start preserving your legacy today.
          </p>
          {isLoggedIn && (
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={() => navigate("/stories/new")}
                className="w-full md:w-auto bg-white text-black hover:bg-white/90"
              >
                {isFreeTier 
                  ? `Write a Story (${remainingStories} remaining)`
                  : "Write a Story"
                }
              </Button>
              {isFreeTier && remainingStories < 2 && (
                <div className="text-center md:text-left">
                  <p className="text-white/90 text-sm">
                    Running low on stories? 
                    <Button
                      variant="link"
                      className="text-white underline ml-1 p-0 h-auto"
                      onClick={() => navigate("/upgrade")}
                    >
                      Upgrade to our family plan
                    </Button>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
