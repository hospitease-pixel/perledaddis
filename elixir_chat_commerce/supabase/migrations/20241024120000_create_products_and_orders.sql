-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('For Her', 'For Him', 'Unisex')),
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
-- Public can read products
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

-- Authenticated users (admins) can manage products
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for orders
-- Public can insert orders (for checkout)
CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Authenticated users (admins) can view orders
CREATE POLICY "Authenticated users can view orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');
