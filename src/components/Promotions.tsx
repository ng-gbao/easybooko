import { Gift, Sparkles, Wallet } from "lucide-react";

const promos = [
  {
    icon: Gift,
    tag: "Khách mới",
    title: "Giảm 25% cho lần đặt phòng đầu tiên",
    desc: "Dùng mã WELCOME25 khi thanh toán. Áp dụng cho phòng từ $80 trở lên.",
    // Warm amber → rose gradient for new-user promo
    bg: "from-amber-500 via-orange-500 to-rose-500",
    glow: "shadow-amber-500/30",
  },
  {
    icon: Sparkles,
    tag: "Theo mùa",
    title: "Ưu đãi du lịch mùa hè",
    desc: "Giảm tới 40% cho resort biển & khách sạn thành phố mùa này.",
    // Sunset-style deep gradient for seasonal sale
    bg: "from-rose-500 via-pink-500 to-fuchsia-600",
    glow: "shadow-rose-500/30",
  },
  {
    icon: Wallet,
    tag: "Ưu đãi ngân hàng",
    title: "Giảm thêm 10% với thẻ đối tác",
    desc: "Thanh toán bằng Visa, MoMo hoặc ZaloPay để hoàn tiền tức thì.",
    // Warm navy → teal for bank/partner deals (premium feel)
    bg: "from-[hsl(var(--ocean-deep))] via-[hsl(var(--ocean-teal))] to-[hsl(var(--ocean-aqua))]",
    glow: "shadow-teal-500/30",
  },
];

const Promotions = () => (
  <section className="py-16 bg-gradient-to-br from-[hsl(var(--warm-cream))] via-amber-50/60 to-rose-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-rose-950/30">
    <div className="container mx-auto px-4">
      <div className="mb-8 flex items-end justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Khuyến mãi & ưu đãi</h2>
          <p className="text-muted-foreground">Ưu đãi độc quyền, giảm giá theo mùa và đặc quyền từ đối tác.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map(({ icon: Icon, tag, title, desc, bg, glow }) => (
          <div
            key={title}
            className={`relative overflow-hidden rounded-2xl p-7 text-primary-foreground bg-gradient-to-br ${bg} shadow-xl ${glow} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
          >
            {/* Decorative orbs for warmth and depth */}
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/15 blur-xl" />
            <div className="absolute -right-6 -bottom-14 w-32 h-32 rounded-full bg-white/10 blur-lg" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />

            <div className="relative">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider bg-white/25 backdrop-blur-sm rounded-full px-3 py-1 mb-5 border border-white/20">
                {tag}
              </span>
              <Icon className="h-9 w-9 mb-3 opacity-95 drop-shadow" />
              <h3 className="font-heading text-xl md:text-2xl font-bold mb-2 leading-snug drop-shadow-sm">
                {title}
              </h3>
              <p className="text-sm opacity-95 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Promotions;
