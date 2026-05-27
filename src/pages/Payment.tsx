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
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        toast.error("Please fill in all card details");
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2000));

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      hotel_id: booking.hotelId,
      room_id: booking.roomId,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      total_price: booking.totalPrice,
      status: "confirmed",
    });

    setProcessing(false);

    if (error) {
      toast.error(
        error.message.includes("already booked")
          ? "This room is already booked for those dates!"
          : error.message
      );
    } else {
      navigate("/booking-success", {
        state: {
          hotelName: booking.hotelName,
          roomType: booking.roomType,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          totalPrice: booking.totalPrice,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <h1 className="font-heading text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Payment method selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <CreditCard className="h-6 w-6 mb-2 mx-auto" />
                    <p className="text-sm font-medium text-center">Credit / Debit Card</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${paymentMethod === "paypal" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    <div className="h-6 w-6 mb-2 mx-auto flex items-center justify-center font-bold text-blue-600">P</div>
                    <p className="text-sm font-medium text-center">PayPal</p>
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
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
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">You will be redirected to PayPal to complete payment.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security note */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-card border rounded-lg p-4">
              <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
              <p>Your payment information is encrypted and secure. We never store your card details.</p>
            </div>
          </div>

          {/* Booking summary sidebar */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
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
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="capitalize font-medium">{booking.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> Check-in
                    </span>
                    <span className="font-medium">{format(new Date(booking.checkIn), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> Check-out
                    </span>
                    <span className="font-medium">{format(new Date(booking.checkOut), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{booking.nights} night{booking.nights > 1 ? "s" : ""}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">${booking.pricePerNight} × {booking.nights} nights</span>
                    <span>${booking.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & fees</span>
                    <span className="text-green-600">Included</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-lg">Total</span>
                  <span className="font-heading font-bold text-2xl text-primary">${booking.totalPrice}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handlePayment} disabled={processing}>
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" /> Confirm & Pay ${booking.totalPrice}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Free cancellation within 24 hours of booking
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
