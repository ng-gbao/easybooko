import { useNavigate } from "react-router-dom";

const FALLBACK = "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80";

const destinations = [
  { name: "Đà Nẵng", country: "Việt Nam", slug: "Da Nang", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80" },
  { name: "Hà Nội", country: "Việt Nam", slug: "Hanoi", image: "https://images.unsplash.com/photo-1509923936021-c9bf38940dd2?w=800&q=80" },
  { name: "Hội An", country: "Việt Nam", slug: "Hoi An", image: "https://images.unsplash.com/photo-1583395145651-be8e302a9d44?w=800&q=80" },
  { name: "Phú Quốc", country: "Việt Nam", slug: "Phu Quoc", image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80" },
  { name: "Sa Pa", country: "Việt Nam", slug: "Sa Pa", image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=800&q=80" },
  { name: "Hạ Long", country: "Việt Nam", slug: "Ha Long", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80" },
];

const TrendingDestinations = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-sky-50/60 dark:bg-sky-950/20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Điểm đến thịnh hành</h2>
          <p className="text-muted-foreground">Lựa chọn yêu thích của du khách — đặt phòng ngay hôm nay.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {destinations.map((d, i) => (
            <button
              key={d.name}
              onClick={() => navigate(`/trending/${encodeURIComponent(d.slug)}`)}
              className={`group relative overflow-hidden rounded-xl text-left ${
                i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"
              }`}
            >
              <img
                src={d.image}
                alt={`${d.name}, ${d.country}`}
                loading="lazy"
                onError={(e) => { if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK; }}
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
