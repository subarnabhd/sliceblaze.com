const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Load upload results
const uploadResults = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'upload-results.json'), 'utf-8')
);

// Create mapping: filename -> Cloudinary URL
const imageMap = {};
uploadResults.forEach(result => {
  if (result.url) {
    // Extract just the filename without extension and normalize
    const filename = result.originalFile.toLowerCase().replace(/\.[^/.]+$/, '');
    imageMap[filename] = result.url;
  }
});

const updateBusinessImages = async () => {
  console.log('🔍 Fetching all businesses from database...\n');

  // Fetch all businesses
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, username, image');

  if (error) {
    console.error('❌ Error fetching businesses:', error);
    return;
  }

  console.log(`📊 Found ${businesses.length} businesses\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const business of businesses) {
    try {
      // Skip if already using Cloudinary
      if (business.image && business.image.includes('cloudinary.com')) {
        console.log(`⏭️  ${business.name}: Already using Cloudinary`);
        skipped++;
        continue;
      }

      // Extract filename from current path
      let filename = null;
      if (business.image) {
        filename = business.image
          .replace(/^\/business\//, '')
          .toLowerCase()
          .replace(/\.[^/.]+$/, '');
      } else {
        // Try matching by username or business name
        filename = (business.username || business.name)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
      }

      // Find matching Cloudinary URL
      let cloudinaryUrl = null;
      
      // Try exact match first
      if (imageMap[filename]) {
        cloudinaryUrl = imageMap[filename];
      } else {
        // Try fuzzy match
        const matches = Object.keys(imageMap).filter(key => 
          key.includes(filename) || filename.includes(key)
        );
        if (matches.length === 1) {
          cloudinaryUrl = imageMap[matches[0]];
        }
      }

      if (!cloudinaryUrl) {
        console.log(`⚠️  ${business.name}: No matching image found (${filename})`);
        skipped++;
        continue;
      }

      // Update database
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ image: cloudinaryUrl })
        .eq('id', business.id);

      if (updateError) {
        console.error(`❌ ${business.name}: Update failed`, updateError.message);
        failed++;
      } else {
        console.log(`✅ ${business.name}: Updated to ${cloudinaryUrl}`);
        updated++;
      }

    } catch (err) {
      console.error(`❌ ${business.name}: Error`, err.message);
      failed++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${businesses.length}\n`);
};

updateBusinessImages().catch(console.error);
