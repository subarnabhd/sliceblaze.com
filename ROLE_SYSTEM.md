# Role-Based Access Control System

## User Roles

### 1. Admin
**Location**: `/admin/*` routes

**Capabilities**:
- Full access to admin panel
- Create, edit, view, and delete ALL businesses
- Assign businesses to users
- Manage users (create, edit, view, delete)
- Manage categories
- Manage menu items across all businesses
- Manage WiFi networks across all businesses
- View comprehensive statistics and analytics

**Access Control**:
- Login: Hardcoded credentials (admin/admin1234)
- Session: `localStorage.getItem('adminSession')`
- Routes protected by admin session check

### 2. Owner (Business Owner)
**Definition**: A user who has created a business OR has been assigned a business by admin

**How to become an Owner**:
1. User creates a business from their dashboard → automatically becomes owner (user_id assigned)
2. Admin assigns an existing business to a user → user becomes owner (user_id updated)

**Capabilities**:
- View their own businesses in dashboard
- Edit ONLY their own businesses (where user_id matches)
- Manage menu items for their businesses
- Manage WiFi settings for their businesses
- Create new businesses (becoming owner of those too)

**Cannot do**:
- View other users' businesses
- Edit businesses they don't own
- Access admin panel
- Manage other users

### 3. Regular User
**Definition**: Any registered user without businesses

**Capabilities**:
- Browse and explore businesses on the site
- View business profiles
- Search for businesses
- Create a business (becomes Owner upon creation)

**Cannot do**:
- View dashboard content without creating a business
- Access admin panel
- Manage businesses

---

## Database Structure

### businesses Table
```sql
- id (primary key)
- name
- username (unique)
- user_id (foreign key → users.id) -- Owner of this business
- category
- address
- phone
- email
- description
- website
- logo_url
- cover_image_url
- opening_hours
- primary_color
- secondary_color
- facebook_url
- instagram_url
- twitter_url
- is_active
- created_at
```

### users Table
```sql
- id (primary key)
- username (unique)
- email (unique)
- full_name
- password_hash
- role (user | admin | owner) -- Note: owner status is determined by having businesses
- is_active
- created_at
```

---

## Implementation Details

### User Dashboard (`/dashboard`)
**Access**: Logged-in users only
**Data Fetching**:
```typescript
// Only fetch businesses owned by logged-in user
const { data } = await supabase
  .from('businesses')
  .select('*')
  .eq('user_id', userId)  // Filter by owner
```

**Features**:
- Shows statistics for user's businesses only
- Lists only businesses where user is the owner
- Quick actions to create/manage own businesses

### My Businesses Page (`/my-businesses`)
**Access**: Logged-in users only
**Data Fetching**:
```typescript
const { data } = await supabase
  .from('businesses')
  .select('*')
  .eq('user_id', userId)  // Owner filter
  .order('name')
```

**Features**:
- Display only businesses owned by the user
- Edit functionality restricted to owned businesses
- Cannot see or modify other users' businesses

### Add Business Page (`/add-business`)
**Access**: Logged-in users only
**Business Creation**:
```typescript
const businessData = {
  // ... other fields
  user_id: userData.id  // Automatically assign to creator
}
```

**Result**: User becomes owner of the created business

### Admin Business Management (`/admin/business-management`)
**Access**: Admin only
**Data Fetching**:
```typescript
// Fetch ALL businesses (no user_id filter)
const { data } = await supabase
  .from('businesses')
  .select('*')
```

**Features**:
- View all businesses regardless of owner
- Edit any business
- Assign/reassign businesses to users
- When assigning, updates `user_id` field to new owner

---

## Session Management

### User Session
**Storage**: `localStorage.setItem('userSession', JSON.stringify(userData))`

**Structure**:
```typescript
{
  id: number
  username: string
  email: string
  full_name: string
}
```

### Admin Session
**Storage**: `localStorage.setItem('adminSession', 'true')`

**Check**: Simple boolean check for admin access

---

## Navigation & UI

### Header Dropdown (Logged-in Users)
- Dashboard (view their businesses)
- My Businesses (manage owned businesses)
- View Profile (public profile page)
- Logout

### Protected Routes
**User Routes** (`/dashboard`, `/my-businesses`, `/add-business`):
- Check for `userSession` in localStorage
- Redirect to `/login` if not found

**Admin Routes** (`/admin/*`):
- Check for `adminSession` in localStorage
- Redirect to `/admin` (login) if not found

---

## Key Security Principles

1. **Data Isolation**: Users can only query businesses with matching `user_id`
2. **No Cross-User Access**: Database queries filter by owner
3. **Admin Separation**: Admin panel completely separate from user dashboard
4. **Session-Based Auth**: Local storage sessions for both user and admin
5. **Ownership Assignment**: Business ownership tracked via `user_id` foreign key

---

## Workflow Examples

### Scenario 1: New User Creates Business
1. User registers → role: 'user'
2. User navigates to `/add-business`
3. User fills form and submits
4. Business created with `user_id = user.id`
5. User now sees business in dashboard (becomes owner)

### Scenario 2: Admin Assigns Business
1. Admin creates business OR selects existing business
2. Admin uses "Assign to User" dropdown
3. Selects target user from list
4. Updates business `user_id` to selected user's ID
5. Target user now sees business in their dashboard (becomes owner)

### Scenario 3: User Views Dashboard
1. User logs in
2. Dashboard queries: `WHERE user_id = currentUser.id`
3. Shows only businesses owned by that user
4. Cannot see businesses owned by others
5. Edit buttons only work on their businesses

---

## File Changes Made

### Updated Files:
1. `/app/(user)/dashboard/page.tsx` - Only show user's businesses
2. `/app/(user)/my-businesses/page.tsx` - Filter by user_id
3. `/app/(user)/add-business/page.tsx` - Auto-assign user_id on creation
4. `/components/Header.tsx` - Updated dropdown navigation
5. `/app/admin/business-management/page.tsx` - Admin can assign businesses
6. `/app/admin/overview/page.tsx` - Shows all businesses stats

---

## Testing Checklist

- [ ] User can create business and becomes owner
- [ ] User only sees their own businesses in dashboard
- [ ] User cannot access other users' businesses
- [ ] Admin can assign business to user
- [ ] Assigned business appears in user's dashboard
- [ ] User can edit assigned business
- [ ] Admin can see all businesses
- [ ] Sessions properly maintained across page refreshes
