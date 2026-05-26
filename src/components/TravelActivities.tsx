import { Link } from "react-router-dom";
import { experiences, FALLBACK_IMAGE } from "@/data/travelContent";

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE;
};

const TravelActivities = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Popular travel experiences</h2>
        <p className="text-muted-foreground">Discover unforgettable things to do at your destination.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {experiences.map((a) => (
          <Link
            key={a.slug}
            to={`/experiences/${a.slug}`}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer block hover:shadow-xl transition-shadow"
          >
            <img src={a.image} onError={handleImgError} alt={a.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
              <div className="text-xs uppercase tracking-wide opacity-80 mb-1">{a.type}</div>
              <h3 className="font-heading font-semibold text-lg leading-tight">{a.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default TravelActivities;
