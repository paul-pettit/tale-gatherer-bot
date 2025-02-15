
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      toast.error('Invalid session');
      navigate('/subscription');
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">Thank You!</CardTitle>
          <CardDescription className="text-lg">
            Your subscription has been successfully processed. You can now start using all the features of your plan.
          </CardDescription>
          <Button onClick={() => navigate('/')} className="mt-6">
            Go to Dashboard
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
