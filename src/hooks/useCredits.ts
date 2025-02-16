
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
      
      const response = await supabase.functions.invoke<{ url: string; error?: string }>('create-credit-checkout', {
        body: {
          packageId,
          userId: user.id,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Edge function response:', response);

      if (response.error) {
        console.error('Edge function error:', {
          error: response.error,
          data: response.data,
        });
        
        // Try to extract the most useful error message
        const errorMessage = response.error.message || 
          (response.data?.error ? 
            typeof response.data.error === 'string' ? 
              response.data.error : 
              JSON.stringify(response.data.error)
          ) : 'Failed to initiate purchase';
        
        throw new Error(errorMessage);
      }

      if (!response.data?.url) {
        console.error('Missing checkout URL in response:', response);
        throw new Error('No checkout URL received from Stripe');
      }

      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error: any) {
      console.error('Purchase error:', {
        error,
        message: error.message,
        stack: error.stack,
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
