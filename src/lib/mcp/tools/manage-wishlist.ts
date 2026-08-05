import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "manage_wishlist",
  title: "Manage wishlist",
  description: "List, add to, or remove hotels from the signed-in user's Easybooko wishlist.",
  inputSchema: {
    action: z.enum(["list", "add", "remove"]).describe("Operation to perform."),
    hotel_id: z.string().uuid().optional().describe("Hotel id — required for add and remove."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ action, hotel_id }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();

    if (action !== "list" && !hotel_id)
      return { content: [{ type: "text", text: "hotel_id is required for this action." }], isError: true };

    if (action === "add") {
      const { error } = await supabase.from("wishlists").insert({ user_id: userId, hotel_id });
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (action === "remove") {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", userId)
        .eq("hotel_id", hotel_id!);
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const { data, error } = await supabase
      .from("wishlists")
      .select("hotel_id,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const ids = (data ?? []).map((w) => w.hotel_id);
    const { data: hotels } = ids.length
      ? await supabase.from("hotels").select("id,name,location,price_per_night,rating").in("id", ids)
      : { data: [] as unknown[] };

    return {
      content: [{ type: "text", text: JSON.stringify(hotels ?? [], null, 2) }],
      structuredContent: { wishlist: hotels ?? [] },
    };
  },
});
