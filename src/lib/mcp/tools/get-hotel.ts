import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_hotel",
  title: "Get hotel details",
  description:
    "Get full details for one Easybooko hotel including amenities and its room types with prices (VND) and quantity.",
  inputSchema: {
    hotel_id: z.string().uuid().optional().describe("Hotel id."),
    name: z.string().trim().min(2).optional().describe("Hotel name (partial match) if id is unknown."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ hotel_id, name }) => {
    if (!hotel_id && !name)
      return { content: [{ type: "text", text: "Provide hotel_id or name." }], isError: true };

    const supabase = supabaseAnon();
    let query = supabase
      .from("hotels")
      .select("id,name,location,property_type,description,price_per_night,rating,amenities,images")
      .limit(1);
    query = hotel_id ? query.eq("id", hotel_id) : query.ilike("name", `%${name}%`);

    const { data: hotel, error } = await query.maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!hotel) return { content: [{ type: "text", text: "Hotel not found." }], isError: true };

    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id,type,price,quantity,available")
      .eq("hotel_id", hotel.id)
      .order("price");
    if (roomsError)
      return { content: [{ type: "text", text: roomsError.message }], isError: true };

    const result = { ...hotel, rooms: rooms ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: { hotel: result },
    };
  },
});
