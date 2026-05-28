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
  freeCancellation?: boolean;
  hotelIds?: string[]; // pre-filtered ids (e.g. by room type)
  sortBy?: SortBy;
  page?: number;
  pageSize?: number;
}

// Stable pseudo-distance from hotel id (mock since we have no geo data)
const mockDistance = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 200) / 10; // 0.0 - 19.9 km
};

export const useHotels = (filters: HotelFilters = {}) => {
  const {
    location, minPrice, maxPrice, minRating, propertyType,
    amenities, freeCancellation, hotelIds,
    sortBy = "rating_desc", page = 1, pageSize = 12,
  } = filters;

  return useQuery({
    queryKey: ["hotels", filters],
    queryFn: async () => {
      if (hotelIds && hotelIds.length === 0) return { hotels: [], totalCount: 0 };

      // Combine amenities + free_cancellation flag (stored alongside amenities)
      const amenityFilter = [...(amenities || [])];
      if (freeCancellation) amenityFilter.push("free_cancellation");

      let query = supabase.from("hotels").select("*", { count: "exact" });

      if (location) query = query.ilike("location", `%${location}%`);
      if (minPrice !== undefined) query = query.gte("price_per_night", minPrice);
      if (maxPrice !== undefined) query = query.lte("price_per_night", maxPrice);
      if (minRating !== undefined) query = query.gte("rating", minRating);
      if (propertyType) query = query.eq("property_type", propertyType);
      if (amenityFilter.length > 0) query = query.contains("amenities", amenityFilter);
      if (hotelIds && hotelIds.length > 0) query = query.in("id", hotelIds);

      // Server-side ordering for price; rating used as proxy for popularity
      if (sortBy === "price_asc") query = query.order("price_per_night", { ascending: true });
      else if (sortBy === "price_desc") query = query.order("price_per_night", { ascending: false });
      else query = query.order("rating", { ascending: false });

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      let hotels = data || [];

      // Client-side distance sort (mocked but stable)
      if (sortBy === "distance") {
        hotels = [...hotels].sort((a, b) => mockDistance(a.id) - mockDistance(b.id));
      }

      return { hotels, totalCount: count || 0 };
    },
  });
};
