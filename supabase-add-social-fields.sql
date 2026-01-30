-- Add new social media and business fields to businesses table
-- Only adds fields if they don't already exist

-- Add whatsapp field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='whatsapp') THEN
    ALTER TABLE businesses ADD COLUMN whatsapp TEXT DEFAULT '';
  END IF;
END $$;

-- Add website field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='website') THEN
    ALTER TABLE businesses ADD COLUMN website TEXT DEFAULT '';
  END IF;
END $$;

-- Add twitter field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='twitter') THEN
    ALTER TABLE businesses ADD COLUMN twitter TEXT DEFAULT '';
  END IF;
END $$;

-- Add youtube field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='youtube') THEN
    ALTER TABLE businesses ADD COLUMN youtube TEXT DEFAULT '';
  END IF;
END $$;

-- Add linkedin field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='linkedin') THEN
    ALTER TABLE businesses ADD COLUMN linkedin TEXT DEFAULT '';
  END IF;
END $$;

-- Add threads field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='threads') THEN
    ALTER TABLE businesses ADD COLUMN threads TEXT DEFAULT '';
  END IF;
END $$;

-- Add google_map_url field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='google_map_url') THEN
    ALTER TABLE businesses ADD COLUMN google_map_url TEXT DEFAULT '';
  END IF;
END $$;

-- Add menuurl field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='menuurl') THEN
    ALTER TABLE businesses ADD COLUMN menuurl TEXT DEFAULT '';
  END IF;
END $$;

-- Add wifiqrcode field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='wifiqrcode') THEN
    ALTER TABLE businesses ADD COLUMN wifiqrcode TEXT DEFAULT '';
  END IF;
END $$;

-- Add brand_primary_color field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='brand_primary_color') THEN
    ALTER TABLE businesses ADD COLUMN brand_primary_color TEXT DEFAULT '#ED1D33';
  END IF;
END $$;

-- Add brand_secondary_color field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='brand_secondary_color') THEN
    ALTER TABLE businesses ADD COLUMN brand_secondary_color TEXT DEFAULT '#C91828';
  END IF;
END $$;

-- Add openinghours field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='openinghours') THEN
    ALTER TABLE businesses ADD COLUMN openinghours TEXT DEFAULT '';
  END IF;
END $$;
