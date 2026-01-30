-- Rename image to business_logo, add businesscover and businessphotos fields
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='image') THEN
    ALTER TABLE businesses RENAME COLUMN image TO business_logo;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='businesscover') THEN
    ALTER TABLE businesses ADD COLUMN businesscover TEXT DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='businessphotos') THEN
    ALTER TABLE businesses ADD COLUMN businessphotos TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;
