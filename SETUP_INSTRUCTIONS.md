# 🚀 Supabase Database Setup Instructions

## Step 1: Create Users Table in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `yjgjygdavifobzopkdfu`
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Create users table with roles
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  business_id INT REFERENCES businesses(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'owner', 'user')) DEFAULT 'user',
  full_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
```

6. Click **Run** (or Ctrl+Enter)
7. You should see ✅ success message

## Step 2: Insert Test Users

1. Click **New Query** again
2. Copy and paste this SQL:

```sql
-- Insert test users with different roles

-- Super Admin
INSERT INTO users (username, email, full_name, password_hash, role, is_active)
VALUES ('admin', 'admin@sliceblaze.com', 'Admin User', 'Slicebl@ze2025', 'admin', true);

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
```

3. Click **Run**
4. You should see ✅ success message with "7 rows inserted"

## Step 3: Verify Database (Optional but Recommended)

1. Go to **Table Editor** (left sidebar)
2. Select the `users` table
3. You should see all 7 users listed:
   - 1 admin (admin)
   - 3 owners (ujamaakoffie, pizzaplus, sushitown)
   - 3 users (user1, user2, user3)

## Step 4: Test the Login System

1. Go to `http://localhost:3000/login`
2. Try these credentials:

### Admin Login
- Username: `admin`
- Password: `Slicebl@ze2025`
- Expected: Redirects to `/sliceblaze/admin` (Admin Dashboard)

### Owner Login
- Username: `ujamaakoffie`
- Password: `password123`
- Expected: Redirects to `/owner/dashboard` (Owner Dashboard)

### User Login
- Username: `user1`
- Password: `user123`
- Expected: Redirects to `/user/dashboard` (User Dashboard)

## 🔍 Troubleshooting

### Login says "Invalid username or password"

1. Go to `http://localhost:3000/debug`
2. This page will show:
   - All users in the database
   - Database columns
   - Test login functionality

3. Check:
   - Are users showing in the table?
   - Is the `username` column there?
   - Do passwords match exactly?

### Users table doesn't exist

1. Go back to Supabase SQL Editor
2. Run the CREATE TABLE query from Step 1
3. Make sure you see ✅ success message

### Still having issues?

Check browser console (F12 → Console tab) when attempting login. You'll see detailed error messages.

## 📋 Test Credentials Summary

| Role | Username | Password | Expected Dashboard |
|------|----------|----------|-------------------|
| Admin | `admin` | `Slicebl@ze2025` | `/sliceblaze/admin` |
| Owner | `ujamaakoffie` | `password123` | `/owner/dashboard` |
| User | `user1` | `user123` | `/user/dashboard` |

## ✅ Checklist

- [ ] Create users table in Supabase (Step 1)
- [ ] Insert test users (Step 2)
- [ ] Verify table in Table Editor (Step 3 - Optional)
- [ ] Test admin login
- [ ] Test owner login
- [ ] Test user login
- [ ] Each user sees correct dashboard
- [ ] Try logout and login again

---

**After setup is complete, you should be able to:**
1. Visit `/login`
2. Enter credentials for any user type
3. See the appropriate dashboard based on role
4. Logout and login with different user to see different dashboard
