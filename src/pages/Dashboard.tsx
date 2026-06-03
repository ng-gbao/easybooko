import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarDays, MapPin, XCircle } from "lucide-react";
import { Navigate, Link } from "react-router-dom";

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Đã xác nhận",
  cancelled: "Đã huỷ",
  pending: "Đang chờ",
  pending_confirmation: "Chờ admin xác nhận",
  rejected: "Đã bị từ chối",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  pending_confirmation: "secondary",
  pending: "secondary",
  cancelled: "outline",
  rejected: "destructive",
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, hotels(name, location, images), rooms(type, price)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase.rpc("cancel_booking", { p_booking_id: bookingId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Đã huỷ đặt phòng");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Đặt phòng của tôi</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : bookings?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground mb-4">Bạn chưa có đặt phòng nào</p>
          <Link to="/"><Button>Tìm khách sạn</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings?.map((b) => {
            const hotel = b.hotels as any;
            const room = b.rooms as any;
            return (
              <Card key={b.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-32 md:h-auto shrink-0">
                    <img
                      src={hotel?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"}
                      alt={hotel?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-lg">{hotel?.name}</h3>
                        <Badge variant={b.status === "confirmed" ? "default" : "secondary"}>
                          {STATUS_LABEL[b.status] || b.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" /> {hotel?.location}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" /> {format(new Date(b.check_in), "dd/MM")} – {format(new Date(b.check_out), "dd/MM/yyyy")}
                        </span>
                        <span className="capitalize">Phòng {room?.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${b.total_price}</p>
                        <p className="text-xs text-muted-foreground">tổng cộng</p>
                      </div>
                      {b.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => cancelBooking.mutate(b.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Huỷ
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
