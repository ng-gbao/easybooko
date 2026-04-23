-- 1. Fix profiles: restrict SELECT to own profile only
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;

CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Lock down user_roles: only admins can insert/update/delete roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Validate booking total_price server-side
CREATE OR REPLACE FUNCTION public.validate_booking_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  room_price NUMERIC;
  nights INTEGER;
  expected_price NUMERIC;
BEGIN
  SELECT price INTO room_price FROM public.rooms WHERE id = NEW.room_id;
  IF room_price IS NULL THEN
    RAISE EXCEPTION 'Invalid room';
  END IF;

  nights := (NEW.check_out - NEW.check_in);
  IF nights <= 0 THEN
    RAISE EXCEPTION 'Check-out must be after check-in';
  END IF;

  expected_price := room_price * nights;

  IF ABS(NEW.total_price - expected_price) > 0.01 THEN
    RAISE EXCEPTION 'Invalid total_price: expected %, got %', expected_price, NEW.total_price;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_booking_price ON public.bookings;
CREATE TRIGGER check_booking_price
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.validate_booking_price();

-- 4. Tighten booking UPDATE: prevent users from changing financial/date fields
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;

CREATE POLICY "Users can update own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger to prevent users (non-admins) from modifying financial/structural fields
CREATE OR REPLACE FUNCTION public.prevent_booking_field_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.total_price IS DISTINCT FROM OLD.total_price
     OR NEW.room_id IS DISTINCT FROM OLD.room_id
     OR NEW.hotel_id IS DISTINCT FROM OLD.hotel_id
     OR NEW.check_in IS DISTINCT FROM OLD.check_in
     OR NEW.check_out IS DISTINCT FROM OLD.check_out
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Only booking status can be modified';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_booking_field_changes_trigger ON public.bookings;
CREATE TRIGGER prevent_booking_field_changes_trigger
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.prevent_booking_field_changes();

-- 5. Document why check_booking_conflict is SECURITY DEFINER
COMMENT ON FUNCTION public.check_booking_conflict() IS
  'SECURITY DEFINER is required so the trigger can see bookings from all users when checking for date conflicts. Do not change to SECURITY INVOKER — it would only see the current user''s bookings and miss conflicts.';