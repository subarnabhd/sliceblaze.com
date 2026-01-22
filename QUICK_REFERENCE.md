# SliceBlaze Quick Reference Card

## 🔑 Test Credentials

```
Admin:  admin / admin123
Owner:  ujamaakoffie / password123
User:   user1 / user123
```

## 🌐 Routes by Role

| Route | Admin | Owner | User | Guest |
|-------|:-----:|:-----:|:----:|:-----:|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/business` | ✅ | ✅ | ✅ | ✅ |
| `/business/[username]` | ✅ | ✅ | ✅ | ✅ |
| `/sliceblaze/login` | ✅ | ✅ | ✅ | ✅ |
| `/sliceblaze/admin` | ✅ | ❌ | ❌ | ❌ |
| `/owner/dashboard` | ❌ | ✅ | ❌ | ❌ |
| `/user/dashboard` | ❌ | ❌ | ✅ | ❌ |
| `/owner/login` | Redirects to `/sliceblaze/login` |

## 🔄 Login Flow

```
1. Go to /sliceblaze/login
2. Enter username and password
3. verifyLogin() checks credentials
4. Session stored in localStorage
5. Redirect based on role:
   - admin    → /sliceblaze/admin
   - owner    → /owner/dashboard
   - user     → /user/dashboard
```

## 👥 Admin Dashboard

**Tab: Users**
- List all users with role, status, and business
- Toggle user active/inactive status
- Delete users
- Create new users via modal

**Tab: Businesses**
- View all businesses
- See business owner information
- Click "View" to see public profile

**Create User Form:**
- Username (required, unique)
- Email (required, unique)
- Full Name (optional)
- Password (required)
- Role (user, owner, admin)
- Business ID (if owner role)

## 💼 Owner Dashboard

**Edit Fields:**
- Name, Location, Category
- Contact, Opening Hours, Direction
- Facebook, Instagram, TikTok
- Google Maps URL, Menu URL
- WiFi QR Code
- Brand Primary Color (color picker)
- Brand Secondary Color (color picker)
- Description

**Actions:**
- Save Changes → updates in Supabase
- Reset → revert to last saved
- Logout → clears session, redirects to login

## 👤 User Dashboard

**Features:**
- Search bar for businesses
- Business cards in responsive grid
- Click card to view details
- Filter by name/category/location
- View count of matching businesses

**Business Card Shows:**
- Business image
- Name, Category, Location
- Brief description
- Brand-colored "View Details" button

## 🗄️ Database

### Users Table
```
id          SERIAL PRIMARY KEY
business_id INT (nullable)
email       TEXT UNIQUE
username    TEXT UNIQUE
password_hash TEXT
role        TEXT (admin|owner|user)
full_name   TEXT
is_active   BOOLEAN DEFAULT TRUE
created_at  TIMESTAMP DEFAULT NOW()
updated_at  TIMESTAMP DEFAULT NOW()
```

### Indexes
- `idx_users_username` on username
- `idx_users_email` on email
- `idx_users_role` on role

## 🛠️ API Functions (lib/supabase.js)

### Authentication
```javascript
verifyLogin(username, password)
// Returns: { id, business_id, username, email, role, full_name, is_active }
```

### Business
```javascript
getBusinesses()                          // Get all
getBusinessByUsername(username)          // Single by username
getBusinessById(id)                      // Single by ID
updateBusiness(businessId, updates)      // Save changes
getAllBusinessesAdmin()                  // With owner info
```

### User Management (Admin)
```javascript
getAllUsers()                            // List all
createUser(userData)                     // Create new
updateUser(userId, updates)              // Edit
deleteUser(userId)                       // Remove
getUserBusiness(userId)                  // With business
```

## 💾 Session Storage

Key: `'session'` in localStorage

```javascript
{
  userId: 1,
  businessId: 2,
  username: "ujamaakoffie",
  email: "owner@example.com",
  role: "owner",
  fullName: "Owner Name"
}
```

## 🔐 Security Notes

⚠️ **Before Production:**
- [ ] Implement bcrypt for password hashing
- [ ] Add session expiration (currently no timeout)
- [ ] Use HTTPS only
- [ ] Add CSRF protection
- [ ] Implement rate limiting on login
- [ ] Add email verification
- [ ] Set up password reset flow

## 📊 File Structure

```
sliceblaze/
├── app/
│   ├── sliceblaze/
│   │   ├── login/
│   │   │   └── page.tsx        ← Unified login
│   │   └── admin/
│   │       └── page.tsx        ← Admin dashboard
│   ├── owner/
│   │   ├── login/
│   │   │   └── page.tsx        ← Redirects to /sliceblaze/login
│   │   └── dashboard/
│   │       └── page.tsx        ← Owner dashboard
│   ├── user/
│   │   └── dashboard/
│   │       └── page.tsx        ← User dashboard
│   └── business/
│       ├── page.tsx            ← Business listing
│       └── [username]/
│           └── page.tsx        ← Business profile
├── lib/
│   └── supabase.js             ← API functions
├── SETUP_GUIDE.md              ← Setup instructions
├── AUTHENTICATION.md           ← Full docs
└── supabase-insert-users.sql   ← Test data
```

## 🧪 Testing Checklist

- [ ] Admin login and dashboard access
- [ ] Create new user as admin
- [ ] Deactivate/activate user as admin
- [ ] Delete user as admin
- [ ] Owner login and dashboard access
- [ ] Edit business details as owner
- [ ] Save changes and verify update
- [ ] Logout as owner
- [ ] User login and dashboard access
- [ ] Search and filter businesses
- [ ] View business details as user
- [ ] Logout as user

## 🐛 Debugging Tips

**Login Fails**
- Check localStorage: `localStorage.getItem('session')`
- Check browser console for errors
- Verify user exists in Supabase
- Verify password matches (currently plain text)

**Access Denied**
- Check user role: `JSON.parse(localStorage.getItem('session')).role`
- Verify role matches route requirements
- Check is_active status in database

**Data Not Updating**
- Check Supabase connection in `.env.local`
- Verify user has correct business_id
- Check browser console for API errors
- Inspect Network tab for failed requests

## 📞 Support

See documentation:
- **SETUP_GUIDE.md** - Quick start
- **AUTHENTICATION.md** - Complete docs
- **IMPLEMENTATION_SUMMARY.md** - Technical details

---

**Last Updated:** January 23, 2026
**Status:** ✅ Complete (Security hardening needed before production)
