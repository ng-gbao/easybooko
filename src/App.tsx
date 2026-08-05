import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import HotelDetail from "@/pages/HotelDetail";
import Payment from "@/pages/Payment";
import BookingSuccess from "@/pages/BookingSuccess";
import Dashboard from "@/pages/Dashboard";
import Wishlist from "@/pages/Wishlist";
import Admin from "@/pages/Admin";
import Hotels from "@/pages/Hotels";
import Trending from "@/pages/Trending";
import Attractions from "@/pages/Attractions";
import NotFound from "@/pages/NotFound";
import TravelExperiences from "@/pages/TravelExperiences";
import TravelGuidePage from "@/pages/TravelGuide";
import OAuthConsent from "@/pages/OAuthConsent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/hotels" element={<Hotels />} />
                  <Route path="/trending/:city" element={<Trending />} />
                  <Route path="/attractions" element={<Attractions />} />
                  <Route path="/attractions/:slug" element={<Attractions />} />
                  <Route path="/experiences" element={<TravelExperiences />} />
                  <Route path="/experiences/:slug" element={<TravelExperiences />} />
                  <Route path="/travel-guide" element={<TravelGuidePage />} />
                  <Route path="/travel-guide/:slug" element={<TravelGuidePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/hotel/:id" element={<HotelDetail />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/booking-success" element={<BookingSuccess />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
