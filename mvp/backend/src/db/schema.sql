CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('customer', 'runner', 'admin');
CREATE TYPE runner_status AS ENUM ('active', 'inactive', 'busy');
CREATE TYPE errand_status AS ENUM ('requested', 'assigned', 'in_transit', 'arrived', 'in_progress', 'awaiting_confirmation', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'pending_verification', 'completed', 'failed');
CREATE TYPE payout_status AS ENUM ('pending', 'paid');

ALTER TYPE errand_status ADD VALUE 'payment_submitted';

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    kra_pin TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE runners (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    status runner_status DEFAULT 'inactive',
    current_location_lat DECIMAL(9,6),
    current_location_long DECIMAL(9,6),
    rating DECIMAL(2,1) DEFAULT 5.0,
    vehicle_type TEXT,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_gps_active BOOLEAN DEFAULT TRUE -- Track if GPS is enabled
);

CREATE TABLE errands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id),
    runner_id UUID REFERENCES users(id),
    status errand_status DEFAULT 'requested',
    category TEXT NOT NULL,
    description TEXT,
    pickup_address TEXT NOT NULL,
    pickup_zone TEXT NOT NULL,
    pickup_lat DECIMAL(9,6),
    pickup_long DECIMAL(9,6),
    delivery_address TEXT,
    delivery_zone TEXT,
    delivery_lat DECIMAL(9,6),
    delivery_long DECIMAL(9,6),
    goods_cost DECIMAL(10,2) DEFAULT 0.00, -- Added for upfront payment of goods
    estimated_price DECIMAL(10,2) NOT NULL, -- This is the service fee
    final_price DECIMAL(10,2),
    payment_status payment_status DEFAULT 'pending',
    mpesa_checkout_id TEXT,
    mpesa_receipt_number TEXT,
    completion_photo_url TEXT, -- For proof of completion
    customer_confirmed_at TIMESTAMP WITH TIME ZONE, -- When customer marked as received
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE errand_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    runner_id UUID REFERENCES users(id),
    zone TEXT NOT NULL,
    status TEXT DEFAULT 'open', -- 'open', 'assigned', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE errands ADD COLUMN batch_id UUID REFERENCES errand_batches(id);

CREATE TABLE errand_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    errand_id UUID NOT NULL REFERENCES errands(id) ON DELETE CASCADE,
    status errand_status NOT NULL,
    location_lat DECIMAL(9,6),
    location_long DECIMAL(9,6),
    updated_by UUID NOT NULL REFERENCES users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    errand_id UUID NOT NULL REFERENCES errands(id),
    invoice_number TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    vat DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_counter (
    id TEXT PRIMARY KEY DEFAULT 'single',
    last_number INTEGER NOT NULL DEFAULT 0
);
INSERT INTO invoice_counter (id, last_number) VALUES ('single', 0);

CREATE TABLE runner_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    runner_id UUID NOT NULL REFERENCES users(id),
    errand_id UUID NOT NULL REFERENCES errands(id),
    amount DECIMAL(10,2) NOT NULL,
    status payout_status DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE
);
