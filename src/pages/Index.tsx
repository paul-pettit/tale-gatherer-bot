import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, BookOpen, MessageSquareMore, Gift, Heart, Shield } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/ff964a7f-566d-4e85-9216-ac611ea1bb51.png"
                alt="MemoryStitcher"
                className="h-24 mx-auto mb-8"
              />
            </div>
            <div className="space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-2xl">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                The Perfect Gift for Your Parents
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Give them the gift of preserving their legacy. Our AI-powered platform helps capture 
                their stories, wisdom, and memories in a beautiful digital book that your family 
                will treasure forever.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="h-5 w-5" /> Secure Private Storage
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Gift className="h-5 w-5" /> Perfect Gift
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Heart className="h-5 w-5" /> Family Keepsake
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 pt-4">
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-lg px-8 py-6 transform transition-all hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Family Plan</h3>
                      <p className="text-gray-600 mb-4">Perfect for immediate family</p>
                      <ul className="space-y-2 mb-6 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-600" />
                          Up to 8 family members
                        </li>
                        <li className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-purple-600" />
                          Story incentives
                        </li>
                        <li className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-purple-600" />
                          Add members anytime
                        </li>
                      </ul>
                      <p className="text-3xl font-bold text-gray-900 mb-2">$20<span className="text-lg font-normal text-gray-600">/month</span></p>
                      <Button 
                        onClick={() => navigate('/auth?plan=family')}
                        className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]"
                      >
                        Start Family Legacy
                      </Button>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border-2 border-purple-400 hover:border-purple-500 transition-all relative overflow-hidden">
                      <div className="absolute top-3 right-3 bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Extended Family</h3>
                      <p className="text-gray-600 mb-4">Perfect for the whole family tree</p>
                      <ul className="space-y-2 mb-6 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-600" />
                          Up to 20 family members
                        </li>
                        <li className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-purple-600" />
                          Story incentives
                        </li>
                        <li className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-purple-600" />
                          Add members anytime
                        </li>
                      </ul>
                      <p className="text-3xl font-bold text-gray-900 mb-2">$35<span className="text-lg font-normal text-gray-600">/month</span></p>
                      <Button 
                        onClick={() => navigate('/auth?plan=extended')}
                        className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]"
                      >
                        Start Extended Legacy
                      </Button>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm text-center max-w-2xl">
                    Both plans include the ability to add additional members for $3/month each. 
                    Invite family members and choose to cover their cost or let them contribute.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Why Families Choose Memory Stitcher</h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Your parents have a lifetime of wisdom and stories. Don't let them fade away.
            Our AI-powered platform makes it easy to preserve their legacy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Weekly Story Prompts</h3>
              <p className="text-gray-600">
                We email thoughtful questions that spark memories and make storytelling effortless
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">AI Enhancement</h3>
              <p className="text-gray-600">
                Our AI helps polish stories while preserving the authentic voice of your loved ones
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Beautiful Books</h3>
              <p className="text-gray-600">
                Stories are compiled into a professionally designed digital book you can share and print
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="h-12 w-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  AI Writing Assistant
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI helps transform simple answers into engaging stories while maintaining 
                  your loved one's unique voice and personality.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="h-12 w-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Digital Time Capsule
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Securely store stories, photos, and memories in a beautiful digital format 
                  that future generations can easily access and cherish.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="h-12 w-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquareMore className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Expert-Crafted Prompts
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Weekly questions designed by historians and storytellers to uncover 
                  meaningful memories and life lessons.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Trusted by Families Like Yours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <blockquote className="text-lg text-gray-700 italic">
                  "The AI writing assistance is incredible. My father isn't a writer, but Memory Stitcher 
                  helped turn his memories into beautiful stories that sound just like him. This is the 
                  best gift I've ever given my family."
                </blockquote>
                <p className="mt-4 font-semibold text-gray-900">Sarah M.</p>
                <p className="text-sm text-gray-600">Daughter & Memory Keeper</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <blockquote className="text-lg text-gray-700 italic">
                  "I started this for my mom, and now the whole family looks forward to her weekly 
                  stories. We've learned so much about her life that we never knew before. Absolutely 
                  worth the investment."
                </blockquote>
                <p className="mt-4 font-semibold text-gray-900">Michael T.</p>
                <p className="text-sm text-gray-600">Son & Story Collector</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Start Preserving Your Family's Legacy Today</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create meaningful connections and preserve precious memories with your loved ones.
            </p>
            {!user && (
              <div className="flex flex-col items-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/auth?plan=family')}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-lg px-8 py-6 transform transition-all hover:scale-105"
                >
                  Start Your Family's Legacy
                </Button>
                <p className="text-gray-600">Plans start at $20/month</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-24 text-center text-gray-600">
            © 2025 Memory Stitcher. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
