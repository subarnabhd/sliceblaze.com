-- Migration: Add logo, cover_image, and photos fields to businesses table
ALTER TABLE businesses
  ADD COLUMN logo TEXT,
  ADD COLUMN cover_image TEXT,
  ADD COLUMN photos TEXT[];

-- Optional: Migrate old image field to new logo/cover/photos fields
-- If 'image' column exists and should be migrated to 'logo':
UPDATE businesses SET logo = image WHERE image IS NOT NULL;

-- If you want to move old images to Cloudinary folders, do this in your migration script (JS):
-- For each business, upload the old image to Cloudinary in /logo, /cover, or /photos as needed
-- Then update the logo/cover_image/photos fields with the new Cloudinary URLs
-- Remove or keep the old 'image' field as needed

-- Example: Remove old image column if no longer needed
-- ALTER TABLE businesses DROP COLUMN image;
