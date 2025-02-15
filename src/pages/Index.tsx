
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useFreeTier } from "@/hooks/useFreeTier";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { remainingStories, isFreeTier } = useFreeTier();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <img 
              src="/lovable-uploads/1be5fd17-4da1-4e64-be1c-0a0930d6f9b1.png" 
              alt="Memory Stitcher" 
              className="h-12 w-auto"
            />
            {!user && (
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

      {/* Hero Section */}
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
            {user && (
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

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose MemoryStitch?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 h-full shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Collaborative Storytelling</h3>
                <p className="text-gray-600">
                  Multiple family members can contribute to the same story, adding their unique perspectives.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 h-full shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Story Incentives</h3>
                <p className="text-gray-600">
                  Encourage storytelling through gift card contributions and family rewards.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 h-full shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Private & Secure</h3>
                <p className="text-gray-600">
                  Control who sees your stories with flexible privacy settings for family sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Family Plans Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Family Plan
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Free Tier</h3>
                <div className="text-3xl font-bold mb-6">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    5 personal stories
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Basic editor
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Private storage
                  </li>
                </ul>
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="w-full"
                >
                  Start Free
                </Button>
              </div>

              {/* Standard Family Plan */}
              <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-primary">
                <div className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm mb-4">
                  Most Popular
                </div>
                <h3 className="text-2xl font-semibold mb-4">Standard Family</h3>
                <div className="text-3xl font-bold mb-6">$20<span className="text-lg font-normal text-gray-600">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Up to 8 family members
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Unlimited stories
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Story incentives
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Version control
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    $3/month per extra member
                  </li>
                </ul>
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="w-full"
                >
                  Choose Standard
                </Button>
              </div>

              {/* Extended Family Plan */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Extended Family</h3>
                <div className="text-3xl font-bold mb-6">$35<span className="text-lg font-normal text-gray-600">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Up to 20 family members
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    All Standard features
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Advanced collaboration
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    $3/month per extra member
                  </li>
                </ul>
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="w-full"
                >
                  Choose Extended
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
