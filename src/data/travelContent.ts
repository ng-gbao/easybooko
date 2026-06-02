export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export type Experience = {
  slug: string;
  name: string;
  type: string;
  location: string;
  image: string;
  description: string;
  activities: string[];
  relatedDestinations: string[];
};

export const experiences: Experience[] = [
  {
    slug: slugify("Du thuyen Vinh Ha Long"),
    name: "Du thuyền Vịnh Hạ Long",
    type: "Tour trong ngày",
    location: "Hạ Long, Việt Nam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
    description:
      "Lướt qua làn nước ngọc bích giữa hàng nghìn đảo đá vôi trên hành trình du thuyền tại một trong những kỳ quan thiên nhiên nổi tiếng nhất thế giới.",
    activities: [
      "Chèo kayak khám phá hang động",
      "Tiệc tối ngắm hoàng hôn trên boong",
      "Thăm làng chài nổi",
      "Trải nghiệm trang trại ngọc trai",
    ],
    relatedDestinations: ["Hà Nội", "Hạ Long"],
  },
  {
    slug: slugify("Tour Ba Na Hills Da Nang"),
    name: "Tour Bà Nà Hills",
    type: "Trải nghiệm địa phương",
    location: "Đà Nẵng, Việt Nam",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80",
    description:
      "Băng qua Cầu Vàng huyền thoại được nâng bởi đôi tay đá khổng lồ, đi cáp treo kỷ lục thế giới và khám phá Làng Pháp trên những đỉnh mây mù.",
    activities: [
      "Tham quan Cầu Vàng",
      "Đi cáp treo kỷ lục thế giới",
      "Khám phá Làng Pháp",
      "Buffet trưa tại nhà hàng đỉnh núi",
    ],
    relatedDestinations: ["Đà Nẵng", "Hội An"],
  },
  {
    slug: slugify("Pho co Hoi An ve dem"),
    name: "Phố cổ Hội An về đêm",
    type: "Văn hoá",
    location: "Hội An, Việt Nam",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
    description:
      "Lang thang giữa những con phố cổ lung linh ánh đèn lồng, thả hoa đăng trên sông Hoài và thưởng thức ẩm thực miền Trung trứ danh.",
    activities: [
      "Thả đèn hoa đăng sông Hoài",
      "Tour ẩm thực phố cổ",
      "Lớp học làm đèn lồng",
      "Đạp xe đồng quê Trà Quế",
    ],
    relatedDestinations: ["Hội An", "Đà Nẵng"],
  },
  {
    slug: slugify("Lop hoc nau an Viet Nam"),
    name: "Lớp học nấu ăn Việt Nam",
    type: "Văn hoá",
    location: "Hội An, Việt Nam",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    description:
      "Đi chợ ven sông cùng đầu bếp địa phương, rồi học nấu 5 món Việt truyền thống trong căn bếp vườn xanh mát.",
    activities: [
      "Tham quan chợ truyền thống",
      "Học nấu phở, bánh xèo, gỏi cuốn",
      "Tham quan vườn rau Trà Quế",
      "Tiệc tối kiểu gia đình Việt",
    ],
    relatedDestinations: ["Hội An", "Đà Nẵng"],
  },
];

export type Guide = {
  slug: string;
  title: string;
  category: string;
  read: string;
  image: string;
  intro: string;
  tips: string[];
  recommendedPlaces: string[];
  notes: string[];
};

export const guides: Guide[] = [
  {
    slug: slugify("10 diem den it nguoi biet o Viet Nam"),
    title: "10 điểm đến ít người biết ở Việt Nam bạn nên ghé thăm",
    category: "Cẩm nang điểm đến",
    read: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1509923936021-c9bf38940dd2?w=1600&q=80",
    intro:
      "Ngoài Hà Nội và TP. Hồ Chí Minh, Việt Nam còn ẩn chứa những vịnh biển yên ả, bản làng vùng cao và những thị trấn chài cổ kính. Đây là gợi ý cho hành trình khác biệt của bạn.",
    tips: [
      "Đi giữa tuần để tránh đông khách nội địa",
      "Mang theo tiền lẻ VND cho hàng quán vỉa hè",
      "Tải bản đồ offline trước khi vào vùng sâu",
      "Chỉ thuê xe máy khi có giấy phép quốc tế",
    ],
    recommendedPlaces: [
      "Cung đường Hà Giang",
      "Hang động Phong Nha",
      "Côn Đảo",
      "Ruộng bậc thang Mù Cang Chải",
    ],
    notes: [
      "Mùa đẹp: tháng 10 – tháng 4 cho miền Bắc",
      "Tiền tệ: Việt Nam Đồng (VND)",
      "Visa: e-visa cho hầu hết quốc tịch",
    ],
  },
  {
    slug: slugify("Bi quyet sap xep hanh ly cho chuyen di 2 tuan"),
    title: "Bí quyết sắp xếp hành lý cho chuyến đi 2 tuần",
    category: "Mẹo du lịch",
    read: "4 phút đọc",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80",
    intro:
      "Hai tuần, một vali xách tay, không stress. Một tủ đồ tối giản và vài món phụ kiện thông minh là tất cả những gì bạn cần.",
    tips: [
      "Cuộn quần áo thay vì gấp",
      "Dùng túi nén để gọn hành lý",
      "Mang một bộ đồ trong hành lý xách tay",
      "Đem theo ổ cắm chuyển đổi đa năng",
    ],
    recommendedPlaces: ["Áp dụng cho mọi điểm đến — mẹo này đi cùng bạn"],
    notes: [
      "Hành lý xách tay nên dưới 8kg",
      "Mang giày nặng nhất khi lên máy bay",
      "Để 20% chỗ trống cho quà lưu niệm",
    ],
  },
  {
    slug: slugify("Top thanh pho am thuc duong pho Viet Nam"),
    title: "Những thành phố ẩm thực đường phố hấp dẫn nhất Việt Nam",
    category: "Ẩm thực & văn hoá",
    read: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80",
    intro:
      "Từ phở Hà Nội nghi ngút khói đến bún bò Huế cay nồng và bánh mì Hội An giòn rụm — vỉa hè Việt Nam chính là nhà hàng đẳng cấp Michelin của riêng bạn.",
    tips: [
      "Chọn quán nào người địa phương xếp hàng",
      "Mang theo khăn ướt và nước rửa tay",
      "Thử đặc sản vùng miền trước",
      "Đi bụng đói — ăn rải nhiều quán",
    ],
    recommendedPlaces: ["Hà Nội", "Huế", "Hội An", "TP. Hồ Chí Minh", "Đà Nẵng"],
    notes: [
      "Mang theo tiền mặt khi ăn vỉa hè",
      "Chợ đêm ngon nhất sau hoàng hôn",
      "Hỏi 'ít cay' nếu không ăn được cay",
    ],
  },
];
