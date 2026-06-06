-- Prevent users from inserting bookings with elevated status (must be 'pending' for non-admins)
CREATE OR REPLACE FUNCTION public.enforce_booking_insert_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  -- Force non-admin inserts to 'pending' regardless of submitted value
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_booking_insert_status_trigger ON public.bookings;
CREATE TRIGGER enforce_booking_insert_status_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_insert_status();

-- Tighten INSERT RLS policy to additionally require status='pending' from clients
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (status = 'pending' OR public.has_role(auth.uid(), 'admin'))
);
