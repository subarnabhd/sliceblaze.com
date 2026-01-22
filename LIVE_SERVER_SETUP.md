# 🚀 Live Server Deployment - Environment Variables Setup

## The Problem
✅ Works locally = Environment variables in `.env.local`
❌ Doesn't work on live server = Missing environment variables on server

## Solution: Add Environment Variables to Live Server

### If Using **Vercel** (Most Common for Next.js)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your SliceBlaze project
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Add these two variables:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://yjgjygdavifobzopkdfu.supabase.co`
- Environments: Select all (Production, Preview, Development)
- Click **Add**

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `sb_publishable_DxIKVpNXinU7MeeKYz7OZQ_orpC18ku`
- Environments: Select all (Production, Preview, Development)
- Click **Add**

6. Click **Save**
7. **Redeploy** your project:
   - Go to **Deployments** tab
   - Click the three dots (...) on the latest deployment
   - Click **Redeploy**
   - Wait for deployment to complete

---

### If Using **Netlify**

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your SliceBlaze site
3. Click **Site Settings** → **Build & Deploy**
4. Click **Environment** (left sidebar)
5. Click **Edit variables**
6. Add the two variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://yjgjygdavifobzopkdfu.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_DxIKVpNXinU7MeeKYz7OZQ_orpC18ku`

7. Click **Save**
8. Trigger a new deploy:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - Wait for deployment to complete

---

### If Using **Other Hosting** (AWS, Heroku, etc.)

Look for "Environment Variables" or "Secrets" section and add:
```
NEXT_PUBLIC_SUPABASE_URL=https://yjgjygdavifobzopkdfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DxIKVpNXinU7MeeKYz7OZQ_orpC18ku
```

---

## Verify It's Working

After redeploying, test:

1. Go to your live website: `https://yourdomain.com/debug`
2. Check if users table data shows up
3. If yes ✅: Try logging in with test credentials
4. If no ❌: Check browser console (F12) for error messages

---

## Your Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://yjgjygdavifobzopkdfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DxIKVpNXinU7MeeKYz7OZQ_orpC18ku
```

**These are PUBLIC keys** (notice `NEXT_PUBLIC_` prefix) - they're safe to share and must be accessible from the browser.

---

## ❓ Still Not Working?

1. **Check Supabase Status**: Is your Supabase project running?
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Should say "Active" in top right

2. **Check Database**: Do users exist in Supabase?
   - Go to **Table Editor**
   - Click `users` table
   - Should show your test users

3. **Check Browser Console**: 
   - Go to live site
   - Press F12 → Console tab
   - Try login
   - Look for error messages

4. **Check Network Tab**:
   - F12 → Network tab
   - Try login
   - Look for failed requests to Supabase
   - Check the error response

---

## 📚 Troubleshooting Steps

### Issue: "No data showing on live server"
- [ ] Verified environment variables are added to live server
- [ ] Redeployed after adding variables
- [ ] Checked Supabase project is still running
- [ ] Confirmed users table has data in Supabase

### Issue: "Login works but shows wrong data"
- [ ] Check that Supabase URL is correct
- [ ] Check that Supabase API key is correct
- [ ] Verify users table schema matches code

### Issue: "Getting CORS errors"
- This means Supabase is rejecting the request
- Check Supabase project settings for CORS configuration
- Or contact Supabase support

---

## ✅ Checklist

- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to live server
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to live server
- [ ] Redeployed the application
- [ ] Waited for deployment to complete
- [ ] Tested `/debug` page to see users data
- [ ] Tested login with test credentials
- [ ] Verified admin/owner/user see correct dashboards

---

## Need Help?

1. Check your live site's `/debug` page to see what data is available
2. Open browser console (F12) while trying to login
3. Share any error messages you see
4. Verify which hosting platform you're using (Vercel, Netlify, etc.)
