
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Users, Gift } from 'lucide-react';

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
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Preserve Your Family Stories
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Every family has stories worth preserving. Make your memories last forever through
                guided storytelling that brings generations together.
              </p>
            </div>
            
            <div className="flex justify-center gap-4 pt-4">
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
                  Start Your Family Story
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
                <BookOpen className="text-white h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Guided Storytelling
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our thoughtfully crafted questions help bring out the most meaningful memories and stories, 
                making it easy to share your experiences.
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-white h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Family Collaboration
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Invite family members to contribute their unique perspectives and preserve memories 
                together in one shared space.
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gift className="text-white h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Story Incentives
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Encourage storytelling through our unique gift card system. Show appreciation 
                for shared memories that touch your heart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
