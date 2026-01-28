const fs = require('fs');
const path = require('path');

const deleteBusinessFolder = () => {
  const businessDir = path.join(__dirname, '../public/business');
  
  if (!fs.existsSync(businessDir)) {
    console.log('❌ Business directory not found');
    return;
  }

  try {
    // Check if upload-results.json exists
    const resultsPath = path.join(__dirname, 'upload-results.json');
    if (!fs.existsSync(resultsPath)) {
      console.log('⚠️  Warning: upload-results.json not found. Make sure you ran upload-business-images.js first.\n');
      console.log('Do you want to continue? (y/n)');
      
      // For safety, exit if results don't exist
      console.log('❌ Aborting. Please upload images first.');
      return;
    }

    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    const successful = results.filter(r => r.url).length;
    const total = results.length;

    console.log(`📊 Upload Results: ${successful}/${total} images successfully uploaded\n`);

    if (successful < total) {
      console.log(`⚠️  Warning: Not all images were uploaded successfully.`);
      console.log(`❌ Aborting deletion for safety. Please check upload-results.json\n`);
      return;
    }

    // Delete the folder
    fs.rmSync(businessDir, { recursive: true, force: true });
    console.log('✅ Successfully deleted public/business folder\n');
    console.log('📋 Backup of image URLs saved in scripts/upload-results.json');

  } catch (error) {
    console.error('❌ Error deleting folder:', error.message);
  }
};

deleteBusinessFolder();
