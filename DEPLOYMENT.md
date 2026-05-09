# On The Move Co. MVP - Deployment Guide

This guide covers the deployment process for all four components of the On The Move Co. errand platform.

## Architecture Overview
- **Backend API**: Node.js/Express, PostgreSQL, Redis.
- **Customer Web App**: React (Vite).
- **Admin Dashboard**: React (Vite).
- **Runner Mobile App**: React Native (Expo).

---

## 1. Recommended Hosting & Cost Estimates

| Component | Recommended Host | Why? | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Backend API** | [Railway](https://railway.app/) or [Render](https://render.com/) | Built-in support for Node.js, Postgres, and Redis. | $10 - $20/mo (Total for API + DB + Redis) |
| **PostgreSQL** | [Supabase](https://supabase.com/) or Railway | Easy management, excellent free tier. | $0 - $10/mo |
| **Redis** | [Upstash](https://upstash.com/) or Railway | Serverless Redis with a great free tier. | $0 - $5/mo |
| **Web Apps** | [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) | Best-in-class for static/SPA hosting. | $0 (Free tier usually sufficient) |
| **Mobile App** | [Expo EAS](https://expo.dev/eas) | Simplifies builds and distribution for iOS/Android. | $0 - $25/mo (Priority builds) |

---

## 2. Environment Variables

Each component requires specific environment variables to function in production.

### Backend API (`/backend`)
Create a `.env` file with the following:
```env
PORT=5000
DATABASE_URL=postgres://user:password@hostname:5432/dbname
REDIS_URL=redis://user:password@hostname:port
JWT_SECRET=generate_a_long_random_string

# Payment Mode: 'paybill' or 'daraja'
PAYMENT_MODE=paybill
PAYBILL_NUMBER=0740761815
PAYBILL_ACCOUNT_PREFIX=ONTHEMOVE

# M-Pesa Daraja API Settings (Required for 'daraja' mode)
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=https://your-api-domain.com/api/v1/payments/callback

# Africa's Talking SMS Settings
AFRICASTALKING_USERNAME=your_username
AFRICASTALKING_API_KEY=your_api_key

# Owner / Business Info (for Invoices)
OWNER_NAME="Victor Mbatia Mubea"
OWNER_ADDRESS="Nairobi, Kenya"
OWNER_KRA_PIN="A015677297T"
```

### Customer Web App (`/customer-app`)
Create a `.env.production` file:
```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

### Admin Dashboard (`/admin-dashboard`)
Create a `.env.production` file:
```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

### Runner Mobile App (`/runner-app`)
Update `src/api/index.js`:
```javascript
const API_URL = 'https://your-api-domain.com/api/v1';
```

---

## 3. Step-by-Step Deployment

### Step A: Database Setup
1. Create a PostgreSQL instance on **Supabase** or **Railway**.
2. Run the schema found in `backend/src/db/schema.sql` against your database.
3. Keep the `DATABASE_URL` handy.

### Step B: Redis Setup
1. Create a Redis instance on **Upstash** or **Railway**.
2. Keep the `REDIS_URL` handy.

### Step C: Backend API (Render/Railway)
1. Connect your GitHub repo.
2. Select the `backend` directory as the root.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all environment variables listed above.

### Step D: Web Frontends (Vercel)
1. Connect your GitHub repo.
2. For **Customer App**, select `customer-app` as root. Build command: `npm run build`. Output: `dist`.
3. For **Admin Dashboard**, select `admin-dashboard` as root. Build command: `npm run build`. Output: `dist`.
4. Add the `VITE_API_URL` environment variable.

---

## 4. Third-Party Integrations

### M-Pesa Sandbox Setup
1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke/).
2. Create a new App to get your `Consumer Key` and `Consumer Secret`.
3. Use the **Simulate** feature to test C2B (Paybill) or **STK Push** for Daraja.
4. Set `PAYMENT_MODE=daraja` in your API environment variables when ready for STK Push.

### Africa's Talking SMS
1. Sign up at [Africa's Talking](https://africastalking.com/).
2. Get your **API Key** and **Username** (use `sandbox` for testing).
3. For production, you will need to register a **Shortcode** or **Alphanumeric Sender ID**.

---

## 5. Maintenance & Scaling
- **Logs**: Monitor API logs on Render/Railway.
- **Monitoring**: Check the Admin Dashboard's "Control Room" for runner activity.
- **Payments**: Reconcile M-Pesa callbacks by checking the `errands` table status.
