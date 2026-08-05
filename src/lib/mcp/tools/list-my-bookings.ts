import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_my_bookings",
  title: "List my bookings",
  description: "List the signed-in user's Easybooko bookings with hotel, room, dates, total (VND) and status.",
  inputSchema: {
    status: z
      .enum(["pending", "confirmed", "cancelled", "rejected"])
      .optional()
      .describe("Optional status filter."),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);

    let query = supabase
      .from("bookings")
      .select("id,check_in,check_out,total_price,status,created_at,hotel_id,room_id")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (status) query = query.eq("status", status);

    const { data: bookings, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!bookings?.length)
      return { content: [{ type: "text", text: "Bạn chưa có đơn đặt phòng nào." }] };

    const hotelIds = [...new Set(bookings.map((b) => b.hotel_id))];
    const roomIds = [...new Set(bookings.map((b) => b.room_id).filter(Boolean))] as string[];
    const [{ data: hotels }, { data: rooms }] = await Promise.all([
      supabase.from("hotels").select("id,name,location").in("id", hotelIds),
      roomIds.length
        ? supabase.from("rooms").select("id,type,price").in("id", roomIds)
        : Promise.resolve({ data: [] as { id: string; type: string; price: number }[] }),
    ]);

    const enriched = bookings.map((b) => ({
      ...b,
      hotel: hotels?.find((h) => h.id === b.hotel_id) ?? null,
      room: rooms?.find((r) => r.id === b.room_id) ?? null,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(enriched, null, 2) }],
      structuredContent: { bookings: enriched },
    };
  },
});
