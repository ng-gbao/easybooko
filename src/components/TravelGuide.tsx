import { ArrowRight } from "lucide-react";

const articles = [
  {
    title: "10 hidden gems in Vietnam you must visit",
    category: "Destination guide",
    read: "5 min read",
    image: "https://images.unsplash.com/photo-1509923936021-c9bf38940dd2?w=800&q=80",
  },
  {
    title: "How to pack smart for a 2-week trip",
    category: "Travel tips",
    read: "4 min read",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  },
  {
    title: "Best street food cities in Southeast Asia",
    category: "Food & culture",
    read: "6 min read",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  },
];

const TravelGuide = () => (
  <section className="py-16 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Travel guide & tips</h2>
        <p className="text-muted-foreground">Insider stories and practical advice for your next adventure.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((a) => (
          <article key={a.title} className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">{a.category}</div>
              <h3 className="font-heading font-semibold text-lg leading-snug mb-3 group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{a.read}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default TravelGuide;
