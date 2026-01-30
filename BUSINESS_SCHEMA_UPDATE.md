# Business Schema Update - Migration Guide

## Problem
The admin business management form was using field names that didn't match the database schema, causing Supabase errors when creating or editing businesses.

## Mismatch Details

### Admin Form Fields → Database Fields
- `phone` → `contact` (old)
- `email` → *(missing)*
- `address` → `location` (old)
- `logo_url` → `image` (old)
- `cover_image_url` → *(missing)*
- `opening_hours` → `openingHours` (old)
- `facebook_url` → `facebook` (old)
- `instagram_url` → `instagram` (old)
- `twitter_url` → `twitter` (old)
- `primary_color` → `brand_primary_color` (old)
- `secondary_color` → `brand_secondary_color` (old)

## Solution

### Step 1: Run Database Migration

**📋 Execute this SQL in Supabase SQL Editor:**

```bash
File: supabase-update-business-schema.sql
```

This migration will:
1. Add all new field names (`phone`, `email`, `address`, etc.)
2. Migrate existing data from old fields to new fields
3. Keep old fields for backward compatibility
4. Add `user_id` and `updated_at` fields
5. Create auto-update trigger for `updated_at`

### Step 2: Verify Migration

After running the SQL, verify in Supabase:
1. Go to Table Editor → businesses
2. Check that new columns exist: `phone`, `email`, `address`, `logo_url`, `cover_image_url`, `opening_hours`, `facebook_url`, `instagram_url`, `twitter_url`, `primary_color`, `secondary_color`
3. Verify data was migrated correctly

### Step 3: Test Admin Panel

1. Navigate to `/admin` and login
2. Go to Business Management
3. Try editing an existing business
4. Try creating a new business
5. Check browser console for errors

## Files Updated

### 1. `supabase-update-business-schema.sql` (NEW)
- Complete migration script
- Adds all missing fields
- Migrates data from old to new fields
- Backward compatible

### 2. `app/admin/business-management/page.tsx`
- Enhanced error logging for debugging
- All input fields now use `|| ''` fallback to prevent controlled/uncontrolled warnings
- Better error messages showing actual Supabase errors

### 3. `app/(user)/[username]/page.tsx`
- Updated Business interface to include both old and new field names
- Added helper functions for backward compatibility:
  - `getAddress()`, `getPhone()`, `getEmail()`
  - `getLogoUrl()`, `getCoverImageUrl()`
  - `getOpeningHours()`
  - `getFacebookUrl()`, `getInstagramUrl()`, `getTwitterUrl()`
  - `getPrimaryColor()`, `getSecondaryColor()`
- Updated all references to use helper functions
- Maintains compatibility with both old and new data

## Testing Checklist

- [ ] Run SQL migration in Supabase
- [ ] Verify all new columns exist in businesses table
- [ ] Test creating a new business in admin panel
- [ ] Test editing an existing business in admin panel
- [ ] Test business profile page displays correctly
- [ ] Test image uploads (logo and cover)
- [ ] Test social media links work
- [ ] Test all form fields save correctly
- [ ] Check browser console for errors
- [ ] Verify sitemap.xml includes all businesses

## Rollback Plan

If issues occur:
1. The migration is non-destructive (old fields remain)
2. Revert code changes via git
3. Optionally drop new columns (not recommended if data was added)

## Notes

- Old field names are preserved for backward compatibility
- Existing businesses will work with both old and new field names
- New businesses should use new field names automatically
- The business profile page handles both old and new schemas seamlessly
