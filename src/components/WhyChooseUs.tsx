import { ShieldCheck, Tag, Sparkles, Globe2 } from "lucide-react";

const benefits = [
  {
    icon: Tag,
    title: "Best price guarantee",
    description: "We match any lower price you find, so you always book with confidence.",
  },
  {
    icon: Sparkles,
    title: "Easy booking",
    description: "Reserve your stay in just a few clicks — no hidden fees, no surprises.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payment",
    description: "Encrypted transactions and trusted payment partners keep your data safe.",
  },
  {
    icon: Globe2,
    title: "Wide selection",
    description: "From cozy apartments to luxury villas in 30+ destinations worldwide.",
  },
];

const WhyChooseUs = () => (
  <section className="bg-muted/40 py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Why choose StayFlow</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Everything you need for a stress-free trip — from search to checkout.
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
