const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

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

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImagesFromFolder = async () => {
  const businessDir = path.join(__dirname, '../public/business');
  
  // Check if directory exists
  if (!fs.existsSync(businessDir)) {
    console.log('❌ Business directory not found');
    return;
  }

  // Get all files from the directory
  const files = fs.readdirSync(businessDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  console.log(`📸 Found ${imageFiles.length} images to upload\n`);

  const results = [];

  for (const file of imageFiles) {
    try {
      const filePath = path.join(businessDir, file);
      const businessName = file.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

      console.log(`⏳ Uploading: ${file}...`);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'businesses/logos',
        resource_type: 'auto',
        type: 'upload',
        access_mode: 'public',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        invalidate: true,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
        context: {
          alt: businessName,
          caption: `${businessName} logo`,
        },
        tags: ['businesses', 'logos', 'sliceblaze'],
      });

      results.push({
        originalFile: file,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        size: result.bytes,
      });

      console.log(`✅ ${file} → ${result.secure_url}\n`);

    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
      results.push({
        originalFile: file,
        error: error.message,
      });
    }
  }

  // Save results to a JSON file
  const outputPath = path.join(__dirname, 'upload-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successful: ${results.filter(r => r.url).length}`);
  console.log(`❌ Failed: ${results.filter(r => r.error).length}`);
  console.log(`📄 Full results saved to: ${outputPath}\n`);

  // Ask if user wants to delete the folder
  console.log('🗑️  To delete the public/business folder, run:');
  console.log('   node scripts/delete-business-folder.js\n');
};

uploadImagesFromFolder().catch(console.error);
