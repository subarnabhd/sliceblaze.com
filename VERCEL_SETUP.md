# ✅ Vercel Environment Variables Setup

## Step 1: Go to Vercel Dashboard

1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Login with your account
3. Find your **SliceBlaze** project in the list
4. Click on it to open

---

## Step 2: Add Environment Variables

1. Click **Settings** (top navigation bar)
2. Click **Environment Variables** (left sidebar)
3. You should see a form that says "Add Environment Variable"

---

## Step 3: Add First Variable (Supabase URL)

**In the "Name" field, type:**
```
NEXT_PUBLIC_SUPABASE_URL
```

**In the "Value" field, paste:**
```
https://yjgjygdavifobzopkdfu.supabase.co
```

**In the "Environments" dropdown, select:**
- ✅ Production
- ✅ Preview
- ✅ Development

**Then click: Add**

---

## Step 4: Add Second Variable (Supabase Key)

**In the "Name" field, type:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**In the "Value" field, paste:**
```
sb_publishable_DxIKVpNXinU7MeeKYz7OZQ_orpC18ku
```

**In the "Environments" dropdown, select:**
- ✅ Production
- ✅ Preview
- ✅ Development

**Then click: Add**

---

## Step 5: Redeploy Your Project

1. Click **Deployments** (top navigation bar)
2. Find your **latest deployment** (usually at the top)
3. Click the **three dots (...)** on the right side
4. Click **Redeploy**
5. Wait for it to say "✓ Ready" (usually takes 1-2 minutes)

---

## Step 6: Test Your Live Site

1. Go to your live website (e.g., `https://yourdomain.vercel.app`)
2. Visit `/debug` page
3. You should now see:
   - ✅ Database users list
   - ✅ All user data
   - ✅ Database columns

---

## Step 7: Test Login

1. Go to `/login` on your live site
2. Try logging in with:
   - **Admin:** `admin` / `admin123`
   - **Owner:** `ujamaakoffie` / `password123`
   - **User:** `user1` / `user123`

3. After login, you should:
   - ✅ See the correct dashboard for that role
   - ✅ Be able to browse/edit content

---

## 🔍 Verify Variables Were Added

After adding variables:

1. In Vercel Settings → Environment Variables
2. You should see **two items** listed:
   - `NEXT_PUBLIC_SUPABASE_URL` (with 3 dots showing it's applied to all environments)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (with 3 dots showing it's applied to all environments)

---

## ❌ Troubleshooting

### Variables appear but site still shows no data
- **Solution:** Make sure you clicked **Redeploy** after adding variables
- Check deployment status shows "✓ Ready"

### Still no data after redeploy
1. Wait 5-10 minutes (sometimes cache takes time)
2. Try a hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
3. Check browser console (F12) for error messages

### Can't find Environment Variables section
1. Make sure you clicked **Settings** (not the gear icon)
2. Look for "Build & Deploy" or "Environment" in left sidebar
3. If still stuck, click the **?** icon for help

### Variables disappeared
- Don't worry, just re-add them
- Make sure to select all three environments (Production, Preview, Development)

---

## ✅ Checklist

- [ ] Logged into Vercel Dashboard
- [ ] Selected SliceBlaze project
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` variable
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` variable
- [ ] Both set to all 3 environments (Production, Preview, Development)
- [ ] Clicked Redeploy
- [ ] Waited for "✓ Ready" status
- [ ] Tested `/debug` page - sees user data ✅
- [ ] Tested login - redirects to correct dashboard ✅

---

## 🎉 Success!

Once you see the debug page showing users and login works with redirects, you're done! Your live site is now fully functional.

If you have any issues, check:
1. Browser console for error messages (F12)
2. Vercel deployment logs for build errors
3. Supabase project status (should be "Active")
