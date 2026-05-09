# On The Move Co. - UX/UI Design Specification

## 1. Design Language & Brand Identity
*   **Primary Colors:** 
    *   *Movement Blue (#1A73E8)* - Represents reliability, professionalism, and trust.
    *   *Growth Green (#34A853)* - Represents the Kenyan landscape and financial success (M-Pesa context).
*   **Secondary Colors:**
    *   *Warning Orange (#FBBC05)* - For urgent alerts or pending tasks.
    *   *Error Red (#EA4335)* - For cancelled tasks or payment failures.
*   **Typography:** Sans-serif (Inter or Roboto) for readability on low-resolution mobile screens.
*   **Iconography:** Simple, bold icons for quick recognition at a glance.

## 2. Customer App: The "Hustle-Free" Experience

### 2.1. Home Screen (Category Selection)
*   **Header:** "Hello [Name], what can we do for you today?"
*   **Grid Layout:** 4 main icons (Parcel, Queue, Bank, General Errands).
*   **Area Tags:** Category icons may show "Hot Zones" (e.g., "High demand in CBD").
*   **Active Task Snippet:** If a task is active, a floating card at the bottom shows real-time status (e.g., "Runner is 2 mins away").

### 2.2. Booking Flow (The 3-Step Process)
1.  **Details Entry:** 
    *   **Zone Selection:** Explicit "Pickup Zone" and "Dropoff Zone" dropdowns. 
    *   **Phase 1 Zones:** CBD, Westlands, Karen, Kilimani, Kileleshwa, Lavington, Riverside, Parklands, Highridge, South B, South C, Langata.
    *   Pickup/Location field (Google Maps Autocomplete for exact address).
    *   Detailed instructions text box ("Ask for Jane at the counter").
    *   Urgency toggle (Standard vs. Express).
2.  **Estimate & Review:**
    *   Clear breakdown: Base Fee + Distance Fee + Service Type Fee = Total.
    *   "M-Pesa" selected as default payment.
3.  **Payment Initiation:**
    *   Modal overlay: "Check your phone for the M-Pesa PIN prompt."
    *   Countdown timer for the STK Push response.

### 2.3. Real-Time Tracking
*   **Top Half:** Live map showing the Runner's icon and the destination.
*   **Bottom Half:** Expandable sheet with:
    *   Status Timeline (Requested -> Assigned -> In-Transit -> Completed).
    *   Runner Profile: Name, Photo, Rating, and "Call/Chat" buttons.
    *   Estimated Time of Arrival (ETA).

### 2.4. Invoice & History
*   **History Tab:** List of cards showing Date, Task Type, Status, and Cost.
*   **Invoice View:** KRA-compliant layout. "Download PDF" button at the bottom.

---

## 3. Runner App: The "Earnings & Efficiency" Tool

### 3.1. Task Feed (The Marketplace)
*   **Header:** Online/Offline toggle + Zone Filter.
*   **Batched Task Cards:** 
    *   Shows multiple errands in the same zone as one unit.
    *   Big "Ksh 1,200" total earnings estimate for the batch.
    *   "3 Errands in Westlands" summary label.
    *   "Quick Accept" swipe action for the entire batch.

### 3.2. Active Task Execution
*   **Batch View:** List of all errands in the current batch.
*   **Optimized Route:** The app guides the runner through the most efficient sequence (e.g., Pickup A -> Pickup B -> Dropoff A -> Dropoff B).
*   **Big Buttons:** "I have Arrived", "I have Picked Up", "I have Completed" for each sub-task.
*   **Proof of Completion:** Photo upload requirement for deliveries.

### 3.3. Runner Wallet
*   **Visual Chart:** Earnings over the last 7 days.
*   **Withdraw Button:** "Move to M-Pesa" button (B2C integration).

---

## 4. Admin Dashboard: The "Control Room"

### 4.1. Live Order Board
*   Full-screen map of Nairobi/Outskirts.
*   **Zone Clusters:** Visual heatmaps showing errand density by zone (CBD, Westlands, Kilimani, Karen, etc.).
*   Filters for: Pending, Active, Delayed, Completed, and **By Zone**.
*   Right sidebar: Real-time event log ("Batch Accepted in Westlands").

### 4.2. Pricing Engine Config
*   Input fields for:
    *   Base Fare (Ksh)
    *   Per KM Rate (Ksh)
    *   Waiting Time (Ksh per 15 mins)
    *   Outskirt Surcharge (Percentage)

## 5. Low-Bandwidth & USSD Fallback Design
*   **Minimalist UI Mode:** For users on slow connections (2G/3G), the app should prioritize text over images and map tiles.
*   **USSD Menu Flow (Fallback):**
    1.  *1. Book Errand*
    2.  *2. Check Status*
    3.  *3. My Balance*
    *   *1.1 Select Type: 1.Parcel 2.Queue 3.Other*
*   **SMS Notifications:** Every status change triggers a short SMS (e.g., "OnTheMove: Runner [Name] has accepted your errand. ETA 15min. Track at [shortlink]") to ensure visibility without data.
