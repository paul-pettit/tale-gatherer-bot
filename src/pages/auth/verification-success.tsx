
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerificationSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to onboarding page after 3 seconds
    const timeout = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl mb-2">Email Verified!</CardTitle>
          <CardDescription className="text-lg">
            Your email has been successfully verified. Let's set up your profile.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => navigate('/onboarding')}
            className="mt-2"
          >
            Continue to Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
