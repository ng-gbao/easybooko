import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="bg-ocean-deep text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo tone="dark" />
            <p className="text-sm opacity-70 leading-relaxed">
              Khám phá khách sạn được tuyển chọn khắp Việt Nam và thế giới. Đặt phòng tự tin, tận hưởng kỳ nghỉ trọn vẹn.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Về chúng tôi</h4>
            <ul className="space-y-2.5 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Giới thiệu</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Tuyển dụng</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Báo chí</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Blog du lịch</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2.5 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Chính sách huỷ phòng</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> support@easybooko.vn
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" /> +84 28 7300 1199
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" /> 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-50">
          <p>© {new Date().getFullYear()} Easybooko. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-100 transition-opacity">Điều khoản</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Bảo mật</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
