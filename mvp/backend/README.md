# On The Move Co. - MVP Backend

## Tech Stack
- Node.js & Express
- PostgreSQL (via pg)
- Redis (for real-time tracking - structure ready)
- M-Pesa Daraja API (STK Push)
- Africa's Talking API (SMS)
- JWT for Auth

## Setup
1. `npm install`
2. Create `.env` from `.env.example`
3. Run `src/db/schema.sql` in your PostgreSQL database
4. `npm run dev`

## API Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/errands` - Book errand (Customer)
- `GET /api/v1/errands/available` - View task feed (Runner)
- `POST /api/v1/errands/:id/accept` - Accept errand (Runner)
- `PATCH /api/v1/errands/:id/status` - Update status (Runner)
- `GET /api/v1/errands/my` - View my errands (Customer/Runner)
- `POST /api/v1/payments/stk-push` - Initiate M-Pesa payment
- `POST /api/v1/payments/callback` - M-Pesa Callback handler
