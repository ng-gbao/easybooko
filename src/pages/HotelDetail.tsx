import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Star, MapPin, Wifi, Car, Coffee, Waves, CalendarIcon, Users } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  breakfast: <Coffee className="h-4 w-4" />,
  pool: <Waves className="h-4 w-4" />,
};

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  
  const [mainImage, setMainImage] = useState(0);

  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("hotels").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: rooms } = useQuery({
    queryKey: ["rooms", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("*").eq("hotel_id", id!).eq("available", true);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Get booked dates for selected room
  const { data: bookedDates } = useQuery({
    queryKey: ["booked-dates", selectedRoom],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("check_in, check_out")
        .eq("room_id", selectedRoom!)
        .eq("status", "confirmed");
      if (!data) return [];
      const dates: Date[] = [];
      data.forEach((b) => {
        let d = new Date(b.check_in);
        const end = new Date(b.check_out);
        while (d < end) {
          dates.push(new Date(d));
          d.setDate(d.getDate() + 1);
        }
      });
      return dates;
    },
    enabled: !!selectedRoom,
  });

  const selectedRoomData = rooms?.find((r) => r.id === selectedRoom);
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = selectedRoomData ? nights * selectedRoomData.price : 0;

  const isDateBooked = (date: Date) => {
    return bookedDates?.some((d) => d.toDateString() === date.toDateString()) || false;
  };

  const handleBook = () => {
    if (!user) { navigate("/login"); return; }
    if (!selectedRoom || !checkIn || !checkOut || !selectedRoomData) {
      toast.error("Please select a room and dates");
      return;
    }
    navigate("/payment", {
      state: {
        hotelId: id,
        hotelName: hotel?.name,
        hotelLocation: hotel?.location,
        hotelImage: images[0],
        roomId: selectedRoom,
        roomType: selectedRoomData.type,
        checkIn: format(checkIn, "yyyy-MM-dd"),
        checkOut: format(checkOut, "yyyy-MM-dd"),
        nights,
        pricePerNight: selectedRoomData.price,
        totalPrice,
      },
    });
  };

  if (hotelLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-[400px] rounded-xl mb-6" />
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!hotel) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Hotel not found.</div>;

  const images = hotel.images?.length ? hotel.images : [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
        <div className="md:col-span-3 aspect-[16/9] rounded-xl overflow-hidden">
          <img src={images[mainImage]} alt={hotel.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainImage(i)}
              className={cn("rounded-lg overflow-hidden shrink-0 aspect-[4/3] w-24 md:w-full border-2 transition-colors", mainImage === i ? "border-primary" : "border-transparent")}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hotel info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-heading text-3xl font-bold">{hotel.name}</h1>
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">{hotel.rating?.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {hotel.location}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {hotel.amenities.map((a) => (
                  <Badge key={a} variant="secondary" className="px-3 py-1.5 text-sm gap-1.5">
                    {amenityIcons[a.toLowerCase()] || null} {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Rooms */}
          <div>
            <h2 className="font-heading text-lg font-semibold mb-3">Available Rooms</h2>
            <div className="space-y-3">
              {rooms?.map((room) => (
                <Card
                  key={room.id}
                  className={cn("cursor-pointer transition-all", selectedRoom === room.id ? "ring-2 ring-primary" : "hover:shadow-md")}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold capitalize">{room.type} Room</p>
                        <p className="text-sm text-muted-foreground">${room.price}/night</p>
                      </div>
                    </div>
                    <Button variant={selectedRoom === room.id ? "default" : "outline"} size="sm">
                      {selectedRoom === room.id ? "Selected" : "Select"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {rooms?.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No rooms available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Book This Hotel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Check-in</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start", !checkIn && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date() || isDateBooked(date)}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Check-out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start", !checkOut && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date <= (checkIn || new Date()) || isDateBooked(date)}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {nights > 0 && selectedRoomData && (
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{selectedRoomData.type} room × {nights} nights</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary text-lg">${totalPrice}</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={!selectedRoom || !checkIn || !checkOut || booking}
                onClick={handleBook}
              >
                {booking ? "Booking..." : user ? "Confirm Booking" : "Sign in to Book"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
