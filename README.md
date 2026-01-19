# AppointMe

> Providers join AppointMe so we can handle their availability, bookings, and client updates, and customers trust us to match them with the right verified provider for whatever service they need.

## Key Features
- **Dual-role onboarding:** Guided, validated forms route each user into either the provider or client flow, storing their profile details and unlocking the right experience once onboarding is finished.
- **Availability engine:** Providers configure weekly working hours that are normalized into JSON, enabling fast conflict checks and flexible business hours per weekday.
- **Booking workflow:** Clients browse provider cards, filter by specialty, and reserve one-hour slots, server actions prevent double booking and send confirmations instantly.
- **Transactional communications:** React Email templates plus Resend power welcome and booking notification emails without managing SMTP infrastructure.
- **Asset pipeline:** Providers upload brand imagery through AWS S3 pre-signed URLs, letting the browser stream uploads directly while keeping credentials server-side.
- **Secure sessions:** Passwords are Scrypt-hashed with per-user salts and session state lives in Upstash Redis for stateless server deployments.

## Tech Stack
- **Framework:** Next.js App Router (v16), React 19, TypeScript
- **UI:** Tailwind CSS, shadcn/ui primitives, Framer Motion, FullCalendar Library
- **Forms & Validation:** React Hook Form, Zod
- **Data & Infra:** Drizzle ORM, Neon/PostgreSQL, Upstash Redis
- **Messaging & Files:** Resend + React Email, AWS S3 (pre-signed uploads)

## Architecture & Technical Decisions
- **Feature-first app directory:** Each page (`book`, `profile`, `myAppointments`, `authPage`) keeps its own actions, components, and schemas, so features move faster without stepping on each other.
- **Server actions + API routes:** Bookings, onboarding, and availability updates stay type-safe as server actions, while `/api/*` routes share clean contracts with calendars, mobile apps, or webhooks.
- **Typed database layer:** `drizzle/schema.ts` describes every enum, table, and JSON field, and `drizzle-kit` migrations keep code and Postgres in sync.
- **Session boundary:** Redis-backed sessions (`auth/core/session.ts`) keep auth state outside Next.js middleware, so the app can scale horizontally without sticky sessions.
- **Asynchronous side effects:** Actions like `bookAppointment` fire Resend emails via async fetches, keeping the UI quick while still delivering notifications.

## Getting Started
### Prerequisites
- Node.js 20+
- npm 10+ (or a compatible package manager)
- Access to a PostgreSQL database (Neon is configured by default)
- AWS S3 bucket credentials and an Upstash Redis instance
- Resend API key for transactional email

### Installation
1. Clone the repository and install dependencies:
	```bash
	git clone https://github.com/your-org/appointment-app.git
	cd appointment-app
	npm install
	```
2. Create an `.env.local` file and provide the required environment variables (see below).

### Environment Variables
| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string used by Neon/Drizzle. |
| `RESEND_API_KEY` | API key for sending transactional emails. |
| `AWS_REGION` | Region for your S3 bucket. |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Credentials for creating S3 pre-signed URLs. |
| `AWS_BUCKET_NAME` | Bucket that stores provider assets. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Redis endpoint + token for sessions. |
| `NEXT_PUBLIC_BASE_URL` | Public origin used when server actions call internal routes. |

### Database & Tooling
```bash
npm run db:generate   # Update drizzle schema from the database
npm run db:migrate    # Apply pending migrations
npm run db:push       # Push schema changes (optional for dev)
npm run db:studio     # Launch Drizzle Studio to browse data
```

### Run Locally
```bash
npm run dev           # Start Next.js with Turbopack
npm run lint          # Static analysis via eslint
npm run build && npm run start  # Production build & serve
npm run email         # Preview React Email templates locally
```
Then visit http://localhost:3000.

## Future Improvements / Roadmap
- Role-aware routing middleware to hide provider-only surfaces from clients until policies are enforced.
- Booking lifecycle enhancements: reschedule, cancel, and reminders (email/SMS).
- Analytics dashboards summarizing utilization, cancellations, and top services for providers.

## Feedback & Contributions
This project is still actively being developed—feel free to reach out with feature ideas, usability feedback, or bug reports so they can be prioritized in upcoming iterations.

## License
Released under the [MIT License](https://opensource.org/licenses/MIT).