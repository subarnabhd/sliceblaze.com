-- Add cover_image and photos fields to businesses table if not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='cover_image') THEN
    ALTER TABLE businesses ADD COLUMN cover_image TEXT DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='photos') THEN
    ALTER TABLE businesses ADD COLUMN photos TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;
