import { Building2, Home, Palmtree, Castle, LayoutGrid } from "lucide-react";
import type { PropertyType } from "@/hooks/useHotels";
import { cn } from "@/lib/utils";

interface Props {
  value?: PropertyType;
  onChange: (value?: PropertyType) => void;
}

const types: { key?: PropertyType; label: string; icon: typeof Building2 }[] = [
  { key: undefined, label: "All", icon: LayoutGrid },
  { key: "hotel", label: "Hotels", icon: Building2 },
  { key: "apartment", label: "Apartments", icon: Home },
  { key: "resort", label: "Resorts", icon: Palmtree },
  { key: "villa", label: "Villas", icon: Castle },
];

const PropertyTypeFilter = ({ value, onChange }: Props) => (
  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
    {types.map(({ key, label, icon: Icon }) => {
      const active = value === key;
      return (
        <button
          key={label}
          onClick={() => onChange(key)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap text-sm font-medium transition-colors",
            active
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      );
    })}
  </div>
);

export default PropertyTypeFilter;
