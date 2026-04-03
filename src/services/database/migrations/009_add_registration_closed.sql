-- Add registration_closed boolean to events table
-- When TRUE, the event's registration is closed (no new bookings allowed)

ALTER TABLE events
    ADD COLUMN IF NOT EXISTS registration_closed BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for quick filtering
CREATE INDEX IF NOT EXISTS idx_events_registration_closed ON events(registration_closed);
