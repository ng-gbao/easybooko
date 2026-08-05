import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_hotels",
  title: "Search hotels",
  description:
    "Search Easybooko hotels by destination, property type, price range and minimum rating. Prices are in VND per night.",
  inputSchema: {
    destination: z.string().trim().optional().describe("City or location, e.g. 'Da Nang'."),
    property_type: z
      .enum(["hotel", "apartment", "resort", "villa"])
      .optional()
      .describe("Accommodation type filter."),
    min_price: z.number().nonnegative().optional().describe("Minimum price per night in VND."),
    max_price: z.number().positive().optional().describe("Maximum price per night in VND."),
    min_rating: z.number().min(0).max(5).optional().describe("Minimum star rating."),
    limit: z.number().int().min(1).max(25).default(10).describe("Max hotels to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ destination, property_type, min_price, max_price, min_rating, limit }) => {
    let query = supabaseAnon()
      .from("hotels")
      .select("id,name,location,property_type,price_per_night,rating,amenities,description")
      .order("rating", { ascending: false })
      .limit(limit ?? 10);

    if (destination) query = query.ilike("location", `%${destination}%`);
    if (property_type) query = query.eq("property_type", property_type);
    if (min_price !== undefined) query = query.gte("price_per_night", min_price);
    if (max_price !== undefined) query = query.lte("price_per_night", max_price);
    if (min_rating !== undefined) query = query.gte("rating", min_rating);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length)
      return { content: [{ type: "text", text: "No hotels matched those filters." }] };

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { hotels: data },
    };
  },
});
