-- Add is_active column to businesses table if it doesn't exist
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Set all existing businesses to active
UPDATE businesses SET is_active = true WHERE is_active IS NULL;
