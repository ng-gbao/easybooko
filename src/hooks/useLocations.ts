import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLocations = () => {
  return useQuery({
    queryKey: ["hotel-locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hotels").select("location");
      if (error) throw error;
      return Array.from(new Set((data || []).map((r) => r.location))).sort();
    },
    staleTime: 1000 * 60 * 10,
  });
};
