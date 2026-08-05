import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "check_room_availability",
  title: "Check room availability",
  description:
    "Check how many rooms of each type are still available at a hotel for a date range (check-out day is free for a new check-in).",
  inputSchema: {
    hotel_id: z.string().uuid().describe("Hotel id."),
    check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Check-in date (YYYY-MM-DD)."),
    check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Check-out date (YYYY-MM-DD)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ hotel_id, check_in, check_out }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    if (check_in >= check_out)
      return { content: [{ type: "text", text: "check_out must be after check_in." }], isError: true };

    const supabase = supabaseForUser(ctx);
    const { data: rooms, error } = await supabase
      .from("rooms")
      .select("id,type,price,quantity,available")
      .eq("hotel_id", hotel_id)
      .order("price");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!rooms?.length)
      return { content: [{ type: "text", text: "No rooms found for that hotel." }], isError: true };

    const { data: counts, error: rpcError } = await supabase.rpc("get_room_overlap_counts", {
      p_hotel_id: hotel_id,
      p_check_in: check_in,
      p_check_out: check_out,
    });
    if (rpcError) return { content: [{ type: "text", text: rpcError.message }], isError: true };

    const booked = new Map<string, number>();
    for (const row of (counts ?? []) as { room_id: string; booked_count: number }[]) {
      booked.set(row.room_id, Number(row.booked_count));
    }

    const availability = rooms.map((r) => {
      const used = booked.get(r.id) ?? 0;
      const remaining = r.available ? Math.max(0, (r.quantity ?? 1) - used) : 0;
      return { room_id: r.id, type: r.type, price: r.price, remaining };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(availability, null, 2) }],
      structuredContent: { check_in, check_out, availability },
    };
  },
});
