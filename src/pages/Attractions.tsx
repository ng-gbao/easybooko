import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, MapPin, Sparkles, Ticket, Star, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const FALLBACK_ATTRACTION = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600&q=80";
const onImgErr = (e: React.SyntheticEvent<HTMLImageElement>) => { if (e.currentTarget.src !== FALLBACK_ATTRACTION) e.currentTarget.src = FALLBACK_ATTRACTION; };

export const attractionsData = [
  {
    slug: "vinpearl-land",
    name: "VinWonders Phú Quốc",
    city: "Phú Quốc",
    price: 35,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80",
    duration: "Cả ngày",
    rating: 4.6,
    description:
      "Thiên đường giải trí ngoài đảo với công viên nước, thuỷ cung, trò chơi cảm giác mạnh và safari hoang dã — lựa chọn lý tưởng cho cả gia đình.",
    highlights: ["Bao gồm công viên nước", "Phù hợp gia đình", "Vé cả ngày", "Xe đưa đón miễn phí"],
  },
  {
    slug: "ba-na-hills-tour",
    name: "Bà Nà Hills & Cầu Vàng",
    city: "Đà Nẵng",
    price: 45,
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600&q=80",
    duration: "8 giờ",
    rating: 4.8,
    description:
      "Băng qua Cầu Vàng huyền thoại được nâng bởi đôi tay đá khổng lồ, đi cáp treo kỷ lục thế giới và khám phá Làng Pháp trên đỉnh mây.",
    highlights: ["Đón tận khách sạn", "Hướng dẫn viên tiếng Việt/Anh", "Vé cáp treo", "Buffet trưa"],
  },
  {
    slug: "ha-long-bay-cruise",
    name: "Du thuyền Vịnh Hạ Long",
    city: "Hạ Long",
    price: 65,
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80",
    duration: "Cả ngày",
    rating: 4.9,
    description:
      "Hành trình du thuyền giữa hàng nghìn đảo đá vôi tại kỳ quan thiên nhiên thế giới — chèo kayak, thăm hang động và thưởng thức hải sản tươi sống.",
    highlights: ["Vé du thuyền & ăn trưa", "Chèo kayak khám phá hang", "Tham quan hang Sửng Sốt", "Xác nhận tức thì"],
  },
  {
    slug: "hoi-an-lantern",
    name: "Phố đèn lồng Hội An",
    city: "Hội An",
    price: 25,
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1600&q=80",
    duration: "4 giờ",
    rating: 4.7,
    description:
      "Khám phá phố cổ Hội An rực rỡ đèn lồng, thả hoa đăng trên sông Hoài và thưởng thức ẩm thực miền Trung.",
    highlights: ["Hướng dẫn viên địa phương", "Hoa đăng sông Hoài", "Ẩm thực phố cổ", "Vé chùa Cầu"],
  },
  {
    slug: "cu-chi-tunnels",
    name: "Địa đạo Củ Chi",
    city: "TP. Hồ Chí Minh",
    price: 30,
    image: "https://images.unsplash.com/photo-1583395145651-be8e302a9d44?w=1600&q=80",
    duration: "Nửa ngày",
    rating: 4.5,
    description:
      "Khám phá hệ thống địa đạo lịch sử dài hơn 200km, cùng nghe câu chuyện chiến tranh và bài học hoà bình tại điểm đến biểu tượng của miền Nam.",
    highlights: ["Đón tại trung tâm Sài Gòn", "Hướng dẫn viên tiếng Anh", "Trải nghiệm hầm địa đạo", "Bữa ăn nhẹ tại chỗ"],
  },
];

const Attractions = () => {
  const { slug } = useParams();
  const attraction = attractionsData.find((a) => a.slug === slug) || attractionsData[0];

  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img src={attraction.image} alt={attraction.name} onError={onImgErr} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12 text-primary-foreground">
          <Badge className="self-start mb-4 bg-primary/90 backdrop-blur-sm gap-1">
            <Ticket className="h-3.5 w-3.5" /> Điểm tham quan & hoạt động
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-2">{attraction.name}</h1>
          <div className="flex items-center gap-4 opacity-95">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {attraction.city}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {attraction.duration}</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {attraction.rating}</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Về trải nghiệm này</h2>
            <p className="text-muted-foreground leading-relaxed">{attraction.description}</p>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Bao gồm những gì</h3>
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
            <img src={attraction.image} alt={attraction.name} onError={onImgErr} className="w-full h-80 object-cover" />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">Từ</div>
            <div className="font-heading text-3xl font-bold text-primary mb-1">{formatPrice(attraction.price)}</div>
            <div className="text-xs text-muted-foreground mb-5">mỗi người · đã bao gồm thuế</div>

            <Button className="w-full mb-3" size="lg">Đặt ngay</Button>
            <Button variant="outline" className="w-full mb-5">Thêm vào yêu thích</Button>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck className="h-4 w-4" /> Miễn phí huỷ trước 24h</div>
              <div className="flex items-center gap-2 text-sky-600"><Sparkles className="h-4 w-4" /> Xác nhận tức thì</div>
            </div>
          </div>
        </aside>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Có thể bạn cũng thích</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {attractionsData.filter((a) => a.slug !== attraction.slug).slice(0, 4).map((a) => (
              <Link
                key={a.slug}
                to={`/attractions/${a.slug}`}
                className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={a.image} alt={a.name} onError={onImgErr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">{a.city}</div>
                  <div className="font-heading font-semibold line-clamp-1 mb-1">{a.name}</div>
                  <div className="text-sm text-muted-foreground">Từ <span className="text-primary font-bold">{formatPrice(a.price)}</span></div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/hotels"><Button variant="outline">Tìm khách sạn cho chuyến đi <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Attractions;
