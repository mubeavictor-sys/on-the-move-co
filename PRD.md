# Product Requirements Document (PRD): On The Move Co.

## 1. Product Overview
**On The Move Co.** is a mobile-first errand-running platform designed to save time for busy individuals and businesses in Nairobi and its outskirts. The platform connects customers with vetted "Runners" who can perform a variety of tasks, from physical deliveries to administrative errands.

## 2. Service Categories
The platform will initially focus on the following core services:
*   **Parcel Pickup & Delivery:** Moving items between locations (home, office, courier offices like G4S/Wells Fargo).
*   **Queue Standing:** Waiting in line at government offices (KRA, NTSA), banks, or event ticketing booths.
*   **Bank & Administrative Runs:** Depositing checks, picking up documents, or filing paperwork.
*   **General Errands:** Personal shopping, bill payments (where physical presence is required), and other custom requests.

## 3. User Personas
### A. The Customer (Client)
*   **Profile:** Busy professionals, small business owners (SMEs), or individuals living outside the city center.
*   **Needs:** Reliability, trust, transparent pricing, and real-time updates.

### B. The Runner (Service Provider)
*   **Profile:** Reliable individuals with good local knowledge, often looking for flexible work.
*   **Needs:** Fair compensation, clear task instructions, efficient routing, and timely payments.

### C. Admin/Operations
*   **Profile:** On The Move Co. staff.
*   **Needs:** Runner vetting management, dispute resolution, fleet monitoring, and financial reporting.

### D. Automation Layer
*   **Role:** The "Brain" of the platform that handles logic without human intervention.
*   **Needs:** Efficient matching algorithms, reliable notification triggers, and automated financial reconciliation.

## 4. Core Workflows
### 4.1. Booking Workflow
1.  Customer selects service category.
2.  Customer provides details (locations, instructions, urgency).
3.  System calculates estimated cost.
4.  Customer confirms and pays (via M-Pesa).
5.  **Automation:** Task is broadcasted to nearby/available Runners using a proximity and rating-based algorithm.

### 4.2. Fulfillment Workflow & Tracking
1.  **Requested:** Customer submits request; status is "Requested".
2.  **Assigned:** Runner accepts task; status moves to "Assigned". Customer notified.
3.  **In-Transit to Start:** Runner moves to the first location; status "In-Transit (Pick-up)".
4.  **Arrived at Start:** Runner arrives; status "Arrived at Pick-up".
5.  **In-Progress:** Runner starts the errand; status "In-Progress". Customer can track real-time location.
6.  **Completed:** Runner completes task and uploads proof; status "Completed".
7.  **Invoiced:** System generates a KRA-compliant invoice and sends it to the customer.

### 4.3. Runner Vetting & Onboarding
1.  Runner applies via the platform.
2.  Submission of ID, Police Clearance Certificate (Certificate of Good Conduct), and references.
3.  **Automation:** Initial background check via third-party APIs (where available) and document OCR verification.
4.  Physical interview/training session.
5.  Activation on the platform.

## 5. Key Features per User Type
### Customer App/Web
*   **Task Dashboard:** Track active and past errands with full status history.
*   **Real-time Tracking:** See Runner's location and status timeline (Requested → Assigned → In-Progress → Completed).
*   **In-App Chat:** Communicate directly with the Runner.
*   **M-Pesa Integration:** Seamless payment for services and disbursements.
*   **Invoice Management:** Download PDF invoices for completed errands (KRA compliant).
*   **Rating & Review:** Feedback loop for service quality.

### Runner App
*   **Task Feed:** View available errands with estimated earnings.
*   **Status Management:** One-tap updates for task stages (Arrived, Started, Completed).
*   **Navigation Integration:** Integration with Google Maps.
*   **Earnings Wallet:** Track daily/weekly earnings and request withdrawals.

### Admin Dashboard
*   **User Management:** Manage Customers and Runners.
*   **Live Order Board:** Real-time visibility across all active orders and their statuses.
*   **Payout & Invoice Management:** Oversee Runner payments and view/regenerate customer invoices.
*   **Pricing Engine:** Configure base rates, per-KM rates, and "waiting time" fees.

### Automation Layer
*   **Smart Dispatcher:** Automatically assigns tasks to the most suitable runner.
*   **Status Notification Engine:** Triggers SMS/Push notifications to customers at each status change.
*   **Auto-Invoicing:** Automatically generates a sequential, KRA-compliant PDF invoice upon task completion.
*   **Payment Reconciliation:** Automatically match M-Pesa transaction IDs with task IDs.

## 6. Financial Compliance & Invoicing (Kenyan Law)
To comply with KRA (Kenya Revenue Authority) requirements, the system must generate invoices containing:
*   **Company Details:** On The Move Co. Name, Address, and KRA PIN.
*   **Customer Details:** Name/Business Name and PIN (if provided).
*   **Invoice Metadata:** Unique Sequential Invoice Number, Date of Issue.
*   **Service Details:** Description of errand, Quantity, Unit Price, and Total.
*   **Tax Breakdown:** VAT (if applicable), Total Amount Payable.
*   **Output:** Automated PDF generation upon task completion, stored in the customer’s "Invoice Management" section.

## 7. Order Tracking & Visibility
*   **Status Timeline:** Every order must maintain a timestamped log of status changes (Requested → Assigned → In-Transit → Arrived → In-Progress → Completed).
*   **Customer View:** Real-time map view of the runner + a progress bar indicating the current stage.
*   **Admin View:** A "Control Room" dashboard showing all active errands, their current status, and potential delays (e.g., tasks stuck in "Assigned" for too long).

## 8. Tech Stack Recommendation
To ensure rapid development and local accessibility:
*   **Frontend:** React Native (Cross-platform iOS/Android) for the mobile apps; React.js for the Admin Dashboard.
*   **Backend:** Node.js with Express.
*   **Database:** PostgreSQL (for structured relational data) and Redis (for real-time location tracking).
*   **Payments:** Daraja API (M-Pesa integration) for C2B and B2C transactions.
*   **Communication:** Twilio or Africa's Talking for SMS notifications and USSD (for low-bandwidth accessibility).
*   **Infrastructure:** AWS (Ireland or South Africa region for low latency).

## 9. Assumptions & Open Questions
*   **Assumption:** Most customers have smartphones and data, but USSD/SMS fallback is needed for Runners or basic bookings.
*   **Question:** What is the insurance policy for lost/damaged parcels or sensitive documents?
*   **Question:** How do we handle "cash-on-delivery" errands where the Runner needs to pay for an item upfront? (Recommendation: Use a float system or customer pre-payment).
*   **Question:** What are the specific outskirts to be covered in Phase 1 (e.g., Kikuyu, Ruiru, Ngong, Athi River)?
