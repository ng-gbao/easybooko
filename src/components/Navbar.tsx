import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Shield, Heart, Menu, X, Hotel, CalendarDays, Home } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/hotels", label: "Hotels", icon: Hotel },
];

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-heading text-xl font-bold text-primary flex items-center gap-2 shrink-0">
          <span className="text-2xl">🏨</span> Easybooko
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 ml-8">
          {navLinks.map(({ to, label }) => (
            <Link key={label} to={to}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-sm",
                  location.pathname === to && "bg-accent/50"
                )}
              >
                {label}
              </Button>
            </Link>
          ))}
          {user && (
            <>
              <Link to="/wishlist">
                <Button variant="ghost" size="sm" className={cn("text-sm", location.pathname === "/wishlist" && "bg-accent/50")}>
                  <Heart className="h-4 w-4 mr-1" /> Wishlist
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className={cn("text-sm", location.pathname === "/dashboard" && "bg-accent/50")}>
                  <CalendarDays className="h-4 w-4 mr-1" /> My Bookings
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <CalendarDays className="h-4 w-4 mr-2" /> My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                  <Heart className="h-4 w-4 mr-2" /> Wishlist
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="h-4 w-4 mr-2" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b p-4 flex flex-col gap-1 animate-fade-in">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={label} to={to} onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Icon className="h-4 w-4 mr-2" /> {label}
              </Button>
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start"><Heart className="h-4 w-4 mr-2" /> Wishlist</Button>
              </Link>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start"><CalendarDays className="h-4 w-4 mr-2" /> My Bookings</Button>
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start"><Shield className="h-4 w-4 mr-2" /> Admin</Button>
                </Link>
              )}
              <Button variant="outline" className="w-full justify-start mt-2" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Sign In</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full justify-start">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
