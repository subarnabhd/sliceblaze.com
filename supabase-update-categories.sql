-- Add new columns to existing categories table
-- Run this if your categories table already exists without these columns

-- Add description column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'categories' AND column_name = 'description') THEN
    ALTER TABLE public.categories ADD COLUMN description TEXT;
  END IF;
END $$;

-- Add icon column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'categories' AND column_name = 'icon') THEN
    ALTER TABLE public.categories ADD COLUMN icon VARCHAR(10) DEFAULT '📂';
  END IF;
END $$;

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'categories' AND column_name = 'image_url') THEN
    ALTER TABLE public.categories ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- Update existing categories with default icons if they don't have one
UPDATE public.categories
SET icon = CASE name
  WHEN 'Restaurant' THEN '🍽️'
  WHEN 'Cafe' THEN '☕'
  WHEN 'Food & Beverage' THEN '🍔'
  WHEN 'Hotel' THEN '🏨'
  WHEN 'Retail' THEN '🛒'
  WHEN 'Services' THEN '💼'
  WHEN 'Bar' THEN '🍺'
  WHEN 'Fast Food' THEN '🍔'
  WHEN 'Bakery' THEN '🥖'
  WHEN 'Pizza' THEN '🍕'
  ELSE '🏪'
END
WHERE icon IS NULL OR icon = '📂';

-- Update existing categories with descriptions
UPDATE public.categories
SET description = CASE name
  WHEN 'Restaurant' THEN 'Fine dining and casual restaurants offering diverse cuisines'
  WHEN 'Cafe' THEN 'Coffee shops and cafes for beverages and light meals'
  WHEN 'Food & Beverage' THEN 'Various food and beverage establishments'
  WHEN 'Hotel' THEN 'Hotels and accommodation services'
  WHEN 'Retail' THEN 'Retail stores and shopping establishments'
  WHEN 'Services' THEN 'Professional and personal services'
  WHEN 'Bar' THEN 'Bars and pubs serving drinks and entertainment'
  WHEN 'Fast Food' THEN 'Quick service restaurants and fast food chains'
  WHEN 'Bakery' THEN 'Bakeries offering fresh bread, pastries and baked goods'
  WHEN 'Pizza' THEN 'Pizza restaurants and pizzerias'
  ELSE 'Other business establishments'
END
WHERE description IS NULL OR description = '';
