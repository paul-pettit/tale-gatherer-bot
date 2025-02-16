
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Gem } from "lucide-react";
import { toast } from "sonner";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  stripe_price_id: string;
  description?: string;
}

export default function CreditsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { data: creditPackages } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_packages')
        .select('*')
        .order('credits', { ascending: true });

      if (error) throw error;
      return data as CreditPackage[];
    },
  });

  const handlePurchase = async (priceId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          userId: user.id,
          mode: 'payment'
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      window.location.href = response.data.url;
    } catch (error: any) {
      toast.error('Failed to initiate purchase');
      console.error('Purchase error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Purchase Story Credits</h1>
        <p className="text-muted-foreground">Choose a credit package to continue writing your stories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {creditPackages?.map((pkg) => (
          <Card key={pkg.id} className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="h-5 w-5" />
                {pkg.name}
              </CardTitle>
              <CardDescription>
                {pkg.description || `${pkg.credits} story ${pkg.credits === 1 ? 'credit' : 'credits'}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">${pkg.price.toFixed(2)}</div>
                {pkg.credits >= 5 && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    20% OFF
                  </span>
                )}
              </div>
              <Button
                className="w-full"
                onClick={() => handlePurchase(pkg.stripe_price_id)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Purchase Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
