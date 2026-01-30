-- Update businesses table schema to match admin form fields
-- Add missing fields and rename/migrate existing ones

-- Add phone field (migrate from contact)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='phone') THEN
    ALTER TABLE businesses ADD COLUMN phone TEXT DEFAULT '';
    UPDATE businesses SET phone = contact WHERE contact IS NOT NULL;
  END IF;
END $$;

-- Add email field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='email') THEN
    ALTER TABLE businesses ADD COLUMN email TEXT DEFAULT '';
  END IF;
END $$;

-- Add address field (migrate from location)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='address') THEN
    ALTER TABLE businesses ADD COLUMN address TEXT DEFAULT '';
    UPDATE businesses SET address = location WHERE location IS NOT NULL;
  END IF;
END $$;

-- Add logo_url field (migrate from image)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='logo_url') THEN
    ALTER TABLE businesses ADD COLUMN logo_url TEXT DEFAULT '';
    UPDATE businesses SET logo_url = image WHERE image IS NOT NULL;
  END IF;
END $$;

-- Add cover_image_url field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='cover_image_url') THEN
    ALTER TABLE businesses ADD COLUMN cover_image_url TEXT DEFAULT '';
  END IF;
END $$;

-- Add opening_hours field (migrate from openingHours)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='opening_hours') THEN
    ALTER TABLE businesses ADD COLUMN opening_hours TEXT DEFAULT '';
    UPDATE businesses SET opening_hours = "openingHours" WHERE "openingHours" IS NOT NULL;
  END IF;
END $$;

-- Add facebook_url field (migrate from facebook)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='facebook_url') THEN
    ALTER TABLE businesses ADD COLUMN facebook_url TEXT DEFAULT '';
    UPDATE businesses SET facebook_url = facebook WHERE facebook IS NOT NULL;
  END IF;
END $$;

-- Add instagram_url field (migrate from instagram)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='instagram_url') THEN
    ALTER TABLE businesses ADD COLUMN instagram_url TEXT DEFAULT '';
    UPDATE businesses SET instagram_url = instagram WHERE instagram IS NOT NULL;
  END IF;
END $$;

-- Add twitter_url field (migrate from twitter)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='twitter_url') THEN
    ALTER TABLE businesses ADD COLUMN twitter_url TEXT DEFAULT '';
    UPDATE businesses SET twitter_url = twitter WHERE twitter IS NOT NULL;
  END IF;
END $$;

-- Add primary_color field (migrate from brand_primary_color)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='primary_color') THEN
    ALTER TABLE businesses ADD COLUMN primary_color TEXT DEFAULT '#ED1D33';
    UPDATE businesses SET primary_color = "brand_primary_color" WHERE "brand_primary_color" IS NOT NULL;
  END IF;
END $$;

-- Add secondary_color field (migrate from brand_secondary_color)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='secondary_color') THEN
    ALTER TABLE businesses ADD COLUMN secondary_color TEXT DEFAULT '#000000';
    UPDATE businesses SET secondary_color = "brand_secondary_color" WHERE "brand_secondary_color" IS NOT NULL;
  END IF;
END $$;

-- Add user_id field if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='user_id') THEN
    ALTER TABLE businesses ADD COLUMN user_id BIGINT DEFAULT NULL;
  END IF;
END $$;

-- Add updated_at field
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='businesses' AND column_name='updated_at') THEN
    ALTER TABLE businesses ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
  END IF;
END $$;

-- Create or replace trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
