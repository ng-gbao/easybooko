import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchHotelsTool from "./tools/search-hotels";
import getHotelTool from "./tools/get-hotel";
import checkRoomAvailabilityTool from "./tools/check-room-availability";
import listMyBookingsTool from "./tools/list-my-bookings";
import manageWishlistTool from "./tools/manage-wishlist";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "easybooko",
  title: "Easybooko",
  version: "0.1.0",
  instructions:
    "Tools for Easybooko, a Vietnam-focused hotel booking app. Use `search_hotels` and `get_hotel` to browse stays (prices in VND), `check_room_availability` for a date range, `list_my_bookings` for the signed-in user's reservations, and `manage_wishlist` to list/add/remove saved hotels.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchHotelsTool,
    getHotelTool,
    checkRoomAvailabilityTool,
    listMyBookingsTool,
    manageWishlistTool,
  ],
});
