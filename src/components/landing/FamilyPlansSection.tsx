
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function FamilyPlansSection() {
  const navigate = useNavigate();

  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Family Plans Coming Soon
            </h2>
            <p className="text-xl text-gray-600">
              Experience the power of shared storytelling. Connect with up to 8 family members, collaborate on stories, and build your family's legacy together.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Collaborative Features</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Share stories with up to 8 family members
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Add multiple perspectives to family stories
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Create private family spaces
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Enhanced Features</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Advanced story organization
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Unlimited story storage
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Priority support
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm max-w-lg mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Start Free Today</h3>
            <div className="text-3xl font-bold mb-6">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                5 personal stories
              </li>
              <li className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                Basic editor
              </li>
              <li className="flex items-center justify-center">
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
            <p className="text-sm text-gray-500 mt-4">
              Be the first to know when family plans launch
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
