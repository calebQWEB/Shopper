# Shopper

Shopper is a premium electronics storefront for discovering and buying laptops, smartphones, tablets, headphones, smartwatches, and gaming consoles.

**Live demo:** [shopperdemo.vercel.app](https://shopperdemo.vercel.app/)

## Features

- Browse products by category, search the catalog, and view product details.
- Add items to a shopping cart and check out with Paystack.
- Create an account, sign in, and view orders and account details.
- Manage products, customers, orders, and promotions through the admin control panel.
- Upload product images with Cloudinary.
- Track analytics with PostHog when configured.

## Tech stack

- [Next.js](https://nextjs.org/) 15 and React 19
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) and PostgreSQL
- [Supabase](https://supabase.com/) PostgreSQL hosting
- [Paystack](https://paystack.com/) payments
- [Cloudinary](https://cloudinary.com/) image hosting
- NextAuth.js authentication

## Prerequisites

- Node.js and npm
- A PostgreSQL database (the project is configured for Supabase)
- Paystack and Cloudinary accounts for payment processing and product image uploads

## Local setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/calebQWEB/Shopper.git
   cd Shopper
   npm install
   ```

2. Create a local environment file by copying `.env.example` to `.env`. For example:

   ```bash
   # macOS / Linux
   cp .env.example .env

   # PowerShell
   Copy-Item .env.example .env
   ```

3. Configure the environment variables described below. At minimum, set the database connection strings and authentication values.

4. Apply the database migrations:

   ```bash
   npx prisma migrate deploy
   ```

   Dependency installation runs `prisma generate` automatically. If you change the Prisma schema, create and apply a migration in development with:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000).

## Environment variables

Use `.env.example` as the template. Never commit `.env` or expose secret values in client-side code.

### Database

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection used by the app. For Supabase/Vercel, use the pooled connection string (typically port `6543`). |
| `DIRECT_URL` | Direct PostgreSQL connection used by Prisma migrations (typically port `5432`). |

Use the connection strings from your Supabase project. URL-encode special characters in the database password when required by the connection-string format.

### Authentication and admin registration

| Variable | Purpose |
| --- | --- |
| `NEXTAUTH_SECRET` | Secret used by NextAuth to sign and encrypt session data. Use a long, unique random value. |
| `NEXTAUTH_URL` | Base URL for the app, such as `http://localhost:3000` locally or your deployed HTTPS URL. |
| `ADMIN_CODE` | Optional code that assigns the admin role when supplied during registration. Keep it private and unset after creating the initial admin account if it is no longer needed. |
| `NEXT_PUBLIC_BASE_URL` | Public app URL reserved for absolute links, such as email verification links. |

### Payments and image uploads

| Variable | Purpose |
| --- | --- |
| `PAYSTACK_SECRET_KEY` | Server-side Paystack API key used to verify payments and process webhook events. |
| `NEXT_PUBLIC_PAYSTACK_PUBLISHABLE_KEY` | Paystack public key used by the checkout UI. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_SECRET` | Server-side Cloudinary API secret. |

Use test credentials while developing and live credentials only in the production environment.

### Optional integrations

| Variable | Purpose |
| --- | --- |
| `CRON_SECRET` | Protects `/api/cron/keep-alive`. Vercel Cron sends this as a bearer token when configured. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Enables PostHog analytics when set. |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host; defaults to `https://us.i.posthog.com`. |
| `IPINFO_TOKEN` | IP geolocation token used by the weather endpoint. |
| `WEATHER_API_KEY` | OpenWeather API key used by the weather endpoint. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | SMTP settings reserved for email delivery. Registration currently creates verification tokens, but sending verification emails is not enabled. |

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create the optimized production build. |
| `npm start` | Run the production server (after building). |
| `npm run lint` | Run the configured lint command. The current ESLint configuration references `standard`, which is not installed, so linting needs that config added or removed from the ESLint setup. |

## Deploying to Vercel

1. Import the repository into Vercel.
2. Add the required environment variables in the Vercel project settings. Configure them for each environment where they are needed, especially Production.
3. For Supabase, use the pooled URL for `DATABASE_URL` and the direct URL for `DIRECT_URL`.
4. Deploy. The install step generates the Prisma client; the production build runs with `npm run build`.
5. Apply pending database migrations before directing production traffic:

   ```bash
   npx prisma migrate deploy
   ```

The project configures a Vercel Cron Job at `/api/cron/keep-alive`, scheduled daily at **09:00 UTC**. Set `CRON_SECRET` in Vercel and deploy to Production to enable it. Check the Vercel Cron Jobs page and function logs to confirm scheduled runs.

## Project structure

```text
prisma/       Prisma schema and database migrations
public/       Static images and other public assets
src/app/      App Router pages, layouts, and API routes
src/components/ Shared UI components
src/libs/     Database client and shared utilities
```
