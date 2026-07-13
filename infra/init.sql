-- init.sql: cria tabelas básicas e um usuário admin de seed

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  number TEXT,
  plate TEXT,
  model TEXT,
  year INT,
  km INT DEFAULT 0,
  unit TEXT,
  status TEXT,
  last_review DATE,
  next_review DATE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  number TEXT,
  date TIMESTAMP,
  vehicle_id INT REFERENCES vehicles(id),
  problem TEXT,
  service TEXT,
  responsible TEXT,
  parts TEXT,
  cost NUMERIC(12,2) DEFAULT 0,
  downtime_minutes INT DEFAULT 0,
  status TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Seed admin
INSERT INTO users (name, email, password, role) VALUES
('Admin Inicial', 'admin@exemplo.local', 'Admin123!', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
