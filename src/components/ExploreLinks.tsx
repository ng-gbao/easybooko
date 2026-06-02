import { useNavigate } from "react-router-dom";

const groups = [
  {
    title: "Khách sạn nổi bật",
    items: [
      "Khách sạn cao cấp tại Hà Nội",
      "Resort biển tại Phú Quốc",
      "Boutique stay tại Đà Nẵng",
      "Khách sạn gia đình tại TP. Hồ Chí Minh",
      "Khách sạn 5 sao tại Đà Lạt",
    ],
    type: "location",
  },
  {
    title: "Điểm đến",
    items: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Phú Quốc", "Đà Lạt", "Nha Trang", "Hội An", "Sa Pa", "Hạ Long"],
    type: "location",
  },
  {
    title: "Hoạt động",
    items: [
      "Công viên giải trí",
      "Lớp học nấu ăn Việt",
      "Du thuyền hoàng hôn",
      "Tour ẩm thực đường phố",
      "Tour văn hoá trong ngày",
    ],
    type: "activity",
  },
];

const ExploreLinks = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Bạn muốn khám phá điều gì?</h2>
          <p className="text-muted-foreground">Đường dẫn nhanh giúp bạn lên kế hoạch dễ dàng hơn.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div key={g.title} className="bg-card border rounded-xl p-6">
              <h3 className="font-heading font-semibold text-lg mb-4 pb-3 border-b">{g.title}</h3>
              <ul className="space-y-2">
                {g.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => g.type === "location" && navigate(`/hotels?location=${encodeURIComponent(item)}`)}
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
