# 🎯 Quick Vercel Setup - 5 Minutes

## Copy-Paste Solution

Just follow these exact steps (takes ~5 minutes):

---

## STEP 1: Open Vercel
```
Go to: https://vercel.com/dashboard
```
(You'll see your projects list)

---

## STEP 2: Click Your Project
Look for "sliceblaze" or your domain name in the list and click it

---

## STEP 3: Click Settings
In the top menu bar, click **Settings**

---

## STEP 4: Click Environment Variables
In the left sidebar, find and click **Environment Variables**

---

## STEP 5: Copy & Paste Variable 1

**What to do:**
1. In the **Name** field, paste this exactly:
```
NEXT_PUBLIC_SUPABASE_URL
```

2. In the **Value** field, paste this exactly:
```
https://yjgjygdavifobzopkdfu.supabase.co
```

3. Under **Environments**, make sure these are CHECKED:
   - ☑ Production
   - ☑ Preview  
   - ☑ Development

4. Click the **Add** button

---

## STEP 6: Copy & Paste Variable 2

**What to do:**
1. In the **Name** field, paste this exactly:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

2. In the **Value** field, paste this exactly:
```
sb_publishable_DxIKVpNXinU7MeeKYz7OZQ_orpC18ku
```

3. Under **Environments**, make sure these are CHECKED:
   - ☑ Production
   - ☑ Preview
   - ☑ Development

4. Click the **Add** button

---

## STEP 7: Redeploy

1. Click **Deployments** (top menu)
2. Find your latest deployment (top of the list)
3. Click the **...** (three dots) on the right
4. Click **Redeploy**
5. Wait until it says ✅ **Ready**

---

## STEP 8: Test

1. Go to your live site (e.g., yourdomain.vercel.app)
2. Add `/debug` to the URL
3. You should see a list of users from the database

If you see users → **SUCCESS!** ✅

---

## That's It!

Once you've done these 8 steps:
- ✅ Your login will work
- ✅ You'll see the debug page with users
- ✅ Login will redirect to correct dashboard

**Let me know when you've done steps 1-8, and tell me:**
- Did you see users on the `/debug` page? 
- Did the login work?
