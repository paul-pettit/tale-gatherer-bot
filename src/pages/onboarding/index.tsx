
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCheck, MessageCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const steps = [
    {
      icon: UserCheck,
      title: "Account Created",
      description: "Your account has been successfully created and verified.",
    },
    {
      icon: Shield,
      title: "Choose Your Plan",
      description: "Select a subscription plan that best fits your family's needs.",
    },
    {
      icon: MessageCircle,
      title: "Start Sharing Stories",
      description: "Begin creating and sharing your family's precious memories.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">Welcome to Memory Stitcher!</CardTitle>
          <CardDescription className="text-lg">
            Let's get you started on your journey of preserving family memories
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate('/subscription')} size="lg">
            Continue to Subscription Plans
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
