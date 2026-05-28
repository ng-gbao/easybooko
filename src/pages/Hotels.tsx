import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HotelCard from "@/components/HotelCard";
import PropertyTypeFilter from "@/components/PropertyTypeFilter";
import { useHotels, type PropertyType, type SortBy } from "@/hooks/useHotels";
import { useLocations } from "@/hooks/useLocations";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, SlidersHorizontal, MapPin, X, Users, BedDouble, CalendarDays, Wifi, Car, Coffee, Waves, Snowflake } from "lucide-react";

const AMENITY_OPTIONS = [
  { key: "wifi", label: "WiFi", icon: Wifi },
  { key: "breakfast", label: "Breakfast", icon: Coffee },
  { key: "parking", label: "Parking", icon: Car },
  { key: "pool", label: "Pool", icon: Waves },
  { key: "air_conditioner", label: "Air conditioner", icon: Snowflake },
];
const ROOM_TYPES = ["single", "double", "suite", "deluxe", "family"];
const STAR_RATINGS = [5, 4, 3];

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Main search
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  // Filters
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState<number | undefined>();
  const [propertyType, setPropertyType] = useState<PropertyType | undefined>(
    (searchParams.get("type") as PropertyType | null) || undefined
  );
  const [starRating, setStarRating] = useState<number | undefined>();
  const [roomType, setRoomType] = useState<string | undefined>();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [minReviewScore, setMinReviewScore] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<SortBy>("rating_desc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = (searchParams.get("type") as PropertyType | null) || undefined;
    setPropertyType(t);
    const loc = searchParams.get("location") || "";
    setLocation(loc);
    setLocationInput(loc);
    setPage(1);
  }, [searchParams]);

  // Fetch hotel IDs that have the selected room type
  const { data: roomTypeHotelIds } = useQuery({
    queryKey: ["hotels-by-room-type", roomType],
    queryFn: async () => {
      if (!roomType) return undefined;
      const { data } = await supabase.from("rooms").select("hotel_id").eq("type", roomType);
      return Array.from(new Set((data || []).map((r) => r.hotel_id)));
    },
    enabled: !!roomType,
  });

  const effectiveMinRating = minRating ?? minReviewScore ?? starRating;

  const { data, isLoading } = useHotels({
    location,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    minRating: effectiveMinRating,
    propertyType,
    amenities: amenities.length > 0 ? amenities : undefined,
    hotelIds: roomType ? (roomTypeHotelIds || []) : undefined,
    sortBy,
    page,
    pageSize: 16,
  });

  const totalPages = data ? Math.ceil(data.totalCount / 16) : 1;

  const applyLocationFilter = () => {
    setLocation(locationInput);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (locationInput) params.set("location", locationInput);
    else params.delete("location");
    setSearchParams(params, { replace: true });
  };

  const toggleAmenity = (key: string) => {
    setAmenities((prev) => prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]);
    setPage(1);
  };

  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setMinRating(undefined);
    setStarRating(undefined);
    setRoomType(undefined);
    setAmenities([]);
    setFreeCancellation(false);
    setMinReviewScore(undefined);
    setPage(1);
  };

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (priceRange[0] > 0 || priceRange[1] < 1000) chips.push({ label: `$${priceRange[0]}–$${priceRange[1]}`, clear: () => setPriceRange([0, 1000]) });
    if (starRating) chips.push({ label: `${starRating}★ hotels`, clear: () => setStarRating(undefined) });
    if (minReviewScore) chips.push({ label: `Score ${minReviewScore}+`, clear: () => setMinReviewScore(undefined) });
    if (roomType) chips.push({ label: `Room: ${roomType}`, clear: () => setRoomType(undefined) });
    if (freeCancellation) chips.push({ label: "Free cancellation", clear: () => setFreeCancellation(false) });
    amenities.forEach((a) => chips.push({ label: AMENITY_OPTIONS.find(o => o.key === a)?.label || a, clear: () => toggleAmenity(a) }));
    return chips;
  }, [priceRange, starRating, minReviewScore, roomType, freeCancellation, amenities]);

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Page header */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-deep to-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Find your stay</h1>
          <p className="opacity-80 mb-6">Search hotels, apartments, resorts and villas worldwide.</p>

          {/* Main search bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-card text-card-foreground p-3 rounded-xl shadow-xl">
            <div className="relative md:col-span-4">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Destination"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyLocationFilter()}
                className="pl-9"
              />
            </div>
            <div className="relative md:col-span-2">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="pl-9" />
            </div>
            <div className="relative md:col-span-2">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="pl-9" />
            </div>
            <div className="relative md:col-span-1">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="number" min={1} value={guests} onChange={(e) => setGuests(+e.target.value)} className="pl-9" title="Guests" />
            </div>
            <div className="relative md:col-span-1">
              <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="number" min={1} value={roomsCount} onChange={(e) => setRoomsCount(+e.target.value)} className="pl-9" title="Rooms" />
            </div>
            <Button onClick={applyLocationFilter} className="md:col-span-2">Search</Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <FilterPanel
            priceRange={priceRange} setPriceRange={setPriceRange}
            starRating={starRating} setStarRating={setStarRating}
            roomType={roomType} setRoomType={setRoomType}
            amenities={amenities} toggleAmenity={toggleAmenity}
            freeCancellation={freeCancellation} setFreeCancellation={setFreeCancellation}
            minReviewScore={minReviewScore} setMinReviewScore={setMinReviewScore}
            clearAllFilters={clearAllFilters}
          />
        </aside>

        <div className="lg:col-span-3">
          {/* Sticky toolbar */}
          <div className="sticky top-16 z-20 -mx-4 px-4 py-3 mb-4 bg-background/85 backdrop-blur-md border-b">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-heading text-lg font-semibold">
                {data ? `${data.totalCount} stays` : "Loading..."}
                {location && <span className="text-muted-foreground font-normal"> in "{location}"</span>}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                  <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
                </Button>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                  <SelectTrigger className="w-[180px] h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating_desc">Highest Rating</SelectItem>
                    <SelectItem value="price_asc">Price: Low → High</SelectItem>
                    <SelectItem value="price_desc">Price: High → Low</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-3">
              <PropertyTypeFilter
                value={propertyType}
                onChange={(v) => {
                  const params = new URLSearchParams(searchParams);
                  if (v) params.set("type", v); else params.delete("type");
                  setSearchParams(params, { replace: true });
                }}
              />
            </div>

            {activeChips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                {activeChips.map((c, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 pr-1 animate-fade-in">
                    {c.label}
                    <button onClick={c.clear} className="ml-1 hover:bg-background rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearAllFilters}>Clear all</Button>
              </div>
            )}
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="lg:hidden bg-card border rounded-lg p-4 mb-4 animate-fade-in">
              <FilterPanel
                priceRange={priceRange} setPriceRange={setPriceRange}
                starRating={starRating} setStarRating={setStarRating}
                roomType={roomType} setRoomType={setRoomType}
                amenities={amenities} toggleAmenity={toggleAmenity}
                freeCancellation={freeCancellation} setFreeCancellation={setFreeCancellation}
                minReviewScore={minReviewScore} setMinReviewScore={setMinReviewScore}
                clearAllFilters={clearAllFilters}
              />
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : data?.hotels.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-xl animate-fade-in">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-heading text-xl font-semibold mb-2">No stays match your filters</h3>
              <p className="text-muted-foreground mb-6">Try widening your price range or removing some filters.</p>
              <Button onClick={clearAllFilters}>Clear all filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data?.hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface FPProps {
  priceRange: number[]; setPriceRange: (v: number[]) => void;
  starRating?: number; setStarRating: (v?: number) => void;
  roomType?: string; setRoomType: (v?: string) => void;
  amenities: string[]; toggleAmenity: (k: string) => void;
  freeCancellation: boolean; setFreeCancellation: (v: boolean) => void;
  minReviewScore?: number; setMinReviewScore: (v?: number) => void;
  clearAllFilters: () => void;
}

const FilterPanel = ({
  priceRange, setPriceRange, starRating, setStarRating, roomType, setRoomType,
  amenities, toggleAmenity, freeCancellation, setFreeCancellation,
  minReviewScore, setMinReviewScore, clearAllFilters,
}: FPProps) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-heading font-semibold">Filters</h3>
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllFilters}>Reset</Button>
    </div>

    <div>
      <Label className="text-sm font-medium mb-3 block">
        Price: ${priceRange[0]} – ${priceRange[1]}
      </Label>
      <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={25} />
    </div>

    <div>
      <Label className="text-sm font-medium mb-3 block">Star rating</Label>
      <div className="flex flex-wrap gap-2">
        {STAR_RATINGS.map((s) => (
          <Button key={s} size="sm" variant={starRating === s ? "default" : "outline"}
            onClick={() => setStarRating(starRating === s ? undefined : s)}>
            <Star className="h-3 w-3 mr-1 fill-current" /> {s}
          </Button>
        ))}
      </div>
    </div>

    <div>
      <Label className="text-sm font-medium mb-3 block">Review score</Label>
      <div className="flex flex-wrap gap-2">
        {[4.5, 4, 3.5].map((s) => (
          <Button key={s} size="sm" variant={minReviewScore === s ? "default" : "outline"}
            onClick={() => setMinReviewScore(minReviewScore === s ? undefined : s)}>
            {s}+
          </Button>
        ))}
      </div>
    </div>

    <div>
      <Label className="text-sm font-medium mb-3 block">Room type</Label>
      <Select value={roomType || "any"} onValueChange={(v) => setRoomType(v === "any" ? undefined : v)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any room type</SelectItem>
          {ROOM_TYPES.map((rt) => (
            <SelectItem key={rt} value={rt} className="capitalize">{rt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label className="text-sm font-medium mb-3 block">Amenities</Label>
      <div className="space-y-2">
        {AMENITY_OPTIONS.map(({ key, label, icon: Icon }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded p-1 transition-colors">
            <Checkbox checked={amenities.includes(key)} onCheckedChange={() => toggleAmenity(key)} />
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <Label className="text-sm font-medium mb-3 block">Other</Label>
      <label className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 rounded p-1 transition-colors">
        <Checkbox checked={freeCancellation} onCheckedChange={(c) => setFreeCancellation(!!c)} />
        <span className="text-sm">Free cancellation</span>
      </label>
    </div>
  </div>
);

export default Hotels;
