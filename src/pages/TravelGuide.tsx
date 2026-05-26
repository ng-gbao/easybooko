import { Link, useParams } from "react-router-dom";
import { guides, FALLBACK_IMAGE } from "@/data/travelContent";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, MapPin, Info } from "lucide-react";

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE;
};

const TravelGuidePage = () => {
  const { slug } = useParams();
  const guide = slug ? guides.find((g) => g.slug === slug) : undefined;

  if (slug && guide) {
    return (
      <div className="min-h-screen">
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden">
          <img src={guide.image} onError={handleImgError} alt={guide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8 text-primary-foreground">
            <Link to="/travel-guide" className="inline-flex items-center gap-1 text-sm opacity-90 hover:opacity-100 mb-3">
              <ArrowLeft className="h-4 w-4" /> All guides
            </Link>
            <Badge className="mb-3">{guide.category}</Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-2 max-w-3xl">{guide.title}</h1>
            <span className="text-sm opacity-80">{guide.read}</span>
          </div>
        </div>

        <article className="container mx-auto px-4 py-12 max-w-3xl space-y-10">
          <p className="text-lg text-muted-foreground leading-relaxed">{guide.intro}</p>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" /> Travel tips
            </h2>
            <ul className="space-y-2">
              {guide.tips.map((t) => (
                <li key={t} className="flex gap-3 bg-card border rounded-lg px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Recommended places
            </h2>
            <div className="flex flex-wrap gap-2">
              {guide.recommendedPlaces.map((p) => (
                <Badge key={p} variant="secondary" className="px-3 py-1.5 text-sm">{p}</Badge>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Useful notes
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {guide.notes.map((n) => <li key={n}>• {n}</li>)}
            </ul>
          </section>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-ocean-deep text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Travel Guide</h1>
          <p className="opacity-80">Insider stories and practical advice for your next adventure.</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((g) => (
            <Link key={g.slug} to={`/travel-guide/${g.slug}`} className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={g.image} onError={handleImgError} alt={g.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">{g.category}</div>
                <h3 className="font-heading font-semibold text-lg leading-snug mb-2 group-hover:text-primary transition-colors">{g.title}</h3>
                <span className="text-sm text-muted-foreground">{g.read}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelGuidePage;
