
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, BookOpen, MessageSquareMore } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9D7] to-white">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b')] bg-cover bg-center" />
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
                Turn Moments Into Legacy
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                You carry a lifetime of treasured moments—no need to be a seasoned storyteller to bring them to life. 
                Memory Stitcher uses advanced AI to transform your recollections into beautiful, engaging narratives 
                that your family will cherish for generations.
              </p>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Because your wisdom is precious, and we're here to help you share it with the people who matter most.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 pt-4">
              <h2 className="text-2xl font-semibold text-white">
                Tell Your Story Well
              </h2>
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-lg px-8 py-6 transform transition-all hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-lg px-8 py-6 transform transition-all hover:scale-105"
                >
                  Get Early Access
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How Memory Stitcher Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Share Your Stories</h3>
              <p className="text-gray-600">
                Respond to thoughtfully crafted prompts that spark meaningful memories and stories
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">AI Enhancement</h3>
              <p className="text-gray-600">
                Our AI helps transform your memories into beautifully written stories while preserving your voice
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Create Your Legacy</h3>
              <p className="text-gray-600">
                Your stories are preserved in a beautiful digital library for generations to come
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-white to-[#E5DEFF] py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
                <div className="h-12 w-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  AI-Powered Storytelling
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Transform simple memories into beautifully crafted narratives with our intelligent 
                  story generator. No writing experience needed!
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
                <div className="h-12 w-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Family Lore Library
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Create a permanent digital archive of your family's most precious stories, 
                  accessible to generations to come.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
                <div className="h-12 w-12 bg-[#8B5CF6] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquareMore className="text-white h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Guided Story Collection
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our smart prompts help uncover stories you never knew existed, 
                  making storytelling effortless and enjoyable.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-purple-100">
              <blockquote className="text-lg text-gray-700 italic">
                "Memory Stitcher helped us discover stories from my grandparents that we never would have 
                thought to ask about. It's like having a family historian in your pocket!"
              </blockquote>
              <p className="mt-4 font-semibold text-gray-900">Sarah M.</p>
              <p className="text-sm text-gray-600">Preserving family stories for her children</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-purple-100">
              <blockquote className="text-lg text-gray-700 italic">
                "The AI assistance made it so easy to turn my dad's memories into beautiful stories. 
                He was amazed at how well it captured his voice."
              </blockquote>
              <p className="mt-4 font-semibold text-gray-900">Michael T.</p>
              <p className="text-sm text-gray-600">Documenting his father's life stories</p>
            </div>
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
