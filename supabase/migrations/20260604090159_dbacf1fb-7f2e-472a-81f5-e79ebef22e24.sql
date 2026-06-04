
-- 1. Widen bookings status check constraint to the canonical set
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
-- Migrate any legacy pending_confirmation rows to 'pending' BEFORE re-adding constraint
UPDATE public.bookings SET status = 'pending' WHERE status = 'pending_confirmation';
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending','confirmed','cancelled','rejected'));

-- 2. Change default booking status to 'pending'
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'pending';

-- 3. Add quantity column to rooms (inventory per room type)
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 5;

-- Populate realistic inventory by type
UPDATE public.rooms SET quantity = CASE lower(type)
  WHEN 'single'     THEN 15
  WHEN 'double'     THEN 12
  WHEN 'twin'       THEN 10
  WHEN 'family'     THEN 6
  WHEN 'deluxe'     THEN 8
  WHEN 'executive'  THEN 5
  WHEN 'suite'      THEN 3
  WHEN 'penthouse'  THEN 2
  ELSE 5
END;

-- 4. Update conflict trigger function to account for room quantity
--    and use the new canonical status values ('pending','confirmed')
CREATE OR REPLACE FUNCTION public.check_booking_conflict()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_qty   integer;
  v_count integer;
BEGIN
  IF NEW.status NOT IN ('pending','confirmed') THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(quantity, 1) INTO v_qty FROM public.rooms WHERE id = NEW.room_id;
  IF v_qty IS NULL THEN
    RAISE EXCEPTION 'Invalid room';
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.bookings
  WHERE room_id = NEW.room_id
    AND status IN ('pending','confirmed')
    AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND check_in < NEW.check_out
    AND check_out > NEW.check_in;

  IF v_count >= v_qty THEN
    RAISE EXCEPTION 'Room is fully booked for the selected dates';
  END IF;

  RETURN NEW;
END;
$$;

-- 5. Update cancel_booking RPC to accept the new 'pending' status
CREATE OR REPLACE FUNCTION public.cancel_booking(p_booking_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE v_user uuid; v_co date; v_status text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT user_id, check_out, status INTO v_user, v_co, v_status
    FROM public.bookings WHERE id = p_booking_id;
  IF v_user IS NULL OR v_user <> auth.uid() THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF v_status NOT IN ('pending','confirmed') THEN
    RAISE EXCEPTION 'Booking cannot be cancelled';
  END IF;
  IF CURRENT_DATE > v_co THEN
    RAISE EXCEPTION 'Cannot cancel a booking after its check-out date';
  END IF;
  UPDATE public.bookings SET status = 'cancelled' WHERE id = p_booking_id;
  UPDATE public.payments SET status = 'failed', updated_at = now()
    WHERE booking_id = p_booking_id AND status = 'pending';
END;
$$;

-- 6. Add an UPDATE policy for payments so admins can update via direct queries if needed
--    (the SECURITY DEFINER RPCs already bypass RLS, but this keeps the model consistent)
DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments;
CREATE POLICY "Admins can update all payments"
  ON public.payments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
