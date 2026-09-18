CREATE SCHEMA IF NOT EXISTS air_reserve;
REVOKE ALL ON SCHEMA air_reserve FROM PUBLIC;
CREATE TABLE IF NOT EXISTS air_reserve.bookings (
 id uuid PRIMARY KEY,
 request_id uuid NOT NULL UNIQUE,
 payload_hash text NOT NULL,
 customer_name text NOT NULL,
 phone text NOT NULL,
 phone_hash text NOT NULL,
 address text NOT NULL,
 service text NOT NULL,
 area text NOT NULL,
 preferred_date date NOT NULL,
 time_slot text NOT NULL,
 quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 4),
 notes text NOT NULL DEFAULT '',
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
 consent_version text NOT NULL,
 consent_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bookings_created_idx ON air_reserve.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_phone_idx ON air_reserve.bookings(phone_hash, created_at DESC);
ALTER TABLE air_reserve.bookings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON air_reserve.bookings FROM PUBLIC;
CREATE TABLE IF NOT EXISTS air_reserve.admin_attempts (
 bucket text PRIMARY KEY,
 attempts integer NOT NULL DEFAULT 1,
 expires_at timestamptz NOT NULL
);
ALTER TABLE air_reserve.admin_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON air_reserve.admin_attempts FROM PUBLIC;
