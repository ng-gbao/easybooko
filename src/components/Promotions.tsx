import { Gift, Sparkles, Wallet } from "lucide-react";

const promos = [
  {
    icon: Gift,
    tag: "New user",
    title: "Get 25% off your first booking",
    desc: "Use code WELCOME25 at checkout. Valid on stays over $80.",
    gradient: "from-primary to-primary/70",
  },
  {
    icon: Sparkles,
    tag: "Seasonal",
    title: "Holiday Escape Sale",
    desc: "Up to 40% off beach resorts & city stays this season.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Wallet,
    tag: "Bank deal",
    title: "Extra 10% with partner cards",
    desc: "Pay with Visa, MoMo or ZaloPay for instant cashback.",
    gradient: "from-secondary to-accent",
  },
];

const Promotions = () => (
  <section className="py-16 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="mb-8 flex items-end justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Promotions & deals</h2>
          <p className="text-muted-foreground">Exclusive offers, seasonal sales, and partner perks.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map(({ icon: Icon, tag, title, desc, gradient }) => (
          <div
            key={title}
            className={`relative overflow-hidden rounded-2xl p-6 text-primary-foreground bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -right-4 -bottom-12 w-24 h-24 rounded-full bg-white/10" />
            <div className="relative">
              <span className="inline-block text-xs font-semibold uppercase tracking-wide bg-white/20 rounded-full px-3 py-1 mb-4">
                {tag}
              </span>
              <Icon className="h-8 w-8 mb-3 opacity-90" />
              <h3 className="font-heading text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm opacity-90">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Promotions;
