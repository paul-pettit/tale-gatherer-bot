
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Family {
  id: string;
  name: string;
  created_at: string;
  subscription_tier: 'free' | 'basic' | 'premium' | 'enterprise';
  _count?: {
    members: number;
  }
}

export function useFamilies() {
  return useQuery({
    queryKey: ['families'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('families')
        .select(`
          *,
          family_members (count)
        `);

      if (error) throw error;

      return data.map(family => ({
        ...family,
        _count: {
          members: family.family_members[0].count
        }
      })) as Family[];
    }
  });
}
