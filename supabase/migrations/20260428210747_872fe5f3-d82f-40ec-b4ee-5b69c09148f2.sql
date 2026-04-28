-- Expand allowed room types
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_type_check;
ALTER TABLE public.rooms ADD CONSTRAINT rooms_type_check
  CHECK (type = ANY (ARRAY['single','double','deluxe','suite','family','twin','executive','penthouse']));

-- Refresh hotel image arrays with multiple verified images per hotel
UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&q=80'
] WHERE name = 'Hanoi Heritage Hotel';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80'
] WHERE name = 'West Lake Luxury Apartments';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'
] WHERE name = 'Saigon Sky Tower';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'
] WHERE name = 'District 1 Boutique Stay';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'
] WHERE name = 'Da Nang Beachfront Resort';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
  'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&q=80',
  'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80'
] WHERE name = 'Marble Mountain Villa';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80'
] WHERE name = 'Phu Quoc Pearl Resort';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80'
] WHERE name = 'Sunset Bay Villa Phu Quoc';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&q=80'
] WHERE name = 'Hoi An Ancient Town Hotel';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1534351590666-13e3e96c5017?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80'
] WHERE name = 'Amsterdam Canal House';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'
] WHERE name = 'Aspen Mountain Villa';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80'
] WHERE name = 'Bali Ubud Jungle Villa';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'
] WHERE name = 'Bangkok Riverside Hotel';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
  'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80'
] WHERE name = 'Barcelona Beach Apartments';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1580977251946-3724a539b691?w=800&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80'
] WHERE name = 'Cape Town Vineyard Resort';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'
] WHERE name = 'Iceland Aurora Lodge';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'
] WHERE name = 'Kyoto Zen Apartment';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'
] WHERE name = 'London Mayfair Suites';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80'
] WHERE name = 'Manhattan Skyline Apartment';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80',
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80'
] WHERE name = 'Marrakech Riad Palace';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=800&q=80',
  'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80'
] WHERE name = 'Miami Ocean Drive Resort';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80'
] WHERE name = 'Montmartre Artist Loft';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'
] WHERE name = 'Paris Latin Quarter Hotel';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
  'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800&q=80'
] WHERE name = 'Phuket Cliff Resort';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'
] WHERE name = 'Queenstown Alpine Villa';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
  'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=800&q=80',
  'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80'
] WHERE name = 'Rio Copacabana Hotel';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'
] WHERE name = 'Rome Colosseum Boutique';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80'
] WHERE name = 'Seoul Gangnam Suites';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80'
] WHERE name = 'Singapore Marina Hotel';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80'
] WHERE name = 'Sydney Harbour View Hotel';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80'
] WHERE name = 'Tulum Eco Resort';

UPDATE public.hotels SET images = ARRAY[
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80'
] WHERE name = 'Tuscany Vineyard Villa';

-- Add 5 more rooms to every hotel
INSERT INTO public.rooms (hotel_id, type, price, available)
SELECT h.id, 'suite', ROUND(h.price_per_night * 1.8, 2), true FROM public.hotels h
UNION ALL
SELECT h.id, 'family', ROUND(h.price_per_night * 1.5, 2), true FROM public.hotels h
UNION ALL
SELECT h.id, 'twin', ROUND(h.price_per_night * 1.1, 2), true FROM public.hotels h
UNION ALL
SELECT h.id, 'executive', ROUND(h.price_per_night * 1.6, 2), true FROM public.hotels h
UNION ALL
SELECT h.id, 'penthouse', ROUND(h.price_per_night * 2.4, 2), true FROM public.hotels h;