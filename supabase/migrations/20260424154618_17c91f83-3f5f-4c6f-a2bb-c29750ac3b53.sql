-- Add property_type to hotels
ALTER TABLE public.hotels
ADD COLUMN IF NOT EXISTS property_type text NOT NULL DEFAULT 'hotel';

-- Optional check via trigger-free constraint (allow only known types)
ALTER TABLE public.hotels
DROP CONSTRAINT IF EXISTS hotels_property_type_check;

ALTER TABLE public.hotels
ADD CONSTRAINT hotels_property_type_check
CHECK (property_type IN ('hotel', 'apartment', 'resort', 'villa'));

CREATE INDEX IF NOT EXISTS idx_hotels_property_type ON public.hotels(property_type);
CREATE INDEX IF NOT EXISTS idx_hotels_location ON public.hotels(location);