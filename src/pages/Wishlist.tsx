import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HotelCard from "@/components/HotelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: hotels, isLoading } = useQuery({
    queryKey: ["wishlist-hotels", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("hotels(*)")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data?.map((w) => w.hotels).filter(Boolean) as any[];
    },
    enabled: !!user,
  });

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Danh sách yêu thích</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/3] rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ))}
        </div>
      ) : hotels?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground mb-4">Danh sách yêu thích còn trống</p>
          <Link to="/"><Button>Khám phá khách sạn</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels?.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
