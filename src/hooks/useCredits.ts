
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
      
      const { data, error } = await supabase.functions.invoke<{ url: string; error?: string }>('create-credit-checkout', {
        body: {
          packageId,
          userId: user.id,
        },
      });

      if (error || data?.error) {
        console.error('Error response:', error || data?.error);
        throw new Error(error?.message || data?.error || 'Failed to initiate purchase');
      }

      console.log('Successfully received response:', data);

      if (!data?.url) {
        throw new Error('No checkout URL received from Stripe');
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error('Full error object:', error);
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
