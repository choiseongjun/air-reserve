ALTER TABLE air_reserve.bookings ADD COLUMN IF NOT EXISTS photo_consent_at timestamptz;
CREATE TABLE IF NOT EXISTS air_reserve.booking_photos (
 id uuid PRIMARY KEY,
 booking_id uuid NOT NULL REFERENCES air_reserve.bookings(id) ON DELETE CASCADE,
 position smallint NOT NULL CHECK (position BETWEEN 0 AND 2),
 image bytea NOT NULL CHECK (octet_length(image) <= 750000),
 UNIQUE (booking_id, position)
);
ALTER TABLE air_reserve.booking_photos ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON air_reserve.booking_photos FROM PUBLIC;
