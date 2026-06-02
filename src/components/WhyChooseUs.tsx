import { ShieldCheck, Tag, Sparkles, Globe2 } from "lucide-react";

const benefits = [
  {
    icon: Tag,
    title: "Đảm bảo giá tốt nhất",
    description: "Chúng tôi sẵn sàng so giá để bạn luôn an tâm đặt phòng.",
  },
  {
    icon: Sparkles,
    title: "Đặt phòng dễ dàng",
    description: "Chỉ vài cú nhấp — không phí ẩn, không bất ngờ.",
  },
  {
    icon: ShieldCheck,
    title: "Thanh toán an toàn",
    description: "Giao dịch mã hoá cùng các đối tác thanh toán uy tín.",
  },
  {
    icon: Globe2,
    title: "Lựa chọn đa dạng",
    description: "Từ căn hộ ấm cúng đến villa sang trọng tại hơn 30 điểm đến trong và ngoài nước.",
  },
];

const WhyChooseUs = () => (
  <section className="bg-muted/40 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Vì sao chọn Easybooko</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Mọi thứ bạn cần cho một chuyến đi suôn sẻ — từ tìm kiếm đến thanh toán.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="bg-card border rounded-xl p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
