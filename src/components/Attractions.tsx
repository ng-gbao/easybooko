import { Link } from "react-router-dom";

const attractions = [
  { slug: "universal-studios", name: "Universal Studios", city: "Singapore", price: 78, image: "https://images.unsplash.com/photo-1569096651661-820d0de8b4ab?w=600&q=80" },
  { slug: "vinpearl-land", name: "Vinpearl Land", city: "Phu Quoc", price: 35, image: "https://images.unsplash.com/photo-1560786824-0d04e0bb44c2?w=600&q=80" },
  { slug: "tokyo-disneyland", name: "Tokyo Disneyland", city: "Tokyo", price: 92, image: "https://images.unsplash.com/photo-1624601573012-efb68931cc8f?w=600&q=80" },
  { slug: "ba-na-hills-tour", name: "Ba Na Hills Tour", city: "Da Nang", price: 45, image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80" },
  { slug: "eiffel-tower-skip-the-line", name: "Eiffel Tower Skip-the-Line", city: "Paris", price: 56, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
];

const Attractions = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Attractions & activities</h2>
        <p className="text-muted-foreground">Skip the lines — book theme parks, tours, and tickets in advance.</p>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {attractions.map((a) => (
          <Link
            to={`/attractions/${a.slug}`}
            key={a.slug}
            className="snap-start shrink-0 w-64 md:w-72 bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={a.image} alt={a.name} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground mb-1">{a.city}</div>
              <h3 className="font-heading font-semibold mb-2 line-clamp-1">{a.name}</h3>
              <div className="text-sm text-muted-foreground">From <span className="text-primary font-bold text-base">${a.price}</span></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Attractions;
