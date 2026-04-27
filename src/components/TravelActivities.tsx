const activities = [
  { name: "Halong Bay Cruise", type: "Day tour", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80" },
  { name: "Street Food Walking Tour", type: "Local experience", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80" },
  { name: "Sunset Sailing", type: "Adventure", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80" },
  { name: "Cooking Class", type: "Culture", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" },
];

const TravelActivities = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Popular travel experiences</h2>
        <p className="text-muted-foreground">Discover unforgettable things to do at your destination.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {activities.map((a) => (
          <div key={a.name} className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer">
            <img src={a.image} alt={a.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
              <div className="text-xs uppercase tracking-wide opacity-80 mb-1">{a.type}</div>
              <h3 className="font-heading font-semibold text-lg leading-tight">{a.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TravelActivities;
