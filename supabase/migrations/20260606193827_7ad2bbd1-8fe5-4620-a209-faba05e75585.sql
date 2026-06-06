
CREATE OR REPLACE FUNCTION public.get_room_overlap_counts(
  p_hotel_id uuid,
  p_check_in date,
  p_check_out date
)
RETURNS TABLE(room_id uuid, booked_count integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.room_id, COUNT(*)::int AS booked_count
  FROM public.bookings b
  JOIN public.rooms r ON r.id = b.room_id
  WHERE r.hotel_id = p_hotel_id
    AND b.status IN ('pending','confirmed')
    AND b.check_in < p_check_out
    AND b.check_out > p_check_in
  GROUP BY b.room_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_room_overlap_counts(uuid, date, date) TO anon, authenticated;
