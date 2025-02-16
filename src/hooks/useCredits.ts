
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

  return {
    creditPackages,
    isLoading,
    handlePurchase
  };
}
