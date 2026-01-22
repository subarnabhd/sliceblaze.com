-- Insert test users with different roles

-- Super Admin
INSERT INTO users (username, email, full_name, password_hash, role, is_active)
VALUES ('admin', 'admin@sliceblaze.com', 'Admin User', 'admin123', 'admin', true);

-- Business Owners
INSERT INTO users (username, email, full_name, password_hash, role, business_id, is_active)
VALUES 
  ('ujamaakoffie', 'owner1@sliceblaze.com', 'Ujamaa Koffie Owner', 'password123', 'owner', 1, true),
  ('pizzaplus', 'owner2@sliceblaze.com', 'Pizza Plus Owner', 'password123', 'owner', 2, true),
  ('sushitown', 'owner3@sliceblaze.com', 'Sushi Town Owner', 'password123', 'owner', 3, true);

-- Regular Users
INSERT INTO users (username, email, full_name, password_hash, role, is_active)
VALUES 
  ('user1', 'user1@example.com', 'John Doe', 'user123', 'user', true),
  ('user2', 'user2@example.com', 'Jane Smith', 'user123', 'user', true),
  ('user3', 'user3@example.com', 'Bob Johnson', 'user123', 'user', true);

-- Test Credentials:
-- Admin: admin / admin123
-- Owner: ujamaakoffie / password123
-- User: user1 / user123
