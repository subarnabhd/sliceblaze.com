# SliceBlaze Unified Login Flow

## Overview
All users (Admin, Business Owner, and Regular User) now log in from a **single unified `/login` page** instead of separate login pages.

## Login Entry Point
- **Unified Login Page**: `/login` 
- All other login routes redirect here:
  - `/sliceblaze/login` → redirects to `/login`
  - `/owner/login` → redirects to `/login`

## Authentication Flow

### 1. User Visits `/login`
- Displays username and password form
- Shows test credentials for reference
- Clean, professional SliceBlaze branded UI

### 2. Credential Validation
```typescript
const user = await verifyLogin(username, password)
```
- Function validates username/password against the `users` table
- Returns user object with:
  - `id`: User ID
  - `username`: Username
  - `email`: Email address
  - `role`: admin | owner | user
  - `business_id`: Associated business ID (for owners)
  - `full_name`: User's full name

### 3. Session Creation
```typescript
localStorage.setItem('session', JSON.stringify({
  userId: user.id,
  businessId: user.business_id,
  username: user.username,
  email: user.email,
  role: user.role,
  fullName: user.full_name,
}))
```

### 4. Role-Based Redirect
After successful login, user is redirected based on their role:

| Role | Redirect | Dashboard |
|------|----------|-----------|
| **admin** | `/sliceblaze/admin` | Super Admin Dashboard - Manage all users and businesses |
| **owner** | `/owner/dashboard` | Business Owner Dashboard - Manage business details |
| **user** | `/user/dashboard` | Regular User Dashboard - Browse businesses |

## Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Slicebl@ze2025` |
| Business Owner | `ujamaakoffie` | `password123` |
| Regular User | `user1` | `user123` |

## Dashboard Protections

Each dashboard validates the user's session on load:

### Admin Dashboard (`/sliceblaze/admin/page.tsx`)
```typescript
const session = localStorage.getItem('session')
const user = JSON.parse(session)
if (user.role !== 'admin') {
  router.push('/login') // Redirect if not admin
}
```

### Owner Dashboard (`/owner/dashboard/page.tsx`)
- Checks for `owner` role
- Manages business information and inventory

### User Dashboard (`/user/dashboard/page.tsx`)
- Checks for `user` role
- Browse and filter businesses

## Logout Flow

All dashboards have a logout button that:
1. Clears localStorage session: `localStorage.removeItem('session')`
2. Redirects to `/login`

## Key Features

✅ Single unified login page for all user types
✅ Username/password based authentication
✅ Role-based access control (RBAC)
✅ Session persistence via localStorage
✅ Automatic role-based dashboard routing
✅ Protected routes with role validation
✅ Clean error handling and user feedback
✅ Test credentials displayed for development

## Security Considerations

⚠️ **Development Only**: Current implementation uses plain text passwords
- Before production: Implement bcrypt password hashing
- Add HTTPS/TLS for all connections
- Implement token-based auth (JWT) instead of localStorage
- Add password reset functionality
- Implement session timeout

## Related Files

- [/app/login/page.tsx](app/login/page.tsx) - Unified login page
- [/app/sliceblaze/admin/page.tsx](app/sliceblaze/admin/page.tsx) - Admin dashboard
- [/app/owner/dashboard/page.tsx](app/owner/dashboard/page.tsx) - Owner dashboard
- [/app/user/dashboard/page.tsx](app/user/dashboard/page.tsx) - User dashboard
- [/lib/supabase.js](lib/supabase.js) - Backend authentication functions
