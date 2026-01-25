import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  console.log('🚀 Starting database migration...\n');

  const migrations = [
    { name: 'whatsapp', type: 'TEXT' },
    { name: 'website', type: 'TEXT' },
    { name: 'twitter', type: 'TEXT' },
    { name: 'youtube', type: 'TEXT' },
    { name: 'linkedin', type: 'TEXT' },
    { name: 'threads', type: 'TEXT' },
    { name: 'getdirection', type: 'TEXT' },
  ];

  for (const field of migrations) {
    try {
      // Try to select the column to check if it exists
      const { error: checkError } = await supabase
        .from('businesses')
        .select(field.name)
        .limit(1);

      if (checkError && checkError.code === '42703') {
        // Column doesn't exist (error code 42703 = undefined_column)
        console.log(`⏳ Adding column: ${field.name}...`);
        
        // Note: Supabase client cannot execute ALTER TABLE directly
        // You need to run this through the Supabase Dashboard SQL Editor
        console.log(`⚠️  Column '${field.name}' needs to be added via Supabase Dashboard`);
      } else if (!checkError) {
        console.log(`✅ Column '${field.name}' already exists`);
      } else {
        console.log(`⚠️  Error checking column '${field.name}':`, checkError.message);
      }
    } catch (err) {
      console.error(`❌ Error processing ${field.name}:`, err.message);
    }
  }

  console.log('\n📋 Migration Summary:');
  console.log('To complete the migration, run the SQL file in Supabase Dashboard:');
  console.log('1. Go to your Supabase project');
  console.log('2. Click SQL Editor');
  console.log('3. Copy and paste the contents of supabase-add-social-fields.sql');
  console.log('4. Click Run\n');
}

runMigration();
