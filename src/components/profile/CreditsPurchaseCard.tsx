
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  size: 'small' | 'medium' | 'large';
  stripe_price_id: string;
}

export function CreditsPurchaseCard() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

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

  const handlePurchase = async (creditPackage: CreditPackage) => {
    try {
      setIsLoading(true);
      
      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: creditPackage.stripe_price_id,
          userId: user?.id,
          credits: creditPackage.credits,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Story Credits</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {creditPackages?.map((pkg) => (
          <Card key={pkg.id} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">${pkg.price}</div>
              <p className="text-muted-foreground">{pkg.credits} story credits</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePurchase(pkg)}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Purchase"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
