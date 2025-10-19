# 🧭 MVP Development Roadmap

Purpose: Build a simple booking platform that connects **Providers** (offering appointments) and **Clients** (booking them).

---

## 🧱 Tech Stack

**Frontend**
- [x] Next.js
- [x] Tailwind CSS
- [x] shadcn/ui
- [x] Authentication 

**Backend / Infra**
- [ ] Next.js API Routes
- [ ] Database (PostgreSQL / Supabase / Prisma)
- [ ] Email Service (Resend / Nodemailer)

---

## 👤 Authentication & User Roles

**Goal:** Distinguish between *providers* and *clients*.

**Tasks**
- [x] Implement sign up / login  
- [ ] Role selection (provider or client) on first login  
- [x] Basic profile (name, email) 
- [ ] Advanced profile ()
- [x] Store role in user table  
- [ ] Protect routes by role (middleware or server-side check)

---

## 🗓️ Provider Availability

**Goal:** Let providers define and manage their available time slots.

**Tasks**
- [ ] UI: Availability management page  
- [ ] UI: Day & time picker component  
- [ ] API:  
  - [ ] `POST /api/availability` → Create / update availability  
  - [ ] `GET /api/availability?userId=` → Fetch provider availability  
- [ ] DB schema for availability  
- [ ] Display availability list view  
- [ ] Validation: Prevent overlapping slots  

**Done When**
- Provider can add, edit, and delete time slots from dashboard  

---

## 📅 Booking System

**Goal:** Allow clients to browse available slots and confirm bookings.

**Tasks**
- [ ] Fetch available time slots (provider view)  
- [ ] Booking form (slot selection + confirm)  
- [ ] API:
  - [ ] `POST /api/bookings` → Create booking  
  - [ ] `GET /api/bookings?providerId=` → List provider’s bookings  
- [ ] Prevent double-booking (check before insert)  
- [ ] Save booking in database  

**Done When**
- Clients can see availability and successfully book a time  

---

## 📊 Dashboards

**Goal:** Give users visibility into their upcoming appointments.

### Provider Dashboard
- [ ] List upcoming bookings  
- [ ] Button → manage availability  

### Client Dashboard
- [ ] List all booked appointments  

**Done When**
- Both roles can see relevant data after login  

---

## 📧 Email Notifications (Optional for MVP)

**Goal:** Notify both parties of new bookings.

**Tasks**
- [ ] Integrate Resend or Nodemailer  
- [ ] Design email template (date, time, provider name)  
- [ ] Trigger email on successful booking  

**Done When**
- Both provider and client receive confirmation emails  

---

## 🧩 Future Enhancements (Post-MVP Ideas)

- [ ] Google / Outlook Calendar integration  
- [ ] Booking reschedule or cancellation  
- [ ] Payment integration (Stripe)  
- [ ] Reminder notifications (email or SMS)  
- [ ] Provider bios and profile photos  
- [ ] Client reviews  

---

## 📁 Suggested Folder Structure

