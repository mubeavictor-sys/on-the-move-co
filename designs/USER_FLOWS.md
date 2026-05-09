# On The Move Co. - User Flows

## 1. Customer Booking Flow
```mermaid
graph TD
    A[Home: Select Category] --> B[Enter Zones: Pickup & Dropoff]
    B --> C[Enter Exact Addresses & Instructions]
    C --> D[View Cost Estimate]
    D --> E{Confirm & Pay?}
    E -- Yes --> F[M-Pesa STK Push]
    E -- No --> B
    F --> G{Payment Success?}
    G -- Yes --> H[System Groups Task into Zone Batch]
    G -- No --> I[Retry Payment]
    H --> J[Status: Requested]
```

## 2. Runner Fulfillment Flow
```mermaid
graph TD
    A[Task Feed: Batch Alert] --> B[Review Batch: Earnings & Zone Clusters]
    B --> C{Accept Batch?}
    C -- Yes --> D[Status: Assigned - Multiple]
    D --> E[Navigate Optimized Route]
    E --> F[Arrive at Location X]
    F --> G[Perform Sub-Task]
    G --> H{More sub-tasks?}
    H -- Yes --> E
    H -- No --> I[Status: Completed - Batch]
    I --> J[Generate Invoices & Pay Runner]
```

## 3. Order Tracking States
*   **Requested:** Customer paid, waiting for runner.
*   **Assigned:** Runner accepted, moving to start point.
*   **Arrived at Start:** Runner is at the first location.
*   **In-Progress:** Runner is performing the errand (moving to dropoff or waiting in queue).
*   **Completed:** Task done, proof uploaded.
*   **Cancelled:** Task aborted (by customer/runner/admin).
```