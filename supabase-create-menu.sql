-- Create menu_categories table
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_subcategories table
CREATE TABLE IF NOT EXISTS public.menu_subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
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

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_menu_categories_business_id ON public.menu_categories(business_id);
CREATE INDEX IF NOT EXISTS idx_menu_subcategories_category_id ON public.menu_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_subcategory_id ON public.menu_items(subcategory_id);

-- Add comments to tables
COMMENT ON TABLE public.menu_categories IS 'Main menu categories for businesses (e.g., Appetizers, Main Course)';
COMMENT ON TABLE public.menu_subcategories IS 'Subcategories within menu categories (e.g., Vegetarian, Non-Vegetarian)';
COMMENT ON TABLE public.menu_items IS 'Individual menu items with name, description, and price';
