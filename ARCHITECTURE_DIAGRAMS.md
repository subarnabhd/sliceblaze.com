# SliceBlaze Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SliceBlaze App                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             /sliceblaze/login (Unified)                 │  │
│  │         ↓ Verify Credentials ↓                          │  │
│  │  ┌──────────────────────────────────────────────┐       │  │
│  │  │    localStorage.setItem('session', {})       │       │  │
│  │  └──────────────────────────────────────────────┘       │  │
│  └────────┬──────────────────┬──────────────────┬─────────┘  │
│           │                  │                  │             │
│    ┌──────▼───────┐  ┌───────▼────────┐  ┌────▼──────────┐  │
│    │   Admin      │  │    Owner       │  │    User       │  │
│    │   role       │  │    role        │  │   role        │  │
│    │ (admin)      │  │  (owner)       │  │  (user)       │  │
│    └──────┬───────┘  └────────┬───────┘  └────┬──────────┘  │
│           │                   │               │              │
│    ┌──────▼──────────┐  ┌────▼────────┐  ┌───▼───────────┐  │
│    │ /sliceblaze/    │  │   /owner/   │  │ /user/        │  │
│    │ admin           │  │  dashboard  │  │ dashboard     │  │
│    │ - Users Tab     │  │ - Edit all  │  │ - Browse      │  │
│    │ - Businesses    │  │   details   │  │ - Search      │  │
│    │   Tab           │  │ - Color     │  │ - Filter      │  │
│    │                 │  │   picker    │  │ - View detail │  │
│    └─────────────────┘  └─────────────┘  └───────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    Supabase       │
                    │  (PostgreSQL)     │
                    │                   │
                    │  - users table    │
                    │  - businesses tbl │
                    └───────────────────┘
```

## Authentication Flow

```
User Visits App
      │
      ▼
Check localStorage.getItem('session')
      │
  ┌───┴───────────────────────────────┐
  │                                   │
  NO SESSION                    SESSION EXISTS
  │                                   │
  ▼                                   ▼
Redirect to              Check role & redirect
/sliceblaze/login              │
  │                       ┌────┼────┬──────┐
  ▼                       │    │    │      │
User enters              ADM  OWN  USR   SUPER
credentials              │    │    │     (all other)
  │                      │    │    │
  ▼                      ▼    ▼    ▼
verifyLogin()        /SB/   /own/ /usr/
  │                  adm    dash  dash
  │
  ▼
Check password
  │
┌─┴─────────┐
│           │
✓           ✗
│           │
▼           ▼
Store  Error
session Message
│
▼
Redirect
(based on role)
```

## Database Schema Relationship

```
┌──────────────────────┐
│      users           │
├──────────────────────┤
│ id (PK)              │
│ username (UNIQUE)    │
│ email (UNIQUE)       │
│ password_hash        │
│ role ┐               │ ◄───────────────┐
│      │(admin         │                 │
│      │ owner ──────┐ │ ┌──────────────────────────┐
│      │ user)       │ │ │   businesses            │
│ full_name           │ │ ├──────────────────────────┤
│ business_id ────────┼─┼─┼─► id (PK)              │
│ is_active           │ │ │   username              │
│ created_at          │ │ │   name                  │
└──────────────────────┘ │ │   ... (other fields)   │
                         │ │                        │
                         └─┼─ owner_id (FK)        │
                           │                        │
                           └──────────────────────┘

Relationship:
- One Business has One Owner (User with role='owner')
- One User (owner) can own One Business
- Multiple Users can have role='user' or 'admin'
```

## State Management Flow

```
┌────────────────────────────────────────────────────────┐
│             React Component State                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  useEffect(() => {                                     │
│    Load session from localStorage                      │
│    Check role (RBAC protection)                        │
│    Fetch data from Supabase                            │
│    Update component state                              │
│  }, [dependencies])                                    │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ State Variables (useState hooks)                │  │
│  │ - session (user info from localStorage)         │  │
│  │ - data (fetched from Supabase)                  │  │
│  │ - formData (user input)                         │  │
│  │ - loading (UI state)                            │  │
│  │ - message (feedback to user)                    │  │
│  └──────────────────────────────────────────────────┘  │
│         │              │              │                │
│         ▼              ▼              ▼                │
│    ┌─────────┐  ┌──────────┐  ┌──────────────┐       │
│    │  Render │  │ User     │  │ API Calls    │       │
│    │  UI     │  │ Inputs   │  │ (Supabase)   │       │
│    │ (JSX)   │  │ (onChange)│  │              │       │
│    └─────────┘  └────┬─────┘  └──────┬───────┘       │
│         ▲            │               │                │
│         └────────────┴───────────────┘                │
│              State Updates                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Request Flow - Save Business Details

```
User fills form
      │
      ▼
handleSave() triggered
      │
      ▼
e.preventDefault()
setSaving(true)
      │
      ▼
updateBusiness(businessId, updates)
  from lib/supabase.js
      │
      ▼
Supabase client
  .from('businesses')
  .update(updates)
  .eq('id', businessId)
  .select()
      │
      ▼
┌─────────────────┐
│   Success?      │
└────────┬────────┘
         │
     ┌───┴────┐
     │        │
    YES      NO
     │        │
     ▼        ▼
Update   Error
state    Message
│        │
│        └─► setMessage('Failed...')
│
▼
setBusiness(updated)
setFormData(updated)
setMessage('✅ Updated!')
setSaving(false)

setTimeout(() => {
  clearMessage()
}, 3000)
```

## Role-Based Access Control (RBAC)

```
           ┌─────────────────────────────┐
           │   Route Protection          │
           │                             │
           │ useEffect(() => {           │
           │   const session = localStorage │
           │                             │
           │   if (!session) {           │
           │     redirect('/login')      │
           │   }                         │
           │                             │
           │   if (session.role !==      │
           │       requiredRole) {       │
           │     redirect('/business')   │
           │   }                         │
           │ })                          │
           └────────────┬────────────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
        ALLOW                    DENY
           │                         │
           ▼                         ▼
    Load Page              Redirect to
    Content               Appropriate Route
```

## Component Hierarchy

```
┌─ App (Root)
│  │
│  ├─ Header
│  │
│  └─ Pages (Dynamic routing)
│     │
│     ├─ Home (/)
│     │
│     ├─ Login (/sliceblaze/login)
│     │  └─ Session management
│     │
│     ├─ Admin (/sliceblaze/admin)
│     │  ├─ UsersList component
│     │  ├─ BusinessesList component
│     │  └─ CreateUserModal component
│     │
│     ├─ OwnerDashboard (/owner/dashboard)
│     │  └─ BusinessForm component
│     │
│     ├─ UserDashboard (/user/dashboard)
│     │  ├─ SearchBar component
│     │  ├─ BusinessProfileCard component (×n)
│     │  └─ Pagination component
│     │
│     └─ BusinessBrowser (/business)
│        └─ BusinessProfile (/business/[username])
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────┐
│            Frontend (React)                          │
│  ┌──────────────┐    ┌──────────────┐               │
│  │ Components   │    │ State/Props  │               │
│  └──────┬───────┘    └────────┬─────┘               │
│         │                     │                      │
│         └─────────────┬───────┘                      │
│                       │                              │
└───────────────────────┼──────────────────────────────┘
                        │
                        ▼ API Calls
        ┌───────────────────────────────────┐
        │   lib/supabase.js                 │
        │  (API Abstraction Layer)          │
        │                                   │
        │  - getBusinesses()                │
        │  - verifyLogin()                  │
        │  - createUser()                   │
        │  - updateBusiness()               │
        │  - etc...                         │
        └───────────────┬───────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │   Supabase JavaScript Client      │
        │                                   │
        │  .from(table)                     │
        │  .select/insert/update/delete()   │
        │  .eq/match/etc()                  │
        │                                   │
        └───────────────┬───────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │   Supabase Backend                │
        │  (PostgreSQL + APIs)              │
        │                                   │
        │  - Row Level Security             │
        │  - Triggers                       │
        │  - Stored Procedures              │
        │                                   │
        └───────────────┬───────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │   PostgreSQL Database             │
        │                                   │
        │  - users table                    │
        │  - businesses table               │
        │  - Indexes & Constraints          │
        │                                   │
        └───────────────────────────────────┘
```

## Error Handling Flow

```
User Action
    │
    ▼
Try {
    Call API
}
    │
    ▼
Catch {
    if error → handle error
}
    │
    ├─ Network error
    │  └─ "An error occurred..."
    │
    ├─ Validation error
    │  └─ "Invalid input..."
    │
    ├─ Database error
    │  └─ "Failed to save..."
    │
    └─ Auth error
       └─ "Unauthorized..."
           │
           ▼
       Redirect to login
```

---

These diagrams provide visual understanding of how the SliceBlaze authentication system is organized and how data flows through the application.
