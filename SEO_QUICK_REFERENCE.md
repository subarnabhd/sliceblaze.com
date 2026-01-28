# SEO Quick Reference

## ✅ What's Been Implemented

### Meta Tags (All Pages)
- ✅ Title tags with templates
- ✅ Meta descriptions
- ✅ Keywords
- ✅ OpenGraph tags (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Robots meta tags

### Business Profiles
- ✅ Dynamic metadata per business
- ✅ Business-specific titles & descriptions
- ✅ Social sharing optimized
- ✅ JSON-LD structured data

### Technical SEO
- ✅ Sitemap (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ Structured data (JSON-LD)
- ✅ Proper indexing rules

## 🔧 Quick Actions Required

### 1. Update Verification Codes
File: `app/layout.tsx` (lines 63-66)

Replace:
```typescript
verification: {
  google: 'google-site-verification-code',  // ← Change this
  yandex: 'yandex-verification-code',       // ← Change this
},
```

### 2. Create OG Image
Create: `/public/og-image.jpg`
- Size: 1200 x 630 pixels
- Add your logo + tagline

### 3. Update Domain (If Not sliceblaze.com)
Update in these files:
- `app/layout.tsx`: line 15 - metadataBase
- `app/sitemap.ts`: line 5 - baseUrl
- `app/robots.ts`: line 12 - sitemap URL
- `lib/json-ld.tsx`: all URL references

## 🧪 Testing

### Check Your Implementation
```bash
# Build the app
npm run build

# Start production server
npm start

# Visit these URLs:
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
```

### Validate
- **Rich Results**: https://search.google.com/test/rich-results
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator

## 📊 Submit to Search Engines

1. **Google Search Console**
   - Add property
   - Submit sitemap
   - Monitor performance

2. **Bing Webmaster Tools**
   - Verify site
   - Submit sitemap

## 📄 Files Modified

### New Files Created:
- `app/sitemap.ts` - Dynamic sitemap
- `app/robots.ts` - Robots configuration
- `lib/json-ld.tsx` - Structured data helpers
- `app/(user)/[username]/layout.tsx` - Business metadata
- `SEO_IMPLEMENTATION.md` - Full documentation
- `SEO_QUICK_REFERENCE.md` - This file

### Files Modified:
- `app/layout.tsx` - Enhanced metadata
- All page.tsx files - Added metadata exports
- `app/(user)/[username]/page.tsx` - Added JSON-LD

## 🎯 Key Features

### Homepage (/)
- Title: "Sliceblaze - Your Business Digital Partner"
- Full OpenGraph support
- Organization JSON-LD

### Business Profiles (/[username])
- Dynamic titles: "{Business} - {Category}"
- Business-specific descriptions
- LocalBusiness JSON-LD
- Social media integration

### Protected Pages
- Login, Register, Dashboard, Admin
- Set to noindex, nofollow
- Not included in sitemap

## 📈 Expected Results

- Better search engine rankings
- Rich snippets in search results
- Improved social media previews
- Proper business information in Google
- Higher click-through rates

## 🆘 Common Issues

**Metadata not showing?**
- Clear cache and rebuild
- Check for duplicate metadata exports

**Sitemap empty?**
- Verify Supabase connection
- Check businesses table has data

**Social cards broken?**
- Use absolute URLs, not relative
- Verify og-image.jpg exists

---

**For detailed information, see SEO_IMPLEMENTATION.md**
