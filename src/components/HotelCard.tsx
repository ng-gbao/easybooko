import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatPrice, formatAmenity } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

interface HotelCardProps {
  hotel: Tables<"hotels">;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isWishlisted } = useQuery({
    queryKey: ["wishlist", hotel.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("hotel_id", hotel.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const toggleWishlist = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Login required");
      if (isWishlisted) {
        await supabase.from("wishlists").delete().eq("user_id", user.id).eq("hotel_id", hotel.id);
      } else {
        await supabase.from("wishlists").insert({ user_id: user.id, hotel_id: hotel.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(isWishlisted ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích");
    },
  });

  const img = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={img}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={(e) => { const fb = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"; if (e.currentTarget.src !== fb) e.currentTarget.src = fb; }}
        />
        {user && (
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist.mutate(); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
            aria-label="Yêu thích"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
          </button>
        )}
        <Badge className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur-sm">
          Từ {formatPrice(hotel.price_per_night)} / đêm
        </Badge>
      </div>
      <Link to={`/hotel/${hotel.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-heading font-semibold text-lg line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center gap-1 text-sm shrink-0 ml-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{hotel.rating?.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{hotel.location}</span>
          </div>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
              Miễn phí huỷ phòng
            </Badge>
            <Badge variant="outline" className="text-[10px] border-sky-500/40 text-sky-700 dark:text-sky-400">
              Thanh toán tại khách sạn
            </Badge>
          </div>
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {hotel.amenities.slice(0, 3).map((a) => (
                <Badge key={a} variant="secondary" className="text-xs">{formatAmenity(a, "compact")}</Badge>
              ))}
              {hotel.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">+{hotel.amenities.length - 3}</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default HotelCard;
