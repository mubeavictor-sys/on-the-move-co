# On The Move Co. - Detailed Screen Mockup Specs

## 1. Customer App

### Screen: [C-01] Home / Service Selection
- **UI Elements:**
    - Top Bar: Logo (Left), Profile Icon (Right).
    - Search Bar: "Search for a specific errand..."
    - **Zone Display:** Banner showing "Fast turnaround in CBD and Westlands right now!"
    - Main Grid (Cards with Illustrations):
        - Parcel Pickup (Icon: Package)
        - Queue Standing (Icon: Person in line)
        - Bank/Admin Run (Icon: Bank building)
        - General/Custom (Icon: Stars)
    - Recent Activity: Horizontal scroll of last 3 errands.

### Screen: [C-01.5] Booking Details
- **UI Elements:**
    - Zone Dropdowns: [Pickup Zone v] and [Dropoff Zone v].
    - **Options:** CBD, Westlands, Karen, Kilimani, Kileleshwa, Lavington, Riverside, Parklands, Highridge, South B, South C, Langata.
    - Location Inputs: Exact Pickup and Dropoff addresses.
    - Instruction Box: "Details for the runner..."
    - Next Button: Navigates to [C-02].

### Screen: [C-02] Real-Time Tracking
- **UI Elements:**
    - Map View (70% of screen): Google Maps style, showing blue dot (Runner) and red pin (Destination).
    - Status Card (Bottom sheet, persistent):
        - Status Title: "Runner is heading to G4S Office"
        - Time: "ETA: 12 mins"
        - Runner Info: Mini avatar, "Call" and "Chat" icons.
        - Progress Bar: 5 steps (Req, Asg, Pickup, Progress, Done).

### Screen: [C-03] Rating & Review
- **UI Elements:**
    - Title: "How was your errand?"
    - 5-Star Rating widget.
    - Comment Box: "Tell us about the Runner's service..."
    - Quick Tags: [Professional], [On-time], [Polite], [Handled with care].
    - Submit Button (Full width, Blue).

---

## 2. Runner App

### Screen: [R-01] Task Feed
- **UI Elements:**
    - Tab Switcher: Available Batches | My Active Batch.
    - **Zone Filter:** "Show only: [CBD / Westlands / Karen / Kilimani / All]".
    - **Batched Task Cards:**
        - Title: "Batch: 3 errands in Westlands" (Bold).
        - Total Earnings: "Ksh 1,200".
        - Summary: "Pickups: Nairobi Water, G4S, KRA. Dropoffs: Delta Towers."
        - "Accept Batch" (Green Button) | "Ignore" (Gray Button).

### Screen: [R-02] Active Batch (Sequence)
- **UI Elements:**
    - **Sequence List:**
        1. [Pickup] G4S Westlands - Parcel for John.
        2. [Pickup] Nairobi Water - Pay Bill.
        3. [Dropoff] Delta Towers - Deliver Parcel.
    - Action Bar (Bottom): Context-aware button:
        - [I am at G4S] (Orange) -> [Parcel Picked Up] (Blue) -> [I am at Nairobi Water] (Orange) ...

### Screen: [R-03] Earnings Wallet
- **UI Elements:**
    - Balance: "Ksh 4,200" (Large font).
    - Stats: Tasks completed today (4), Total distance (22km).
    - Transaction History: List of completed tasks with timestamps and net earnings.
    - Withdraw Button: Triggers B2C M-Pesa transfer.

---

## 3. Admin Dashboard

### Screen: [A-01] Live Order Board
- **UI Elements:**
    - Central Map: Real-time pins of all active runners + **Zone Overlays** (colored polygons representing CBD, Westlands, etc.).
    - Side Panel (Right): Scrollable list of active batches with zone labels.
    - "Zone Health" Widget: Showing errand count vs. runner count for each zone.
    - "Alerts" Section: Red flags for tasks stuck in "Assigned" for >20 mins.

### Screen: [A-02] Pricing Engine
- **UI Elements:**
    - Form Grid:
        - Base Fare: [Input field]
        - Per KM: [Input field]
        - Waiting Fee (per 15m): [Input field]
    - Geo-fencing: Map selector to define "Nairobi Outskirts" and apply a multiplier (e.g., 1.2x).
    - Save Changes Button.
