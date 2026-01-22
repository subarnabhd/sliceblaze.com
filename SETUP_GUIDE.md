# SliceBlaze Setup Guide - Role-Based Authentication

## 🎯 What's New

Your SliceBlaze application now has a complete role-based authentication system with three user types:

- **👨‍💼 Super Admin** - Can manage all users and businesses
- **🏪 Business Owner** - Can update their business information
- **👤 Regular User** - Can browse and view businesses

## 🚀 Quick Start

### 1. Update Supabase Database

Go to [Supabase Dashboard](https://app.supabase.com) → SQL Editor and run this SQL:

```sql
-- Create improved users table with roles
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

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Insert Test Users

Copy and paste the contents of `supabase-insert-users.sql` in the SQL Editor:

**Test Credentials:**
- Admin: `admin` / `admin123`
- Business Owner: `ujamaakoffie` / `password123`
- Regular User: `user1` / `user123`

### 3. Test the Application

1. Navigate to `/sliceblaze/login`
2. Try logging in with the test credentials above
3. Verify you're redirected to the correct dashboard:
   - Admin → `/sliceblaze/admin`
   - Owner → `/owner/dashboard`
   - User → `/user/dashboard`

## 📁 New Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/sliceblaze/login` | Public | Unified login for all user types |
| `/sliceblaze/admin` | Admin Only | Manage users and businesses |
| `/owner/dashboard` | Owner Only | Edit business details |
| `/user/dashboard` | User Only | Browse businesses |

## 👤 User Roles

### Super Admin (`admin`)
- View all users in the system
- Create new users with any role
- Activate/Deactivate users
- Delete users
- View all businesses and their owners

### Business Owner (`owner`)
- Login with `/sliceblaze/login`
- Edit all their business details
- Update brand colors
- Manage social media links
- Update menu and WiFi QR codes
- Changes are immediately visible on their public profile

### Regular User (`user`)
- Browse all businesses
- Search and filter businesses
- View detailed business information
- No admin or editing capabilities

## 🔐 Key Files

| File | Purpose |
|------|---------|
| `app/sliceblaze/login/page.tsx` | Main login page for all users |
| `app/sliceblaze/admin/page.tsx` | Super admin dashboard |
| `app/owner/dashboard/page.tsx` | Owner dashboard (uses new session) |
| `app/user/dashboard/page.tsx` | User browsing dashboard |
| `lib/supabase.js` | Updated with admin functions |
| `AUTHENTICATION.md` | Full authentication documentation |

## 🔄 Session Management

Sessions are stored in `localStorage`:

```javascript
localStorage.getItem('session') // Returns:
{
  userId: 1,
  businessId: null,
  username: "admin",
  email: "admin@sliceblaze.com",
  role: "admin",
  fullName: "Admin User"
}
```

## ⚠️ Important Notes

### Security ⚠️
- **Passwords are stored as plain text** - Implement bcrypt hashing before production
- Use HTTPS only in production
- Add session expiration logic

### Old Routes
- `/owner/login` now redirects to `/sliceblaze/login`
- Old session key `ownerSession` is replaced with `session`

### Supabase Schema
- Users table now includes `role` column
- All users must have a role (admin, owner, or user)
- Business owners have a `business_id` foreign key

## 🎓 How to Use

### For Admin Users
1. Login with `admin` / `admin123` at `/sliceblaze/login`
2. You'll see the admin dashboard with:
   - **Users Tab**: Manage all users
   - **Businesses Tab**: View all businesses

### For Business Owners
1. Login with owner credentials at `/sliceblaze/login`
2. Edit business details in the dashboard
3. Changes save to Supabase immediately
4. Changes are visible on public profile: `/business/[username]`

### For Regular Users
1. Login with user credentials at `/sliceblaze/login`
2. Browse businesses in the user dashboard
3. Click any business to view details

## 🐛 Troubleshooting

**Login fails with "Invalid username or password"**
- Check that users were inserted in Supabase
- Verify username matches exactly (case-sensitive in current implementation)
- Check password matches (currently plain text)

**Can't access admin dashboard**
- Verify you logged in with admin account
- Check browser console for errors
- Verify Supabase connection in `.env.local`

**Business owner can't edit details**
- Verify user has `role: 'owner'` in database
- Verify `business_id` is set for the user
- Check Supabase permissions

## 📚 Documentation

For more details, see:
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Full authentication system documentation
- [lib/supabase.js](./lib/supabase.js) - All API functions with comments

## ✅ Checklist

- [ ] Run SQL to create users table with role column
- [ ] Insert test users using supabase-insert-users.sql
- [ ] Test admin login: `admin` / `admin123`
- [ ] Test owner login: `ujamaakoffie` / `password123`
- [ ] Test user login: `user1` / `user123`
- [ ] Verify admin can manage users
- [ ] Verify owner can edit business
- [ ] Verify user can browse businesses
- [ ] ⚠️ TODO: Implement password hashing before production

## 🚀 Next Steps

1. Test the application with provided credentials
2. Create additional test users in admin dashboard
3. Test business owner editing workflow
4. Implement proper password hashing (bcrypt)
5. Add session expiration and refresh tokens
6. Set up image upload for business profiles

---

**Questions?** Check [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed documentation.
