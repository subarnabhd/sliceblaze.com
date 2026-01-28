// Migration script: Move old business images to Cloudinary folders and update DB
// Usage: node scripts/migrate-business-images.js

const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateImages() {
  // 1. Fetch all businesses with old image field
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, image');

  if (error) {
    console.error('Error fetching businesses:', error);
    return;
  }

  for (const business of businesses) {
    if (!business.image) continue;
    // 2. Upload old image to Cloudinary /logo folder
    const publicId = `businesses/logos/${business.id}`;
    try {
      const result = await cloudinary.uploader.upload(business.image, {
        public_id: publicId,
        folder: 'businesses/logos',
        overwrite: true,
      });
      // 3. Update logo field in DB
      await supabase
        .from('businesses')
        .update({ logo: result.secure_url })
        .eq('id', business.id);
      console.log(`Business ${business.id}: migrated image to logo.`);
    } catch (err) {
      console.error(`Error migrating image for business ${business.id}:`, err);
    }
  }
}

migrateImages();
