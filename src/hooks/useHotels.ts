import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PropertyType = "hotel" | "apartment" | "resort" | "villa";
export type SortBy = "price_asc" | "price_desc" | "rating_desc" | "popularity" | "distance";

interface HotelFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  propertyType?: PropertyType;
  amenities?: string[];
  hotelIds?: string[]; // pre-filtered ids (e.g. by room type)
  sortBy?: SortBy;
  page?: number;
  pageSize?: number;
}

export const useHotels = (filters: HotelFilters = {}) => {
  const {
    location, minPrice, maxPrice, minRating, propertyType,
    amenities, hotelIds, sortBy = "rating_desc", page = 1, pageSize = 12,
  } = filters;

  return useQuery({
    queryKey: ["hotels", filters],
    queryFn: async () => {
      if (hotelIds && hotelIds.length === 0) return { hotels: [], totalCount: 0 };

      let query = supabase.from("hotels").select("*", { count: "exact" });

      if (location) query = query.ilike("location", `%${location}%`);
      if (minPrice !== undefined) query = query.gte("price_per_night", minPrice);
      if (maxPrice !== undefined) query = query.lte("price_per_night", maxPrice);
      if (minRating !== undefined) query = query.gte("rating", minRating);
      if (propertyType) query = query.eq("property_type", propertyType);
      if (amenities && amenities.length > 0) query = query.contains("amenities", amenities);
      if (hotelIds && hotelIds.length > 0) query = query.in("id", hotelIds);

      if (sortBy === "price_asc") query = query.order("price_per_night", { ascending: true });
      else if (sortBy === "price_desc") query = query.order("price_per_night", { ascending: false });
      else query = query.order("rating", { ascending: false }); // rating / popularity / distance fallback

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { hotels: data || [], totalCount: count || 0 };
    },
  });
};
