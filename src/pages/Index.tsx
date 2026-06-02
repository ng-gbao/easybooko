import { Link } from "react-router-dom";
import HeroSearch from "@/components/HeroSearch";
import HotelCard from "@/components/HotelCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import TrendingDestinations from "@/components/TrendingDestinations";
import Promotions from "@/components/Promotions";
import AccommodationOptions from "@/components/AccommodationOptions";
import Attractions from "@/components/Attractions";
import TravelActivities from "@/components/TravelActivities";
import TravelGuide from "@/components/TravelGuide";
import ExploreLinks from "@/components/ExploreLinks";
import { useHotels } from "@/hooks/useHotels";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { data, isLoading } = useHotels({ sortBy: "rating_desc", page: 1, pageSize: 8 });

  return (
    <div className="min-h-screen">
      <HeroSearch />

      <section id="results" className="container mx-auto px-4 py-12 md:py-16 scroll-mt-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Khách sạn nổi bật</h2>
            <p className="text-muted-foreground mt-1">Những chỗ nghỉ được đánh giá cao nhất, tuyển chọn dành cho bạn</p>
          </div>
          <Link to="/hotels">
            <Button variant="outline">
              Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.hotels.slice(0, 8).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      <Promotions />
      <AccommodationOptions />
      <TrendingDestinations />
      <Attractions />
      <TravelActivities />
      <TravelGuide />
      <ExploreLinks />
      <WhyChooseUs />
    </div>
  );
};

export default Index;
