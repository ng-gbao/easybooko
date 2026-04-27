import { useNavigate } from "react-router-dom";

const groups = [
  {
    title: "Top hotels",
    items: ["Luxury hotels in Hanoi", "Beachfront resorts in Phu Quoc", "Boutique stays in Da Nang", "Family hotels in Ho Chi Minh City", "5-star hotels in Bali"],
    type: "location",
  },
  {
    title: "Destinations",
    items: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Phu Quoc", "Bali", "Tokyo", "Paris", "Santorini"],
    type: "location",
  },
  {
    title: "Activities",
    items: ["Theme parks", "Cooking classes", "Sunset cruises", "Street food tours", "Cultural day trips"],
    type: "activity",
  },
];

const ExploreLinks = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">What do you want to explore?</h2>
          <p className="text-muted-foreground">Quick links to help you plan faster.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div key={g.title} className="bg-card border rounded-xl p-6">
              <h3 className="font-heading font-semibold text-lg mb-4 pb-3 border-b">{g.title}</h3>
              <ul className="space-y-2">
                {g.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => g.type === "location" && navigate(`/?location=${encodeURIComponent(item)}`)}
                      className="text-sm text-muted-foreground hover:text-primary hover:underline text-left transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreLinks;
