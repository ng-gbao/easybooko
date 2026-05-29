import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, MapPin, Users, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLocations } from "@/hooks/useLocations";

interface SearchBarProps {
  initialLocation?: string;
  initialCheckIn?: string; // YYYY-MM-DD
  initialCheckOut?: string;
  initialGuests?: number;
  initialRooms?: number;
  variant?: "hero" | "compact";
}

const parseDate = (s?: string) => (s ? new Date(s + "T00:00:00") : undefined);

const SearchBar = ({
  initialLocation = "",
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  initialRooms = 1,
  variant = "hero",
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialLocation);
  const [checkIn, setCheckIn] = useState<Date | undefined>(parseDate(initialCheckIn));
  const [checkOut, setCheckOut] = useState<Date | undefined>(parseDate(initialCheckOut));
  const [adults, setAdults] = useState(Math.max(1, initialGuests - 0));
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(initialRooms);

  // Sync when initial values change (e.g. URL params on Hotels page)
  useEffect(() => { setLocation(initialLocation); }, [initialLocation]);
  useEffect(() => { setCheckIn(parseDate(initialCheckIn)); }, [initialCheckIn]);
  useEffect(() => { setCheckOut(parseDate(initialCheckOut)); }, [initialCheckOut]);
  useEffect(() => { setAdults(Math.max(1, initialGuests)); }, [initialGuests]);
  useEffect(() => { setRooms(initialRooms); }, [initialRooms]);

  const { data: allLocations = [] } = useLocations();
  const [showSuggest, setShowSuggest] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const suggestRef = useRef<HTMLDivElement | null>(null);
  const suggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    if (!q) return allLocations.slice(0, 8);
    return allLocations.filter((l) => l.toLowerCase().includes(q)).slice(0, 8);
  }, [location, allLocations]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) setShowSuggest(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goToHotels = (loc?: string) => {
    const params = new URLSearchParams();
    const finalLoc = (loc ?? location).trim();
    if (finalLoc) params.set("location", finalLoc);
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    params.set("guests", String(adults + children));
    params.set("rooms", String(rooms));
    navigate(`/hotels?${params.toString()}`);
  };

  const selectSuggestion = (loc: string) => {
    setLocation(loc);
    setShowSuggest(false);
    goToHotels(loc);
  };

  const guestLabel = `${adults + children} guest${adults + children > 1 ? "s" : ""} · ${rooms} room${rooms > 1 ? "s" : ""}`;

  const Stepper = ({ label, value, setValue, min = 0 }: { label: string; value: number; setValue: (n: number) => void; min?: number }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={value <= min} onClick={() => setValue(value - 1)}>
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-6 text-center text-sm">{value}</span>
        <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setValue(value + 1)}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn("bg-card text-card-foreground rounded-xl p-4 md:p-5 shadow-xl", variant === "hero" && "shadow-2xl max-w-5xl")}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="relative md:col-span-2" ref={suggestRef}>
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Where are you going? e.g. Hanoi, Da Nang…"
            value={location}
            onChange={(e) => { setLocation(e.target.value); setShowSuggest(true); setHighlight(-1); }}
            onFocus={() => setShowSuggest(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setHighlight((h) => Math.min(h + 1, suggestions.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
              else if (e.key === "Enter") {
                if (highlight >= 0 && suggestions[highlight]) selectSuggestion(suggestions[highlight]);
                else goToHotels();
              } else if (e.key === "Escape") setShowSuggest(false);
            }}
            className="pl-9"
            autoComplete="off"
          />
          {showSuggest && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover text-popover-foreground border rounded-lg shadow-lg overflow-hidden animate-fade-in">
              <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                {location ? "Matching destinations" : "Popular destinations"}
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
                      onMouseEnter={() => setHighlight(i)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                        highlight === i ? "bg-accent" : "hover:bg-accent/60"
                      }`}
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start text-left font-normal", !checkIn && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkIn ? format(checkIn, "MMM dd") : "Check-in"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start text-left font-normal", !checkOut && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOut ? format(checkOut, "MMM dd") : "Check-out"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => date <= (checkIn || new Date())}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <Users className="mr-2 h-4 w-4" />
              <span className="truncate">{guestLabel}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="start">
            <Stepper label="Adults" value={adults} setValue={setAdults} min={1} />
            <Stepper label="Children" value={children} setValue={setChildren} min={0} />
            <Stepper label="Rooms" value={rooms} setValue={setRooms} min={1} />
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={() => goToHotels()} className="w-full md:w-auto mt-3" size="lg">
        <Search className="h-4 w-4 mr-2" /> Search Hotels
      </Button>
    </div>
  );
};

export default SearchBar;
