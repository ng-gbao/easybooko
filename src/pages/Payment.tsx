import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CreditCard, Lock, CalendarDays, MapPin, ArrowLeft, ShieldCheck, QrCode, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface BookingState {
  hotelId: string;
  hotelName: string;
  hotelLocation: string;
  hotelImage: string;
  roomId: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const booking = location.state as BookingState | null;

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qr">("card");

  if (!user) return <Navigate to="/login" />;
  if (!booking) return <Navigate to="/" />;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePayment = async () => {
    let methodValue: "qr_banking" | "visa" | "mastercard" = "qr_banking";
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        toast.error("Vui lòng điền đầy đủ thông tin thẻ");
        return;
      }
      methodValue = cardNumber.replace(/\s/g, "").startsWith("5") ? "mastercard" : "visa";
    }

    setProcessing(true);

    // Simulate payment gateway latency
    await new Promise((r) => setTimeout(r, 1500));

    // 1. Create booking as pending_confirmation (this also reserves the dates via trigger)
    const { data: bookingRow, error: bookErr } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        hotel_id: booking.hotelId,
        room_id: booking.roomId,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        total_price: booking.totalPrice,
        status: "pending_confirmation",
      })
      .select()
      .single();

    if (bookErr || !bookingRow) {
      setProcessing(false);
      toast.error(
        bookErr?.message?.includes("already booked")
          ? "Phòng này đã được đặt cho khoảng ngày bạn chọn!"
          : bookErr?.message || "Không thể tạo đặt phòng"
      );
      return;
    }

    // 2. Create pending payment linked to the booking
    const txRef = `EBK-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
    const { error: payErr } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        booking_id: bookingRow.id,
        amount: booking.totalPrice,
        currency: "USD",
        payment_method: methodValue,
        status: "pending",
        transaction_reference: txRef,
      });

    if (payErr) {
      setProcessing(false);
      toast.error(payErr.message || "Không thể khởi tạo thanh toán");
      return;
    }

    setProcessing(false);
    navigate("/booking-success", {
      state: {
        hotelName: booking.hotelName,
        roomType: booking.roomType,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.totalPrice,
        pending: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
        </Button>

        <h1 className="font-heading text-3xl font-bold mb-8">Hoàn tất đặt phòng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" /> Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <CreditCard className="h-6 w-6 mb-2 mx-auto" />
                    <p className="text-sm font-medium text-center">Thẻ tín dụng / ghi nợ</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("qr")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all hover:-translate-y-0.5 ${paymentMethod === "qr" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <QrCode className="h-6 w-6 mb-2 mx-auto" />
                    <p className="text-sm font-medium text-center">QR / Ví điện tử</p>
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-2 animate-fade-in">
                    <div>
                      <Label htmlFor="cardName">Tên chủ thẻ</Label>
                      <Input id="cardName" placeholder="NGUYEN VAN A" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Số thẻ</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className="pr-12"
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Ngày hết hạn</Label>
                        <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "qr" && (
                  <div className="pt-2 animate-fade-in text-center">
                    <p className="text-sm text-muted-foreground mb-4">Quét mã bằng ứng dụng ngân hàng hoặc ví điện tử để thanh toán</p>
                    <div className="mx-auto w-56 h-56 bg-white border-2 border-primary/20 rounded-xl p-3 flex items-center justify-center shadow-inner">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-ocean-deep">
                        <rect width="100" height="100" fill="white" />
                        {Array.from({ length: 144 }).map((_, i) => {
                          const x = (i % 12) * 8 + 2;
                          const y = Math.floor(i / 12) * 8 + 2;
                          const filled = ((i * 7) % 13) % 3 !== 0;
                          return filled ? <rect key={i} x={x} y={y} width="6" height="6" fill="currentColor" /> : null;
                        })}
                        <rect x="2" y="2" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" />
                        <rect x="76" y="2" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" />
                        <rect x="2" y="76" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" />
                      </svg>
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">Hỗ trợ MoMo, ZaloPay, VNPay và các ứng dụng ngân hàng</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-card border rounded-lg p-4">
              <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
              <p>Thông tin thanh toán của bạn được mã hoá và bảo mật. Chúng tôi không lưu thông tin thẻ.</p>
            </div>
          </div>

          {/* Booking summary sidebar */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Tóm tắt đặt phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg overflow-hidden aspect-video">
                  <img src={booking.hotelImage} alt={booking.hotelName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg">{booking.hotelName}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {booking.hotelLocation}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loại phòng</span>
                    <span className="capitalize font-medium">{booking.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> Check-in
                    </span>
                    <span className="font-medium">{format(new Date(booking.checkIn), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> Check-out
                    </span>
                    <span className="font-medium">{format(new Date(booking.checkOut), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian</span>
                    <span className="font-medium">{booking.nights} đêm</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">${booking.pricePerNight} × {booking.nights} đêm</span>
                    <span>${booking.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thuế & phí</span>
                    <span className="text-green-600">Đã bao gồm</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-lg">Tổng cộng</span>
                  <span className="font-heading font-bold text-2xl text-primary">${booking.totalPrice}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handlePayment} disabled={processing}>
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Đang xử lý...
                    </span>
                  ) : (
                    paymentMethod === "qr" ? (
                      <><CheckCircle2 className="h-4 w-4 mr-2" /> Tôi đã hoàn tất thanh toán</>
                    ) : (
                      <><Lock className="h-4 w-4 mr-2" /> Thanh toán · ${booking.totalPrice}</>
                    )
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Miễn phí huỷ trong vòng 24 giờ kể từ khi đặt phòng
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
