# User Business Management System

## Overview
Users can now create and manage their own businesses through a dedicated dashboard. Admin can also assign businesses to users.

## Features

### 1. User Login
- **Route**: `/user/login`
- Users can log in with their username and password
- Session stored in localStorage
- Redirects to user dashboard after successful login

### 2. User Dashboard
- **Route**: `/user/dashboard`
- Users can:
  - View their assigned business (if admin assigned one)
  - Create a new business (if they don't have one)
  - Edit business details (name, categories, contact, location, description, hours, social media, menu URL)
  - Upload business logo
  - Multi-select categories
  - Save changes to their business

### 3. Admin Business Assignment
- Admin can assign businesses to users in the admin dashboard
- In the Users tab, click "Edit" on any user
- Select a business from the "Assigned Business" dropdown
- User will be able to manage that business in their dashboard

### 4. User Business Creation
- Users without an assigned business can create their own
- Click "Create My Business" button
- Fill in required fields (Business Name, Username)
- Upload optional logo
- Select categories
- Add business details
- Once created, the business is automatically assigned to the user

## How It Works

### User Flow:
1. User logs in at `/user/login`
2. If they have a business assigned → see edit form
3. If no business assigned → see "Create My Business" button
4. User creates or edits their business
5. Changes are saved to the database

### Admin Flow:
1. Admin creates a user account (in Users tab)
2. Admin can either:
   - Assign an existing business to the user, OR
   - Let the user create their own business
3. Admin can see which business is assigned to each user
4. Admin can change business assignments at any time

## Technical Details

### Database Changes:
- Users table already has `business_id` field
- When a user creates a business, their `business_id` is automatically updated
- Admin can manually update `business_id` through the edit user interface

### Files Modified:
1. **app/user/dashboard/page.tsx** - User dashboard with business management
2. **app/user/login/page.tsx** - User login page
3. **app/user/layout.tsx** - Layout to hide header on user pages
4. **app/admin/dashboard/page.tsx** - Updated to show business dropdown in user edit
5. **components/Header.tsx** - Added "Login" link for users

### Authentication:
- User sessions stored in localStorage as JSON: `{id, username, business_id}`
- Password verification done through database query (simple password check)
- Note: In production, use proper password hashing (bcrypt, etc.)

## Usage

### For Users:
1. Get login credentials from admin
2. Go to the website and click "Login" in header
3. Enter username and password
4. Create or edit your business
5. Your business profile will be visible at `/{username}`

### For Admins:
1. Create user accounts in admin dashboard
2. Either assign an existing business or let users create their own
3. Monitor and manage all businesses and users
4. Change business assignments as needed

## Security Notes

⚠️ **Important for Production:**
- Currently using simple password storage - implement proper password hashing (bcrypt)
- Add CSRF protection
- Implement session expiration
- Add rate limiting on login attempts
- Use environment variables for sensitive data
- Validate all user inputs server-side
