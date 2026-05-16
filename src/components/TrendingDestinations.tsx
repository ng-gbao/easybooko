import { useNavigate } from "react-router-dom";

const destinations = [
  { name: "Da Nang", country: "Vietnam", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80" },
  { name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80" },
  { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80" },
  { name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80" },
  { name: "Phu Quoc", country: "Vietnam", image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80" },
  { name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80" },
];

const TrendingDestinations = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Trending destinations</h2>
          <p className="text-muted-foreground">Travelers' favorites — book your spot today.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {destinations.map((d, i) => (
            <button
              key={d.name}
              onClick={() => navigate(`/trending/${encodeURIComponent(d.name)}`)}
              className={`group relative overflow-hidden rounded-xl text-left ${
                i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"
              }`}
            >
              <img
                src={d.image}
                alt={`${d.name}, ${d.country}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-primary-foreground">
                <div className="font-heading text-xl md:text-2xl font-semibold">{d.name}</div>
                <div className="text-sm opacity-90">{d.country}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDestinations;
