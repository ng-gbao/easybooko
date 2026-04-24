import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PropertyType = "hotel" | "apartment" | "resort" | "villa";

interface HotelFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  propertyType?: PropertyType;
  sortBy?: "price_asc" | "price_desc" | "rating_desc";
  page?: number;
  pageSize?: number;
}

export const useHotels = (filters: HotelFilters = {}) => {
  const { location, minPrice, maxPrice, minRating, propertyType, sortBy = "rating_desc", page = 1, pageSize = 12 } = filters;

  return useQuery({
    queryKey: ["hotels", filters],
    queryFn: async () => {
      let query = supabase.from("hotels").select("*", { count: "exact" });

      if (location) {
        query = query.ilike("location", `%${location}%`);
      }
      if (minPrice !== undefined) {
        query = query.gte("price_per_night", minPrice);
      }
      if (maxPrice !== undefined) {
        query = query.lte("price_per_night", maxPrice);
      }
      if (minRating !== undefined) {
        query = query.gte("rating", minRating);
      }
      if (propertyType) {
        query = query.eq("property_type", propertyType);
      }

      if (sortBy === "price_asc") query = query.order("price_per_night", { ascending: true });
      else if (sortBy === "price_desc") query = query.order("price_per_night", { ascending: false });
      else query = query.order("rating", { ascending: false });

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { hotels: data || [], totalCount: count || 0 };
    },
  });
};
