
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
      
      console.log('Starting purchase process for package:', packageId);
      console.log('User ID:', user.id);
      
      const response = await supabase.functions.invoke<{ url: string; error?: string }>('create-credit-checkout', {
        body: {
          packageId,
          userId: user.id,
        },
      });

      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(
          response.error.message || 
          (response.data?.error ? JSON.stringify(response.data.error) : 'Failed to initiate purchase')
        );
      }

      if (response.data?.error) {
        console.error('Application error:', response.data.error);
        throw new Error(response.data.error);
      }

      if (!response.data?.url) {
        throw new Error('No checkout URL received from Stripe');
      }

      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error: any) {
      console.error('Purchase error:', error);
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
