import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import HotelCard from "@/components/HotelCard";
import PropertyTypeFilter from "@/components/PropertyTypeFilter";
import { useHotels, type PropertyType } from "@/hooks/useHotels";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, SlidersHorizontal, MapPin } from "lucide-react";

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get("location") || "";
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [location, setLocation] = useState(initialLocation);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState<number | undefined>();
  const [propertyType, setPropertyType] = useState<PropertyType | undefined>();
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "rating_desc">("rating_desc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useHotels({
    location,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    minRating,
    propertyType,
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

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <section className="bg-ocean-deep text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">All Hotels</h1>
          <p className="opacity-80 mb-6">Browse our complete collection of stays around the world.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl bg-card text-card-foreground p-3 rounded-xl shadow-xl">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by city or country..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyLocationFilter()}
                className="pl-9"
              />
            </div>
            <Button onClick={applyLocationFilter}>Search</Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="font-heading text-xl font-semibold">
            {data ? `${data.totalCount} stays` : "Loading..."}
            {location && ` in "${location}"`}
          </h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
            </Button>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating_desc">Highest Rating</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <PropertyTypeFilter
            value={propertyType}
            onChange={(v) => {
              setPropertyType(v);
              setPage(1);
            }}
          />
        </div>

        {showFilters && (
          <div className="bg-card border rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Price Range: ${priceRange[0]} – ${priceRange[1]}
              </label>
              <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={25} />
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
              <div className="flex gap-2 flex-wrap">
                {[undefined, 3, 3.5, 4, 4.5].map((r) => (
                  <Button
                    key={String(r)}
                    variant={minRating === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMinRating(r)}
                  >
                    {r ? <><Star className="h-3 w-3 mr-1 fill-current" /> {r}+</> : "All"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : data?.hotels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No stays found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
};

export default Hotels;
