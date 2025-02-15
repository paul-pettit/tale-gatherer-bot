
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type SubscriptionPrice = {
  tier: 'free' | 'basic' | 'premium';
  duration: 'monthly' | 'annual';
  price: number;
};

type PlanFeatures = {
  [key in 'free' | 'basic' | 'premium']: {
    name: string;
    maxMembers: number;
    features: string[];
  };
};

const planFeatures: PlanFeatures = {
  free: {
    name: 'Free Tier',
    maxMembers: 1,
    features: ['Up to 5 single-user stories', 'Basic features', 'No family sharing'],
  },
  basic: {
    name: 'Basic Family Plan',
    maxMembers: 8,
    features: ['Up to 8 family members', 'All core features', 'Family story sharing', 'Collaborative writing'],
  },
  premium: {
    name: 'Extended Family Plan',
    maxMembers: 20,
    features: [
      'Up to 20 family members',
      'Priority support',
      'All core features',
      'Advanced analytics',
      'Priority AI processing',
    ],
  },
};

export default function SubscriptionPage() {
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'annual'>('annual');
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: prices, isLoading } = useQuery({
    queryKey: ['subscription-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_prices')
        .select('*');
      
      if (error) throw error;
      return data as SubscriptionPrice[];
    },
  });

  const handleSelectPlan = async (tier: 'free' | 'basic' | 'premium') => {
    try {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: tier,
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: tier === 'free' ? null : new Date(Date.now() + (selectedDuration === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
          is_free_tier: tier === 'free'
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Subscription updated successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getPrice = (tier: 'free' | 'basic' | 'premium') => {
    if (tier === 'free') return 0;
    const price = prices?.find(p => p.tier === tier && p.duration === selectedDuration)?.price;
    return price || 0;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={selectedDuration === 'monthly' ? 'default' : 'outline'}
              onClick={() => setSelectedDuration('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={selectedDuration === 'annual' ? 'default' : 'outline'}
              onClick={() => setSelectedDuration('annual')}
            >
              Annual (Save up to 50%)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['free', 'basic', 'premium'] as const).map((tier) => (
            <Card key={tier} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {planFeatures[tier].name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${getPrice(tier)}</span>
                  {tier !== 'free' && (
                    <span className="text-gray-500">/{selectedDuration}</span>
                  )}
                </div>
                <ul className="space-y-3">
                  {planFeatures[tier].features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSelectPlan(tier)}
                  variant={tier === 'premium' ? 'default' : 'outline'}
                >
                  {tier === 'free' ? 'Start Free' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
