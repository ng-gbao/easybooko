import { Building2, Home, Palmtree, Hotel } from "lucide-react";
import { useNavigate } from "react-router-dom";

const types = [
  { key: "hotel", label: "Khách sạn", desc: "Tiện nghi & dịch vụ chuẩn mực", icon: Hotel, count: "20+ nơi lưu trú" },
  { key: "apartment", label: "Căn hộ", desc: "Đầy đủ tiện nghi như ở nhà", icon: Building2, count: "12+ nơi lưu trú" },
  { key: "resort", label: "Resort", desc: "Nghỉ dưỡng trọn gói", icon: Palmtree, count: "8+ nơi lưu trú" },
  { key: "villa", label: "Villa", desc: "Riêng tư & rộng rãi", icon: Home, count: "6+ nơi lưu trú" },
];

const AccommodationOptions = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-950/20 dark:to-sky-950/20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Thêm lựa chọn lưu trú</h2>
          <p className="text-muted-foreground">Từ khách sạn thành phố đến villa riêng — chọn nơi phù hợp với bạn.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {types.map(({ key, label, desc, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => navigate(`/hotels?type=${key}`)}
              className="text-left bg-card border rounded-xl p-6 hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1">{label}</h3>
              <p className="text-sm text-muted-foreground mb-2">{desc}</p>
              <span className="text-xs text-primary font-medium">{count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccommodationOptions;
