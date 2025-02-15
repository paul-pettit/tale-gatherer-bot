
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Preserve Your Family Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            MemoryStitch helps you capture and share precious family memories through guided storytelling,
            making it easy to preserve your family's legacy for generations to come.
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <Button size="lg" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Guided Storytelling</h3>
              <p className="text-gray-600">
                Thoughtfully crafted questions help bring out the most meaningful memories and stories.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Family Collaboration</h3>
              <p className="text-gray-600">
                Invite family members to contribute their stories and preserve memories together.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Story Incentives</h3>
              <p className="text-gray-600">
                Encourage storytelling through gift cards and collaborative contributions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
