import { Link, useParams } from "react-router-dom";
import { useHotels } from "@/hooks/useHotels";
import HotelCard from "@/components/HotelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Sparkles, TrendingUp, Plane } from "lucide-react";

const cityMeta: Record<string, { country: string; image: string; tagline: string; blurb: string }> = {
  "Da Nang": {
    country: "Vietnam",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1600&q=80",
    tagline: "Coastal charm meets vibrant city life",
    blurb: "Golden beaches, the iconic Dragon Bridge, and easy access to Ba Na Hills make Da Nang a must-visit on Vietnam's central coast.",
  },
  "Bali": {
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80",
    tagline: "Island of the gods",
    blurb: "From rice terraces in Ubud to surf breaks in Uluwatu, Bali blends spiritual culture, lush nature, and world-class resorts.",
  },
  "Paris": {
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
    tagline: "The city of light",
    blurb: "World-renowned museums, café culture, and timeless boulevards — Paris is a year-round bucket-list destination.",
  },
  "Tokyo": {
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=80",
    tagline: "Where tradition meets the future",
    blurb: "Neon-lit Shinjuku, calm temples in Asakusa, and the freshest sushi on earth — Tokyo never stops surprising you.",
  },
  "Phu Quoc": {
    country: "Vietnam",
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1600&q=80",
    tagline: "Vietnam's tropical island escape",
    blurb: "White-sand beaches, pristine snorkeling, and sunset cocktails — Phu Quoc is paradise just off the southern coast.",
  },
  "Santorini": {
    country: "Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&q=80",
    tagline: "Whitewashed cliffs above the Aegean",
    blurb: "Iconic blue domes, caldera views, and unforgettable sunsets in Oia make Santorini one of the most romantic getaways on earth.",
  },
};

const Trending = () => {
  const { city = "" } = useParams();
  const decoded = decodeURIComponent(city);
  const meta = cityMeta[decoded] || {
    country: "",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80",
    tagline: "A trending traveler favorite",
    blurb: "Discover top-rated stays and unique experiences in this trending destination.",
  };

  const { data, isLoading } = useHotels({ location: decoded, sortBy: "rating_desc", page: 1, pageSize: 8 });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img src={meta.image} alt={decoded} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12 text-primary-foreground">
          <Badge className="self-start mb-4 bg-primary/90 backdrop-blur-sm gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Trending now
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-2">{decoded}</h1>
          <div className="flex items-center gap-2 opacity-90 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{meta.country}</span>
          </div>
          <p className="text-lg md:text-xl max-w-2xl opacity-95">{meta.tagline}</p>
        </div>
      </section>

      {/* Promo strip */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-6">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <div>
              <div className="font-heading font-semibold">Limited-time deal</div>
              <div className="text-sm opacity-90">Save up to 25% on stays in {decoded} this season</div>
            </div>
          </div>
          <Link to={`/hotels?location=${encodeURIComponent(decoded)}`}>
            <Button variant="secondary">Browse all stays <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">About {decoded}</h2>
            <p className="text-muted-foreground leading-relaxed">{meta.blurb}</p>
          </div>
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Plane className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Best time to visit</div>
                <div className="text-sm text-muted-foreground">Year-round destination</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Free cancellation</div>
                <div className="text-sm text-muted-foreground">On most properties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related hotels */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Top stays in {decoded}</h2>
            <p className="text-muted-foreground mt-1">Highest-rated picks for your trip</p>
          </div>
          <Link to={`/hotels?location=${encodeURIComponent(decoded)}`}>
            <Button variant="outline">See all <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : data && data.hotels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.hotels.map((h) => <HotelCard key={h.id} hotel={h} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl">
            <p className="text-muted-foreground mb-4">No stays found for {decoded} yet.</p>
            <Link to="/hotels"><Button>Browse all hotels</Button></Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Trending;
