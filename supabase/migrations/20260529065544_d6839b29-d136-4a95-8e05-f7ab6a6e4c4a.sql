
-- 1. Drop the overly-permissive user UPDATE policy on payments
DROP POLICY IF EXISTS "Users can update own payments" ON public.payments;

-- 2. Server-side controlled confirmation: validates ownership of payment + booking
CREATE OR REPLACE FUNCTION public.confirm_payment(p_payment_id uuid, p_booking_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid;
  v_status text;
  v_amount numeric;
  v_booking_user uuid;
  v_booking_total numeric;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT user_id, status, amount INTO v_user, v_status, v_amount
  FROM public.payments WHERE id = p_payment_id;

  IF v_user IS NULL OR v_user <> auth.uid() THEN
    RAISE EXCEPTION 'Payment not found';
  END IF;

  IF v_status <> 'pending' THEN
    RAISE EXCEPTION 'Payment is not pending';
  END IF;

  SELECT user_id, total_price INTO v_booking_user, v_booking_total
  FROM public.bookings WHERE id = p_booking_id;

  IF v_booking_user IS NULL OR v_booking_user <> auth.uid() THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF ABS(v_booking_total - v_amount) > 0.01 THEN
    RAISE EXCEPTION 'Payment amount does not match booking total';
  END IF;

  UPDATE public.payments
  SET status = 'paid', booking_id = p_booking_id, updated_at = now()
  WHERE id = p_payment_id;
END;
$$;

-- Server-side controlled failure marking for the same payment owner
CREATE OR REPLACE FUNCTION public.mark_payment_failed(p_payment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid;
  v_status text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT user_id, status INTO v_user, v_status
  FROM public.payments WHERE id = p_payment_id;

  IF v_user IS NULL OR v_user <> auth.uid() THEN
    RAISE EXCEPTION 'Payment not found';
  END IF;

  IF v_status <> 'pending' THEN
    RETURN;
  END IF;

  UPDATE public.payments SET status = 'failed', updated_at = now()
  WHERE id = p_payment_id;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_payment(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.confirm_payment(uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.mark_payment_failed(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_payment_failed(uuid) TO authenticated;

-- 3. Lock down internal trigger/helper functions (not meant for API exposure)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_booking_field_changes() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.validate_booking_price() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.check_booking_conflict() FROM PUBLIC, anon, authenticated;

-- has_role is needed for RLS evaluation; restrict direct API execution to signed-in callers only
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
