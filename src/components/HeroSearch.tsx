import SearchBar from "@/components/SearchBar";

const HeroSearch = () => {
  return (
    <section className="relative bg-ocean-deep text-primary-foreground overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/40 via-ocean-deep/25 to-ocean-deep/70" />

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 max-w-2xl">
          Find your perfect stay, anywhere in the world
        </h1>
        <p className="text-lg md:text-xl opacity-80 mb-10 max-w-lg">
          Discover handpicked hotels with unbeatable prices and world-class service.
        </p>
        <SearchBar variant="hero" />
      </div>
    </section>
  );
};

export default HeroSearch;
