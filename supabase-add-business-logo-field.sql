-- Add logo field to businesses table if not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='logo') THEN
    ALTER TABLE businesses ADD COLUMN logo TEXT DEFAULT '';
  END IF;
END $$;
