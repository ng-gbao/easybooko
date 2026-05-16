import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, MapPin, Sparkles, Ticket, Star, ShieldCheck } from "lucide-react";

export const attractionsData = [
  {
    slug: "universal-studios",
    name: "Universal Studios",
    city: "Singapore",
    price: 78,
    image: "https://images.unsplash.com/photo-1569096651661-820d0de8b4ab?w=1600&q=80",
    duration: "Full day",
    rating: 4.7,
    description:
      "Step into the movies at Southeast Asia's only Universal Studios. Ride world-class roller coasters, meet beloved characters, and explore themed zones from Hollywood to Sci-Fi City.",
    highlights: ["Skip-the-line entry", "Mobile e-ticket", "Instant confirmation", "Valid for 1 day"],
  },
  {
    slug: "vinpearl-land",
    name: "Vinpearl Land",
    city: "Phu Quoc",
    price: 35,
    image: "https://images.unsplash.com/photo-1560786824-0d04e0bb44c2?w=1600&q=80",
    duration: "Full day",
    rating: 4.5,
    description:
      "An all-in-one entertainment paradise featuring a water park, aquarium, amusement rides, and a stunning safari experience perfect for the whole family.",
    highlights: ["Includes water park", "Family friendly", "All-day pass", "Free shuttle"],
  },
  {
    slug: "tokyo-disneyland",
    name: "Tokyo Disneyland",
    city: "Tokyo",
    price: 92,
    image: "https://images.unsplash.com/photo-1624601573012-efb68931cc8f?w=1600&q=80",
    duration: "Full day",
    rating: 4.9,
    description:
      "Experience the magic of Disney with uniquely Japanese twists. From dazzling parades to themed lands, Tokyo Disneyland delivers unforgettable moments for every age.",
    highlights: ["1-day passport", "All attractions included", "Live shows & parades", "Instant confirmation"],
  },
  {
    slug: "ba-na-hills-tour",
    name: "Ba Na Hills Tour",
    city: "Da Nang",
    price: 45,
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600&q=80",
    duration: "8 hours",
    rating: 4.8,
    description:
      "Cross the iconic Golden Bridge held by giant stone hands, ride the world-record cable car, and explore the French Village high in the clouds above Da Nang.",
    highlights: ["Hotel pickup included", "English-speaking guide", "Cable car ticket", "Lunch buffet"],
  },
  {
    slug: "eiffel-tower-skip-the-line",
    name: "Eiffel Tower Skip-the-Line",
    city: "Paris",
    price: 56,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
    duration: "2 hours",
    rating: 4.6,
    description:
      "Skip the long queues and ascend directly to the Eiffel Tower's second floor for breathtaking views of Paris. Optional upgrade to the summit available on site.",
    highlights: ["Skip-the-line access", "Mobile ticket", "Free cancellation", "Best rated in Paris"],
  },
];

const Attractions = () => {
  const { slug } = useParams();
  const attraction = attractionsData.find((a) => a.slug === slug) || attractionsData[0];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img src={attraction.image} alt={attraction.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12 text-primary-foreground">
          <Badge className="self-start mb-4 bg-primary/90 backdrop-blur-sm gap-1">
            <Ticket className="h-3.5 w-3.5" /> Attractions & activities
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-2">{attraction.name}</h1>
          <div className="flex items-center gap-4 opacity-95">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {attraction.city}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {attraction.duration}</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {attraction.rating}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">About this experience</h2>
            <p className="text-muted-foreground leading-relaxed">{attraction.description}</p>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">What's included</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {attraction.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2 bg-card border rounded-lg p-4">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border">
            <img src={attraction.image} alt={attraction.name} className="w-full h-80 object-cover" />
          </div>
        </div>

        {/* Booking card */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">From</div>
            <div className="font-heading text-3xl font-bold text-primary mb-1">${attraction.price}</div>
            <div className="text-xs text-muted-foreground mb-5">per person · taxes included</div>

            <Button className="w-full mb-3" size="lg">Book now</Button>
            <Button variant="outline" className="w-full mb-5">Add to wishlist</Button>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck className="h-4 w-4" /> Free cancellation up to 24h</div>
              <div className="flex items-center gap-2 text-sky-600"><Sparkles className="h-4 w-4" /> Instant confirmation</div>
            </div>
          </div>
        </aside>
      </section>

      {/* Other attractions */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">You may also like</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {attractionsData.filter((a) => a.slug !== attraction.slug).slice(0, 4).map((a) => (
              <Link
                key={a.slug}
                to={`/attractions/${a.slug}`}
                className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">{a.city}</div>
                  <div className="font-heading font-semibold line-clamp-1 mb-1">{a.name}</div>
                  <div className="text-sm text-muted-foreground">From <span className="text-primary font-bold">${a.price}</span></div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/hotels"><Button variant="outline">Browse hotels for your trip <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Attractions;
