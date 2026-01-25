# WiFi Management Feature

## Overview
The WiFi Management feature allows businesses to add multiple WiFi networks to their profile. Customers can view these networks, scan QR codes to connect, or copy credentials directly.

## Features

### For Business Owners (Admin/User)
- Add multiple WiFi networks
- Edit existing WiFi networks
- Delete WiFi networks
- Configure:
  - SSID (WiFi name)
  - Password
  - Security type (WPA/WPA2, WEP, No Password)
  - Hidden network option

### For System Admins
- Manage WiFi networks for ANY business
- Select business from dropdown
- Full CRUD operations on all WiFi networks
- Overview of all businesses and their WiFi

### For Customers
- View all available WiFi networks on business profile
- Click QR button to view QR code in popup
- Click Connect button to copy WiFi password
- Scan QR code with mobile device to auto-connect

## Database Schema

### Table: `business_wifi`
```sql
CREATE TABLE IF NOT EXISTS public.business_wifi (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  ssid VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  security_type VARCHAR(50) DEFAULT 'WPA',
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### 1. Run Database Migration
Execute the SQL migration file to create the WiFi table:
```bash
# In Supabase SQL Editor, run:
# File: supabase-create-wifi.sql
```

Or manually execute:
```sql
CREATE TABLE IF NOT EXISTS public.business_wifi (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  ssid VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  security_type VARCHAR(50) DEFAULT 'WPA',
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_wifi_business_id ON public.business_wifi(business_id);
```

### 2. Install Dependencies
The required packages have been installed:
```bash
npm install qrcode @types/qrcode
```

### 3. Files Created/Modified

#### New Files:
- `supabase-create-wifi.sql` - Database migration
- `components/WifiConnect.tsx` - Customer-facing WiFi display component
- `app/user/wifi/page.tsx` - Business owner WiFi management page
- `app/admin/wifi/page.tsx` - System admin WiFi management page

#### Modified Files:
- `lib/supabase.js` - Added WiFi CRUD functions:
  - `getBusinessWifi(businessId)`
  - `addBusinessWifi(wifiData)`
  - `updateBusinessWifi(wifiId, updates)`
  - `deleteBusinessWifi(wifiId)`
- `app/[username]/page.tsx` - Added WiFi display to business profile
- `app/user/dashboard/page.tsx` - Added "Manage WiFi" button
- `app/admin/dashboard/page.tsx` - Added "WiFi Management" navigation link

## Usage

### For System Admins

1. **Login to Admin Panel**
   - Navigate to `/admin`
   - Login with admin credentials

2. **Access WiFi Management**
   - Click "📶 WiFi Management" in the sidebar
   - Or navigate directly to `/admin/wifi`

3. **Select a Business**
   - View all businesses in the left sidebar
   - Click on any business to view/manage their WiFi

4. **Manage WiFi Networks**
   - Add: Click "+ Add WiFi Network", fill form, submit
   - Edit: Click "Edit" on any network, modify, save
   - Delete: Click "Delete" on any network, confirm

### For Business Owners

1. **Navigate to Dashboard**
   - Login to your account
   - Go to "My Business" tab

2. **Access WiFi Management**
   - Click "Manage WiFi" button in the business section
   - Or navigate to `/user/wifi`

3. **Add WiFi Network**
   - Click "+ Add WiFi Network"
   - Fill in:
     - WiFi Name (SSID)
     - Password
     - Security Type
     - Check "Hidden Network" if applicable
   - Click "Add WiFi"

4. **Edit WiFi Network**
   - Click "Edit" on any WiFi network
   - Update the information
   - Click "Update WiFi"

5. **Delete WiFi Network**
   - Click "Delete" on any WiFi network
   - Confirm deletion

### For Customers

1. **View Business Profile**
   - Navigate to `/{business-username}`

2. **Connect to WiFi**
   - Scroll to "Connect WiFi" section
   - See list of available WiFi networks
   - Click "QR" to view QR code in popup
   - Scan QR code with your phone to auto-connect
   - Or click "Connect" to copy password

## QR Code Format

The WiFi QR codes use the standard WiFi QR format:
```
WIFI:T:WPA;S:ssid;P:password;H:false;;
```

Parameters:
- `T` = Security type (WPA, WEP, nopass)
- `S` = SSID (network name)
- `P` = Password
- `H` = Hidden network (true/false)

This format is compatible with:
- iOS (iPhone/iPad) built-in camera
- Android built-in camera
- Most QR code scanner apps

## Component Details

### WifiConnect Component
Location: `components/WifiConnect.tsx`

Props:
- `wifiNetworks`: Array of WiFi network objects
- `brandColor`: Brand primary color (optional, defaults to #ED1D33)

Features:
- Generates QR codes on mount
- Modal popup for QR code display
- Copy password to clipboard
- Responsive design

### WiFi Management Page
Location: `app/user/wifi/page.tsx`

Features:
- CRUD operations for WiFi networks
- Form validation
- Real-time updates
- User authentication check
- Business ownership verification

## API Functions

### getBusinessWifi(businessId)
Fetches all WiFi networks for a business.
```javascript
const wifiNetworks = await getBusinessWifi(businessId)
```

### addBusinessWifi(wifiData)
Adds a new WiFi network.
```javascript
const result = await addBusinessWifi({
  business_id: 1,
  ssid: 'MyWiFi',
  password: 'password123',
  security_type: 'WPA',
  is_hidden: false
})
```

### updateBusinessWifi(wifiId, updates)
Updates an existing WiFi network.
```javascript
const result = await updateBusinessWifi(wifiId, {
  password: 'newpassword123'
})
```

### deleteBusinessWifi(wifiId)
Deletes a WiFi network.
```javascript
const success = await deleteBusinessWifi(wifiId)
```

## Security Considerations

1. **Password Storage**: WiFi passwords are stored in plain text in the database as they need to be displayed to customers. Ensure proper database access controls.

2. **Business Owner Verification**: The WiFi management page checks user authentication and business ownership.

3. **CORS and Public Access**: WiFi information is publicly visible on business profiles (as intended for customer use).

## Testing

1. **Create WiFi Network**
   - Login as business owner
   - Navigate to WiFi management
   - Add a test WiFi network
   - Verify it appears in the list

2. **View on Profile**
   - Visit your business profile page
   - Verify WiFi section appears
   - Click QR button to test popup
   - Click Connect to test password copy

3. **Edit WiFi Network**
   - Edit the test network
   - Change SSID or password
   - Verify changes appear on profile

4. **QR Code Scanning**
   - Open QR code popup
   - Scan with mobile device
   - Verify WiFi connection prompts

5. **Delete WiFi Network**
   - Delete the test network
   - Verify it's removed from profile

## Troubleshooting

### QR Code Not Displaying
- Check browser console for errors
- Verify qrcode package is installed
- Check network data is properly formatted

### WiFi Not Showing on Profile
- Verify business has WiFi networks in database
- Check business_id matches
- Ensure getBusinessWifi is called correctly

### Cannot Add WiFi
- Check user authentication
- Verify business_id exists
- Check Supabase table exists and has correct permissions

## Future Enhancements

Potential improvements:
- WiFi usage analytics
- Auto-rotate passwords feature
- Guest WiFi time limits
- Custom QR code styling
- Email WiFi credentials to customers
- Multiple security types per network
- WiFi speed/bandwidth information
- Connection instructions for different devices
