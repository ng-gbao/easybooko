
-- Block dates while a booking is awaiting admin confirmation
CREATE OR REPLACE FUNCTION public.check_booking_conflict()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NEW.status NOT IN ('confirmed','pending_confirmation') THEN
    RETURN NEW;
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE room_id = NEW.room_id
      AND status IN ('confirmed','pending_confirmation')
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
      AND check_in < NEW.check_out
      AND check_out > NEW.check_in
  ) THEN
    RAISE EXCEPTION 'Room is already booked for the selected dates';
  END IF;
  RETURN NEW;
END; $$;

-- Enforce cancellation rule for non-admin users
CREATE OR REPLACE FUNCTION public.prevent_booking_field_changes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF public.has_role(auth.uid(),'admin') THEN RETURN NEW; END IF;
  IF NEW.total_price IS DISTINCT FROM OLD.total_price
     OR NEW.room_id IS DISTINCT FROM OLD.room_id
     OR NEW.hotel_id IS DISTINCT FROM OLD.hotel_id
     OR NEW.check_in IS DISTINCT FROM OLD.check_in
     OR NEW.check_out IS DISTINCT FROM OLD.check_out
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Only booking status can be modified';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Users can only cancel their bookings';
    END IF;
    IF CURRENT_DATE > OLD.check_out THEN
      RAISE EXCEPTION 'Cannot cancel a booking after its check-out date';
    END IF;
  END IF;
  RETURN NEW;
END; $$;

-- Admins can update any booking (confirm / reject)
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- User-facing cancel helper (enforces business rule)
CREATE OR REPLACE FUNCTION public.cancel_booking(p_booking_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_user uuid; v_co date; v_status text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT user_id, check_out, status INTO v_user, v_co, v_status
    FROM public.bookings WHERE id = p_booking_id;
  IF v_user IS NULL OR v_user <> auth.uid() THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF v_status NOT IN ('confirmed','pending_confirmation') THEN
    RAISE EXCEPTION 'Booking cannot be cancelled';
  END IF;
  IF CURRENT_DATE > v_co THEN
    RAISE EXCEPTION 'Cannot cancel a booking after its check-out date';
  END IF;
  UPDATE public.bookings SET status='cancelled' WHERE id = p_booking_id;
  UPDATE public.payments SET status='failed', updated_at=now()
    WHERE booking_id = p_booking_id AND status='pending';
END; $$;
REVOKE EXECUTE ON FUNCTION public.cancel_booking(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_booking(uuid) TO authenticated;

-- Admin: confirm a pending payment + its booking
CREATE OR REPLACE FUNCTION public.admin_confirm_payment(p_payment_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_booking uuid;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT booking_id INTO v_booking FROM public.payments WHERE id = p_payment_id;
  UPDATE public.payments SET status='paid', updated_at=now() WHERE id = p_payment_id;
  IF v_booking IS NOT NULL THEN
    UPDATE public.bookings SET status='confirmed' WHERE id = v_booking;
  END IF;
END; $$;
REVOKE EXECUTE ON FUNCTION public.admin_confirm_payment(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_confirm_payment(uuid) TO authenticated;

-- Admin: reject a pending payment + its booking
CREATE OR REPLACE FUNCTION public.admin_reject_payment(p_payment_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_booking uuid;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT booking_id INTO v_booking FROM public.payments WHERE id = p_payment_id;
  UPDATE public.payments SET status='failed', updated_at=now() WHERE id = p_payment_id;
  IF v_booking IS NOT NULL THEN
    UPDATE public.bookings SET status='rejected' WHERE id = v_booking;
  END IF;
END; $$;
REVOKE EXECUTE ON FUNCTION public.admin_reject_payment(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_reject_payment(uuid) TO authenticated;
