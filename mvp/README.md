# On The Move Co. - MVP

This repository contains the MVP for On The Move Co., an errand-running platform for Nairobi.

## Deployment
For detailed production deployment instructions, please refer to [DEPLOYMENT.md](../DEPLOYMENT.md).

## Directory Structure
- `/backend`: Node.js/Express API with PostgreSQL schema, M-Pesa integration, and notification engine.
- `/customer-app`: React (Vite) web application for customers to book and track errands.
- `/runner-app`: React Native source code for the runner's mobile application.
- `/admin-dashboard`: React (Vite) dashboard for administrative oversight.

## Key Features Implemented
- **Booking Flow**: Multi-category service booking with Zone-based grouping and **upfront payment for goods**.
- **Smart Batching**: Automated dispatcher that groups errands by **Phase 1 zones** (CBD, Westlands, etc.) to allow one runner to handle multiple errands simultaneously.
- **Cashless Operations**: 100% cashless system; customers pay for both service fees and goods cost upfront via M-Pesa STK Push.
- **Phase 1 Targeted**: Initial launch focused on CBD and surrounding areas (Westlands, Karen, Kilimani, etc.).
- **Real-time Tracking**: 6-stage status tracking from Requested to Completed.
- **M-Pesa Integration**: Automated STK Push for payments and callback handling.
- **Notifications**: Automated SMS notifications on status changes via Africa's Talking.
- **Financial Compliance**: KRA-compliant auto-invoicing and runner earnings calculation.
- **Admin Visibility**: Stats overview, live order board, and Phase 1 Zone utilization clusters.

## Payment Configuration
The platform supports two payment modes, switchable via environment variables in the backend:
1. **Paybill (Manual)**: Default. Customers see the Paybill number and Account reference at checkout and submit their transaction code for admin verification.
2. **Daraja (Automated)**: Triggers an M-Pesa STK Push directly to the customer's phone.

To switch modes, update the following in `backend/.env`:
```env
PAYMENT_MODE=paybill # or 'daraja'
PAYBILL_NUMBER=247247
PAYBILL_ACCOUNT_PREFIX=ONTHEMOVE
```

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS 4.
- **Mobile**: React Native.
- **Backend**: Node.js, Express, PostgreSQL, Redis.
- **APIs**: Safaricom Daraja (M-Pesa), Africa's Talking (SMS).

## How to Run
Please refer to the README in each individual directory for setup instructions.
