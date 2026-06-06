import { useLocation, Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, CalendarDays, Home } from "lucide-react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";

interface SuccessState {
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  pending?: boolean;
}

const BookingSuccess = () => {
  const location = useLocation();
  const data = location.state as SuccessState | null;

  if (!data) return <Navigate to="/" />;

  const pending = !!data.pending;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="pt-10 pb-8 px-8 space-y-6">
          <div className="flex justify-center">
            <div className={`h-20 w-20 rounded-full flex items-center justify-center ${pending ? "bg-amber-100" : "bg-green-100"}`}>
              <CheckCircle2 className={`h-10 w-10 ${pending ? "text-amber-600" : "text-green-600"}`} />
            </div>
          </div>

          <div>
            <h1 className="font-heading text-2xl font-bold mb-2">
              {pending ? "Đặt phòng đã được gửi ⏳" : "Đặt phòng thành công! 🎉"}
            </h1>
            <p className="text-muted-foreground">
              {pending
                ? "Thanh toán của bạn đang chờ admin xác nhận. Bạn sẽ nhận được cập nhật trong phần Đặt phòng của tôi."
                : "Đặt phòng của bạn đã được xử lý thành công."}
            </p>
          </div>

          <div className="bg-muted rounded-lg p-5 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Khách sạn</span>
              <span className="font-medium">{data.hotelName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phòng</span>
              <span className="font-medium capitalize">{data.roomType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> Check-in
              </span>
              <span className="font-medium">{format(new Date(data.checkIn), "dd/MM/yyyy")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> Check-out
              </span>
              <span className="font-medium">{format(new Date(data.checkOut), "dd/MM/yyyy")}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <span className="font-semibold">{pending ? "Tổng cộng (chờ xác nhận)" : "Đã thanh toán"}</span>
              <span className="font-bold text-primary text-lg">{formatPrice(data.totalPrice)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {pending
              ? "Phòng sẽ được giữ chỗ cho đến khi admin xác nhận hoặc từ chối."
              : "Email xác nhận sẽ được gửi đến địa chỉ Email đã đăng ký."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dashboard" className="flex-1">
              <Button className="w-full">Xem đặt phòng của tôi</Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" /> Về trang chủ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccess;
