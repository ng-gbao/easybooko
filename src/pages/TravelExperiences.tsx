import { Link, useParams } from "react-router-dom";
import { experiences, FALLBACK_IMAGE } from "@/data/travelContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE;
};

const TravelExperiences = () => {
  const { slug } = useParams();
  const experience = slug ? experiences.find((e) => e.slug === slug) : undefined;

  if (slug && experience) {
    return (
      <div className="min-h-screen">
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden">
          <img src={experience.image} onError={handleImgError} alt={experience.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8 text-primary-foreground">
            <Link to="/experiences" className="inline-flex items-center gap-1 text-sm opacity-90 hover:opacity-100 mb-3">
              <ArrowLeft className="h-4 w-4" /> All experiences
            </Link>
            <Badge className="mb-3">{experience.type}</Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-2">{experience.name}</h1>
            <div className="flex items-center gap-2 opacity-90">
              <MapPin className="h-4 w-4" /> {experience.location}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">{experience.description}</p>

            <div>
              <h2 className="font-heading text-2xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Suggested activities
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {experience.activities.map((a) => (
                  <li key={a} className="bg-card border rounded-lg px-4 py-3 text-sm">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-heading font-semibold mb-3">Explore nearby</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {experience.relatedDestinations.map((d) => (
                  <Link key={d} to={`/trending/${encodeURIComponent(d)}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {d}
                    </Badge>
                  </Link>
                ))}
              </div>
              <Link to="/hotels">
                <Button className="w-full">Find nearby hotels</Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-ocean-deep text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Travel Experiences</h1>
          <p className="opacity-80">Handpicked activities and tours to make your trip unforgettable.</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((e) => (
            <Link
              key={e.slug}
              to={`/experiences/${e.slug}`}
              className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={e.image} onError={handleImgError} alt={e.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="mb-2">{e.type}</Badge>
                <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{e.name}</h3>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {e.location}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelExperiences;
