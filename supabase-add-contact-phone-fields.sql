-- Add contact and phone columns to businesses table if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='contact') THEN
    ALTER TABLE businesses ADD COLUMN contact TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='phone') THEN
    ALTER TABLE businesses ADD COLUMN phone TEXT DEFAULT '';
  END IF;
END $$;