
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditPackage } from "@/types/credits";
import { useAuth } from "@/hooks/useAuth";

export function useCredits() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { data: creditPackages, error, refetch } = useQuery({
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

      const { data, error } = await supabase.functions.invoke('create-credit-checkout', {
        body: {
          packageId,
          userId: user.id,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to initiate purchase');
      }

      if (!data?.url) {
        console.error('Missing checkout URL in response:', data);
        throw new Error('No checkout URL received from Stripe');
      }

      // Store current page URL to handle back navigation
      sessionStorage.setItem('creditPurchaseReturnUrl', window.location.href);

      // Redirect to Stripe checkout
      window.location.href = data.url;
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
    handlePurchase,
    error,
    refetch
  };
}
