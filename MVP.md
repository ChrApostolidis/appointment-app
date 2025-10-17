# Tech Stack
* FrontEnd: 
- Next.js
- Tailwindcss
- Shadcn/ui
- Auth

# MVP 
Purpose: Distinguish between providers (the people offering appointments) and clients (people booking them).

Sign up / log in (NextAuth.js, Clerk, or Supabase Auth)
User roles: provider or client
Simple profile: name, email

# Provider 
Features:
Provider can:
Select days of the week
Define available time slots (e.g., Mon 9:00–12:00, Wed 14:00–17:00)
Data stored in DB (via API route /api/availability)

UI:
Simple calendar or day/time picker
Availability list view (to see what’s set)

Backend:
POST /api/availability → create/update
GET /api/availability?userId= → fetch availability

## Booking System

Purpose: Clients pick a slot and confirm booking.
Features:
Show available time slots for a provider
Client selects one and books it
Prevent double-booking
Store in DB as an Appointment

Backend:
POST /api/bookings → create booking
GET /api/bookings?providerId= → list provider bookings

Validation:
Ensure slot is free before even rendering


## Dashboards

Purpose: Let both sides view relevant data easily.
Provider Dashboard:
List of upcoming appointments
Button to manage availability

Client Dashboard:
List of booked appointments

### Email Confirmation (Optional but Strong for MVP)
Feature:
When a booking is made, send a confirmation email to client & provider

Tech:
Use Resend or Nodemailer
Template includes: date, time, provider name