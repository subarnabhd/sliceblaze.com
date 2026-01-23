-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, is_active) VALUES
('Restaurant', true),
('Cafe', true),
('Food & Beverage', true),
('Hotel', true),
('Retail', true),
('Services', true)
ON CONFLICT (name) DO NOTHING;
