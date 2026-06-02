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
          Tìm chỗ nghỉ hoàn hảo cho chuyến đi của bạn
        </h1>
        <p className="text-lg md:text-xl opacity-80 mb-10 max-w-lg">
          Khám phá khách sạn được tuyển chọn khắp Việt Nam — giá tốt, dịch vụ đẳng cấp.
        </p>
        <SearchBar variant="hero" />
      </div>
    </section>
  );
};

export default HeroSearch;
