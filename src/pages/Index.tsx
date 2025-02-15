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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a')] bg-cover bg-center" />
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
                Where Family Stories Come to Life
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Create a living collection of your family's stories, wisdom, and cherished memories. 
                Our AI-powered platform helps bring these stories to life in ways that connect 
                generations.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-white/90">
                  <BookOpen className="h-5 w-5" /> Shared Stories
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Heart className="h-5 w-5" /> Family Connections
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="h-5 w-5" /> Private & Secure
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 pt-4">
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#E5DEFF] hover:bg-[#8E9196] text-gray-800 hover:text-white text-lg px-8 py-6 transform transition-all hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Family Plan</h3>
                      <p className="text-gray-600 mb-4">Perfect for immediate family</p>
                      <ul className="space-y-2 mb-6 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-600" />
                          Up to 8 family members
                        </li>
                        <li className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-gray-600" />
                          Collaborative storytelling
                        </li>
                        <li className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-600" />
                          Story collections
                        </li>
                      </ul>
                      <p className="text-3xl font-bold text-gray-900 mb-2">$20<span className="text-lg font-normal text-gray-600">/month</span></p>
                      <Button 
                        onClick={() => navigate('/auth?plan=family')}
                        className="w-full bg-[#F1F0FB] hover:bg-[#8E9196] text-gray-800 hover:text-white"
                      >
                        Start Your Collection
                      </Button>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all relative overflow-hidden">
                      <div className="absolute top-3 right-3 bg-gray-600 text-white text-sm px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Extended Family</h3>
                      <p className="text-gray-600 mb-4">Perfect for the whole family tree</p>
                      <ul className="space-y-2 mb-6 text-gray-700">
                        <li className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-600" />
                          Up to 20 family members
                        </li>
                        <li className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-gray-600" />
                          Collaborative storytelling
                        </li>
                        <li className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-600" />
                          Story collections
                        </li>
                      </ul>
                      <p className="text-3xl font-bold text-gray-900 mb-2">$35<span className="text-lg font-normal text-gray-600">/month</span></p>
                      <Button 
                        onClick={() => navigate('/auth?plan=extended')}
                        className="w-full bg-[#F1F0FB] hover:bg-[#8E9196] text-gray-800 hover:text-white"
                      >
                        Start Your Collection
                      </Button>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm text-center max-w-2xl">
                    Invite more family members anytime for $3/month each. 
                    Share costs flexibly among family members.
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
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Connect Through Stories</h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Every family has stories worth sharing. Our platform makes it easy to capture, 
            enhance, and preserve the moments that matter most.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gray-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Story Prompts</h3>
              <p className="text-gray-600">
                Thoughtful questions that spark meaningful conversations and memories
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gray-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Collaborative Writing</h3>
              <p className="text-gray-600">
                Family members can contribute their perspectives to shared memories
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gray-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Digital Library</h3>
              <p className="text-gray-600">
                A beautiful collection of stories you can revisit and share with future generations
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
                <div className="h-12 w-12 bg-[#F1F0FB] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-gray-600 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  AI Enhancement
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI helps bring stories to life while preserving each storyteller's authentic voice
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="h-12 w-12 bg-[#F1F0FB] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-gray-600 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Story Collections
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Organize memories by themes, events, or family members to create meaningful collections
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="h-12 w-12 bg-[#F1F0FB] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquareMore className="text-gray-600 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Discussion Features
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Comment, ask questions, and engage with family stories in meaningful ways
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Stories That Bring Families Together</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <blockquote className="text-lg text-gray-700 italic">
                  "Memory Stitcher has brought our family closer together. We've uncovered so many 
                  amazing stories we never knew about each other. It's become a weekly tradition to 
                  share and discuss new memories."
                </blockquote>
                <p className="mt-4 font-semibold text-gray-900">The Martinez Family</p>
                <p className="text-sm text-gray-600">Sharing stories across 3 generations</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <blockquote className="text-lg text-gray-700 italic">
                  "What started as a way to record family history has become something we all look 
                  forward to. The AI helps make everyone's stories engaging while keeping their 
                  unique voice."
                </blockquote>
                <p className="mt-4 font-semibold text-gray-900">The Thompson Family</p>
                <p className="text-sm text-gray-600">Connected across 4 states</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Start Your Family's Story Collection</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Begin capturing the stories that make your family unique
            </p>
            {!user && (
              <div className="flex flex-col items-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/auth?plan=family')}
                  className="bg-[#F1F0FB] hover:bg-[#8E9196] text-gray-800 hover:text-white text-lg px-8 py-6 transform transition-all hover:scale-105"
                >
                  Start Your Collection
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
