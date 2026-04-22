
# Hotel Booking Web Application

## Design Direction
- **Palette:** Ocean Deep — deep navy (#0C2340), teal (#2D8A9E), aqua (#5CBDB9) with white surfaces
- **Typography:** Sora headings, Manrope body — clean and geometric
- **Layout:** Hero search banner + card grid listings
- **Style:** Booking.com-inspired, rounded cards, subtle shadows, responsive mobile-first

## Backend (Lovable Cloud / Supabase)

### Database Tables
1. **profiles** — user profile data (name, avatar, role: user/admin)
2. **user_roles** — role management (admin, user) with security definer function
3. **hotels** — name, location, description, price_per_night, rating, images[], amenities[]
4. **rooms** — hotel_id (FK), type (single/double/deluxe), price, available
5. **bookings** — user_id, hotel_id, room_id, check_in, check_out, total_price, status (confirmed/cancelled)
6. **wishlists** — user_id, hotel_id

### RLS Policies
- Users can read all hotels/rooms, manage their own bookings/wishlists
- Admins can CRUD hotels, rooms, and view all bookings
- Booking conflict prevention via database constraint/function

### Auth
- Email/password + Google OAuth via Supabase Auth

## Pages & Features

### 1. Homepage
- Hero section with search bar (location, check-in/out dates)
- Featured hotels card grid with price, rating, location, image
- Filter sidebar: price range slider, rating filter, sorting (price/rating)

### 2. Hotel Detail Page
- Image gallery with thumbnails
- Description, amenities icons (wifi, parking, breakfast, pool, etc.)
- Available rooms list with type, price, and "Book Now" button
- Calendar date picker for check-in/out with disabled booked dates

### 3. Booking Flow
- Select room → pick dates → see calculated total (nights × price)
- Confirm booking → saved to database
- Double-booking prevention (check date overlaps before confirming)

### 4. User Dashboard
- Booking history with status badges (confirmed/cancelled)
- Cancel booking functionality
- Wishlist/saved hotels

### 5. Admin Panel
- Hotel management: add/edit/delete hotels with image upload
- Room management per hotel
- View all bookings across users

### 6. Auth Pages
- Sign up / Login with email or Google
- Persistent sessions

## Extra Features
- Wishlist (heart icon on hotel cards)
- Sorting: price low→high, rating high→low
- Pagination on listings
- Loading skeletons and error states
- Responsive design (mobile + desktop)

## Seed Data
- 8-10 sample hotels with images, descriptions, rooms, and amenities to demonstrate the app immediately
