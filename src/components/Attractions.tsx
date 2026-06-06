import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";

const FALLBACK_ATTRACTION = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80";

const attractions = [
  { slug: "vinpearl-land", name: "VinWonders Phú Quốc", city: "Phú Quốc", price: 35, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" },
  { slug: "ba-na-hills-tour", name: "Bà Nà Hills & Cầu Vàng", city: "Đà Nẵng", price: 45, image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80" },
  { slug: "ha-long-bay-cruise", name: "Du thuyền Vịnh Hạ Long", city: "Hạ Long", price: 65, image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80" },
  { slug: "hoi-an-lantern", name: "Phố đèn lồng Hội An", city: "Hội An", price: 25, image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80" },
  { slug: "cu-chi-tunnels", name: "Địa đạo Củ Chi", city: "TP. Hồ Chí Minh", price: 30, image: "https://images.unsplash.com/photo-1583395145651-be8e302a9d44?w=800&q=80" },
  { slug: "sapa-fansipan", name: "Cáp treo Fansipan Sa Pa", city: "Sa Pa", price: 38, image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=800&q=80" },
];

const Attractions = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Điểm tham quan & hoạt động</h2>
        <p className="text-muted-foreground">Bỏ qua xếp hàng — đặt vé công viên, tour và trải nghiệm hấp dẫn khắp Việt Nam.</p>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {attractions.map((a) => (
          <Link
            to={`/attractions/${a.slug}`}
            key={a.slug}
            className="snap-start shrink-0 w-64 md:w-72 bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={a.image} alt={a.name} loading="lazy" onError={(e) => { if (e.currentTarget.src !== FALLBACK_ATTRACTION) e.currentTarget.src = FALLBACK_ATTRACTION; }} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground mb-1">{a.city}</div>
              <h3 className="font-heading font-semibold mb-2 line-clamp-1">{a.name}</h3>
              <div className="text-sm text-muted-foreground">Từ <span className="text-primary font-bold text-base">{formatPrice(a.price)}</span></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Attractions;
