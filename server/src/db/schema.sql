CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin','seller','buyer')),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id           UUID NOT NULL REFERENCES users(id),
  name                TEXT NOT NULL,
  sku                 TEXT UNIQUE,
  category            TEXT,
  description         TEXT,
  base_unit           TEXT NOT NULL CHECK (base_unit IN ('g','mL','unit')),
  price_per_base_unit NUMERIC(15,6) NOT NULL,
  stock_in_base_unit  NUMERIC(20,6) NOT NULL DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','rejected')),
  rejection_reason    TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id     UUID NOT NULL REFERENCES users(id),
  seller_id    UUID NOT NULL REFERENCES users(id),
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','processing','fulfilled','cancelled')),
  total_amount NUMERIC(15,2) NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id          UUID NOT NULL REFERENCES products(id),
  display_unit        TEXT NOT NULL,
  display_quantity    NUMERIC(20,6) NOT NULL,
  quantity_base       NUMERIC(20,6) NOT NULL,
  unit_price_snapshot NUMERIC(15,6) NOT NULL,
  line_total          NUMERIC(15,2) NOT NULL
);

-- Seed Admin (password: admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@test.com', '$2b$10$ep/0tW2K0L6A.b4/5QxjueRStk5nO5K0n5W5A.b4/5QxjueRStk5n', 'admin')
ON CONFLICT (email) DO NOTHING;