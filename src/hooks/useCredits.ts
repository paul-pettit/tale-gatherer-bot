
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditPackage } from "@/types/credits";
import { useAuth } from "@/hooks/useAuth";

export function useCredits() {
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

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      toast.error('You must be logged in to make a purchase');
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Initiating purchase:', {
        packageId,
        userId: user.id,
      });

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      // Instead of using supabase.functions.invoke, we'll use fetch directly
      // This gives us more control over the request
      const response = await fetch(
        `${supabase.functions.url}/create-credit-checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            packageId,
            userId: user.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Edge function error:', result);
        throw new Error(result.error || 'Failed to initiate purchase');
      }

      if (!result.url) {
        console.error('Missing checkout URL in response:', result);
        throw new Error('No checkout URL received from Stripe');
      }

      // Redirect to Stripe checkout
      window.location.href = result.url;
    } catch (error: any) {
      console.error('Purchase error:', {
        error,
        message: error.message,
      });
      
      toast.error(error.message || 'Failed to initiate purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    creditPackages,
    isLoading,
    handlePurchase
  };
}
