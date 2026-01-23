# SliceBlaze - Role-Based Authentication System

## Overview

SliceBlaze now features a comprehensive role-based authentication system with three user types:

1. **Super Admin** - Manages all user data and businesses
2. **Business Owner** - Can login and manage their business details
3. **Regular User** - Can browse and view businesses

## Database Schema

### Users Table

```sql
CREATE TABLE users (
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
```

### Roles

| Role | Access | Features |
|------|--------|----------|
| **admin** | Super Admin Dashboard | View all users, create users, deactivate users, delete users, manage businesses |
| **owner** | Owner Dashboard | Edit own business details, update brand colors, manage menu/WiFi QR, update social media |
| **user** | User Dashboard | Browse all businesses, search & filter, view business details |

## Authentication Flow

```
User/Owner/Admin
    ↓
/sliceblaze/login (Unified Login)
    ↓
verifyLogin(username, password)
    ↓
localStorage.setItem('session', {...})
    ↓
Redirect Based on Role:
  - admin → /sliceblaze/admin
  - owner → /owner/dashboard
  - user  → /user/dashboard
```

## Routes

### Public Routes
- `/` - Home page
- `/business` - Browse all businesses
- `/business/[username]` - View specific business profile
- `/sliceblaze/login` - Unified login page

### Protected Routes

#### Super Admin
- `/sliceblaze/admin` - Admin dashboard (requires role: 'admin')
  - Manage all users
  - View all businesses
  - Create new users
  - Deactivate/Activate users
  - Delete users

#### Business Owner
- `/owner/dashboard` - Business dashboard (requires role: 'owner')
  - Edit business name, location, category
  - Update contact information
  - Manage opening hours
  - Update social media links
  - Change brand colors
  - Update menu URL
  - Update WiFi QR code

#### Regular User
- `/user/dashboard` - User dashboard (requires role: 'user')
  - Browse all businesses
  - Search and filter
  - View detailed business information

## Test Credentials

### Super Admin
```
Username: admin
Password: Slicebl@ze2025
```

### Business Owner
```
Username: ujamaakoffie
Password: password123
```

### Regular User
```
Username: user1
Password: user123
```

## Session Management

Sessions are stored in `localStorage` with the following structure:

```javascript
{
  userId: number,
  businessId: number | null,
  username: string,
  email: string,
  role: 'admin' | 'owner' | 'user',
  fullName: string
}
```

**Session Key:** `'session'`

## API Functions (lib/supabase.js)

### Authentication
- `verifyLogin(username, password)` - Verify credentials and return user info

### Business Functions
- `getBusinesses()` - Get all businesses
- `getBusinessByUsername(username)` - Get specific business
- `getBusinessById(id)` - Get business by ID
- `updateBusiness(businessId, updates)` - Update business details
- `getAllBusinessesAdmin()` - Get all businesses with owner info (admin only)

### User Management (Admin Only)
- `getAllUsers()` - Get all users with business details
- `createUser(userData)` - Create new user
- `updateUser(userId, updates)` - Update user info
- `deleteUser(userId)` - Delete user
- `getUserBusiness(userId)` - Get user with business details

## Security Notes

⚠️ **IMPORTANT FOR PRODUCTION**

1. **Password Hashing** - Currently uses plain text comparison
   - Implement bcrypt or similar before deploying to production
   - Hash passwords both on creation and during login

2. **Environment Variables** - Keep Supabase credentials in `.env.local`
   - Never commit to version control
   - Use different keys for dev/prod

3. **Session Expiration** - Current implementation has no timeout
   - Add session expiration logic
   - Implement refresh tokens

4. **HTTPS Only** - Always use HTTPS in production
   - Set secure cookie flags
   - Use httpOnly cookies if possible

## Setup Instructions

### 1. Update Supabase Schema

Run the following SQL in Supabase SQL Editor:

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

Run [supabase-insert-users.sql](./supabase-insert-users.sql) in Supabase SQL Editor

### 3. Test the System

1. Go to `/sliceblaze/login`
2. Try different credentials:
   - Admin: `admin` / `Slicebl@ze2025` → redirects to `/sliceblaze/admin`
   - Owner: `ujamaakoffie` / `password123` → redirects to `/owner/dashboard`
   - User: `user1` / `user123` → redirects to `/user/dashboard`

## File Structure

```
app/
├── sliceblaze/
│   ├── login/
│   │   └── page.tsx          # Unified login page
│   └── admin/
│       └── page.tsx          # Super admin dashboard
├── owner/
│   ├── login/
│   │   └── page.tsx          # Redirects to /sliceblaze/login
│   └── dashboard/
│       └── page.tsx          # Owner dashboard
├── user/
│   └── dashboard/
│       └── page.tsx          # User dashboard
└── business/
    ├── page.tsx              # Business listing
    └── [username]/
        └── page.tsx          # Business detail

lib/
└── supabase.js               # Supabase utility functions
```

## Implementation Details

### Role-Based Access Control (RBAC)

Each protected route checks the session in `useEffect`:

```typescript
useEffect(() => {
  const session = localStorage.getItem('session')
  if (!session) {
    router.push('/sliceblaze/login')
    return
  }

  const user = JSON.parse(session)
  
  // Check if user has correct role
  if (user.role !== 'admin') {
    router.push('/business')
    return
  }
  
  // Load page content
}, [router])
```

### Admin Dashboard Features

- **Users Tab**: View all users, toggle active status, delete users, create new users
- **Businesses Tab**: View all businesses with owner information
- **Create User Modal**: Form to create new users with role selection

### Owner Dashboard Features

- **Edit all business details**
- **Brand color pickers** for primary and secondary colors
- **Real-time form updates**
- **Save/Reset/Logout buttons**
- **Success/Error messages**

### User Dashboard Features

- **Search and filter** businesses
- **View business cards** with images
- **Click to view details**
- **Brand-colored action buttons**

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Session timeout/expiration
- [ ] Image upload for business profiles
- [ ] Advanced admin analytics
- [ ] Activity logs and audit trail
- [ ] Role-based permissions system (more granular)
- [ ] API key generation for developers
- [ ] Webhook support for integrations

## Support

For issues or questions:
1. Check the test credentials in [supabase-insert-users.sql](./supabase-insert-users.sql)
2. Verify Supabase connection in `.env.local`
3. Check browser console for error messages
4. Verify users exist in Supabase dashboard
