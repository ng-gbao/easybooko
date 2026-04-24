import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSearch from "@/components/HeroSearch";
import HotelCard from "@/components/HotelCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import TrendingDestinations from "@/components/TrendingDestinations";
import PropertyTypeFilter from "@/components/PropertyTypeFilter";
import { useHotels, type PropertyType } from "@/hooks/useHotels";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, SlidersHorizontal } from "lucide-react";

const Index = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "";
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
  });

  const totalPages = data ? Math.ceil(data.totalCount / 12) : 1;

  return (
    <div className="min-h-screen">
      <HeroSearch />

      <div className="container mx-auto px-4 py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="font-heading text-2xl font-bold">
            {location ? `Stays in "${location}"` : "Featured stays"}
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

        {/* Property type filter */}
        <div className="mb-6">
          <PropertyTypeFilter
            value={propertyType}
            onChange={(v) => {
              setPropertyType(v);
              setPage(1);
            }}
          />
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-card border rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Price Range: ${priceRange[0]} – ${priceRange[1]}
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000}
                step={25}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
              <div className="flex gap-2">
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

        {/* Hotel Grid */}
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

            {/* Pagination */}
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

      <TrendingDestinations />
      <WhyChooseUs />
    </div>
  );
};

export default Index;
