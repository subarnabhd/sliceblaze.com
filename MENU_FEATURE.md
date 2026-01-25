# Menu Management Feature

## Overview
The Menu Management feature allows businesses to create and display digital menus on their profiles with a hierarchical structure: Categories → Subcategories → Items. Perfect for restaurants, cafes, and food businesses.

## Features

### For Business Owners
- Create unlimited menu categories (e.g., Appetizers, Main Course, Desserts)
- Add subcategories within each category (e.g., Vegetarian, Non-Vegetarian)
- Add menu items with:
  - Name
  - Description
  - Price
  - Image (optional)
  - Display order
  - Active/Inactive status
- Full CRUD (Create, Read, Update, Delete) operations
- Reorder items by display order
- Toggle visibility without deleting

### For Customers
- Browse menu by categories with tab navigation
- View organized menu with subcategories
- See item names, descriptions, and prices
- View item images (if provided)
- Responsive design for mobile and desktop

### For Admins
- Access all business menus
- Navigate to business profiles to view menus
- Quick access to all businesses

## Database Schema

### Tables Created

#### 1. `menu_categories`
Main menu categories for businesses

```sql
CREATE TABLE public.menu_categories (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `menu_subcategories`
Subcategories within menu categories

```sql
CREATE TABLE public.menu_subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. `menu_items`
Individual menu items with pricing

```sql
CREATE TABLE public.menu_items (
  id SERIAL PRIMARY KEY,
  subcategory_id INTEGER NOT NULL REFERENCES public.menu_subcategories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### 1. Run Database Migration

Execute the SQL migration file in Supabase SQL Editor:

```bash
# File: supabase-create-menu.sql
```

Or manually execute the SQL commands to create the three tables.

### 2. Files Created/Modified

#### New Files:
- `supabase-create-menu.sql` - Database migration
- `components/MenuDisplay.tsx` - Public menu display component
- `app/user/menu/page.tsx` - Business owner menu management
- `app/admin/menu/page.tsx` - Admin menu overview

#### Modified Files:
- `lib/supabase.js` - Added menu CRUD functions:
  - Category functions: `getMenuCategories`, `addMenuCategory`, `updateMenuCategory`, `deleteMenuCategory`
  - Subcategory functions: `getMenuSubcategories`, `addMenuSubcategory`, `updateMenuSubcategory`, `deleteMenuSubcategory`
  - Item functions: `getMenuItems`, `addMenuItem`, `updateMenuItem`, `deleteMenuItem`
  - Full menu: `getFullMenu` (gets complete menu with nested data)
- `app/[username]/page.tsx` - Added menu display to business profiles
- `app/user/dashboard/page.tsx` - Added "Manage Menu" button
- `app/admin/dashboard/page.tsx` - Added "Menu Management" navigation

## Usage Guide

### For Business Owners

#### Access Menu Management
1. Login to your account at `/login`
2. Navigate to Dashboard → "My Business" tab
3. Click "Manage Menu" button (green button)
4. Or go directly to `/user/menu`

#### Create Menu Structure

**Step 1: Add Categories**
1. Click the "+" button in the Categories sidebar
2. Enter category name (e.g., "Appetizers", "Main Course")
3. Click "Add"

**Step 2: Add Subcategories**
1. Select a category from the left sidebar
2. In the Subcategories section, click "+ Add"
3. Enter subcategory name (e.g., "Vegetarian", "Seafood")
4. Click "Add"

**Step 3: Add Menu Items**
1. Select a subcategory
2. In the Items section, click "+ Add"
3. Fill in:
   - **Item Name** (required)
   - **Description** (optional)
   - **Price** (required, in dollars)
   - **Image URL** (optional)
4. Click "Add"

#### Edit/Delete Items
- Click "Edit" on any category/subcategory/item to modify
- Click "Delete" to remove (with confirmation)
- Note: Deleting categories removes all subcategories and items

### For Customers

#### View Menu
1. Visit business profile: `/{business-username}`
2. Scroll to "Our Menu" section
3. Click category tabs to switch between different menu sections
4. Browse subcategories and items
5. See item names, descriptions, and prices

### For Admins

#### Access Menu Management
1. Login to admin panel at `/admin`
2. Click "🍽️ Menu Management" in sidebar
3. Or navigate to `/admin/menu`
4. View all businesses and access their profiles
5. Business owners manage their own menus via `/user/menu`

## Menu Structure Example

```
📁 Categories
├── 🍕 Appetizers
│   ├── Vegetarian
│   │   ├── Spring Rolls ($8.99)
│   │   └── Garlic Bread ($5.99)
│   └── Non-Vegetarian
│       └── Chicken Wings ($12.99)
├── 🍝 Main Course
│   ├── Pasta
│   │   ├── Spaghetti Carbonara ($15.99)
│   │   └── Penne Arrabbiata ($14.99)
│   └── Pizza
│       ├── Margherita ($13.99)
│       └── Pepperoni ($16.99)
└── 🍰 Desserts
    └── Cakes
        ├── Chocolate Cake ($7.99)
        └── Cheesecake ($8.99)
```

## API Functions

### Category Functions

```javascript
// Get all categories for a business
const categories = await getMenuCategories(businessId)

// Add a new category
const category = await addMenuCategory({
  business_id: 1,
  name: 'Appetizers',
  display_order: 0,
  is_active: true
})

// Update category
const updated = await updateMenuCategory(categoryId, { name: 'Starters' })

// Delete category (cascades to subcategories and items)
const success = await deleteMenuCategory(categoryId)
```

### Subcategory Functions

```javascript
// Get subcategories for a category
const subcategories = await getMenuSubcategories(categoryId)

// Add subcategory
const subcategory = await addMenuSubcategory({
  category_id: 1,
  name: 'Vegetarian',
  display_order: 0,
  is_active: true
})

// Update subcategory
const updated = await updateMenuSubcategory(subcategoryId, { name: 'Vegan' })

// Delete subcategory (cascades to items)
const success = await deleteMenuSubcategory(subcategoryId)
```

### Item Functions

```javascript
// Get items for a subcategory
const items = await getMenuItems(subcategoryId)

// Add item
const item = await addMenuItem({
  subcategory_id: 1,
  name: 'Spring Rolls',
  description: 'Fresh vegetable spring rolls with sweet chili sauce',
  price: 8.99,
  image: 'https://example.com/spring-rolls.jpg',
  display_order: 0,
  is_active: true
})

// Update item
const updated = await updateMenuItem(itemId, { price: 9.99 })

// Delete item
const success = await deleteMenuItem(itemId)
```

### Full Menu

```javascript
// Get complete menu with nested structure
const fullMenu = await getFullMenu(businessId)
// Returns: Categories with nested Subcategories and Items
```

## Component Usage

### MenuDisplay Component

```tsx
import MenuDisplay from '@/components/MenuDisplay'

<MenuDisplay 
  menu={menuData}
  brandColor="#ED1D33"
  currencySymbol="$"
/>
```

Props:
- `menu`: Array of category objects with nested subcategories and items
- `brandColor`: Optional, brand primary color (default: '#ED1D33')
- `currencySymbol`: Optional, currency symbol (default: '$')

## Features in Detail

### Display Order
- Items are sorted by `display_order` field
- Lower numbers appear first
- Automatically suggested when adding new items

### Active/Inactive Status
- `is_active` field controls visibility
- Inactive items are hidden from public view
- Can be toggled without deleting data

### Cascading Deletes
- Deleting a category removes all its subcategories and items
- Deleting a subcategory removes all its items
- Confirmation prompts prevent accidental deletion

### Responsive Design
- Tab-based category navigation
- Grid layout for menu items (2 columns on desktop, 1 on mobile)
- Touch-friendly buttons and forms
- Optimized for all screen sizes

## Best Practices

1. **Organize Logically**
   - Group related items into categories
   - Use subcategories for variations (Veg/Non-veg, Small/Large)
   - Keep category names short and clear

2. **Pricing**
   - Use consistent decimal places (e.g., $9.99 not $9.9)
   - Include currency symbol
   - Update prices regularly

3. **Descriptions**
   - Keep descriptions concise (1-2 lines)
   - Mention key ingredients or preparation
   - Highlight special features (gluten-free, vegan, etc.)

4. **Images**
   - Use high-quality food photography
   - Consistent image dimensions
   - Optimize file sizes for fast loading
   - Host images reliably (CDN recommended)

5. **Display Order**
   - Put popular items first
   - Group complementary items together
   - Update seasonally

## Troubleshooting

### Menu Not Displaying
- Verify business has categories in database
- Check that categories/subcategories/items are `is_active: true`
- Ensure getFullMenu() is called with correct business ID
- Check browser console for errors

### Cannot Add Items
- Verify you've selected a subcategory
- Check that price is a valid number
- Ensure name field is not empty
- Verify database permissions

### Items Not Showing on Profile
- Check `is_active` status
- Verify data is saved (check database)
- Refresh the business profile page
- Check that getFullMenu includes the items

### Cascading Delete Not Working
- Verify foreign key constraints exist
- Check database ON DELETE CASCADE settings
- Ensure proper permissions

## Future Enhancements

Potential features to add:
- Drag-and-drop reordering
- Bulk import/export (CSV/JSON)
- Menu item variations (sizes, add-ons)
- Dietary tags (vegan, gluten-free, etc.)
- Allergen information
- Nutritional information
- Item availability scheduling
- Special offers/discounts
- Multi-language support
- Print-friendly menu view
- QR code menu generation
- Online ordering integration
- Popular items highlighting
- Search and filter functionality

## Testing Checklist

- [ ] Create category
- [ ] Create subcategory
- [ ] Create item with all fields
- [ ] Edit category name
- [ ] Edit item price
- [ ] Delete item
- [ ] Delete subcategory (verify items deleted)
- [ ] Delete category (verify cascade)
- [ ] View menu on business profile
- [ ] Switch between category tabs
- [ ] Test on mobile device
- [ ] Test with long item descriptions
- [ ] Test with missing optional fields
- [ ] Verify price formatting
- [ ] Test item images

## Access Points Summary

| User Type | URL | Purpose |
|-----------|-----|---------|
| **Business Owner** | `/user/menu` | Manage own menu |
| **Business Owner** | `/user/dashboard` | Access via "Manage Menu" button |
| **Admin** | `/admin/menu` | View all business menus |
| **Customer** | `/{username}` | View business menu on profile |
| **Public** | `/` | Browse businesses with menus |
