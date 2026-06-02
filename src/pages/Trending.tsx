import { Link, useParams } from "react-router-dom";
import { useHotels } from "@/hooks/useHotels";
import HotelCard from "@/components/HotelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Sparkles, TrendingUp, Plane } from "lucide-react";

const FALLBACK = "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80";

const cityMeta: Record<string, { name: string; country: string; image: string; tagline: string; blurb: string; queryLocation: string }> = {
  "Da Nang": {
    name: "Đà Nẵng",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1600&q=80",
    tagline: "Biển xanh và nhịp sống thành phố",
    blurb: "Bãi biển vàng, Cầu Rồng nổi tiếng và lối đi nhanh đến Bà Nà Hills — Đà Nẵng là điểm dừng không thể bỏ qua ở miền Trung Việt Nam.",
    queryLocation: "Da Nang",
  },
  "Hanoi": {
    name: "Hà Nội",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1509923936021-c9bf38940dd2?w=1600&q=80",
    tagline: "Thủ đô nghìn năm văn hiến",
    blurb: "36 phố phường, hồ Hoàn Kiếm, phở nóng và cà phê trứng — Hà Nội mê hoặc du khách bằng văn hoá lâu đời và ẩm thực tinh tế.",
    queryLocation: "Hanoi",
  },
  "Ho Chi Minh City": {
    name: "TP. Hồ Chí Minh",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1583395145651-be8e302a9d44?w=1600&q=80",
    tagline: "Sài Gòn không ngủ",
    blurb: "Trung tâm năng động bậc nhất Đông Nam Á với ẩm thực đường phố, kiến trúc thuộc địa và đời sống về đêm sôi nổi.",
    queryLocation: "Ho Chi Minh",
  },
  "Hoi An": {
    name: "Hội An",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1600&q=80",
    tagline: "Phố cổ đèn lồng bên sông Hoài",
    blurb: "Phố cổ lung linh, may áo dài 24 giờ và những bãi biển êm đềm — Hội An là viên ngọc UNESCO của miền Trung.",
    queryLocation: "Hoi An",
  },
  "Phu Quoc": {
    name: "Phú Quốc",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1600&q=80",
    tagline: "Đảo ngọc nhiệt đới của Việt Nam",
    blurb: "Bãi cát trắng, lặn ngắm san hô và hoàng hôn tuyệt đẹp — Phú Quốc là thiên đường nghỉ dưỡng phía Nam.",
    queryLocation: "Phu Quoc",
  },
  "Sa Pa": {
    name: "Sa Pa",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=1600&q=80",
    tagline: "Thị trấn trong mây Tây Bắc",
    blurb: "Ruộng bậc thang, đỉnh Fansipan và những bản làng dân tộc thiểu số — Sa Pa quyến rũ trong mọi mùa.",
    queryLocation: "Sa Pa",
  },
  "Ha Long": {
    name: "Hạ Long",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80",
    tagline: "Kỳ quan thiên nhiên thế giới",
    blurb: "Du thuyền giữa hàng nghìn đảo đá vôi, khám phá hang động và thưởng thức hải sản tươi sống trên vịnh.",
    queryLocation: "Ha Long",
  },
};

const Trending = () => {
  const { city = "" } = useParams();
  const decoded = decodeURIComponent(city);
  const meta = cityMeta[decoded] || {
    name: decoded,
    country: "Việt Nam",
    image: FALLBACK,
    tagline: "Điểm đến đang được du khách yêu thích",
    blurb: "Khám phá chỗ nghỉ được đánh giá cao và trải nghiệm độc đáo tại điểm đến thịnh hành này.",
    queryLocation: decoded,
  };

  const { data, isLoading } = useHotels({ location: meta.queryLocation, sortBy: "rating_desc", page: 1, pageSize: 8 });

  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img src={meta.image} alt={meta.name} onError={(e) => { if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK; }} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12 text-primary-foreground">
          <Badge className="self-start mb-4 bg-primary/90 backdrop-blur-sm gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Đang thịnh hành
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-2">{meta.name}</h1>
          <div className="flex items-center gap-2 opacity-90 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{meta.country}</span>
          </div>
          <p className="text-lg md:text-xl max-w-2xl opacity-95">{meta.tagline}</p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-6">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <div>
              <div className="font-heading font-semibold">Ưu đãi có hạn</div>
              <div className="text-sm opacity-90">Tiết kiệm đến 25% cho chỗ nghỉ tại {meta.name} mùa này</div>
            </div>
          </div>
          <Link to={`/hotels?location=${encodeURIComponent(meta.queryLocation)}`}>
            <Button variant="secondary">Xem tất cả chỗ nghỉ <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Về {meta.name}</h2>
            <p className="text-muted-foreground leading-relaxed">{meta.blurb}</p>
          </div>
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Plane className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Thời điểm lý tưởng</div>
                <div className="text-sm text-muted-foreground">Có thể đi quanh năm</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Miễn phí huỷ phòng</div>
                <div className="text-sm text-muted-foreground">Áp dụng cho hầu hết chỗ nghỉ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Chỗ nghỉ nổi bật tại {meta.name}</h2>
            <p className="text-muted-foreground mt-1">Lựa chọn được đánh giá cao nhất cho chuyến đi của bạn</p>
          </div>
          <Link to={`/hotels?location=${encodeURIComponent(meta.queryLocation)}`}>
            <Button variant="outline">Xem tất cả <ArrowRight className="h-4 w-4 ml-1" /></Button>
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
            <p className="text-muted-foreground mb-4">Chưa có chỗ nghỉ nào cho {meta.name}.</p>
            <Link to="/hotels"><Button>Khám phá tất cả khách sạn</Button></Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Trending;
