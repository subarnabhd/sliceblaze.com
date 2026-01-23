# User Registration & Authentication System

## Overview

SliceBlaze has a complete user authentication and registration system that allows business owners to:
1. Register a new account
2. Login to their account  
3. Manage their business profile
4. Add and edit business information

## User Registration & Login Flows

### Registration Flow

**URL:** `/register`

**Fields:**
- Full Name
- Email Address
- Username
- Password (minimum 6 characters)
- Confirm Password

**Validation:**
- All fields required
- Passwords must match
- Password minimum 6 characters
- Email uniqueness check
- Username availability check

**On Success:**
- User record created in `users` table with role='owner'
- Session automatically created
- Redirected to `/user/my-businesses`

### User Login Flow

**URL:** `/sliceblaze/login`

**Fields:**
- Email Address
- Password

**Process:**
1. User enters credentials
2. System validates against `users` table
3. If valid credentials:
   - Session created in localStorage
   - Redirected to `/user/my-businesses`
4. If invalid:
   - Error message displayed

### Business Owner Dashboard

**URL:** `/user/my-businesses`

**Features:**
- View all businesses for the logged-in user
- Edit business details via modal
- Add new business button
- Logout button
- User welcome message with full name

**Session Check:**
- Redirects to `/sliceblaze/login` if not authenticated

### Add Business Page

**URL:** `/user/add-business`

**Form Fields:**
- Business Name (required)
- Username/Handle (required)
- Category (required, dropdown from database)
- Location
- Contact Number
- Opening Hours
- Description
- Facebook URL
- Instagram URL
- Menu URL
- Brand Primary Color
- Brand Secondary Color

**On Submission:**
- Creates business record in `businesses` table
- Redirects to `/user/my-businesses`

## Session Management

### Session Structure

Sessions stored in browser's `localStorage` as JSON:

```json
{
  "userId": 1,
  "username": "business_username",
  "email": "owner@example.com",
  "role": "owner",
  "fullName": "Business Owner Name"
}
```

### Session Key
- Key: `'session'`
- Location: Browser localStorage

### Session Retrieval

Protected pages check session:

```typescript
const session = localStorage.getItem('session')
if (!session) {
  router.push('/sliceblaze/login')
  return
}

const userData = JSON.parse(session)
setUser(userData)
```

### Logout

- Removes session from localStorage
- Redirects to `/sliceblaze/login`

## Test Accounts

### Business Owner
- **Email:** owner1@example.com  
- **Password:** password123
- **Role:** owner
- **Dashboard:** `/user/my-businesses`

### Admin Account
- **Email:** admin@sliceblaze.com
- **Password:** Slicebl@ze2025
- **Role:** admin
- **Dashboard:** `/admin/dashboard`

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  password_hash VARCHAR(255),
  role VARCHAR(50), -- 'admin', 'owner', 'user'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);
```

### Businesses Table

```sql
CREATE TABLE businesses (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE,
  category VARCHAR(100),
  location VARCHAR(255),
  contact VARCHAR(20),
  description TEXT,
  openingHours VARCHAR(100),
  image VARCHAR(255),
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  tiktok VARCHAR(255),
  menuUrl VARCHAR(255),
  googleMapUrl VARCHAR(255),
  direction TEXT,
  wifiQrCode VARCHAR(255),
  brandPrimaryColor VARCHAR(7),
  brandSecondaryColor VARCHAR(7),
  created_at TIMESTAMP
);
```

### Categories Table

```sql
CREATE TABLE categories (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP
);
```

## Routes & Pages

| Page | URL | Type | Status |
|------|-----|------|--------|
| Registration | `/register` | Public | ✅ Active |
| User Login | `/sliceblaze/login` | Public | ✅ Active |
| My Businesses | `/user/my-businesses` | Protected | ✅ Active |
| Add Business | `/user/add-business` | Protected | ✅ Active |
| Auth Info | `/auth` | Public | ✅ Active |
| Admin Login | `/admin` | Public | ✅ Active |
| Admin Dashboard | `/admin/dashboard` | Protected | ✅ Active |
| Search | `/search` | Public | ✅ Active |

## File Structure

```
app/
├── register/
│   └── page.tsx                    # User registration
├── sliceblaze/
│   └── login/
│       └── page.tsx                # User login
├── user/
│   ├── my-businesses/
│   │   └── page.tsx                # User dashboard
│   └── add-business/
│       └── page.tsx                # Add business form
├── auth/
│   └── page.tsx                    # Auth info page
├── admin/
│   ├── page.tsx                    # Admin login
│   ├── layout.tsx                  # Admin layout
│   └── dashboard/
│       └── page.tsx                # Admin dashboard
└── [other routes...]
```

## Code Examples

### Check Session & Redirect

```typescript
useEffect(() => {
  const session = localStorage.getItem('session')
  if (!session) {
    router.push('/sliceblaze/login')
    return
  }

  const userData = JSON.parse(session)
  setUser(userData)
}, [router])
```

### Create Session After Login

```typescript
// Set session after successful login
localStorage.setItem('session', JSON.stringify({
  userId: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  fullName: user.full_name
}))

// Redirect to dashboard
router.push('/user/my-businesses')
```

### Logout

```typescript
const handleLogout = () => {
  localStorage.removeItem('session')
  router.push('/sliceblaze/login')
}
```

## Security Considerations

⚠️ **Current Implementation Notes:**
- Passwords stored as plaintext (NOT FOR PRODUCTION)
- Sessions use localStorage (vulnerable to XSS)
- No token expiration
- No password hashing

### Recommended Production Improvements

1. **Password Hashing:**
   ```typescript
   import bcrypt from 'bcrypt'
   const hash = await bcrypt.hash(password, 10)
   ```

2. **Secure Session Management:**
   - Use HTTP-only cookies
   - Implement JWT tokens with expiration
   - Add CSRF protection

3. **Additional Security:**
   - Rate limiting on login
   - Email verification
   - Password reset flow
   - Account lockout after failed attempts

## Troubleshooting

### User Can't Login
- Verify email and password match database
- Check user exists in `users` table
- Verify `is_active` is true
- Clear localStorage and try again

### Registration Fails
- Ensure all fields completed
- Check email not already registered
- Verify username available
- Confirm password is 6+ characters

### Session Lost
- Check localStorage not cleared
- Verify session JSON is valid
- Check page checking for session

## Future Features

- Email verification
- Password reset
- Profile editing
- Multi-business support
- Business owner hierarchy
- Analytics & statistics
- Customer reviews
- Reservation system
