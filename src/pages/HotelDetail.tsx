import { useMemo, useState } from "react";

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

  // Fetch all confirmed bookings overlapping selected dates for this hotel's rooms
  const roomIds = useMemo(() => (rooms || []).map((r) => r.id), [rooms]);
  const ciStr = checkIn ? format(checkIn, "yyyy-MM-dd") : null;
  const coStr = checkOut ? format(checkOut, "yyyy-MM-dd") : null;

  const { data: overlappingBookings } = useQuery({
    queryKey: ["overlapping-bookings", id, ciStr, coStr, roomIds.length],
    queryFn: async () => {
      if (!ciStr || !coStr || roomIds.length === 0) return [];
      // Overlap: existing.check_in < new.check_out AND existing.check_out > new.check_in
      const { data } = await supabase
        .from("bookings")
        .select("room_id, check_in, check_out")
        .in("room_id", roomIds)
        .eq("status", "confirmed")
        .lt("check_in", coStr)
        .gt("check_out", ciStr);
      return data || [];
    },
    enabled: !!ciStr && !!coStr && roomIds.length > 0,
  });

  // Booked room IDs for the selected window
  const bookedRoomIds = useMemo(
    () => new Set((overlappingBookings || []).map((b) => b.room_id)),
    [overlappingBookings]
  );

  // Group rooms by type → compute availability summary
  type RoomRow = NonNullable<typeof rooms>[number];
  const datesSelected = !!checkIn && !!checkOut;

  const roomGroups = useMemo(() => {
    const map = new Map<string, { type: string; rooms: RoomRow[]; available: RoomRow[]; bookedCount: number }>();
    (rooms || []).forEach((r) => {
      const g = map.get(r.type) || { type: r.type, rooms: [] as RoomRow[], available: [] as RoomRow[], bookedCount: 0 };
      g.rooms.push(r);
      if (datesSelected && bookedRoomIds.has(r.id)) g.bookedCount++;
      else g.available.push(r);
      map.set(r.type, g);
    });
    const arr = Array.from(map.values());
    // Sort: available types first, then limited, then sold out
    const score = (g: typeof arr[number]) => {
      if (!datesSelected) return 0;
      if (g.available.length === 0) return 2;
      if (g.available.length <= 2) return 1;
      return 0;
    };
    return arr.sort((a, b) => score(a) - score(b));
  }, [rooms, bookedRoomIds, datesSelected]);

  const selectedRoomData = rooms?.find((r) => r.id === selectedRoom);
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = selectedRoomData ? nights * selectedRoomData.price : 0;
  const selectedRoomUnavailable = !!selectedRoom && datesSelected && bookedRoomIds.has(selectedRoom);

  const handleBook = () => {
    if (!user) { navigate("/login"); return; }
    if (!selectedRoom || !checkIn || !checkOut || !selectedRoomData) {
      toast.error("Please select a room and dates");
      return;
    }
    if (selectedRoomUnavailable) {
      toast.error("This room is sold out for the selected dates");
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
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
                Free cancellation
              </Badge>
              <Badge variant="outline" className="border-sky-500/40 text-sky-700 dark:text-sky-400">
                Pay at hotel
              </Badge>
              <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">
                No prepayment needed
              </Badge>
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-lg font-semibold">Available Rooms</h2>
              {!datesSelected && (
                <span className="text-xs text-muted-foreground">Select dates to check live availability</span>
              )}
            </div>
            <div className="space-y-3">
              {roomGroups.map((group) => {
                const isSoldOut = datesSelected && group.available.length === 0;
                const isLimited = datesSelected && group.available.length > 0 && group.available.length <= 2;
                // Use the first available room (or first room if none) as the bookable representative
                const repRoom = group.available[0] || group.rooms[0];
                const isSelected = selectedRoom === repRoom.id;

                return (
                  <Card
                    key={group.type}
                    className={cn(
                      "transition-all",
                      isSoldOut ? "opacity-60" : "cursor-pointer",
                      isSelected ? "ring-2 ring-primary" : !isSoldOut && "hover:shadow-md"
                    )}
                    onClick={() => { if (!isSoldOut) setSelectedRoom(repRoom.id); }}
                  >
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Users className="h-5 w-5 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold capitalize">{group.type} Room</p>
                            {datesSelected && (
                              isSoldOut ? (
                                <Badge variant="outline" className="border-destructive/40 text-destructive">Sold out</Badge>
                              ) : isLimited ? (
                                <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
                                  Limited availability ({group.available.length} left)
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
                                  Available
                                </Badge>
                              )
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">${repRoom.price}/night</p>
                          {isSoldOut && (
                            <p className="text-xs text-destructive mt-1">Unavailable for selected dates</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        disabled={isSoldOut}
                        onClick={(e) => { e.stopPropagation(); if (!isSoldOut) setSelectedRoom(repRoom.id); }}
                      >
                        {isSoldOut ? "Sold out" : isSelected ? "Selected" : "Select"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
              {roomGroups.length === 0 && (
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
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}

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
                      disabled={(date) => date <= (checkIn || new Date())}

                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>


              {selectedRoomUnavailable && (
                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2">
                  Selected room is sold out for these dates. Please choose another room or change dates.
                </div>
              )}

              {nights > 0 && selectedRoomData && !selectedRoomUnavailable && (
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
                disabled={!selectedRoom || !checkIn || !checkOut || selectedRoomUnavailable}
                onClick={handleBook}
              >
                {user ? "Proceed to Payment" : "Sign in to Book"}
              </Button>


            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
