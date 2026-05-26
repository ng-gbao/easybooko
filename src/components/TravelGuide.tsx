import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { guides, FALLBACK_IMAGE } from "@/data/travelContent";

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE;
};

const TravelGuide = () => (
  <section className="py-16 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Travel guide & tips</h2>
        <p className="text-muted-foreground">Insider stories and practical advice for your next adventure.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((a) => (
          <Link
            key={a.slug}
            to={`/travel-guide/${a.slug}`}
            className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img src={a.image} onError={handleImgError} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default TravelGuide;
