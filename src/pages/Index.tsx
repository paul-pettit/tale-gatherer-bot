
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, BookOpen, MessageSquareMore } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-fuchsia-100 opacity-30" />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center space-y-8 relative animate-fade-in">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/ff964a7f-566d-4e85-9216-ac611ea1bb51.png"
                alt="MemoryStitcher"
                className="h-24 mx-auto mb-8"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Turn Moments Into Legacy
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                You carry a lifetime of treasured moments—no need to be a seasoned storyteller to bring them to life. 
                Memory Stitcher uses advanced AI to transform your recollections into beautiful, engaging narratives 
                that your family will cherish for generations.
              </p>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Because your wisdom is precious, and we're here to help you share it with the people who matter most.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 pt-4">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Tell Your Story Well
              </h2>
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 transform transition-all hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 transform transition-all hover:scale-105"
                >
                  Get Early Access
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="text-white h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                AI-Powered Storytelling
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Transform simple memories into beautifully crafted narratives with our intelligent 
                story generator. No writing experience needed!
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="text-white h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Family Lore Library
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create a permanent digital archive of your family's most precious stories, 
                accessible to generations to come.
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquareMore className="text-white h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Guided Story Collection
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our smart prompts help uncover stories you never knew existed, 
                making storytelling effortless and enjoyable.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="mt-24 text-center">
          <blockquote className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto italic">
            "Memory Stitcher helped us discover stories from my grandparents that we never would have 
            thought to ask about. It's like having a family historian in your pocket!"
          </blockquote>
        </div>

        {/* Footer */}
        <div className="mt-24 text-center text-gray-600">
          © 2025 Memory Stitcher. All rights reserved.
        </div>
      </div>
    </div>
  );
}
