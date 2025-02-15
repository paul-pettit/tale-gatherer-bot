
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
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3818956/pexels-photo-3818956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Preserve Your Family Stories
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Capture and share precious memories with loved ones. Start preserving your legacy today.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4">
              {!user ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="w-full md:w-auto bg-white text-black hover:bg-white/90"
                  >
                    Try Free - 5 Stories
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/auth")}
                    className="w-full md:w-auto bg-white/10 text-white hover:bg-white/20 border-white"
                  >
                    Start Family Plan
                  </Button>
                </>
              ) : (
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
                <h3 className="text-xl font-semibold mb-4">Easy to Use</h3>
                <p className="text-gray-600">
                  Start writing and sharing your stories in minutes with our
                  intuitive interface.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 h-full shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Family Collaboration</h3>
                <p className="text-gray-600">
                  Invite family members to contribute their own stories and memories.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 h-full shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
                <p className="text-gray-600">
                  Your stories are safely stored and shared only with those you
                  choose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features or Pricing Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Start Your Story Today
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Free Tier</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    5 personal stories
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Basic story editor
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
              <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-primary">
                <div className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm mb-4">
                  Recommended
                </div>
                <h3 className="text-2xl font-semibold mb-4">Family Plan</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Unlimited stories
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Family collaboration
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Advanced features
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Priority support
                  </li>
                </ul>
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="w-full"
                >
                  Start Family Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
