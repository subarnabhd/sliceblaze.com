-- Create business_wifi table
CREATE TABLE IF NOT EXISTS public.business_wifi (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  ssid VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  security_type VARCHAR(50) DEFAULT 'WPA',
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_business_wifi_business_id ON public.business_wifi(business_id);

-- Add comment to table
COMMENT ON TABLE public.business_wifi IS 'Stores WiFi credentials for businesses';
